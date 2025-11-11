<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Laravel\Facades\Image;
use App\Services\MediaService;

/**
 * Контроллер админки для управления новостями
 * 
 * Реализует CRUD операции с обработкой обложек и генерацией миниатюр
 */
class NewsController extends Controller
{
    /**
     * Конструктор: применяем политику доступа
     */
    public function __construct(private readonly MediaService $mediaService)
    {
        $this->authorizeResource(News::class, 'news');
    }

    /**
     * Отображение списка новостей с фильтрацией и пагинацией
     * 
     * @param Request $request
     * @return Response
     */
    public function index(Request $request, ?string $section = null): Response
    {
        $type = $this->resolveType($section ?? $request->route('type') ?? $request->input('type'));
        $query = News::query()->ofType($type);

        // Фильтр по статусу
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Поиск
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Фильтр по дате публикации
        if ($request->filled('published_from')) {
            $query->where('published_at', '>=', $request->input('published_from'));
        }
        if ($request->filled('published_to')) {
            $query->where('published_at', '<=', $request->input('published_to'));
        }

        // Сортировка по дате создания (новые сначала)
        $query->orderByDesc('created_at');

        // Пагинация: 20 новостей на страницу
        $news = $query->paginate(20)->withQueryString();

        // Преобразуем данные для фронтенда
        $news->getCollection()->transform(function ($item) {
            $media = $this->mediaService->normalizeMediaForFrontend($item->images ?? []);
            $primaryMedia = collect($media)
                ->sortBy(fn ($mediaItem) => $mediaItem['position'] ?? PHP_INT_MAX)
                ->first();

            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'status' => $item->status,
                'cover_thumb_url' => $item->cover_thumb_url,
                'cover_image_alt' => $item->cover_image_alt,
                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $item->published_at?->format('d.m.Y'),
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                'created_at_formatted' => $item->created_at->format('d.m.Y'),
                'views' => $item->views ?? 0,
                'media' => $media,
                'primary_media' => $primaryMedia,
                'creator' => $item->creator ? [
                    'id' => $item->creator->id,
                    'name' => $item->creator->name,
                ] : null,
            ];
        });

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'filters' => array_merge(
                $request->only(['status', 'search', 'published_from', 'published_to']),
                ['type' => $type]
            ),
            'section' => $type,
            'sectionMeta' => $this->sectionMeta($type),
        ]);
    }

    /**
     * Форма создания новости
     * 
     * @return Response
     */
    public function create(?string $section = 'news'): Response
    {
        // Жёсткая нормализация секции для обхода фильтров WAF.
        $normalizedSection = $this->resolveSection($section);

        // Логируем обращение к форме админки (временная диагностика WAF).
        Log::info('admin.news.create', [
            'uid' => auth()->id(),
            'role' => auth()->user()?->role,
            'section' => $normalizedSection,
        ]);

        $this->authorize('create', News::class);

        return Inertia::render('Admin/News/Form', [
            'news' => null,
            'media' => [],
            'section' => $normalizedSection,
            'sectionMeta' => $this->sectionMeta($normalizedSection),
            'type' => $normalizedSection,
        ]);
    }

    /**
     * Сохранение новой новости
     * 
     * @param NewsRequest $request
     * @return RedirectResponse
     */
    public function store(NewsRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            // Создаем новость
            $news = new News();
            $news->title = $validated['title'];
            $news->slug = $validated['slug'] ?? News::generateUniqueSlug($validated['title']);
            $news->excerpt = $validated['excerpt'] ?? null;
            $news->body = $validated['body'];
            // Для обратной совместимости со старым полем content
            $news->content = $validated['body'];
            $news->cover_image_alt = $validated['cover_image_alt'] ?? null;
            $news->seo_title = $validated['seo_title'] ?? null;
            $news->seo_description = $validated['seo_description'] ?? null;
            $type = $this->resolveSection($request->input('section', $validated['type'] ?? null));

            $news->status = $validated['status'];
            $news->published_at = $validated['status'] === 'published' 
                ? ($validated['published_at'] ?? now())
                : null;
            $news->created_by = auth()->id();
            $news->type = $type;

            $mediaItems = $this->parseMediaInput($request->input('media'));
            if (!empty($mediaItems)) {
                $news->images = $mediaItems;
            }

            // Обработка обложки
            if ($request->hasFile('cover')) {
                $this->handleCoverUpload($request->file('cover'), $news);
            }

            $news->save();

            Log::info('Создана новость', [
                'id' => $news->id,
                'title' => $news->title,
                'status' => $news->status,
            ]);

            return redirect()
                ->route('admin.news.index', $this->newsRouteParams($type))
                ->with('success', 'Новость успешно создана');

        } catch (\Exception $e) {
            Log::error('Ошибка при создании новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Произошла ошибка при создании новости. Проверьте логи сервера.']);
        }
    }

    /**
     * Форма редактирования новости
     * 
     * @param News $news
     * @return Response
     */
    public function edit(News $news): Response
    {
        $meta = $this->sectionMeta($news->type ?? News::TYPE_NEWS);

        return Inertia::render('Admin/News/Form', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'excerpt' => $news->excerpt,
                'body' => $news->body,
                'cover_url' => $news->cover_url,
                'cover_thumb_url' => $news->cover_thumb_url,
                'cover_image_alt' => $news->cover_image_alt,
                'seo_title' => $news->seo_title,
                'seo_description' => $news->seo_description,
                'status' => $news->status,
                'published_at' => $news->published_at?->format('Y-m-d\TH:i'),
                'media' => $this->mediaService->normalizeMediaForFrontend($news->images ?? []),
            ],
            'media' => $this->mediaService->normalizeMediaForFrontend($news->images ?? []),
            'section' => $news->type ?? News::TYPE_NEWS,
            'sectionMeta' => $meta,
            'type' => $news->type ?? News::TYPE_NEWS,
        ]);
    }

    /**
     * Обновление новости
     * 
     * @param NewsRequest $request
     * @param News $news
     * @return RedirectResponse
     */
    public function update(NewsRequest $request, News $news): RedirectResponse
    {
        try {
            $validated = $request->validated();

            // Обновляем поля
            $news->title = $validated['title'];
            if ($request->filled('slug')) {
                $news->slug = $validated['slug'];
            } elseif ($news->isDirty('title')) {
                // Автоматически обновляем slug, если изменился title
                $news->slug = News::generateUniqueSlug($validated['title'], $news->id);
            }
            $news->excerpt = $validated['excerpt'] ?? null;
            $news->body = $validated['body'];
            // Синхронизируем устаревшее поле content
            $news->content = $news->body;
            $news->cover_image_alt = $validated['cover_image_alt'] ?? null;
            $news->seo_title = $validated['seo_title'] ?? null;
            $news->seo_description = $validated['seo_description'] ?? null;
            $news->status = $validated['status'];
            $newsType = $this->resolveType($request->input('type', $news->type));
            $news->type = $newsType;
            
            // Обновляем дату публикации
            if ($validated['status'] === 'published') {
                $news->published_at = $validated['published_at'] ?? $news->published_at ?? now();
            } else {
                $news->published_at = null;
            }

            $mediaItems = $this->parseMediaInput($request->input('media'));
            if (!is_null($mediaItems)) {
                $news->images = $mediaItems;
            }

            // Обработка новой обложки (если загружена)
            if ($request->hasFile('cover')) {
                // Удаляем старые файлы
                $this->deleteCoverFiles($news);
                
                // Загружаем новую обложку
                $this->handleCoverUpload($request->file('cover'), $news);
            }

            $news->save();

            Log::info('Обновлена новость', [
                'id' => $news->id,
                'title' => $news->title,
                'status' => $news->status,
            ]);

            return redirect()
                ->route('admin.news.index', $this->newsRouteParams($newsType))
                ->with('success', 'Новость успешно обновлена');

        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'news_id' => $news->id,
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Произошла ошибка при обновлении новости. Проверьте логи сервера.']);
        }
    }

    /**
     * Удаление новости (soft delete)
     * 
     * @param News $news
     * @return RedirectResponse
     */
    public function destroy(News $news): RedirectResponse
    {
        try {
            // Удаляем файлы обложки
            $this->deleteCoverFiles($news);

            $news->delete();

            Log::info('Удалена новость', [
                'id' => $news->id,
                'title' => $news->title,
            ]);

            $type = $news->type ?? News::TYPE_NEWS;

            return redirect()
                ->route('admin.news.index', $this->newsRouteParams($type))
                ->with('success', 'Новость успешно удалена');

        } catch (\Exception $e) {
            Log::error('Ошибка при удалении новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'news_id' => $news->id,
            ]);

            return back()
                ->withErrors(['error' => 'Произошла ошибка при удалении новости.']);
        }
    }

    /**
     * Переключение статуса новости (публикация/черновик)
     * 
     * @param News $news
     * @return RedirectResponse
     */
    public function toggleStatus(News $news): RedirectResponse
    {
        try {
            if ($news->status === 'published') {
                $news->status = 'draft';
                $news->published_at = null;
                $message = 'Новость переведена в черновик';
            } else {
                $news->status = 'published';
                $news->published_at = $news->published_at ?? now();
                $message = 'Новость опубликована';
            }

            $news->save();

            Log::info('Изменен статус новости', [
                'id' => $news->id,
                'status' => $news->status,
            ]);

            return back()->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Ошибка при изменении статуса новости', [
                'error' => $e->getMessage(),
                'news_id' => $news->id,
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при изменении статуса.']);
        }
    }

    /**
     * Загрузка временных медиа файлов (изображения/видео)
     */
    public function uploadMediaFiles(Request $request): JsonResponse
    {
        $request->validate([
            'media_files' => 'required|array|max:50',
            'media_files.*' => 'file|max:102400',
        ]);

        $files = $request->file('media_files', []);

        if (empty($files)) {
            return response()->json([
                'success' => false,
                'message' => 'Файлы для загрузки не выбраны',
            ], 422);
        }

        try {
            $uploaded = $this->mediaService->uploadMultipleMedia($files);

            return response()->json([
                'success' => true,
                'media' => $this->mediaService->normalizeMediaForFrontend($uploaded),
            ]);
        } catch (\Throwable $e) {
            Log::error('uploadMediaFiles error', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Не удалось загрузить файлы',
            ], 500);
        }
    }

    /**
     * Загрузка медиа и привязка к конкретной новости
     */
    public function uploadMedia(Request $request, int $newsId): JsonResponse
    {
        $news = News::findOrFail($newsId);

        $request->validate([
            'media_files' => 'required|array|max:50',
            'media_files.*' => 'file|max:102400',
        ]);

        try {
            $files = $request->file('media_files', []);
            $uploaded = $this->mediaService->uploadMultipleMedia($files);
            $merged = $this->mergeMediaItems($news->images ?? [], $uploaded);
            $news->images = $merged;
            $news->save();

            return response()->json([
                'success' => true,
                'media' => $this->mediaService->normalizeMediaForFrontend($merged),
            ]);
        } catch (\Throwable $e) {
            Log::error('uploadMedia error', [
                'news_id' => $newsId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Не удалось загрузить медиа файлы',
            ], 500);
        }
    }

    /**
     * Обновление порядка медиа файлов
     */
    public function updateMediaOrder(Request $request, int $newsId): JsonResponse
    {
        $news = News::findOrFail($newsId);
        $mediaItems = $this->parseMediaInput($request->input('media')) ?? [];
        $ordered = $this->mediaService->updateMediaOrder($mediaItems);
        $news->images = $ordered;
        $news->save();

        return response()->json([
            'success' => true,
            'media' => $this->mediaService->normalizeMediaForFrontend($ordered),
        ]);
    }

    /**
     * Удаление медиа файла у новости
     */
    public function deleteMedia(int $newsId, string $mediaId): JsonResponse
    {
        $news = News::findOrFail($newsId);
        $mediaCollection = collect($news->images ?? []);
        $target = $mediaCollection->firstWhere('id', $mediaId);

        if ($target && !empty($target['path'])) {
            $this->mediaService->deleteMedia($target['path']);
        }

        $updated = $mediaCollection->reject(fn ($item) => ($item['id'] ?? null) === $mediaId)
            ->values()
            ->all();

        $news->images = $updated;
        $news->save();

        return response()->json([
            'success' => true,
            'media' => $this->mediaService->normalizeMediaForFrontend($updated),
        ]);
    }

    /**
     * Установка медиа файла как обложки в галерее
     */
    public function setCover(int $newsId, string $mediaId): JsonResponse
    {
        $news = News::findOrFail($newsId);
        $current = $news->images ?? [];

        $updated = array_map(function ($item) use ($mediaId) {
            if (is_array($item)) {
                $item['is_cover'] = ($item['id'] ?? null) === $mediaId;
            }
            return $item;
        }, $current);

        $news->images = $updated;
        $news->save();

        return response()->json([
            'success' => true,
            'media' => $this->mediaService->normalizeMediaForFrontend($updated),
        ]);
    }

    /**
     * Удаление временного медиа файла (до сохранения новости)
     */
    public function deleteTemporaryMedia(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        $deleted = $this->mediaService->deleteMedia($validated['path']);

        return response()->json([
            'success' => $deleted,
        ]);
    }

    /**
     * Обработка загрузки обложки с генерацией превью
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @param News $news
     * @return void
     */
    private function handleCoverUpload($file, News $news): void
    {
        /** @var \Illuminate\Http\UploadedFile $file */
        
        // Генерация имен файлов
        $dt = now();
        $uuid = (string) Str::uuid();
        $dir = "news/{$dt->format('Y')}/{$dt->format('m')}";

        // Создаем директорию, если её нет
        Storage::disk('public')->makeDirectory($dir);

        // Путь для оригинала
        $originalPath = "{$dir}/{$uuid}.jpg";

        // Чтение и нормализация оригинала
        $img = Image::read($file->getRealPath())->toJpeg(quality: 85);
        Storage::disk('public')->put($originalPath, (string) $img);

        // Превью 800px по ширине
        $thumbPath = "{$dir}/{$uuid}_thumb.jpg";
        $thumb = Image::read($file->getRealPath())
            ->scale(width: 800, height: null)
            ->toJpeg(quality: 85);
        Storage::disk('public')->put($thumbPath, (string) $thumb);

        // Сохранение путей
        $news->cover_image_path = $originalPath;
        $news->cover_image_thumb_path = $thumbPath;
    }

    /**
     * Удаление файлов обложки
     * 
     * @param News $news
     * @return void
     */
    private function deleteCoverFiles(News $news): void
    {
        if ($news->cover_image_path) {
            Storage::disk('public')->delete($news->cover_image_path);
        }
        if ($news->cover_image_thumb_path) {
            Storage::disk('public')->delete($news->cover_image_thumb_path);
        }
    }

    private function mergeMediaItems(array $existing, array $new): array
    {
        $existingItems = collect($existing)
            ->filter(fn ($item) => is_array($item) && !empty($item['path']))
            ->values()
            ->all();

        $newItems = collect($new)
            ->filter(fn ($item) => is_array($item) && !empty($item['path']))
            ->values()
            ->all();

        $merged = array_merge($existingItems, $newItems);

        return array_values(array_map(function ($item, $index) {
            $item['position'] = $item['position'] ?? $index;
            $item['id'] = $item['id'] ?? (string) Str::uuid();
            $item['type'] = $item['type'] ?? $this->mediaService->detectTypeByPath($item['path']);
            $item['is_cover'] = (bool) ($item['is_cover'] ?? false);
            $item['name'] = $item['name'] ?? basename($item['path']);
            $item['url'] = $this->mediaService->getMediaUrl($item['path']);
            return $item;
        }, $merged, array_keys($merged)));
    }

    private function parseMediaInput($media): ?array
    {
        if (is_null($media)) {
            return [];
        }

        if (is_string($media)) {
            $decoded = json_decode($media, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return [];
            }
            $media = $decoded;
        }

        if (!is_array($media)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($item, $index) {
            if (!is_array($item) || empty($item['path'])) {
                return null;
            }

            $item['id'] = $item['id'] ?? (string) Str::uuid();
            $item['position'] = $item['position'] ?? $index;
            $item['type'] = $item['type'] ?? $this->mediaService->detectTypeByPath($item['path']);
            $item['is_cover'] = (bool) ($item['is_cover'] ?? false);
            $item['name'] = $item['name'] ?? basename($item['path']);
            $item['size'] = $item['size'] ?? null;
            $item['mime_type'] = $item['mime_type'] ?? null;
            $item['url'] = $this->mediaService->getMediaUrl($item['path']);

            return $item;
        }, $media, array_keys($media))));
    }
    /**
     * Возвращает тип публикации с учетом допустимых значений.
     */
    private function newsRouteParams(string $type): array
    {
        return $type === News::TYPE_NEWS ? [] : ['type' => $type];
    }

    private function resolveType(?string $type): string
    {
        return $this->resolveSection($type);
    }

    /**
     * Нормализует значение секции (новости или СМИ) с учётом допустимых значений.
     */
    private function resolveSection(?string $section): string
    {
        return in_array($section, [News::TYPE_NEWS, News::TYPE_MEDIA], true)
            ? $section
            : News::TYPE_NEWS;
    }

    /**
     * Возвращает метаданные для текущего раздела (новости или СМИ о нас).
     */
    private function sectionMeta(string $type): array
    {
        $isMedia = $type === News::TYPE_MEDIA;

        return [
            'type' => $type,
            'title' => $isMedia ? 'СМИ о нас' : 'Новости',
            'createLabel' => $isMedia ? 'Добавить материал из СМИ' : 'Создать новость',
            'editLabel' => $isMedia ? 'Редактировать материал из СМИ' : 'Редактировать новость',
            'returnLabel' => $isMedia ? 'Вернуться к списку материалов' : 'Вернуться к списку',
            'subtitle' => $isMedia
                ? 'Управляйте публикациями СМИ, в которых упоминается ННЦРЗ.'
                : 'Управляйте новостями и анонсами центра.',
        ];
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Intervention\Image\Laravel\Facades\Image;
use App\Services\MediaService;
use App\Services\UrlMetadataService;

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
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly UrlMetadataService $urlMetadataService
    ) {
        $this->authorizeResource(News::class, 'news');
    }

    /**
     * Отображение списка новостей с фильтрацией и пагинацией
     * 
     * @param Request $request
     * @return InertiaResponse
     */
    public function index(Request $request, ?string $section = null): InertiaResponse
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
                'category' => $this->formatCategoryForFrontend($item->category ?? []),
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
            'availableCategories' => $this->availableCategories(),
        ]);
    }

    /**
     * Форма создания новости
     * 
     * @return InertiaResponse
     */
    public function create(?string $section = 'news'): InertiaResponse
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
            'availableCategories' => $this->availableCategories(),
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
        // Проверяем права доступа
        try {
            $this->authorize('create', News::class);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::error('Отказ в доступе при создании новости', [
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role,
                'error' => $e->getMessage(),
            ]);
            
            return back()
                ->withInput()
                ->withErrors(['error' => 'У вас нет прав для создания новостей. Требуется роль admin или editor.']);
        }
        
        // Логируем начало обработки запроса
        Log::info('Начало создания новости', [
            'user_id' => auth()->id(),
            'user_email' => auth()->user()?->email,
            'user_role' => auth()->user()?->role,
            'request_method' => $request->method(),
            'request_path' => $request->path(),
            'has_title' => $request->has('title'),
            'has_body' => $request->has('body'),
            'has_content' => $request->has('content'),
            'all_input_keys' => array_keys($request->all()),
            'ip' => $request->ip(),
        ]);
        
        try {
            // Преобразуем content в body для обратной совместимости
            if ($request->has('content') && !$request->has('body')) {
                $request->merge(['body' => $request->input('content')]);
                Log::info('Преобразовано поле content в body');
            }
            
            $validated = $request->validated();
            
            Log::info('Валидация прошла успешно', [
                'validated_keys' => array_keys($validated),
                'title' => $validated['title'] ?? 'не указан',
                'body_length' => isset($validated['body']) ? strlen($validated['body']) : 0,
            ]);

            // Определяем тип публикации ДО использования
            $type = $this->resolveSection($request->input('section', $validated['type'] ?? null));
            
            // Создаем новость
            $news = new News();
            $news->title = $validated['title'];
            
            // Генерируем уникальный slug с гарантией уникальности
            $slug = $validated['slug'] ?? null;
            
            // Нормализуем slug: убираем пробелы и проверяем формат
            if ($slug) {
                $slug = trim($slug);
                // Если slug пустой, содержит только цифры (как "123"), или не соответствует формату - генерируем новый
                if (empty($slug) || 
                    preg_match('/^\d+$/', $slug) || // Только цифры
                    !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/i', $slug)) { // Неправильный формат
                    $slug = null; // Будет сгенерирован ниже
                }
            }
            
            // Если slug не передан или некорректный, генерируем из заголовка
            // Для СМИ, если нет заголовка, используем external_url или дефолтное значение
            $titleForSlug = $validated['title'] ?? null;
            if (!$titleForSlug && $type === News::TYPE_MEDIA && !empty($validated['external_url'])) {
                try {
                    $url = parse_url($validated['external_url']);
                    $titleForSlug = $url['host'] ?? 'media-item';
                } catch (\Exception $e) {
                    $titleForSlug = 'media-item';
                }
            }
            if (!$titleForSlug) {
                $titleForSlug = 'news-item';
            }
            
            if (!$slug) {
                $slug = News::generateUniqueSlug($titleForSlug);
            } else {
                // Если slug был передан и корректен, проверяем его уникальность
                if (News::where('slug', $slug)->exists()) {
                    // Если slug уже существует, генерируем новый
                    $slug = News::generateUniqueSlug($titleForSlug);
                }
            }
            
            // Финальная проверка уникальности (на случай race condition)
            $originalSlug = $slug;
            $counter = 0;
            while (News::where('slug', $slug)->exists() && $counter < 100) {
                $counter++;
                $slug = $originalSlug . '-' . $counter;
            }
            
            Log::info('Сгенерирован slug для новости', [
                'title' => $validated['title'] ?? 'N/A',
                'final_slug' => $slug,
                'was_provided' => !empty($validated['slug']),
            ]);
            
            $news->slug = $slug;
            $news->title = $validated['title'] ?? ($type === News::TYPE_MEDIA && !empty($validated['external_url']) 
                ? (parse_url($validated['external_url'], PHP_URL_HOST) ?? 'Материал из СМИ')
                : 'Новость без заголовка');
            $news->excerpt = $validated['excerpt'] ?? null;
            $news->body = $validated['body'] ?? null;
            // Для обратной совместимости со старым полем content
            $news->content = $validated['body'] ?? null;
            $news->cover_image_alt = $validated['cover_image_alt'] ?? null;
            $news->seo_title = $validated['seo_title'] ?? null;
            $news->seo_description = $validated['seo_description'] ?? null;
            $news->external_url = $validated['external_url'] ?? null;
            // $type уже определен выше

            $news->status = $validated['status'];
            $news->published_at = $validated['status'] === 'published' 
                ? ($validated['published_at'] ?? now())
                : null;
            $news->created_by = auth()->id();
            $news->type = $type;
            $categories = $this->normalizeCategories($request->input('category'));
            $news->category = ! empty($categories) ? $categories : null;

            $mediaItems = $this->parseMediaInput($request->input('media'));
            if (!empty($mediaItems)) {
                $news->images = $mediaItems;
                
                // Для материалов СМИ: если есть внешнее изображение с is_cover, сохраняем его как обложку
                if ($type === News::TYPE_MEDIA) {
                    $coverMedia = collect($mediaItems)->firstWhere('is_cover', true);
                    if ($coverMedia && !empty($coverMedia['url']) && str_starts_with($coverMedia['url'], 'http')) {
                        // Внешнее изображение - сохраняем URL напрямую
                        $news->cover_image_path = $coverMedia['url'];
                        $news->cover_image_thumb_path = $coverMedia['url'];
                    }
                }
            }

            // Обработка обложки (только для загруженных файлов)
            if ($request->hasFile('cover')) {
                $this->handleCoverUpload($request->file('cover'), $news);
            }
            
            // Если передан cover_image_path напрямую (для внешних изображений)
            if ($request->has('cover_image_path') && $request->input('cover_image_path')) {
                $coverPath = $request->input('cover_image_path');
                // Если это внешний URL, сохраняем как есть
                if (str_starts_with($coverPath, 'http')) {
                    $news->cover_image_path = $coverPath;
                    $news->cover_image_thumb_path = $coverPath;
                }
            }

            // Сохраняем новость с обработкой ошибок дублирования slug
            $maxRetries = 5;
            $retryCount = 0;
            $saved = false;
            
            while (!$saved && $retryCount < $maxRetries) {
                try {
                    $news->save();
                    $saved = true;
                } catch (QueryException $e) {
                    // Если ошибка дублирования slug, генерируем новый уникальный slug
                    if ($e->getCode() === '23000' && (str_contains($e->getMessage(), 'news_slug_unique') || str_contains($e->getMessage(), 'Duplicate entry'))) {
                        $retryCount++;
                        Log::warning('Обнаружен дублирующийся slug, генерируем новый', [
                            'original_slug' => $news->slug,
                            'title' => $news->title,
                            'retry' => $retryCount,
                            'error' => $e->getMessage(),
                        ]);
                        
                        // Генерируем новый уникальный slug
                        $baseSlug = News::generateUniqueSlug($news->title);
                        $counter = $retryCount;
                        do {
                            $news->slug = $baseSlug . ($counter > 0 ? '-' . $counter : '');
                            $counter++;
                        } while (News::where('slug', $news->slug)->exists() && $counter < 100);
                    } else {
                        // Если это не ошибка дублирования slug, пробрасываем исключение дальше
                        throw $e;
                    }
                }
            }
            
            if (!$saved) {
                Log::error('Не удалось сохранить новость после нескольких попыток', [
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'retries' => $retryCount,
                ]);
                throw new \RuntimeException('Не удалось сохранить новость. Пожалуйста, попробуйте еще раз.');
            }

            Log::info('Создана новость', [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'status' => $news->status,
            ]);

            return redirect()
                ->route('admin.news.index', $this->newsRouteParams($type))
                ->with('success', 'Новость успешно создана');

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Ошибка валидации при создании новости', [
                'errors' => $e->errors(),
                'input_data' => $request->except(['cover', 'media']), // Исключаем большие файлы
                'user_id' => auth()->id(),
            ]);
            
            return back()
                ->withInput()
                ->withErrors($e->errors());
                
        } catch (\Exception $e) {
            Log::error('Критическая ошибка при создании новости', [
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'input_data' => $request->except(['cover', 'media']), // Исключаем большие файлы
                'user_id' => auth()->id(),
                'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB',
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Произошла ошибка при создании новости: ' . $e->getMessage()]);
        }
    }

    /**
     * Форма редактирования новости
     * 
     * @param News $news
     * @return InertiaResponse
     */
    public function edit(News $news): InertiaResponse
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
                'external_url' => $news->external_url,
                'status' => $news->status,
                'published_at' => $news->published_at?->format('Y-m-d\TH:i'),
                'media' => $this->mediaService->normalizeMediaForFrontend($news->images ?? []),
                'category' => $this->formatCategoryForFrontend($news->category ?? []),
            ],
            'media' => $this->mediaService->normalizeMediaForFrontend($news->images ?? []),
            'section' => $news->type ?? News::TYPE_NEWS,
            'sectionMeta' => $meta,
            'type' => $news->type ?? News::TYPE_NEWS,
            'availableCategories' => $this->availableCategories(),
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
            $news->body = $validated['body'] ?? null;
            // Синхронизируем устаревшее поле content
            $news->content = $news->body;
            $news->cover_image_alt = $validated['cover_image_alt'] ?? null;
            $news->seo_title = $validated['seo_title'] ?? null;
            $news->seo_description = $validated['seo_description'] ?? null;
            $news->external_url = $validated['external_url'] ?? null;
            $news->status = $validated['status'];
            $newsType = $this->resolveType($request->input('type', $news->type));
            $news->type = $newsType;
            $categories = $this->normalizeCategories($request->input('category'));
            $news->category = ! empty($categories) ? $categories : null;
            
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
     * Экспорт новостей в Excel с просмотрами
     * 
     * @param Request $request
     * @return Response
     */
    /**
     * Парсит метаданные из URL (для материалов СМИ)
     */
    public function parseUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url|max:512',
        ]);

        try {
            $metadata = $this->urlMetadataService->parseUrl($request->input('url'));

            return response()->json([
                'success' => true,
                'data' => $metadata,
            ]);
        } catch (\Exception $e) {
            Log::error('Ошибка парсинга URL', [
                'url' => $request->input('url'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Не удалось получить данные из ссылки: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function exportViews(Request $request): Response
    {
        // Проверяем права доступа
        $this->authorize('viewAny', News::class);
        
        // Получаем все новости с просмотрами
        $news = News::select('title', 'published_at', 'created_at', 'views')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Создаем CSV содержимое с BOM для правильного отображения кириллицы в Excel
        $csv = "\xEF\xBB\xBF"; // UTF-8 BOM
        $csv .= "Наименование новости;Дата размещения;Количество просмотров\n";
        
        foreach ($news as $item) {
            $title = str_replace([';', "\n", "\r"], [' ', ' ', ' '], $item->title);
            // Используем published_at, если есть, иначе created_at
            $date = $item->published_at 
                ? $item->published_at->format('d.m.Y H:i') 
                : ($item->created_at ? $item->created_at->format('d.m.Y H:i') : 'Не указана');
            $views = $item->views ?? 0;
            
            $csv .= sprintf('"%s";"%s";"%d"' . "\n", $title, $date, $views);
        }
        
        // Генерируем имя файла с текущей датой
        $filename = 'news_views_' . date('Y-m-d_His') . '.csv';
        
        Log::info('Экспорт просмотров новостей', [
            'user_id' => auth()->id(),
            'count' => $news->count(),
        ]);
        
        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Pragma' => 'public',
        ]);
    }

    /**
     * Загрузка временных медиа файлов (изображения/видео)
     */
    public function uploadMediaFiles(Request $request): JsonResponse
    {
        // Проверяем права доступа
        try {
            $this->authorize('create', News::class);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::error('Отказ в доступе при загрузке медиа', [
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'У вас нет прав для загрузки медиа файлов.',
            ], 403);
        }
        
        try {
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

            $uploaded = $this->mediaService->uploadMultipleMedia($files);

            return response()->json([
                'success' => true,
                'media' => $this->mediaService->normalizeMediaForFrontend($uploaded),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Ошибка валидации при загрузке медиа', [
                'errors' => $e->errors(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации: ' . implode(', ', array_map(fn($errors) => implode(', ', $errors), $e->errors())),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('uploadMediaFiles error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Не удалось загрузить файлы: ' . $e->getMessage(),
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

    /**
     * Возвращает список доступных категорий новостей.
     */
    private function availableCategories(): array
    {
        return array_values(config('news.categories', []));
    }

    /**
     * Нормализует список категорий: отфильтровывает по белому списку, убирает дубли и ограничивает количество.
     */
    private function normalizeCategories(mixed $categories): array
    {
        if (is_null($categories)) {
            return [];
        }

        if (! is_array($categories)) {
            $categories = [$categories];
        }

        $allowed = $this->availableCategories();

        $normalized = array_map(function ($category) {
            return is_string($category) ? trim($category) : null;
        }, $categories);

        $normalized = array_filter($normalized, function ($category) use ($allowed) {
            return $category !== null
                && $category !== ''
                && (empty($allowed) || in_array($category, $allowed, true));
        });

        $normalized = array_values(array_unique($normalized));

        if (count($normalized) > 5) {
            $normalized = array_slice($normalized, 0, 5);
        }

        return $normalized;
    }

    /**
     * Приводит категории к массиву для фронтенда, учитывая возможные старые форматы хранения.
     */
    private function formatCategoryForFrontend(mixed $category): array
    {
        if (is_array($category)) {
            return array_values($category);
        }

        if (is_string($category) && $category !== '') {
            return [$category];
        }

        return [];
    }
}

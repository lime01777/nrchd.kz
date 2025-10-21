<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsController extends Controller
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }
    /**
     * Отображение списка новостей
     */
    public function index(Request $request)
    {
        $query = News::query();

        // Поиск
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Фильтрация по статусу
        if ($request->filled('status')) {
            $statusMap = [
                'published' => 'Опубликовано',
                'draft' => 'Черновик',
                'scheduled' => 'Запланировано',
                'archived' => 'Архив'
            ];
            $status = $statusMap[$request->input('status')] ?? $request->input('status');
            $query->where('status', $status);
        }

        // Фильтрация по категории
        if ($request->filled('category')) {
            $query->whereJsonContains('category', $request->input('category'));
        }

        // Сортировка
        $query->orderBy('created_at', 'desc');

        $news = $query->paginate(20);

        return Inertia::render('Admin/News/IndexNew', [
            'news' => $news,
            'filters' => $request->only(['search', 'status', 'category'])
        ]);
    }

    /**
     * Форма создания новости
     */
    public function create()
    {
        // Получаем доступные категории из существующих новостей
        $availableCategories = News::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category')
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        // Если категорий нет, добавляем базовые
        if (empty($availableCategories)) {
            $availableCategories = [
                'Общие новости',
                'Медицина',
                'Наука',
                'Образование',
                'Спорт',
                'Культура',
                'Политика',
                'Экономика'
            ];
        }

        return Inertia::render('Admin/News/CreateNew', [
            'availableCategories' => $availableCategories
        ]);
    }

    /**
     * Сохранение новости
     */
    public function store(NewsRequest $request)
    {
        $validated = $request->validated();

        try {
            // Проверяем права на запись в storage
            $storagePath = storage_path('app/public/news');
            if (!is_writable($storagePath)) {
                Log::error('Нет прав на запись в директорию', ['path' => $storagePath]);
                return back()->withErrors(['error' => 'Ошибка прав доступа к директории загрузки']);
            }

            // Генерируем slug
            $slug = $this->generateUniqueSlug($validated['title']);

            // Обрабатываем медиа-файлы
            $mediaItems = $this->processMedia($request);

            // Создаем новость
            $news = new News();
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $this->mapStatus($validated['status']);
            $news->publish_date = $validated['publish_date'] ?? null;
            $news->images = $mediaItems; // Сохраняем в поле images для обратной совместимости
            $news->save();

            Log::info('Создана новость', [
                'id' => $news->id,
                'title' => $news->title,
                'media_count' => count($mediaItems),
                'media' => $mediaItems
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно создана');

        } catch (\Exception $e) {
            Log::error('Ошибка при создании новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'title' => $request->input('title'),
                'files' => $request->hasFile('media_files') ? count($request->file('media_files')) : 0
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при создании новости. Проверьте логи сервера.']);
        }
    }

    /**
     * Форма редактирования новости
     */
    public function edit($id)
    {
        $news = News::findOrFail($id);

        // Получаем доступные категории из существующих новостей
        $availableCategories = News::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category')
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        // Если категорий нет, добавляем базовые
        if (empty($availableCategories)) {
            $availableCategories = [
                'Общие новости',
                'Медицина',
                'Наука',
                'Образование',
                'Спорт',
                'Культура',
                'Политика',
                'Экономика'
            ];
        }

        return Inertia::render('Admin/News/EditNew', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'content' => $news->content,
                'category' => $news->category,
                'tags' => $news->tags ?? [],
                'status' => $news->status,
                'publish_date' => $news->formatted_publish_date,
                'images' => $news->images ?? [],
                'views' => $news->views ?? 0,
                'created_at' => $news->created_at,
                'updated_at' => $news->updated_at,
            ],
            'availableCategories' => $availableCategories
        ]);
    }

    /**
     * Обновление новости
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        // Используем NewsRequest для валидации
        $validated = (new \App\Http\Requests\NewsRequest())->validate($request->all());

        try {
            // Генерируем новый slug если изменился заголовок
            if ($news->title !== $validated['title']) {
                $slug = $this->generateUniqueSlug($validated['title'], $news->id);
            } else {
                $slug = $news->slug;
            }

        // Обрабатываем медиа-файлы
        $mediaPaths = $this->processMedia($request, $news->images ?? []);

            // Обновляем новость
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $this->mapStatus($validated['status']);
            $news->publish_date = $validated['publish_date'] ?? null;
            $news->images = $mediaPaths; // Сохраняем в поле images для обратной совместимости
            $news->save();

            Log::info('Обновлена новость', [
                'id' => $news->id,
                'title' => $news->title,
                'media_count' => count($mediaPaths),
                'media' => $mediaPaths
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно обновлена');

        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'news_id' => $id,
                'files' => $request->hasFile('media_files') ? count($request->file('media_files')) : 0
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при обновлении новости. Проверьте логи сервера.']);
        }
    }

    /**
     * Удаление новости
     */
    public function destroy($id)
    {
        try {
            $news = News::findOrFail($id);
            
            // Удаляем медиа-файлы
            if ($news->images) {
                foreach ($news->images as $mediaItem) {
                    $path = is_array($mediaItem) ? $mediaItem['path'] : $mediaItem;
                    $this->mediaService->deleteMedia($path);
                }
            }

            $news->delete();

            Log::info('Удалена новость', [
                'id' => $id,
                'title' => $news->title
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно удалена');

        } catch (\Exception $e) {
            Log::error('Ошибка при удалении новости', [
                'error' => $e->getMessage(),
                'news_id' => $id
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при удалении новости']);
        }
    }

    /**
     * Обработка медиа-файлов (изображения и видео)
     */
    private function processMedia(Request $request, $existingMedia = [])
    {
        $mediaPaths = [];
        
        // Обрабатываем images из запроса (загруженные через ModernMediaUploader)
        if ($request->has('images') && is_array($request->input('images'))) {
            foreach ($request->input('images') as $imageData) {
                if (is_array($imageData) && isset($imageData['path'])) {
                    $mediaPaths[] = $imageData;
                }
            }
        }
        
        // Добавляем существующие медиа (если они в старом формате - строки)
        if (is_array($existingMedia)) {
            foreach ($existingMedia as $existingItem) {
                if (is_string($existingItem)) {
                    // Старый формат - строка пути
                    $extension = strtolower(pathinfo($existingItem, PATHINFO_EXTENSION));
                    $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
                    $mediaType = in_array($extension, $videoExtensions) ? 'video' : 'image';
                    
                    $mediaPaths[] = [
                        'path' => $existingItem,
                        'type' => $mediaType,
                        'name' => basename($existingItem),
                        'source' => 'existing'
                    ];
                } elseif (is_array($existingItem)) {
                    // Новый формат - объект
                    $mediaPaths[] = $existingItem;
                }
            }
        }

        // Проверяем и создаем директорию если не существует
        $storagePath = storage_path('app/public/news');
        if (!file_exists($storagePath)) {
            try {
                mkdir($storagePath, 0755, true);
                Log::info('Создана директория для медиа-файлов', ['path' => $storagePath]);
            } catch (\Exception $e) {
                Log::error('Ошибка создания директории', [
                    'path' => $storagePath,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Обрабатываем новые загруженные файлы
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                if ($file && $file->isValid()) {
                    try {
                        // Проверяем размер файла
                        if ($file->getSize() > 50 * 1024 * 1024) { // 50MB
                            Log::warning('Файл слишком большой', [
                                'name' => $file->getClientOriginalName(),
                                'size' => $file->getSize()
                            ]);
                            continue;
                        }

                        // Проверяем тип файла
                        $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                        $allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
                        $allowedTypes = array_merge($allowedImageTypes, $allowedVideoTypes);
                        
                        if (!in_array($file->getMimeType(), $allowedTypes)) {
                            Log::warning('Неподдерживаемый тип файла', [
                                'name' => $file->getClientOriginalName(),
                                'mime' => $file->getMimeType()
                            ]);
                            continue;
                        }

                        $path = $file->store('news', 'public');
                        
                        // Проверяем, что файл действительно сохранен
                        $fullPath = storage_path('app/public/' . $path);
                        if (file_exists($fullPath)) {
                            // Определяем тип медиа
                            $mediaType = in_array($file->getMimeType(), $allowedVideoTypes) ? 'video' : 'image';
                            
                            // Создаем объект медиа с типом
                            $mediaItem = [
                                'path' => '/storage/' . $path,
                                'type' => $mediaType,
                                'name' => $file->getClientOriginalName(),
                                'size' => filesize($fullPath)
                            ];
                            
                            $mediaPaths[] = $mediaItem;
                            
                            Log::info('Загружен медиа-файл', [
                                'name' => $file->getClientOriginalName(),
                                'path' => $mediaItem['path'],
                                'size' => $mediaItem['size'],
                                'type' => $mediaType
                            ]);
                        } else {
                            Log::error('Файл не сохранен', [
                                'name' => $file->getClientOriginalName(),
                                'expected_path' => $fullPath
                            ]);
                        }
                    } catch (\Exception $e) {
                        Log::error('Ошибка загрузки медиа-файла', [
                            'file' => $file->getClientOriginalName(),
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                } else {
                    Log::warning('Невалидный файл', [
                        'name' => $file ? $file->getClientOriginalName() : 'unknown',
                        'valid' => $file ? $file->isValid() : false
                    ]);
                }
            }
        }

        // Обрабатываем медиа из библиотеки и существующие файлы
        $inputMedia = $request->input('media', []);
        if (is_array($inputMedia)) {
            foreach ($inputMedia as $mediaItem) {
                if (is_array($mediaItem) && isset($mediaItem['path']) && !empty(trim($mediaItem['path']))) {
                    $path = $mediaItem['path'];
                    
                    // Проверяем, что URL не содержит отсутствующие файлы
                    if (strpos($path, '/storage/news/') === 0) {
                        $filename = basename($path);
                        $filepath = storage_path('app/public/news/' . $filename);
                        
                        if (file_exists($filepath)) {
                            // Определяем тип медиа по расширению
                            $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                            $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
                            $mediaType = in_array($extension, $videoExtensions) ? 'video' : 'image';
                            
                            // Создаем объект медиа с типом
                            $mediaObject = [
                                'path' => $path,
                                'type' => $mediaType,
                                'name' => $mediaItem['name'] ?? $filename,
                                'source' => $mediaItem['source'] ?? 'library'
                            ];
                            
                            $mediaPaths[] = $mediaObject;
                        } else {
                            Log::warning('Отсутствует медиа-файл', [
                                'path' => $path,
                                'filepath' => $filepath
                            ]);
                        }
                    } else {
                        // Для внешних URL сохраняем как есть
                        $mediaObject = [
                            'path' => $path,
                            'type' => $mediaItem['type'] ?? 'image',
                            'name' => $mediaItem['name'] ?? basename($path),
                            'source' => $mediaItem['source'] ?? 'external'
                        ];
                        $mediaPaths[] = $mediaObject;
                    }
                }
            }
        }

        // Удаляем дубликаты по пути
        $uniquePaths = [];
        $seenPaths = [];
        foreach ($mediaPaths as $mediaItem) {
            $path = is_array($mediaItem) ? $mediaItem['path'] : $mediaItem;
            if (!in_array($path, $seenPaths)) {
                $uniquePaths[] = $mediaItem;
                $seenPaths[] = $path;
            }
        }
        $mediaPaths = $uniquePaths;

        Log::info('Обработка медиа-файлов завершена', [
            'total_media' => count($mediaPaths),
            'paths' => $mediaPaths
        ]);

        return $mediaPaths;
    }


    /**
     * Генерация уникального slug
     */
    private function generateUniqueSlug($title, $excludeId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (News::where('slug', $slug)
            ->when($excludeId, function($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Загрузить медиа файлы для новости
     */
    public function uploadMedia(Request $request, $newsId)
    {
        $news = News::findOrFail($newsId);
        
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'file|mimes:jpeg,png,jpg,gif,webp,mp4,avi,mov,wmv,flv,webm,ogg|max:51200',
        ]);

        try {
            $uploadedMedia = $this->mediaService->uploadMultipleMedia($request->file('files'));
            
            // Добавляем к существующим медиа
            $existingMedia = $news->images ?? [];
            $allMedia = array_merge($existingMedia, $uploadedMedia);
            
            $news->images = $allMedia;
            $news->save();

            return response()->json([
                'success' => true,
                'media' => $uploadedMedia,
                'message' => 'Медиа файлы успешно загружены'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка загрузки медиа', [
                'news_id' => $newsId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки медиа файлов: ' . $e->getMessage()
            ], 422);
        }
    }

    /**
     * Обновить порядок медиа
     */
    public function updateMediaOrder(Request $request, $newsId)
    {
        $news = News::findOrFail($newsId);
        
        $request->validate([
            'media' => 'required|array',
            'media.*.id' => 'required|string',
            'media.*.position' => 'required|integer',
        ]);

        try {
            $orderedMedia = $this->mediaService->updateMediaOrder($request->input('media'));
            $news->images = $orderedMedia;
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Порядок медиа обновлен'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка обновления порядка медиа', [
                'news_id' => $newsId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка обновления порядка медиа'
            ], 422);
        }
    }

    /**
     * Удалить медиа файл
     */
    public function deleteMedia(Request $request, $newsId, $mediaId)
    {
        $news = News::findOrFail($newsId);
        
        try {
            $mediaItems = $news->images ?? [];
            $mediaToDelete = null;
            $updatedMedia = [];

            // Находим и удаляем медиа
            foreach ($mediaItems as $item) {
                if (is_array($item) && ($item['id'] ?? '') === $mediaId) {
                    $mediaToDelete = $item;
                    // Удаляем физический файл
                    if (isset($item['path'])) {
                        $this->mediaService->deleteMedia($item['path']);
                    }
                } else {
                    $updatedMedia[] = $item;
                }
            }

            if (!$mediaToDelete) {
                return response()->json([
                    'success' => false,
                    'message' => 'Медиа файл не найден'
                ], 404);
            }

            $news->images = $updatedMedia;
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Медиа файл удален'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка удаления медиа', [
                'news_id' => $newsId,
                'media_id' => $mediaId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка удаления медиа файла'
            ], 422);
        }
    }

    /**
     * Установить обложку
     */
    public function setCover(Request $request, $newsId, $mediaId)
    {
        $news = News::findOrFail($newsId);
        
        try {
            $mediaItems = $news->images ?? [];
            $updatedMedia = $this->mediaService->setCover($mediaItems, $mediaId);
            
            $news->images = $updatedMedia;
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Обложка установлена'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка установки обложки', [
                'news_id' => $newsId,
                'media_id' => $mediaId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка установки обложки'
            ], 422);
        }
    }

    /**
     * Маппинг статусов для обратной совместимости
     */
    private function mapStatus(string $status): string
    {
        $statusMap = [
            'draft' => 'Черновик',
            'scheduled' => 'Запланировано',
            'published' => 'Опубликовано',
            'archived' => 'Архив'
        ];

        return $statusMap[$status] ?? $status;
    }

    /**
     * Обратное маппирование статусов
     */
    private function reverseMapStatus(string $status): string
    {
        $statusMap = [
            'Черновик' => 'draft',
            'Запланировано' => 'scheduled',
            'Опубликовано' => 'published',
            'Архив' => 'archived'
        ];

        return $statusMap[$status] ?? $status;
    }

    /**
     * Загрузка медиа файлов (без привязки к новости)
     */
    public function uploadMediaFiles(Request $request)
    {
        $request->validate([
            'media_files' => 'required|array|max:10',
            'media_files.*' => 'file|mimes:jpeg,png,jpg,gif,webp,mp4,avi,mov,wmv,flv,webm,ogg|max:51200',
        ]);

        try {
            $uploadedMedia = $this->mediaService->uploadMultipleMedia($request->file('media_files'));
            
            return response()->json([
                'success' => true,
                'media' => $uploadedMedia
            ]);
            
        } catch (\Exception $e) {
            Log::error('Ошибка загрузки медиа файлов', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки медиа файлов'
            ], 500);
        }
    }
}

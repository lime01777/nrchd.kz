<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsController extends Controller
{
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
            $query->where('status', $request->input('status'));
        }

        // Сортировка
        $query->orderBy('created_at', 'desc');

        $news = $query->paginate(20);

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Форма создания новости
     */
    public function create()
    {
        return Inertia::render('Admin/News/Create');
    }

    /**
     * Сохранение новости
     */
    public function store(Request $request)
    {
        // Валидация
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
            'publish_date' => 'nullable|date',
            'media' => 'nullable|array|max:15',
            'media.*' => 'nullable|array',
            'media.*.path' => 'nullable|string',
            'media.*.type' => 'nullable|string|in:image,video',
            'media.*.name' => 'nullable|string',
            'media.*.source' => 'nullable|string|in:library,file',
            'media_files' => 'nullable|array|max:15',
            'media_files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,avi,mov,wmv,flv,webm|max:51200',
        ]);

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
            $mediaPaths = $this->processMedia($request);

            // Проверяем, что хотя бы один медиа-файл загружен
            if (empty($mediaPaths)) {
                Log::warning('Попытка создания новости без медиа-файлов', [
                    'title' => $validated['title']
                ]);
            }

            // Создаем новость
            $news = new News();
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $validated['status'];
            $news->publish_date = $validated['publish_date'] ?? null;
            $news->images = $mediaPaths; // Сохраняем в поле images для обратной совместимости
            $news->save();

            Log::info('Создана новость', [
                'id' => $news->id,
                'title' => $news->title,
                'media_count' => count($mediaPaths),
                'media' => $mediaPaths
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

        return Inertia::render('Admin/News/Edit', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'content' => $news->content,
                'category' => $news->category,
                'status' => $news->status,
                'publish_date' => $news->formatted_publish_date,
                'images' => $news->images ?? [],
            ],
        ]);
    }

    /**
     * Обновление новости
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        // Валидация
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
            'publish_date' => 'nullable|date',
            'media' => 'nullable|array|max:15',
            'media.*' => 'nullable|array',
            'media.*.path' => 'nullable|string',
            'media.*.type' => 'nullable|string|in:image,video',
            'media.*.name' => 'nullable|string',
            'media.*.source' => 'nullable|string|in:existing,library,file',
            'media_files' => 'nullable|array|max:15',
            'media_files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,avi,mov,wmv,flv,webm|max:51200',
        ]);

        try {
            // Генерируем новый slug если изменился заголовок
            if ($news->title !== $validated['title']) {
                $slug = $this->generateUniqueSlug($validated['title'], $news->id);
            } else {
                $slug = $news->slug;
            }

            // Обрабатываем медиа-файлы
            $mediaPaths = $this->processMedia($request, $news->images);

            // Обновляем новость
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $validated['status'];
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
                foreach ($news->images as $mediaPath) {
                    $this->deleteMedia($mediaPath);
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
                            $mediaPaths[] = '/storage/' . $path;
                            
                            Log::info('Загружен медиа-файл', [
                                'name' => $file->getClientOriginalName(),
                                'path' => '/storage/' . $path,
                                'size' => filesize($fullPath),
                                'type' => in_array($file->getMimeType(), $allowedVideoTypes) ? 'video' : 'image'
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
                            $mediaPaths[] = $path;
                        } else {
                            Log::warning('Отсутствует медиа-файл', [
                                'path' => $path,
                                'filepath' => $filepath
                            ]);
                        }
                    } else {
                        $mediaPaths[] = $path;
                    }
                }
            }
        }

        // Удаляем дубликаты
        $mediaPaths = array_unique($mediaPaths);

        Log::info('Обработка медиа-файлов завершена', [
            'total_media' => count($mediaPaths),
            'paths' => $mediaPaths
        ]);

        return $mediaPaths;
    }

    /**
     * Удаление медиа-файла
     */
    private function deleteMedia($path)
    {
        if (strpos($path, '/storage/') === 0) {
            $filePath = public_path('storage' . str_replace('/storage', '', $path));
            if (file_exists($filePath)) {
                unlink($filePath);
                Log::info('Удален медиа-файл', ['path' => $filePath]);
            }
        }
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
}

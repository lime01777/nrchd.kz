<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = News::query();

        // Фильтрация по поисковому запросу
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Фильтрация по категории
        if ($request->has('category') && $request->input('category')) {
            $query->where('category', $request->input('category'));
        }

        // Фильтрация по статусу
        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        $news = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/News/Edit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Установка тайм-аута в рамках ограничений хостинга
        set_time_limit(100); // 100 секунд (меньше лимита хостинга 120 сек)
        
        // Увеличиваем лимит памяти
        ini_set('memory_limit', '512M');
        
        try {
            // Проверяем наличие директории для хранения изображений
            if (!Storage::disk('public')->exists('news')) {
                Storage::disk('public')->makeDirectory('news');
            }
        } catch (\Exception $e) {
            Log::error('Ошибка создания директории: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Ошибка создания директории для изображений']);
        }

        try {
            // Валидация данных
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string|min:10',
                'category' => 'required|array|min:1',
                'category.*' => 'string',
                'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
                'publishDate' => 'nullable|date',
                'images' => 'nullable|array',
                'images.*' => 'nullable',
                'image_files' => 'nullable|array',
                'image_files.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'main_image' => 'nullable',
            ]);

        // Генерируем slug из заголовка
        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (News::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Логирование для отладки
        Log::info('Данные запроса при создании новости', [
            'has_images' => $request->has('images'),
            'images_files' => $request->hasFile('image_files'),
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'category' => $request->input('category'),
            'status' => $request->input('status'),
            'images_input' => $request->input('images'),
            'image_files_count' => $request->hasFile('image_files') ? count($request->file('image_files')) : 0,
            'all_data' => $request->all()
        ]);

        // Обработка изображений
        $imagePaths = [];
        
        // Обрабатываем файлы изображений (если есть)
        if ($request->hasFile('image_files')) {
            $imageFiles = $request->file('image_files');
            Log::info('Обработка файлов изображений', [
                'count' => count($imageFiles),
                'files' => array_map(function($file) {
                    return $file ? $file->getClientOriginalName() : 'null';
                }, $imageFiles)
            ]);
            
            foreach ($imageFiles as $key => $img) {
                if ($img && $img->isValid()) {
                    try {
                        // Генерируем уникальное имя файла
                        $filename = time() . '_' . $key . '.' . $img->getClientOriginalExtension();
                        
                        // Сохраняем файл в public/img/news напрямую
                        $destinationPath = public_path('img/news');
                        
                        // Создаем папку если не существует
                        if (!file_exists($destinationPath)) {
                            mkdir($destinationPath, 0755, true);
                        }
                        
                        // Перемещаем файл
                        $img->move($destinationPath, $filename);
                        $path = '/img/news/' . $filename;
                        $imagePaths[] = $path;
                        
                        Log::info('Загружен файл изображения', [
                            'original_name' => $img->getClientOriginalName(),
                            'path' => $path,
                            'size' => $img->getSize()
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Ошибка сохранения файла изображения', [
                            'file' => $img->getClientOriginalName(),
                            'error' => $e->getMessage()
                        ]);
                    }
                } else {
                    Log::warning('Невалидный файл изображения', [
                        'key' => $key,
                        'file' => $img ? $img->getClientOriginalName() : 'null'
                    ]);
                }
            }
        }
        
        // Обрабатываем URL изображений из библиотеки или уже загруженные
        $inputImages = $request->input('images');
        Log::info('Обработка URL изображений', [
            'input_images' => $inputImages,
            'is_array' => is_array($inputImages)
        ]);
        
        if (is_array($inputImages)) {
            foreach ($inputImages as $img) {
                if (is_string($img) && !empty(trim($img)) && !in_array($img, $imagePaths)) {
                    $imagePaths[] = $img;
                    Log::info('Добавлен URL изображения', ['url' => $img]);
                } else {
                    Log::warning('Пропущен невалидный URL изображения', [
                        'url' => $img,
                        'type' => gettype($img),
                        'empty' => empty($img)
                    ]);
                }
            }
        }
        
        // Логируем информацию об изображениях
        Log::info('Обработка изображений при создании', [
            'image_paths' => $imagePaths
        ]);

        // Создаем новую запись
        $news = new News();
        $news->title = $validated['title'];
        $news->slug = $slug;
        $news->content = $validated['content'];
        $news->category = $validated['category'];
        $news->status = $validated['status'];
        $news->publish_date = $validated['publishDate'] ?? null;
        // Сохраняем массив путей к изображениям в JSON-поле images
        $news->images = $imagePaths;
        $news->save();
        
        // Логируем результат
        Log::info('Создана новость', [
            'id' => $news->id,
            'title' => $news->title,
            'images' => $news->images,
            'main_image' => $news->main_image
        ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно создана');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Ошибки валидации - возвращаем их как есть
            Log::error('Ошибка валидации при создании новости', [
                'errors' => $e->errors(),
                'title' => $request->input('title', 'не указан')
            ]);
            throw $e;
            
        } catch (\Exception $e) {
            // Любые другие ошибки
            Log::error('Критическая ошибка при создании новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'title' => $request->input('title', 'не указан'),
                'request_data' => $request->except(['image_files']) // Исключаем файлы из лога
            ]);
            
            return back()->withErrors([
                'error' => 'Произошла ошибка при сохранении новости: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $news = News::findOrFail($id);

        // Логируем данные новости для отладки
        Log::info('Данные новости для редактирования', [
            'id' => $news->id,
            'title' => $news->title,
            'images' => $news->images,
            'main_image' => $news->main_image,
            'images_type' => gettype($news->images),
            'main_image_type' => gettype($news->main_image)
        ]);

        return Inertia::render('Admin/News/Edit', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'content' => $news->content,
                'category' => $news->category,
                'status' => $news->status,
                'publishDate' => $news->formatted_publish_date,
                'images' => $news->images,
                'main_image' => $news->main_image,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        // Валидация данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
            'publishDate' => 'nullable|date',
            'images' => 'nullable|array',
            'images.*' => 'nullable',
            'image_files' => 'nullable|array',
            'image_files.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'main_image' => 'nullable',
        ]);

        // Обновляем slug только если изменился заголовок
        if ($news->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (News::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $news->slug = $slug;
        }

        // Логирование для отладки
        Log::info('Данные запроса при обновлении новости', [
            'has_images' => $request->has('images'),
            'images_input' => $request->input('images'),
            'images_files' => $request->hasFile('image_files') ? 'есть файлы' : 'нет файлов',
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'category' => $request->input('category'),
            'status' => $request->input('status'),
            'all_data' => $request->all()
        ]);

        // Проверяем наличие директории для хранения изображений
        if (!Storage::disk('public')->exists('news')) {
            Storage::disk('public')->makeDirectory('news');
        }

        // Обработка изображений
        $imagePaths = [];
        
        // Обрабатываем файлы изображений (если есть)
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $key => $img) {
                if ($img && $img->isValid()) {
                    // Генерируем уникальное имя файла
                    $filename = time() . '_' . $key . '.' . $img->getClientOriginalExtension();
                    
                    // Сохраняем файл в public/img/news напрямую
                    $destinationPath = public_path('img/news');
                    
                    // Создаем папку если не существует
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Перемещаем файл
                    $img->move($destinationPath, $filename);
                    $path = '/img/news/' . $filename;
                    $imagePaths[] = $path;
                    
                    Log::info('Загружен файл изображения', ['path' => $path]);
                }
            }
        }
        
        // Обрабатываем URL изображений из библиотеки или уже загруженные
        $inputImages = $request->input('images');
        if (is_array($inputImages)) {
            foreach ($inputImages as $img) {
                if (is_string($img) && !empty($img) && !in_array($img, $imagePaths)) {
                    $imagePaths[] = $img;
                    Log::info('Добавлен URL изображения', ['url' => $img]);
                }
            }
        }
        
        // Логируем информацию об изображениях
        Log::info('Обработка изображений при обновлении', [
            'image_paths' => $imagePaths
        ]);

        // Удаляем старые файлы, которые больше не используются
        if ($news->images) {
            foreach ($news->images as $oldImg) {
                if (is_string($oldImg) && !in_array($oldImg, $imagePaths)) {
                    // Обрабатываем старые пути /storage/news/
                    if (strpos($oldImg, '/storage/news/') === 0) {
                        $filePath = public_path('storage' . str_replace('/storage', '', $oldImg));
                        if (file_exists($filePath)) {
                            unlink($filePath);
                            Log::info('Удален старый файл из storage', ['path' => $filePath]);
                        }
                    }
                    // Обрабатываем новые пути /img/news/
                    elseif (strpos($oldImg, '/img/news/') === 0) {
                        $filePath = public_path(str_replace('/img', 'img', $oldImg));
                        if (file_exists($filePath)) {
                            unlink($filePath);
                            Log::info('Удален старый файл из img', ['path' => $filePath]);
                        }
                    }
                }
            }
        }

        // Обновляем запись
        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->category = $validated['category'];
        $news->status = $validated['status'];
        $news->publish_date = $validated['publishDate'] ?? null;
        $news->images = $imagePaths;
        $news->save();

        return redirect()->route('admin.news')->with('success', 'Новость успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);
        
        // Удаляем связанные файлы
        if ($news->images) {
            foreach ($news->images as $img) {
                if (is_string($img)) {
                    // Обрабатываем старые пути /storage/news/
                    if (strpos($img, '/storage/news/') === 0) {
                        $filePath = public_path('storage' . str_replace('/storage', '', $img));
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                    // Обрабатываем новые пути /img/news/
                    elseif (strpos($img, '/img/news/') === 0) {
                        $filePath = public_path(str_replace('/img', 'img', $img));
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                }
            }
        }
        
        $news->delete();
        
        return redirect()->route('admin.news')->with('success', 'Новость успешно удалена');
    }

    /**
     * Массовые действия с новостями
     */
    public function bulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'action' => 'required|string|in:delete,publish,draft',
        ]);

        $count = 0;
        
        switch ($validated['action']) {
            case 'delete':
                foreach ($validated['ids'] as $id) {
                    $news = News::find($id);
                    if ($news) {
                        // Удаляем связанные файлы
                        if ($news->images) {
                            foreach ($news->images as $img) {
                                if (is_string($img) && strpos($img, '/storage/news/') === 0) {
                                    $filePath = str_replace('/storage/', '', $img);
                                    if (Storage::disk('public')->exists($filePath)) {
                                        Storage::disk('public')->delete($filePath);
                                    }
                                }
                            }
                        }
                        
                        $news->delete();
                        $count++;
                    }
                }
                $message = "Удалено новостей: {$count}";
                break;
                
            case 'publish':
                $count = News::whereIn('id', $validated['ids'])->update(['status' => 'Опубликовано']);
                $message = "Опубликовано новостей: {$count}";
                break;
                
            case 'draft':
                $count = News::whereIn('id', $validated['ids'])->update(['status' => 'Черновик']);
                $message = "Переведено в черновики: {$count}";
                break;
        }
        
        return redirect()->route('admin.news')->with('success', $message);
    }

    /**
     * Отладочный метод для проверки данных формы новости
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug(Request $request)
    {
        // Логируем все входящие данные
        Log::info('Отладка данных формы новости', [
            'all' => $request->all(),
            'hasFile_images' => $request->hasFile('images'),
            'images_input' => $request->input('images'),
            'main_image' => $request->input('main_image'),
            'files' => $request->file(),
        ]);
        
        // Обработка изображений для отладки
        $processedImages = [];
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $key => $img) {
                if ($img && $img->isValid()) {
                    $processedImages[$key] = [
                        'name' => $img->getClientOriginalName(),
                        'size' => $img->getSize(),
                        'type' => $img->getMimeType(),
                        'extension' => $img->getClientOriginalExtension(),
                    ];
                }
            }
        } else if ($request->has('images')) {
            $inputImages = $request->input('images');
            if (is_array($inputImages)) {
                foreach ($inputImages as $key => $img) {
                    $processedImages[$key] = [
                        'value' => $img,
                        'type' => 'string',
                    ];
                }
            }
        }
        
        return Response::json([
            'success' => true,
            'message' => 'Данные формы получены',
            'title' => $request->input('title'),
            'category' => $request->input('category'),
            'status' => $request->input('status'),
            'publishDate' => $request->input('publishDate'),
            'content_length' => strlen($request->input('content')),
            'images' => $processedImages,
            'main_image' => $request->input('main_image'),
        ]);
    }

    /**
     * Тестовый метод для проверки загрузки изображений
     */
    public function testUpload(Request $request)
    {
        Log::info('Тестовый запрос загрузки изображений', [
            'all_data' => $request->all(),
            'has_images' => $request->has('images'),
            'images_input' => $request->input('images'),
            'main_image' => $request->input('main_image'),
            'files' => $request->allFiles()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Тестовые данные получены',
            'data' => [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'images' => $request->input('images'),
                'main_image' => $request->input('main_image'),
                'files_count' => count($request->allFiles())
            ]
        ]);
    }
}

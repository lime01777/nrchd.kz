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
        // Проверяем наличие директории для хранения изображений
        if (!Storage::disk('public')->exists('news')) {
            Storage::disk('public')->makeDirectory('news');
        }

        // Валидация данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
            'publishDate' => 'nullable|date',
            'images' => 'nullable|array|max:18',
            'images.*' => 'nullable',
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
            'images_files' => $request->hasFile('images'),
            'main_image' => $request->input('main_image')
        ]);

        // Обработка изображений
        $imagePaths = [];
        
        // Проверяем, есть ли в запросе изображения
        if ($request->has('images')) {
            // Проверяем, являются ли изображения файлами
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $key => $img) {
                    if ($img && $img->isValid()) {
                        // Генерируем уникальное имя файла
                        $filename = time() . '_' . $key . '.' . $img->getClientOriginalExtension();
                        
                        // Сохраняем файл
                        $img->storeAs('news', $filename, 'public');
                        $path = '/storage/news/' . $filename;
                        $imagePaths[] = $path;
                        
                        Log::info('Загружен файл изображения', ['path' => $path]);
                    }
                }
            } else {
                // Обработка строковых URL изображений (из библиотеки или при редактировании)
                $inputImages = $request->input('images');
                if (is_array($inputImages)) {
                    foreach ($inputImages as $img) {
                        if (is_string($img) && !in_array($img, $imagePaths)) {
                            $imagePaths[] = $img;
                            Log::info('Добавлен URL изображения', ['url' => $img]);
                        }
                    }
                }
            }
        }
        
        // Обработка главного изображения
        $mainImage = $request->input('main_image');
        // Если главное изображение не выбрано, но есть другие изображения, выбираем первое
        if (empty($mainImage) && !empty($imagePaths)) {
            $mainImage = $imagePaths[0];
        }
        
        // Проверяем, существует ли главное изображение в списке изображений
        if ($mainImage && !in_array($mainImage, $imagePaths) && !empty($imagePaths)) {
            $mainImage = $imagePaths[0];
        }

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
        $news->main_image = $mainImage;
        $news->save();
        
        // Логируем результат
        Log::info('Создана новость', [
            'id' => $news->id,
            'title' => $news->title,
            'images' => $news->images,
            'main_image' => $news->main_image
        ]);

        return redirect()->route('admin.news')->with('success', 'Новость успешно создана');
    }

    /**
     * Show the form for editing the specified resource.
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
                'publishDate' => $news->publish_date ? $news->publish_date->format('Y-m-d') : null,
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
            'images' => 'nullable|array|max:18',
            'images.*' => 'nullable',
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
            'images_files' => $request->hasFile('images') ? 'есть файлы' : 'нет файлов',
            'main_image' => $request->input('main_image')
        ]);

        // Проверяем наличие директории для хранения изображений
        if (!Storage::disk('public')->exists('news')) {
            Storage::disk('public')->makeDirectory('news');
        }

        // Обработка изображений
        $imagePaths = [];
        
        // Проверяем, есть ли в запросе изображения
        if ($request->has('images')) {
            // Проверяем, являются ли изображения файлами
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $key => $img) {
                    if ($img && $img->isValid()) {
                        // Генерируем уникальное имя файла
                        $filename = time() . '_' . $key . '.' . $img->getClientOriginalExtension();
                        
                        // Сохраняем файл
                        $img->storeAs('news', $filename, 'public');
                        $path = '/storage/news/' . $filename;
                        $imagePaths[] = $path;
                        
                        Log::info('Загружен файл изображения', ['path' => $path]);
                    }
                }
            } else {
                // Обработка строковых URL изображений (из библиотеки или при редактировании)
                $inputImages = $request->input('images');
                if (is_array($inputImages)) {
                    foreach ($inputImages as $img) {
                        if (is_string($img) && !in_array($img, $imagePaths)) {
                            $imagePaths[] = $img;
                            Log::info('Добавлен URL изображения', ['url' => $img]);
                        }
                    }
                }
            }
        }
        
        // Обработка главного изображения
        $mainImage = $request->input('main_image');
        // Если главное изображение не выбрано, но есть другие изображения, выбираем первое
        if (empty($mainImage) && !empty($imagePaths)) {
            $mainImage = $imagePaths[0];
        }
        
        // Проверяем, существует ли главное изображение в списке изображений
        if ($mainImage && !in_array($mainImage, $imagePaths) && !empty($imagePaths)) {
            $mainImage = $imagePaths[0];
        }

        // Удаляем старые файлы, которые больше не используются
        if ($news->images) {
            foreach ($news->images as $oldImg) {
                if (is_string($oldImg) && !in_array($oldImg, $imagePaths) && strpos($oldImg, '/storage/news/') === 0) {
                    $filePath = str_replace('/storage/', '', $oldImg);
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                        Log::info('Удален старый файл', ['path' => $filePath]);
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
        $news->main_image = $mainImage;
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
                if (is_string($img) && strpos($img, '/storage/news/') === 0) {
                    $filePath = str_replace('/storage/', '', $img);
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
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
}

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
            'images' => 'nullable|array|max:15',
            'images.*' => 'nullable|string',
            'image_files' => 'nullable|array|max:15',
            'image_files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        try {
            // Генерируем slug
            $slug = $this->generateUniqueSlug($validated['title']);

            // Обрабатываем изображения
            $imagePaths = $this->processImages($request);

            // Создаем новость
            $news = new News();
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $validated['status'];
            $news->publish_date = $validated['publish_date'] ?? null;
            $news->images = $imagePaths;
            $news->save();

            Log::info('Создана новость', [
                'id' => $news->id,
                'title' => $news->title,
                'images_count' => count($imagePaths)
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно создана');

        } catch (\Exception $e) {
            Log::error('Ошибка при создании новости', [
                'error' => $e->getMessage(),
                'title' => $request->input('title')
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при создании новости: ' . $e->getMessage()]);
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
            'images' => 'nullable|array|max:15',
            'images.*' => 'nullable|string',
            'image_files' => 'nullable|array|max:15',
            'image_files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        try {
            // Генерируем новый slug если изменился заголовок
            if ($news->title !== $validated['title']) {
                $slug = $this->generateUniqueSlug($validated['title'], $news->id);
            } else {
                $slug = $news->slug;
            }

            // Обрабатываем изображения
            $imagePaths = $this->processImages($request, $news->images);

            // Обновляем новость
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $validated['status'];
            $news->publish_date = $validated['publish_date'] ?? null;
            $news->images = $imagePaths;
            $news->save();

            Log::info('Обновлена новость', [
                'id' => $news->id,
                'title' => $news->title,
                'images_count' => count($imagePaths)
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно обновлена');

        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении новости', [
                'error' => $e->getMessage(),
                'news_id' => $id
            ]);

            return back()->withErrors(['error' => 'Произошла ошибка при обновлении новости: ' . $e->getMessage()]);
        }
    }

    /**
     * Удаление новости
     */
    public function destroy($id)
    {
        try {
            $news = News::findOrFail($id);
            
            // Удаляем изображения
            if ($news->images) {
                foreach ($news->images as $imagePath) {
                    $this->deleteImage($imagePath);
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
     * Обработка изображений
     */
    private function processImages(Request $request, $existingImages = [])
    {
        $imagePaths = [];

        // Обрабатываем новые загруженные файлы
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {
                if ($file && $file->isValid()) {
                    try {
                        $path = $file->store('news', 'public');
                        $imagePaths[] = '/storage/' . $path;
                        
                        Log::info('Загружено изображение', [
                            'name' => $file->getClientOriginalName(),
                            'path' => '/storage/' . $path
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Ошибка загрузки изображения', [
                            'file' => $file->getClientOriginalName(),
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
        }

        // Обрабатываем URL изображений из библиотеки (включая выбранные из существующих)
        $inputImages = $request->input('images', []);
        if (is_array($inputImages)) {
            foreach ($inputImages as $url) {
                if (is_string($url) && !empty(trim($url))) {
                    $imagePaths[] = $url;
                }
            }
        }

        // Удаляем дубликаты
        $imagePaths = array_unique($imagePaths);

        Log::info('Обработка изображений завершена', [
            'total_images' => count($imagePaths),
            'paths' => $imagePaths
        ]);

        return $imagePaths;
    }

    /**
     * Удаление изображения
     */
    private function deleteImage($path)
    {
        if (strpos($path, '/storage/') === 0) {
            $filePath = public_path('storage' . str_replace('/storage', '', $path));
            if (file_exists($filePath)) {
                unlink($filePath);
                Log::info('Удален файл изображения', ['path' => $filePath]);
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

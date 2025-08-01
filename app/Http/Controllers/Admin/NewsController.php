<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

        // Обработка изображений
        $imagePaths = [];
        if ($request->has('images')) {
            foreach ($request->file('images', []) as $img) {
                if ($img && $img->isValid()) {
                    $path = $img->store('news', 'public');
                    $imagePaths[] = '/storage/' . $path;
                }
            }
        }
        // Если изображения уже были (например, при редактировании), добавляем их
        if (is_array($request->images)) {
            foreach ($request->images as $img) {
                if (is_string($img) && !in_array($img, $imagePaths)) {
                    $imagePaths[] = $img;
                }
            }
        }
        // Главное изображение
        $mainImage = $request->main_image;
        if ($mainImage && !in_array($mainImage, $imagePaths)) {
            $mainImage = $imagePaths[0] ?? null;
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

        // Обработка изображений
        $imagePaths = [];
        if ($request->has('images')) {
            foreach ($request->file('images', []) as $img) {
                if ($img && $img->isValid()) {
                    $path = $img->store('news', 'public');
                    $imagePaths[] = '/storage/' . $path;
                }
            }
        }
        // Если изображения уже были (например, при редактировании), добавляем их
        if (is_array($request->images)) {
            foreach ($request->images as $img) {
                if (is_string($img) && !in_array($img, $imagePaths)) {
                    $imagePaths[] = $img;
                }
            }
        }
        // Главное изображение
        $mainImage = $request->main_image;
        if ($mainImage && !in_array($mainImage, $imagePaths)) {
            $mainImage = $imagePaths[0] ?? null;
        }

        // Удаляем старые изображения, которых нет в новом списке
        if (is_array($news->images)) {
            foreach ($news->images as $oldImg) {
                if (!in_array($oldImg, $imagePaths) && is_string($oldImg)) {
                    $oldPath = str_replace('/storage/', '', $oldImg);
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }

        // Обновляем запись
        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->category = $validated['category'];
        $news->status = $validated['status'];
        $news->publish_date = $validated['publishDate'] ?? null;
        // Сохраняем массив путей к изображениям в JSON-поле images
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

        // Удаляем все изображения
        if (is_array($news->images)) {
            foreach ($news->images as $img) {
                if (is_string($img)) {
                    $path = str_replace('/storage/', '', $img);
                    Storage::disk('public')->delete($path);
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
        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|string|in:publish,draft,delete',
        ]);
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            $newsList = News::whereIn('id', $ids)->get();
            foreach ($newsList as $news) {
                if (is_array($news->images)) {
                    foreach ($news->images as $img) {
                        if (is_string($img)) {
                            $path = str_replace('/storage/', '', $img);
                            Storage::disk('public')->delete($path);
                        }
                    }
                }
            }
            News::whereIn('id', $ids)->delete();
            return redirect()->route('admin.news')->with('success', 'Выбранные новости успешно удалены');
        } elseif ($action === 'publish') {
            News::whereIn('id', $ids)->update(['status' => 'Опубликовано']);
            return redirect()->route('admin.news')->with('success', 'Выбранные новости опубликованы');
        } elseif ($action === 'draft') {
            News::whereIn('id', $ids)->update(['status' => 'Черновик']);
            return redirect()->route('admin.news')->with('success', 'Выбранные новости переведены в черновики');
        }

        return redirect()->route('admin.news')->with('error', 'Неизвестное действие');
    }
}

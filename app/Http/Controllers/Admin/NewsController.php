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
            'slug' => 'required|string|max:255|unique:news',
            'content' => 'required|string',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string',
            'publishDate' => 'nullable|date',
            'image' => 'nullable|image|max:10240', // Максимум 10MB
        ]);

        // Создаем новую запись
        $news = new News();
        $news->title = $validated['title'];
        $news->slug = $validated['slug'];
        $news->content = $validated['content'];
        $news->category = $validated['category'];
        $news->status = $validated['status'];
        $news->publish_date = $validated['publishDate'] ?? null;

        // Обработка изображения, если оно загружено
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news', 'public');
            $news->image = '/storage/' . $path;
        }

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
                'image' => $news->image,
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
            'slug' => 'required|string|max:255|unique:news,slug,' . $id,
            'content' => 'required|string',
            'category' => 'required|array|min:1',
            'category.*' => 'string',
            'status' => 'required|string',
            'publishDate' => 'nullable|date',
            'image' => 'nullable|image|max:10240', // Максимум 10MB
        ]);

        // Обновляем запись
        $news->title = $validated['title'];
        $news->slug = $validated['slug'];
        $news->content = $validated['content'];
        $news->category = $validated['category'];
        $news->status = $validated['status'];
        $news->publish_date = $validated['publishDate'] ?? null;

        // Обработка изображения, если оно загружено
        if ($request->hasFile('image')) {
            // Удаляем старое изображение, если оно есть
            if ($news->image) {
                $oldPath = str_replace('/storage/', '', $news->image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('news', 'public');
            $news->image = '/storage/' . $path;
        }

        $news->save();

        return redirect()->route('admin.news')->with('success', 'Новость успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        // Удаляем изображение, если оно есть
        if ($news->image) {
            $path = str_replace('/storage/', '', $news->image);
            Storage::disk('public')->delete($path);
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
                if ($news->image) {
                    $path = str_replace('/storage/', '', $news->image);
                    Storage::disk('public')->delete($path);
                }
                $news->delete();
            }
            return redirect()->route('admin.news')->with('success', 'Выбранные новости удалены');
        }

        $status = $action === 'publish' ? 'Опубликовано' : 'Черновик';
        News::whereIn('id', $ids)->update(['status' => $status]);
        return redirect()->route('admin.news')->with('success', 'Статус выбранных новостей обновлён');
    }
}

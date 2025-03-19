<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the news.
     */
    public function index(Request $request)
    {
        $query = News::where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc');

        // Поиск по ключевому слову
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%");
            });
        }

        // Фильтр по категории
        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        // Получаем категории для фильтра
        $categories = News::where('status', 'Опубликовано')
            ->distinct()
            ->pluck('category');

        // Пагинация
        $news = $query->paginate(9);

        return Inertia::render('News/Index', [
            'news' => $news,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Display the specified news.
     */
    public function show($slug)
    {
        $news = News::where('slug', $slug)->first();
        
        if (!$news) {
            return redirect()->route('news')->with('error', 'Новость не найдена');
        }

        // Увеличиваем счетчик просмотров
        $news->views = ($news->views ?? 0) + 1;
        $news->save();

        // Получаем связанные новости той же категории
        $relatedNews = News::where('category', $news->category)
            ->where('id', '!=', $news->id)
            ->where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('News/Show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }
}

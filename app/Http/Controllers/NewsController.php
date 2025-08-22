<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Преобразование пути к изображению в полный URL
     */
    private function getFullImageUrl($path)
    {
        if (empty($path)) {
            return null;
        }
        
        // Если путь уже является полным URL
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
            return $path;
        }
        
        // Если путь начинается с /storage/
        if (strpos($path, '/storage/') === 0) {
            return asset(substr($path, 1));
        }
        
        // Если путь начинается с storage/
        if (strpos($path, 'storage/') === 0) {
            return asset($path);
        }
        
        // Если путь начинается с news/
        if (strpos($path, 'news/') === 0) {
            return asset('storage/' . $path);
        }
        
        // Если путь начинается с /news/
        if (strpos($path, '/news/') === 0) {
            return asset('storage' . $path);
        }
        
        // В остальных случаях добавляем /img/news/
        return '/img/news/' . basename($path);
    }

    /**
     * Обработка изображений для фронтенда
     */
    private function processImagesForFrontend($news)
    {
        // Преобразуем изображения в полные URL
        if (is_array($news->images)) {
            $news->images = array_map(function($img) {
                return $this->getFullImageUrl($img);
            }, $news->images);
        }
        
        // Устанавливаем главное изображение
        if (!empty($news->main_image)) {
            $news->image = $this->getFullImageUrl($news->main_image);
        } elseif (!empty($news->images) && is_array($news->images) && count($news->images) > 0) {
            $news->image = $news->images[0];
        } elseif (!empty($news->image)) {
            $news->image = $this->getFullImageUrl($news->image);
        }
        
        // Убеждаемся, что main_image есть в массиве images
        if (!empty($news->main_image) && is_array($news->images)) {
            $mainImageUrl = $this->getFullImageUrl($news->main_image);
            if (!in_array($mainImageUrl, $news->images)) {
                array_unshift($news->images, $mainImageUrl);
            }
        }
        
        return $news;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = News::where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc');

        // Поиск по ключевому слову
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%");
            });
        }

        // Фильтр по категории
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->whereJsonContains('category', $request->input('category'));
        }

        // Получаем категории для фильтра
        $categories = News::where('status', 'Опубликовано')
            ->distinct()
            ->pluck('category')
            ->flatten()
            ->unique()
            ->values();

        // Пагинация
        $news = $query->paginate(9);

        // Обрабатываем изображения для каждой новости
        $news->getCollection()->transform(function ($item) {
            return $this->processImagesForFrontend($item);
        });

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
        $news->increment('views');

        // Обрабатываем изображения
        $news = $this->processImagesForFrontend($news);

        // Получаем связанные новости той же категории
        $relatedNews = News::where('status', 'Опубликовано')
            ->where('id', '!=', $news->id)
            ->where(function($query) use ($news) {
                if (is_array($news->category)) {
                    foreach ($news->category as $cat) {
                        $query->orWhereJsonContains('category', $cat);
                    }
                } else {
                    $query->where('category', $news->category);
                }
            })
            ->orderBy('publish_date', 'desc')
            ->limit(3)
            ->get();

        // Обрабатываем изображения для связанных новостей
        $relatedNews->transform(function ($item) {
            return $this->processImagesForFrontend($item);
        });

        return Inertia::render('News/Show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }

    /**
     * API для получения последних новостей
     */
    public function getLatestNews(Request $request)
    {
        $limit = $request->input('limit', 10);
        
        $news = News::where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc')
            ->limit($limit)
            ->get();
            
        // Преобразуем новости для фронтенда
        $transformedNews = $news->map(function($item) {
            $item = $this->processImagesForFrontend($item);
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->title,
                'slug' => $item->slug,
                'date' => $item->formatted_publish_date,
                'image' => $item->image,
                'images' => $item->images,
                'url' => route('news.show', $item->slug)
            ];
        });
        
        return response()->json($transformedNews);
    }

    /**
     * API для получения новостей по категории
     */
    public function getNewsByCategory(Request $request, $category)
    {
        $limit = $request->input('limit', 10);
        
        $news = News::where('status', 'Опубликовано')
            ->whereJsonContains('category', $category)
            ->orderBy('publish_date', 'desc')
            ->limit($limit)
            ->get();
            
        // Преобразуем новости для фронтенда
        $transformedNews = $news->map(function($item) {
            $item = $this->processImagesForFrontend($item);
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->title,
                'slug' => $item->slug,
                'date' => $item->formatted_publish_date,
                'image' => $item->image,
                'images' => $item->images,
                'url' => route('news.show', $item->slug)
            ];
        });
        
        return response()->json($transformedNews);
    }

    /**
     * API для поиска новостей
     */
    public function searchNews(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 10);
        
        if (empty($query)) {
            return response()->json([]);
        }
        
        $news = News::where('status', 'Опубликовано')
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%");
            })
            ->orderBy('publish_date', 'desc')
            ->limit($limit)
            ->get();
            
        // Преобразуем новости для фронтенда
        $transformedNews = $news->map(function($item) {
            $item = $this->processImagesForFrontend($item);
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->title,
                'slug' => $item->slug,
                'date' => $item->formatted_publish_date,
                'image' => $item->image,
                'images' => $item->images,
                'url' => route('news.show', $item->slug)
            ];
        });
        
        return response()->json($transformedNews);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class NewsController extends Controller
{
    /**
     * Преобразование пути к изображению в полный URL
     */
    private function getFullImageUrl($path)
    {
        if (empty($path)) {
            Log::warning('Пустой путь к изображению');
            return null;
        }
        
        // Логируем исходный путь для отладки
        Log::info('Original image path', ['path' => $path]);
        
        // Если путь уже является полным URL
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
            Log::info('Путь уже является URL', ['path' => $path]);
            return $path;
        }
        
        // Если путь начинается с /storage/
        if (strpos($path, '/storage/') === 0) {
            // Используем абсолютный URL без начального слэша
            $absolutePath = substr($path, 1); // Удаляем начальный слэш
            $result = asset($absolutePath);
            Log::info('Путь начинается с /storage/', ['original' => $path, 'result' => $result]);
            return $result;
        }
        
        // Если путь начинается с storage/
        if (strpos($path, 'storage/') === 0) {
            $result = asset($path);
            Log::info('Путь начинается с storage/', ['original' => $path, 'result' => $result]);
            return $result;
        }
        
        // Если путь начинается с news/
        if (strpos($path, 'news/') === 0) {
            $result = asset('storage/' . $path);
            Log::info('Путь начинается с news/', ['original' => $path, 'result' => $result]);
            return $result;
        }
        
        // Если путь начинается с /news/
        if (strpos($path, '/news/') === 0) {
            $result = asset('storage' . $path);
            Log::info('Путь начинается с /news/', ['original' => $path, 'result' => $result]);
            return $result;
        }
        
        // В остальных случаях добавляем /storage/news/
        $result = asset('storage/news/' . basename($path));
        
        // Логируем результат преобразования
        Log::info('Converted image URL (default case)', ['original' => $path, 'result' => $result]);
        
        return $result;
    }

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

        // Преобразуем данные для совместимости с фронтендом
        $news->getCollection()->transform(function ($item) {
            // Используем main_image вместо image и преобразуем в полный URL
            $imagePath = $item->main_image ?? ($item->images[0] ?? $item->image ?? null);
            $item->image = $this->getFullImageUrl($imagePath);
            
            // Также преобразуем все изображения в массиве
            if (is_array($item->images)) {
                $item->images = array_map(function($img) {
                    return $this->getFullImageUrl($img);
                }, $item->images);
            }
            
            // Если main_image есть, но его нет в массиве images, добавляем его
            if (!empty($item->main_image) && (!is_array($item->images) || empty($item->images))) {
                $mainImageUrl = $this->getFullImageUrl($item->main_image);
                $item->images = [$mainImageUrl];
            } elseif (!empty($item->main_image) && is_array($item->images)) {
                $mainImageUrl = $this->getFullImageUrl($item->main_image);
                if (!in_array($mainImageUrl, $item->images)) {
                    array_unshift($item->images, $mainImageUrl);
                }
            }
            
            return $item;
        });

        // Логируем для отладки
        $firstNews = $news->getCollection()->first();
        Log::info('News data for frontend', [
            'id' => $firstNews ? $firstNews->id : null,
            'title' => $firstNews ? $firstNews->title : null,
            'image' => $firstNews ? $firstNews->image : null,
            'main_image' => $firstNews ? $firstNews->main_image : null,
            'images' => $firstNews ? $firstNews->images : null,
        ]);

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

        // Используем main_image вместо image для совместимости с фронтендом
        $imagePath = $news->main_image ?? ($news->images[0] ?? $news->image ?? null);
        $news->image = $this->getFullImageUrl($imagePath);
        
        // Также преобразуем все изображения в массиве
        if (is_array($news->images)) {
            $news->images = array_map(function($img) {
                return $this->getFullImageUrl($img);
            }, $news->images);
        }
        
        // Если main_image есть, но его нет в массиве images, добавляем его
        if (!empty($news->main_image) && (!is_array($news->images) || empty($news->images))) {
            $mainImageUrl = $this->getFullImageUrl($news->main_image);
            $news->images = [$mainImageUrl];
        } elseif (!empty($news->main_image) && is_array($news->images)) {
            $mainImageUrl = $this->getFullImageUrl($news->main_image);
            if (!in_array($mainImageUrl, $news->images)) {
                array_unshift($news->images, $mainImageUrl);
            }
        }

        // Получаем связанные новости той же категории
        $relatedNews = News::where('category', $news->category)
            ->where('id', '!=', $news->id)
            ->where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc')
            ->limit(3)
            ->get()
            ->map(function($item) {
                // Используем main_image вместо image для связанных новостей
                $imagePath = $item->main_image ?? ($item->images[0] ?? $item->image ?? null);
                $item->image = $this->getFullImageUrl($imagePath);
                
                // Также преобразуем все изображения в массиве
                if (is_array($item->images)) {
                    $item->images = array_map(function($img) {
                        return $this->getFullImageUrl($img);
                    }, $item->images);
                }
                
                return $item;
            });

        // Логируем для отладки
        Log::info('News detail data', [
            'id' => $news->id,
            'title' => $news->title,
            'image' => $news->image,
            'main_image' => $news->main_image,
            'images' => $news->images
        ]);

        return Inertia::render('News/Show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }
    
    /**
     * Получение последних новостей для API
     */
    public function getLatestNews(Request $request)
    {
        $limit = $request->input('limit', 10);
        
        Log::info('API getLatestNews called', [
            'limit' => $limit,
            'request_headers' => $request->headers->all()
        ]);
        
        $news = News::where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc')
            ->limit($limit)
            ->get();
            
        // Логируем полученные новости для отладки
        $firstNews = $news->first();
        Log::info('Latest news API data', [
            'count' => $news->count(),
            'first_news' => $firstNews ? [
                'id' => $firstNews->id,
                'title' => $firstNews->title,
                'image' => $firstNews->image,
                'main_image' => $firstNews->main_image,
                'images' => $firstNews->images
            ] : null
        ]);
        
        // Преобразуем новости для фронтенда
        $transformedNews = $news->map(function($item) {
            // Определяем путь к изображению
            $imagePath = null;
            
            // Сначала пробуем использовать main_image
            if (!empty($item->main_image)) {
                $imagePath = $item->main_image;
                Log::info('Используем main_image', ['path' => $imagePath]);
            } 
            // Затем пробуем первое изображение из массива
            elseif (is_array($item->images) && !empty($item->images) && isset($item->images[0])) {
                $imagePath = $item->images[0];
                Log::info('Используем первое изображение из массива', ['path' => $imagePath]);
            } 
            // Наконец, пробуем использовать старое поле image
            elseif (!empty($item->image)) {
                $imagePath = $item->image;
                Log::info('Используем старое поле image', ['path' => $imagePath]);
            } 
            // Если ничего не нашли, используем заглушку
            else {
                Log::warning('Не найдено изображение для новости', ['id' => $item->id]);
                $imagePath = '/img/placeholder.jpg';
            }
            
            // Преобразуем путь в полный URL
            $fullImageUrl = $this->getFullImageUrl($imagePath);
            
            // Преобразуем все изображения в массиве
            $transformedImages = [];
            if (is_array($item->images) && !empty($item->images)) {
                $transformedImages = array_map(function($img) {
                    return $this->getFullImageUrl($img);
                }, $item->images);
            } else {
                // Если нет массива изображений, используем главное изображение
                $transformedImages = [$fullImageUrl];
            }
            
            // Если main_image есть, но его нет в массиве images, добавляем его
            if (!empty($item->main_image) && !in_array($item->main_image, $transformedImages)) {
                $mainImageUrl = $this->getFullImageUrl($item->main_image);
                if (!in_array($mainImageUrl, $transformedImages)) {
                    array_unshift($transformedImages, $mainImageUrl);
                }
            }
            
            // Создаем новый объект с нужными полями
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->title, // Используем заголовок как описание
                'slug' => $item->slug,
                'date' => $item->formatted_publish_date,
                'image' => $fullImageUrl,
                'images' => $transformedImages,
                'url' => route('news.show', $item->slug)
            ];
        });
        
        // Логируем финальный результат
        Log::info('Final API response', [
            'transformed_count' => $transformedNews->count(),
            'first_transformed' => $transformedNews->first()
        ]);
        
        return response()->json($transformedNews);
    }
}

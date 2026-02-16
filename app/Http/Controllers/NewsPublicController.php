<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\MediaService;

/**
 * Публичный контроллер для новостей
 * Отображает список и детали опубликованных новостей
 */
class NewsPublicController extends Controller
{
    public function __construct(private readonly MediaService $mediaService)
    {
    }
    /**
     * Отображение списка опубликованных новостей
     * 
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $type = $request->input('type', News::TYPE_NEWS);

        if (!in_array($type, News::TYPES, true)) {
            $type = News::TYPE_NEWS;
        }

        return $this->renderListing($request, $type);
    }

    /**
     * Отображение списка материалов «СМИ о нас».
     */
    public function media(Request $request): Response
    {
        return $this->renderListing($request, News::TYPE_MEDIA);
    }

    /**
     * Отображение детальной страницы новости
     * 
     * @param News $news
     * @return Response|\Illuminate\Http\RedirectResponse
     */
    public function show(News $news)
    {
        // Проверяем, что новость опубликована
        if ($news->status !== 'published') {
            abort(404);
        }

        // Увеличиваем счетчик просмотров
        $news->increment('views');

        // Получаем 3 последние опубликованные новости (кроме текущей)
        $currentLocale = app()->getLocale();
        $relatedNews = News::published()
            ->when($currentLocale !== 'en', fn($q) => $q->where('locale', $currentLocale))
            ->ofType($news->type ?? News::TYPE_NEWS)
            ->where('id', '!=', $news->id)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                $media = $this->mediaService->normalizeMediaForFrontend($item->images ?? []);
                $imagePaths = collect($media)
                    ->where('type', 'image')
                    ->pluck('url')
                    ->values()
                    ->all();

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'excerpt' => $item->excerpt,
                    'type' => $item->type,
                    'cover_url' => $item->cover_url,
                    'cover_thumb_url' => $item->cover_thumb_url,
                    'cover_image_alt' => $item->cover_image_alt,
                    'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                    'published_at_formatted' => $item->published_at?->format('d.m.Y'),
                    'media' => $media,
                    'images' => $imagePaths,
                ];
            });

        // SEO метаданные
        $seoTitle = $news->seo_title ?? $news->title;
        $seoDescription = $news->seo_description ?? $news->excerpt ?? strip_tags(substr($news->body, 0, 160));
        $coverImageUrl = $news->cover_url;

        $media = $this->mediaService->normalizeMediaForFrontend($news->images ?? []);
        $galleryImages = collect($media)
            ->where('type', 'image')
            ->pluck('url')
            ->values()
            ->all();
        $videoCollection = collect($media)
            ->where('type', 'video')
            ->values();
        $videoItems = $videoCollection
            ->map(function ($video) {
                return $video;
            })
            ->all();
        $galleryVideos = $videoCollection
            ->map(function ($video) {
                return $video['embed_url'] ?? $video['url'] ?? $video['path'] ?? null;
            })
            ->filter()
            ->values()
            ->all();

        return Inertia::render('News/Show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'excerpt' => $news->excerpt,
                'type' => $news->type,
                'body' => $news->body,
                'cover_url' => $news->cover_url,
                'cover_thumb_url' => $news->cover_thumb_url,
                'cover_image_alt' => $news->cover_image_alt,
                'seo_title' => $seoTitle,
                'seo_description' => $seoDescription,
                'published_at' => $news->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $news->published_at?->format('d.m.Y'),
                'published_at_full' => $news->published_at ? $news->published_at->format('d.m.Y H:i') : null,
                'external_url' => $news->external_url,
                'media' => $media,
                'gallery_images' => $galleryImages,
                'gallery_videos' => $galleryVideos,
                'videos' => $videoItems,
                'social_instagram' => $news->social_instagram ?? null,
                'social_facebook' => $news->social_facebook ?? null,
                'social_youtube' => $news->social_youtube ?? null,
                'social_telegram' => $news->social_telegram ?? null,
            ],
            'relatedNews' => $relatedNews,
            'seo' => [
                'title' => $seoTitle,
                'description' => $seoDescription,
                'image' => $coverImageUrl,
            ],
        ])->withViewData([
            'title' => $seoTitle,
            'description' => $seoDescription,
            'og_title' => $seoTitle,
            'og_description' => $seoDescription,
            'og_image' => $coverImageUrl,
        ]);
    }
    /**
     * Общий рендерер списков новостей.
     */
    private function renderListing(Request $request, string $type): Response
    {
        $query = News::published()->ofType($type);

        // Фильтрация по языку: для английской версии показываем все новости, для остальных - только соответствующие языку
        $currentLocale = app()->getLocale();
        if ($currentLocale !== 'en') {
            $query->where('locale', $currentLocale);
        }

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        $tagFilter = $request->input('tag');
        if (!empty($tagFilter)) {
            $query->where(function ($q) use ($tagFilter) {
                $q->whereJsonContains('tags', $tagFilter)
                    ->orWhere('tags', 'like', '%"' . $tagFilter . '"%')
                    ->orWhere('tags', 'like', '%' . $tagFilter . '%');
            });
        }

        $news = $query->paginate(12)->withQueryString();

        $news->getCollection()->transform(function ($item) {
            $media = $this->mediaService->normalizeMediaForFrontend($item->images ?? []);
            $imagePaths = collect($media)
                ->where('type', 'image')
                ->pluck('url')
                ->values()
                ->all();
            $videoCollection = collect($media)
                ->where('type', 'video')
                ->values();
            $videoItems = $videoCollection
                ->map(function ($video) {
                    return $video;
                })
                ->all();
            $videoUrls = $videoCollection
                ->map(function ($video) {
                    return $video['embed_url'] ?? $video['url'] ?? $video['path'] ?? null;
                })
                ->filter()
                ->values()
                ->all();

            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'excerpt' => $item->excerpt,
                'body' => $item->body,
                'cover_url' => $item->cover_url,
                'cover_thumb_url' => $item->cover_thumb_url,
                'cover_image_alt' => $item->cover_image_alt,
                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $item->published_at?->format('d.m.Y'),
                'external_url' => $item->external_url,
                'media' => $media,
                'images' => $imagePaths,
                'videos' => $videoItems,
                'gallery_videos' => $videoUrls,
                'type' => $item->type,
                'tags' => is_array($item->tags) ? array_values(array_filter($item->tags)) : [],
            ];
        });

        $isMedia = $type === News::TYPE_MEDIA;
        $availableTags = $this->collectAvailableTags($type);

        return Inertia::render('News/Index', [
            'news' => $news,
            'filters' => array_merge($request->only(['search', 'tag']), ['type' => $type]),
            'availableTags' => $availableTags,
            'section' => [
                'type' => $type,
                'title' => $isMedia ? 'СМИ о нас' : 'Новости',
                // Тексты subtitle и description берутся из системы переводов на фронтенде
            ],
        ]);
    }

    /**
     * Возвращает список тегов для заданного типа публикаций.
     */
    private function collectAvailableTags(string $type): array
    {
        $currentLocale = app()->getLocale();
        $tags = News::published()
            ->ofType($type)
            ->when($currentLocale !== 'en', fn($q) => $q->where('locale', $currentLocale))
            ->pluck('tags')
            ->flatMap(function ($item) {
                if (empty($item)) {
                    return [];
                }

                if (is_array($item)) {
                    return $item;
                }

                if (is_string($item)) {
                    $decoded = json_decode($item, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        return $decoded;
                    }

                    return array_map('trim', array_filter(explode(',', $item)));
                }

                return [];
            })
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return $tags->all();
    }

    /**
     * API: Получение одной новости по слагу в формате JSON.
     * 
     * @param string $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function showJson(string $slug)
    {
        $news = News::where('slug', $slug)->first();

        if (!$news) {
            return response()->json(['error' => 'Новость не найдена'], 404);
        }

        // Увеличиваем счетчик просмотров
        $news->increment('views');

        return response()->json($news);
    }

    /**
     * API: Получение последних новостей в формате JSON.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function latestNews(Request $request)
    {
        try {
            $limit = (int) $request->get('limit', 10);
            $limit = $limit > 0 && $limit <= 50 ? $limit : 10;

            $latestNews = News::query()
                ->whereIn('status', ['published', 'Опубликовано'])
                ->orderByDesc('published_at')
                ->limit($limit)
                ->get()
                ->map(function (News $news) {
                    $media = $this->mediaService->normalizeMediaForFrontend($news->images ?? []);
                    
                    // Передаем все медиа (изображения и видео) для правильной обработки
                    $allMedia = collect($media)->map(function ($item) {
                        return [
                            'type' => $item['type'] ?? 'image',
                            'url' => $item['url'] ?? $item['path'] ?? null,
                            'path' => $item['path'] ?? null,
                            'embed_url' => $item['embed_url'] ?? null,
                            'is_external' => $item['is_external'] ?? false,
                            'is_embed' => $item['is_embed'] ?? false,
                            'thumbnail' => $item['thumbnail'] ?? null,
                        ];
                    })->filter(function ($item) {
                        return !empty($item['url']) || !empty($item['path']);
                    })->values()->all();

                    return [
                        'id' => $news->id,
                        'title' => $news->title,
                        'slug' => $news->slug,
                        'excerpt' => $news->excerpt,
                        'image' => $news->cover_thumb_url ?? $news->cover_url,
                        'images' => $allMedia, // Передаем все медиа, включая видео
                        'publish_date' => optional($news->published_at ?? $news->publish_date)->toDateTimeString(),
                        'external_url' => $news->external_url,
                        'type' => $news->type,
                    ];
                });

            return response()->json($latestNews);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Ошибка в API latest-news', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Ошибка сервера'], 500);
        }
    }
}

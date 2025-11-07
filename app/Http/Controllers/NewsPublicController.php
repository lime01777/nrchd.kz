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
        $query = News::published();

        // Поиск
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Пагинация: 12 новостей на страницу
        $news = $query->paginate(12);

        // Преобразуем данные для фронтенда
        $news->getCollection()->transform(function ($item) {
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
                'cover_url' => $item->cover_url,
                'cover_thumb_url' => $item->cover_thumb_url,
                'cover_image_alt' => $item->cover_image_alt,
                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $item->published_at?->format('d.m.Y'),
                'media' => $media,
                'images' => $imagePaths,
            ];
        });

        return Inertia::render('News/Index', [
            'news' => $news,
            'filters' => $request->only(['search']),
        ]);
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

        // Получаем 3 последние опубликованные новости (кроме текущей)
        $relatedNews = News::published()
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
        $galleryVideos = collect($media)
            ->where('type', 'video')
            ->pluck('url')
            ->values()
            ->all();

        return Inertia::render('News/Show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'excerpt' => $news->excerpt,
                'body' => $news->body,
                'cover_url' => $news->cover_url,
                'cover_thumb_url' => $news->cover_thumb_url,
                'cover_image_alt' => $news->cover_image_alt,
                'seo_title' => $seoTitle,
                'seo_description' => $seoDescription,
                'published_at' => $news->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $news->published_at?->format('d.m.Y'),
                'media' => $media,
                'gallery_images' => $galleryImages,
                'gallery_videos' => $galleryVideos,
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
}

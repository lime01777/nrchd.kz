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

        // Получаем 3 последние опубликованные новости (кроме текущей)
        $relatedNews = News::published()
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
                'media' => $media,
                'gallery_images' => $galleryImages,
                'gallery_videos' => $galleryVideos,
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
                'media' => $media,
                'images' => $imagePaths,
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
                'subtitle' => $isMedia
                    ? 'Мы собрали публикации и упоминания ННЦРЗ в ведущих СМИ.'
                    : 'Последние материалы и анонсы Национального научного центра развития здравоохранения.',
                'description' => $isMedia
                    ? 'Читайте, что пишут о нас в прессе и профессиональных изданиях.'
                    : 'Будьте в курсе событий и свежих проектов центра.',
            ],
        ]);
    }

    /**
     * Возвращает список тегов для заданного типа публикаций.
     */
    private function collectAvailableTags(string $type): array
    {
        $tags = News::published()
            ->ofType($type)
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
}

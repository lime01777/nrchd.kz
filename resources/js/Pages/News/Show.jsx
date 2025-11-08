import React from 'react';
import { Head, Link } from '@inertiajs/react';
import NewsSliderWithMain from '@/Components/NewsSliderWithMain';
import LayoutNews from '@/Layouts/LayoutNews';

/**
 * Публичная страница детального просмотра новости
 */
export default function Show({ news, relatedNews, seo }) {
    const mediaItems = news.media || [];
    const isMediaSection = news.type === 'media';
    const galleryImages = (news.gallery_images || mediaItems
        .filter((item) => item.type === 'image')
        .map((item) => item.url || item.path))
        .filter(Boolean);
    const galleryVideos = (news.gallery_videos || mediaItems
        .filter((item) => item.type === 'video')
        .map((item) => item.url || item.path))
        .filter(Boolean);

    const publishedAt = news.published_at_full || news.published_at_formatted || '';
    const metaItems = [
        publishedAt && {
            label: 'Дата и время публикации',
            value: publishedAt,
        },
    ].filter(Boolean);

    const socialLinks = [
        { name: 'Instagram', url: news.social_instagram, icon: 'M7 10c1.657 0 3-1.343 3-3S8.657 4 7 4 4 5.343 4 7s1.343 3 3 3z' },
        { name: 'Facebook', url: news.social_facebook, icon: 'M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z' },
        { name: 'YouTube', url: news.social_youtube, icon: 'M10 15l5.19-3L10 9v6zm10-7.5s-.1-1.43-.58-2.06c-.56-.78-1.19-.78-1.48-.82C16.42 4.35 12 4.35 12 4.35h-.02s-4.42 0-5.92.27c-.29.04-.92.04-1.48.82-.48.63-.58 2.06-.58 2.06S4 9.07 4 10.63v1.75c0 1.56.02 3.13.02 3.13s.1 1.43.58 2.06c.56.78 1.29.75 1.62.83 1.18.12 5.78.26 5.78.26s4.42 0 5.92-.27c.29-.04.92-.04 1.48-.82.48-.63.58-2.06.58-2.06s.02-1.56.02-3.13V10.63c0-1.56-.02-3.13-.02-3.13z' },
        { name: 'Telegram', url: news.social_telegram, icon: 'M21 3L3 10.53l5.18 1.66L9 21l4.06-4.06L17.82 21 21 3z' },
    ].filter((link) => !!link.url);

    const renderHero = () => (
        <div className="bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20 pb-10 pt-8 sm:pt-10 lg:pt-12">
            <Head>
                <title>{seo?.title || news.title}</title>
                <meta name="description" content={seo?.description || news.excerpt || ''} />
                <meta property="og:title" content={seo?.title || news.title} />
                <meta property="og:description" content={seo?.description || news.excerpt || ''} />
                <meta property="og:image" content={seo?.image || news.cover_url} />
                <meta property="og:type" content="article" />
            </Head>
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-start">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                            {isMediaSection ? 'СМИ О НАС' : 'НОВОСТИ'}
                        </span>
                        <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            {news.title}
                        </h1>
                        {publishedAt && (
                            <div className="mt-6 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow">
                                Опубликовано: <span className="ml-2 text-sm normal-case text-gray-700">{publishedAt}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <LayoutNews
            renderCustomHero={renderHero}
        >
            <Head>
                <title>{seo?.title || news.title}</title>
                <meta name="description" content={seo?.description || news.excerpt || ''} />
                {/* OpenGraph метатеги */}
                <meta property="og:title" content={seo?.title || news.title} />
                <meta property="og:description" content={seo?.description || news.excerpt || ''} />
                <meta property="og:image" content={seo?.image || news.cover_url} />
                <meta property="og:type" content="article" />
            </Head>

            {/* Кнопка возврата на список */}
            <div className="mb-8">
                <Link
                    href={route('news.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад к списку новостей
                </Link>
            </div>


            {/* Галерея изображений */}
            {galleryImages.length > 0 && (
                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Фотогалерея</h2>
                    <NewsSliderWithMain
                        images={galleryImages}
                        className="h-96"
                        height="384px"
                        showCounter
                        showDots
                    />
                        {galleryImages.length > 1 && (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => window.dispatchEvent(new CustomEvent('news-slider:go-to', { detail: index }))}
                                        className="group overflow-hidden rounded-lg border border-transparent shadow transition hover:border-blue-200 hover:shadow-md"
                                    >
                                        <img
                                            src={image}
                                            alt={`Миниатюра ${index + 1}`}
                                            className="h-24 w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                </section>
            )}

            {/* Видео */}
            {galleryVideos.length > 0 && (
                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Видео</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {galleryVideos.map((video, index) => (
                            <div key={`${video}-${index}`} className="overflow-hidden rounded-2xl bg-black">
                                <video
                                    src={video}
                                    controls
                                    preload="metadata"
                                    className="h-full w-full object-cover"
                                >
                                    Ваш браузер не поддерживает воспроизведение видео.
                                </video>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Основной текст */}
            <article
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: news.body }}
            />

            {/* Блок рекомендаций */}
            {relatedNews && relatedNews.length > 0 && (
                <section className="mt-16 rounded-2xl bg-gray-50 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        {isMediaSection ? 'Другие материалы СМИ' : 'Ещё новости'}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {relatedNews.map((item) => {
                            const mediaImages = Array.isArray(item.images)
                                ? item.images
                                    .map((image) => {
                                        if (typeof image === 'string') {
                                            return image;
                                        }

                                        if (typeof image === 'object') {
                                            return image.url || image.path || null;
                                        }

                                        return null;
                                    })
                                    .filter(Boolean)
                                : [];

                            const cardImage = mediaImages[0] || item.cover_thumb_url || item.cover_url || null;

                            return (
                                <Link
                                    key={item.id}
                                    href={route('news.show', item.slug)}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                                        {cardImage ? (
                                            <img
                                                src={cardImage}
                                                alt={item.cover_image_alt || item.title}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col gap-4 p-5">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                                {item.published_at_formatted}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center text-sm font-semibold text-blue-600">
                                            Читать далее
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </LayoutNews>
    );
}

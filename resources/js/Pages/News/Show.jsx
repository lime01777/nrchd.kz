import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LayoutNews from '@/Layouts/LayoutNews';
import NewsSliderWithMain from '@/Components/NewsSliderWithMain';

/**
 * Публичная страница детального просмотра новости
 */
export default function Show({ news, relatedNews, seo }) {
    const mediaItems = news.media || [];
    const galleryImages = (news.gallery_images || mediaItems
        .filter((item) => item.type === 'image')
        .map((item) => item.url || item.path))
        .filter(Boolean);
    const galleryVideos = (news.gallery_videos || mediaItems
        .filter((item) => item.type === 'video')
        .map((item) => item.url || item.path))
        .filter(Boolean);

    const metaItems = [
        news.published_at_formatted && {
            label: 'Дата публикации',
            value: news.published_at_formatted,
        },
        news.seo_description && {
            label: 'Кратко',
            value: news.seo_description,
        },
    ].filter(Boolean);

    return (
        <LayoutNews h1={news.title} subtitle={news.excerpt} img={news.cover_url}>
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

            {/* Краткая информация о публикации */}
            {metaItems.length > 0 && (
                <aside className="mb-10 grid gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm md:grid-cols-2">
                    {metaItems.map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{label}</span>
                            <span className="text-base text-gray-800">{value}</span>
                        </div>
                    ))}
                </aside>
            )}

            {/* Обложка */}
            {news.cover_url && (
                <figure className="mb-12 overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
                    <img
                        src={news.cover_url}
                        srcSet={`${news.cover_thumb_url} 800w, ${news.cover_url} 1600w`}
                        alt={news.cover_image_alt || news.title}
                        className="h-auto w-full object-cover"
                    />
                </figure>
            )}

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
                                <div
                                    key={`${image}-${index}`}
                                    className="overflow-hidden rounded-lg border border-transparent"
                                >
                                    <img src={image} alt={`Миниатюра ${index + 1}`} className="h-24 w-full object-cover" />
                                </div>
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

            {/* Блок "Ещё новости" */}
            {relatedNews && relatedNews.length > 0 && (
                <section className="mt-16 rounded-2xl bg-gray-50 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Ещё новости</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {relatedNews.map((item) => (
                            <Link
                                key={item.id}
                                href={route('news.show', item.slug)}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                                    {item.cover_thumb_url ? (
                                        <img
                                            src={item.cover_thumb_url}
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

                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {item.excerpt && (
                                        <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                                            {item.excerpt}
                                        </p>
                                    )}
                                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        {item.published_at_formatted}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </LayoutNews>
    );
}

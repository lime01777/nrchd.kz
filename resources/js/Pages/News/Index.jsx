import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LayoutNews from '@/Layouts/LayoutNews';

/**
 * Публичная страница списка новостей
 */
export default function Index({ news, filters }) {
    // Общее количество публикаций для справочного блока
    const totalCount = news?.meta?.total ?? news?.total ?? news.data.length;

    return (
        <LayoutNews
            h1="Новости"
        >
            <Head title="Новости" />

            {/* Сетка новостей */}
            {news.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">Новости не найдены</h3>
                    <p className="mt-2 text-gray-600">Попробуйте изменить параметры поиска или вернуться позже.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item) => (
                        <Link
                            key={item.id}
                            href={route('news.show', item.slug)}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Миниатюра */}
                            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                                {item.cover_thumb_url ? (
                                    <img
                                        src={item.cover_thumb_url}
                                        alt={item.cover_image_alt || item.title}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                                        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Дата публикации в углу карточки */}
                                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-700">
                                    {item.published_at_formatted}
                                </div>
                            </div>

                            {/* Контент */}
                            <div className="flex flex-1 flex-col gap-4 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 line-clamp-3">
                                    {item.title}
                                </h2>

                                {item.excerpt && (
                                    <p className="flex-1 text-sm leading-relaxed text-gray-600 line-clamp-4">
                                        {item.excerpt}
                                    </p>
                                )}

                                <span className="inline-flex items-center text-sm font-medium text-blue-600">
                                    Читать подробнее
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {news.links && news.links.length > 3 && (
                <div className="mt-12 flex justify-center">
                    <nav className="flex flex-wrap items-center gap-2">
                        {news.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white shadow'
                                        : link.url
                                            ? 'bg-white text-gray-700 hover:bg-blue-50'
                                            : 'bg-gray-100 text-gray-400'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </LayoutNews>
    );
}

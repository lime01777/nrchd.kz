import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import NewsImageSlider from '@/Components/NewsImageSlider';

/**
 * Страница списка новостей в админке
 */
export default function Index({ news, filters, section = 'news', sectionMeta = null }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const currentSection = section || 'news';
    const meta = sectionMeta || {};
    const indexRoute = currentSection === 'news'
        ? route('admin.news.index')
        : route('admin.news.index', currentSection);
    const createRoute = route('admin.news.create', currentSection);

    /**
     * Применение фильтров
     */
    const applyFilters = () => {
        router.get(indexRoute, {
            search: searchTerm,
            status: statusFilter,
            published_from: filters?.published_from,
            published_to: filters?.published_to,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Сброс фильтров
     */
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(indexRoute, {}, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Удаление новости
     */
    const handleDelete = (newsItem) => {
        if (confirm(`Вы уверены, что хотите удалить новость "${newsItem.title}"?`)) {
            router.delete(route('admin.news.destroy', { news: newsItem.id }), {
                preserveScroll: true,
            });
        }
    };

    /**
     * Переключение статуса
     */
    const handleToggleStatus = (newsItem) => {
        router.patch(route('admin.news.toggle', { news: newsItem.id }), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={meta?.title}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Заголовок */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{meta?.title || 'Новости'}</h1>
                            {meta?.subtitle && (
                                <p className="mt-1 text-sm text-gray-500">{meta.subtitle}</p>
                            )}
                        </div>
                        <Link
                            href={createRoute}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {meta?.createLabel || 'Создать новость'}
                        </Link>
                    </div>

                    {/* Фильтры */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Поиск */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Поиск
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Поиск по заголовку..."
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Фильтр по статусу */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Статус
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Все</option>
                                    <option value="draft">Черновик</option>
                                    <option value="published">Опубликовано</option>
                                </select>
                            </div>

                            {/* Кнопки */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Применить
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Сетка карточек новостей с отображением просмотров */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {news.data.map((item) => {
                            const mediaItems = Array.isArray(item.media) ? item.media : [];
                            const imageSources = mediaItems
                                .filter((mediaItem) => mediaItem?.type === 'image')
                                .map((mediaItem) => mediaItem.url || mediaItem.path)
                                .filter(Boolean);
                            const videoItems = mediaItems.filter((mediaItem) => mediaItem?.type === 'video');
                            const firstVideo = videoItems.length > 0 ? videoItems[0] : null;
                            const hasImages = imageSources.length > 0;

                            return (
                            <article
                                key={item.id}
                                className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                    {firstVideo ? (
                                        firstVideo.is_external && firstVideo.is_embed && (firstVideo.embed_url || firstVideo.url || firstVideo.path) ? (
                                            <iframe
                                                src={firstVideo.embed_url || firstVideo.url || firstVideo.path}
                                                title={item.title}
                                                className="h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                src={firstVideo.url || firstVideo.path}
                                                poster={firstVideo.thumbnail || undefined}
                                                controls
                                                muted
                                                className="h-full w-full object-cover"
                                            >
                                                Ваш браузер не поддерживает воспроизведение видео.
                                            </video>
                                        )
                                    ) : hasImages ? (
                                        imageSources.length > 1 ? (
                                            <NewsImageSlider
                                                images={imageSources}
                                                className="h-44"
                                                height="176px"
                                                showDots={false}
                                                showCounter
                                            />
                                        ) : (
                                            <img
                                                src={imageSources[0]}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        )
                                    ) : item.cover_thumb_url ? (
                                        <img
                                            src={item.cover_thumb_url}
                                            alt={item.cover_image_alt || item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <span
                                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                            item.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col gap-4 p-5">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{item.slug}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5A2 2 0 003 7v12a2 2 0 002 2z" />
                                            </svg>
                                            {item.published_at_formatted || '—'}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span className="font-semibold text-gray-800">{item.views ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex flex-wrap gap-2">
                                        <Link
                                            href={route('admin.news.edit', { news: item.id })}
                                            className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(item)}
                                            className="inline-flex items-center rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
                                        >
                                            {item.status === 'published' ? 'В черновик' : 'Опубликовать'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                            className="inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </article>
                            );
                        })}
                    </div>

                    {/* Пагинация */}
                    {news.links && news.links.length > 3 && (
                        <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {news.links[0].url && (
                                        <Link
                                            href={news.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Предыдущая
                                        </Link>
                                    )}
                                    {news.links[news.links.length - 1].url && (
                                        <Link
                                            href={news.links[news.links.length - 1].url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Следующая
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Показано <span className="font-medium">{news.from}</span> до{' '}
                                            <span className="font-medium">{news.to}</span> из{' '}
                                            <span className="font-medium">{news.total}</span> результатов
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {news.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

import React, { useMemo } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import LayoutNews from '@/Layouts/LayoutNews';
import NewsImageSlider from '@/Components/NewsImageSlider';
import { isValidVideoUrl } from '@/Utils/mediaUtils';
import translationService from '@/services/TranslationService';

/**
 * Локальная обертка над сервисом переводов c безопасным фолбэком
 */
const t = (key, fallback = '') => {
    try {
        return translationService.t(key, fallback || key);
    } catch (error) {
        console.warn('[News/Index] Ошибка получения перевода:', error);
        return fallback || key;
    }
};

/**
 * Публичная страница списка новостей
 * Восстанавливаем карточки и поведение из прошлой версии (осень 2025)
 */
export default function Index() {
    const { news, filters = {} } = usePage().props;

    // Управляем состоянием фильтров (пока только поиск по ключевому слову)
    const { data, setData, get, processing } = useForm({
        search: filters.search ?? '',
    });

    /**
     * Подготавливаем массив карточек: собираем изображения и убираем видео
     */
    const preparedNews = useMemo(() => {
        if (!news?.data) {
            return [];
        }

        const stripHtml = (html) => {
            if (!html || typeof html !== 'string') {
                return '';
            }

            return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        };

        return news.data.map((item) => {
            const rawImages = Array.isArray(item.images) ? item.images : [];

            // Приводим к простому массиву путей, пропуская видео
            const galleryImages = rawImages
                .map((mediaItem) => {
                    if (!mediaItem) {
                        return null;
                    }

                    if (typeof mediaItem === 'string') {
                        return mediaItem;
                    }

                    if (typeof mediaItem === 'object') {
                        return mediaItem.url || mediaItem.path || null;
                    }

                    return null;
                })
                .filter((url) => !!url && !isValidVideoUrl(url));

            // Удаляем дубликаты, сохраняя порядок
            const uniqueImages = Array.from(new Set(galleryImages));

            // Краткий обзор: используем excerpt или формируем из тела новости
            const excerptSource = item.excerpt && item.excerpt.trim().length > 0
                ? item.excerpt
                : stripHtml(item.body || '').slice(0, 220);

            const formattedExcerpt = excerptSource
                ? `${excerptSource}${excerptSource.length >= 220 ? '…' : ''}`
                : '';

            return {
                ...item,
                galleryImages: uniqueImages,
                preparedExcerpt: formattedExcerpt,
            };
        });
    }, [news]);

    /**
     * Отправка фильтров. Используем именованный роут news.index (актуальный публичный маршрут).
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        get(route('news.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    /**
     * Сбрасываем поиск и обновляем список
     */
    const handleReset = () => {
        setData('search', '');
        get(route('news.index'), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => window?.scrollTo?.({ top: 0, behavior: 'smooth' }),
        });
    };

    const totalCount = news?.meta?.total ?? news?.total ?? preparedNews.length;

    return (
        <LayoutNews h1={t('news.title', 'Новости')} img="news">
            <Head
                title={t('news.meta.title', 'Новости')}
                meta={[
                    {
                        name: 'description',
                        content: t(
                            'news.meta.description',
                            'Последние новости Национального научного центра развития здравоохранения.'
                        ),
                    },
                ]}
            />

            {/* Заголовок и статистика */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-wide text-blue-600">
                        {t('news.total.label', 'Всего публикаций')}
                    </p>
                    <h2 className="text-3xl font-semibold text-gray-900">
                        {totalCount}
                    </h2>
                </div>
                <div className="rounded-2xl bg-blue-50 px-6 py-4 text-sm text-blue-700">
                    {t('news.total.hint', 'Следите за обновлениями — мы публикуем свежие новости каждую неделю.')}
                </div>
            </div>

            {/* Поиск по новостям */}
            <form
                className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                onSubmit={handleSearchSubmit}
            >
                <label className="block text-sm font-medium text-gray-700">
                    {t('news.filters.search.label', 'Поиск по ключевому слову')}
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={data.search}
                        onChange={(event) => setData('search', event.target.value)}
                        placeholder={t('news.filters.search.placeholder', 'Например: медицина будущего')}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <div className="flex flex-row gap-2 sm:flex-shrink-0">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? t('news.filters.search.processing', 'Поиск...') : t('news.filters.search.cta', 'Найти')}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 px-6 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                            {t('news.filters.search.reset', 'Сбросить')}
                        </button>
                    </div>
                </div>
            </form>

            {/* Сетка новостей */}
            {preparedNews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {t('news.empty.title', 'Новости не найдены')}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {t(
                            'news.empty.description',
                            'Попробуйте изменить поисковый запрос или зайдите позже — мы уже готовим новые публикации.'
                        )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {preparedNews.map((item) => (
                        <article
                            key={item.id}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <Link href={route('news.show', item.slug)} className="block">
                                {/* Превью изображений */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <NewsImageSlider
                                        images={item.galleryImages}
                                        className="h-56"
                                        height="224px"
                                        showDots={item.galleryImages.length > 1}
                                        showCounter={false}
                                        autoPlay={item.galleryImages.length > 1}
                                        interval={4000}
                                    />

                                    {/* Дата публикации */}
                                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm">
                                        {item.published_at_formatted || '—'}
                                    </div>
                                </div>

                                {/* Текст карточки */}
                                <div className="flex flex-1 flex-col gap-4 p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 transition group-hover:text-blue-600">
                                        {item.title}
                                    </h3>

                                    {item.preparedExcerpt && (
                                        <p className="flex-1 text-sm leading-relaxed text-gray-600 line-clamp-4">
                                            {item.preparedExcerpt}
                                        </p>
                                    )}

                                    <span className="inline-flex items-center text-sm font-semibold text-blue-600">
                                        {t('news.card.read_more', 'Читать далее')}
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {Array.isArray(news?.links) && news.links.length > 1 && (
                <div className="mt-12 flex justify-center">
                    <nav className="flex flex-wrap items-center gap-2">
                        {news.links.map((link, index) => {
                            const isDisabled = link.url === null;
                            const plainLabel = String(link.label || '')
                                .replace(/<[^>]+>/g, '')
                                .replace(/&laquo;|&raquo;/g, '')
                                .trim();

                            const normalizedLabel = plainLabel.toLowerCase();
                            const isPrevious = ['previous', 'предыдущая', 'pagination.previous'].includes(normalizedLabel);
                            const isNext = ['next', 'следующая', 'pagination.next'].includes(normalizedLabel);
                            const isDots = ['...', '…'].includes(plainLabel);

                            return (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white shadow'
                                            : isDisabled
                                                ? 'bg-gray-100 text-gray-400'
                                                : 'bg-white text-gray-700 hover:bg-blue-50'
                                    }`}
                                    preserveScroll
                                    preserveState
                                >
                                    {isPrevious && (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </span>
                                    )}

                                    {isNext && (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    )}

                                    {!isPrevious && !isNext && !isDots && (
                                        <span className="flex items-center justify-center">
                                            {plainLabel}
                                        </span>
                                    )}

                                    {isDots && (
                                        <span className="flex items-center justify-center">&hellip;</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </LayoutNews>
    );
}

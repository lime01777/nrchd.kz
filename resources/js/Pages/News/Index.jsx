import React, { useMemo } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import LayoutNews from '@/Layouts/LayoutNews';
import NewsImageSlider from '@/Components/NewsImageSlider';
import MediaCard from '@/Components/MediaCard';
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
export default function Index({ section: sectionProp }) {
    const { news, filters = {}, section: sectionFromPage, availableTags = [] } = usePage().props;
    const section = sectionProp || sectionFromPage || {
        type: 'news',
        title: 'Новости',
        subtitle: '',
        description: '',
    };
    const currentType = section.type || 'news';
    const isMediaSection = currentType === 'media';

    // Управляем состоянием фильтров (пока только поиск по ключевому слову)
    const { data, setData, processing } = useForm({
        search: filters.search ?? '',
        tag: filters.tag ?? '',
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
            const mediaItems = Array.isArray(item.media) ? item.media : [];

            const imageAccumulator = new Set(
                (Array.isArray(item.images) ? item.images : []).filter(Boolean)
            );

            mediaItems
                .filter((mediaItem) => mediaItem?.type === 'image')
                .forEach((mediaItem) => {
                    const url = mediaItem.url || mediaItem.path;
                    if (url) {
                        imageAccumulator.add(url);
                    }
                });

            const galleryImages = Array.from(imageAccumulator);

            const videoAccumulator = [];
            const seenVideoIds = new Set();

            const appendVideo = (video) => {
                if (!video) {
                    return;
                }

                if (typeof video === 'string') {
                    const normalizedSrc = video;
                    const id = `${normalizedSrc}-${videoAccumulator.length}`;
                    if (seenVideoIds.has(id)) {
                        return;
                    }
                    seenVideoIds.add(id);
                    videoAccumulator.push({
                        id,
                        type: 'video',
                        src: normalizedSrc,
                        url: normalizedSrc,
                        path: normalizedSrc,
                        is_external: normalizedSrc.startsWith('http'),
                        is_embed: false,
                    });
                    return;
                }

                const id = video.id || `${video.url || video.path}-${videoAccumulator.length}`;
                if (seenVideoIds.has(id)) {
                    return;
                }
                seenVideoIds.add(id);
                videoAccumulator.push({
                    ...video,
                    src: video.embed_url || video.url || video.path || null,
                });
            };

            if (Array.isArray(item.videos)) {
                item.videos.forEach(appendVideo);
            }

            mediaItems
                .filter((mediaItem) => mediaItem?.type === 'video')
                .forEach(appendVideo);

            const galleryVideos = videoAccumulator
                .map((video) => video.src)
                .filter(Boolean);

            const filteredImages = galleryImages.filter((url) => !isValidVideoUrl(url));

            const excerptSource = item.excerpt && item.excerpt.trim().length > 0
                ? item.excerpt
                : stripHtml(item.body || '').slice(0, 220);

            const formattedExcerpt = excerptSource
                ? `${excerptSource}${excerptSource.length >= 220 ? '…' : ''}`
                : '';

            return {
                ...item,
                galleryImages: filteredImages,
                galleryVideos,
                videoItems: videoAccumulator,
                preparedExcerpt: formattedExcerpt,
                // Для MediaCard передаем images из media массива
                images: item.images || filteredImages,
            };
        });
    }, [news]);

    const fetchData = (overrides = {}) => {
        const payload = {
            ...data,
            type: currentType,
            ...overrides,
        };

        router.get(route('news.index'), payload, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    /**
     * Отправка фильтров.
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    /**
     * Сбрасываем поиск и обновляем список.
     */
    const handleReset = () => {
        setData('search', '');
        setData('tag', '');

        router.get(route('news.index'), {
            search: '',
            tag: '',
            type: currentType,
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => window?.scrollTo?.({ top: 0, behavior: 'smooth' }),
        });
    };

    const totalCount = news?.meta?.total ?? news?.total ?? preparedNews.length;
    const selectedTag = data.tag || '';

    const handleTagSelect = (tag) => {
        const nextTag = selectedTag === tag ? '' : tag;

        setData('tag', nextTag);
        fetchData({ tag: nextTag });
    };

    const handleTypeChange = (nextType) => {
        if (nextType === currentType) {
            return;
        }

        router.get(route('news.index'), {
            ...data,
            type: nextType,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const renderHero = () => (
        <div className="bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20 py-16 sm:py-20 lg:py-24">
            <Head
                title={section.title || t('news.meta.title', 'Новости')}
                meta={[
                    {
                        name: 'description',
                        content:
                            section.description ||
                            t(
                                'news.meta.description',
                                'Последние новости Национального научного центра развития здравоохранения.'
                            ),
                    },
                ]}
            />
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-10 shadow-lg">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                                {isMediaSection ? 'СМИ О НАС' : 'НОВОСТИ'}
                            </p>
                            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
                                {section.subtitle || (isMediaSection ? 'Публикации в ведущих СМИ' : 'Актуальные события ННЦРЗ')}
                            </h1>
                            <p className="mt-5 text-lg leading-relaxed text-gray-600">
                                {section.description ||
                                    (isMediaSection
                                        ? 'Читайте статьи и интервью о деятельности центра из авторитетных источников.'
                                        : 'Следите за обновлениями и важными новостями Национального научного центра развития здравоохранения.')}
                            </p>

                            <form
                                className="mt-8 w-full rounded-2xl border border-white/80 bg-white/70 p-6 shadow-inner backdrop-blur"
                                onSubmit={handleSearchSubmit}
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
                                    <div className="flex-1 min-w-0">
                                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                                        {isMediaSection
                                            ? 'Поиск по источнику или заголовку'
                                            : t('news.filters.search.label', 'Поиск по ключевому слову')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.search}
                                        onChange={(event) => setData('search', event.target.value)}
                                        placeholder={
                                            isMediaSection
                                                ? 'Например: Forbes, Kazinform, интервью'
                                                : t('news.filters.search.placeholder', 'Например: медицина будущего')
                                        }
                                            className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-3 text-base shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing
                                                ? t('news.filters.search.processing', 'Поиск...')
                                                : t('news.filters.search.cta', 'Найти')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                                        >
                                            {t('news.filters.search.reset', 'Сбросить')}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {availableTags.length > 0 && (
                                <div className="mt-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                                        {isMediaSection ? 'Упоминания' : 'Теги новостей'}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {availableTags.map((tag) => {
                                            const isActive = selectedTag === tag;
                                            return (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => handleTagSelect(tag)}
                                                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                        isActive
                                                            ? 'border-blue-600 bg-blue-600 text-white shadow'
                                                            : 'border-transparent bg-white/70 text-gray-700 hover:border-blue-200 hover:text-blue-600'
                                                    }`}
                                                >
                                                    #{tag}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Кнопки переключения разделов */}
                        <div className="flex flex-col gap-3 md:items-end">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Разделы
                            </span>
                            <div className="relative flex w-full max-w-xs items-center rounded-full border border-blue-100 bg-white/90 p-1 shadow-inner backdrop-blur">
                                <span
                                    className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-blue-600 shadow transition-transform duration-300 ease-out ${
                                        currentType === 'media' ? 'translate-x-full' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('news')}
                                    className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        currentType === 'news'
                                            ? 'text-white'
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                >
                                    Новости
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('media')}
                                    className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        currentType === 'media'
                                            ? 'text-white'
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                >
                                    СМИ о нас
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <LayoutNews
            renderCustomHero={renderHero}
        >

            {/* Сетка новостей */}
            {preparedNews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {t('news.empty.title', 'Новости не найдены')}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {isMediaSection
                            ? 'Мы пока не добавили материалы СМИ. Проверьте позже или предложите публикацию.'
                            : t(
                                'news.empty.description',
                                'Попробуйте изменить поисковый запрос или зайдите позже — мы уже готовим новые публикации.'
                            )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {preparedNews.map((item) => {
                        // Для материалов СМИ используем специальный компонент MediaCard
                        if (isMediaSection && item.external_url) {
                            return <MediaCard key={item.id} item={item} />;
                        }

                        // Обычные новости - стандартная карточка
                        return (
                        <article
                            key={item.id}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <Link href={route('news.show', item.slug)} className="block">
                                {/* Превью изображений */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    {item.videoItems && item.videoItems.length > 0 ? (
                                        (() => {
                                            const firstVideo = item.videoItems[0];
                                            const videoSrc = firstVideo.embed_url || firstVideo.src || firstVideo.url || firstVideo.path;
                                            if (firstVideo.is_external && firstVideo.is_embed && videoSrc) {
                                                return (
                                                    <iframe
                                                        src={videoSrc}
                                                        title={item.title}
                                                        className="h-full w-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />
                                                );
                                            }
                                            return (
                                                <video
                                                    src={videoSrc}
                                                    poster={firstVideo.thumbnail || undefined}
                                                    controls
                                                    className="h-full w-full object-cover"
                                                >
                                                    Ваш браузер не поддерживает воспроизведение видео.
                                                </video>
                                            );
                                        })()
                                    ) : item.galleryImages.length > 1 ? (
                                        <NewsImageSlider
                                            images={item.galleryImages}
                                            className="h-56"
                                            height="224px"
                                            showDots
                                            showCounter={false}
                                            autoPlay
                                            interval={4000}
                                        />
                                    ) : item.galleryImages.length === 1 ? (
                                        <img
                                            src={item.galleryImages[0]}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

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
                        );
                    })}
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

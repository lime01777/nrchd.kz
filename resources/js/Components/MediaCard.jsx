import React from 'react';
import { Link } from '@inertiajs/react';
import SafeImage from './SafeImage';

/**
 * Компонент карточки для материалов СМИ
 * При клике переходит на оригинальный сайт СМИ
 */
export default function MediaCard({ item, className = '' }) {
    const {
        id,
        title,
        slug,
        excerpt,
        preparedExcerpt,
        cover_url,
        cover_thumb_url,
        cover_image_alt,
        galleryImages = [],
        published_at_formatted,
        external_url,
    } = item;

    // Определяем изображение для карточки
    // Проверяем все возможные источники изображений
    const images = item.images || galleryImages || [];
    const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
    const imageUrl = firstImage?.url || firstImage?.path || firstImage;
    const cardImage = cover_thumb_url || cover_url || imageUrl || (galleryImages.length > 0 ? galleryImages[0] : null);
    const cardAlt = cover_image_alt || title || 'Изображение';
    const cardExcerpt = preparedExcerpt || excerpt || '';

    // Если есть external_url, открываем в новой вкладке
    const handleClick = (e) => {
        if (external_url) {
            e.preventDefault();
            window.open(external_url, '_blank', 'noopener,noreferrer');
        }
    };

    const cardContent = (
        <article
            className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${className}`}
        >
            {/* Изображение */}
            {cardImage && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <SafeImage
                        src={cardImage}
                        alt={cardAlt}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        fallbackSrc="/img/placeholder.jpg"
                    />
                    {external_url && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            СМИ
                        </div>
                    )}
                </div>
            )}

            {/* Контент */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                    {title}
                </h3>

                {cardExcerpt && (
                    <p className="text-gray-600 text-sm line-clamp-4 mb-4 flex-1">
                        {cardExcerpt}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        {published_at_formatted || ''}
                    </span>
                    {external_url && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                            Читать на сайте СМИ
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </article>
    );

    // Если есть external_url, делаем карточку кликабельной без Inertia Link
    if (external_url) {
        return (
            <a
                href={external_url}
                onClick={handleClick}
                className="block"
                target="_blank"
                rel="noopener noreferrer"
            >
                {cardContent}
            </a>
        );
    }

    // Обычная карточка с переходом на детальную страницу
    return (
        <Link href={route('news.show', slug)}>
            {cardContent}
        </Link>
    );
}


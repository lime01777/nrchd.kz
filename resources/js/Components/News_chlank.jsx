import React from 'react'
import { Link } from '@inertiajs/react';
import NewsSliderWithMain from './NewsSliderWithMain';
import { isValidVideoUrl } from '../Utils/mediaUtils';
import translationService from '@/services/TranslationService';

function News_chlank({ date, description, slug, image, images = [], external_url, type }) {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const rawImages = images && images.length > 0 ? images : (image ? [image] : []);
  const normalizedImages = rawImages
    .map((img) => {
      if (!img) return null;
      if (typeof img === 'string') {
        return img;
      }
      if (typeof img === 'object') {
        return img.url || img.path || null;
      }
      return null;
    })
    .filter(Boolean);

  const imageOnlyImages = normalizedImages.filter((src) => !isValidVideoUrl(src));
  
  // Определяем, является ли это публикацией из СМИ
  const isMediaPublication = type === 'media' && external_url;
  
  // Определяем URL для перехода
  const newsUrl = isMediaPublication ? external_url : (slug ? route('news.show', slug) : null);
  
  // Компонент кнопки "Читать новость"
  const ReadButton = () => {
    const buttonContent = (
      <span className="mt-auto text-black inline-flex items-center border-gray-300 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 pointer-events-none">
        {t('common.readNews', 'Читать новость')}
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
            strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </span>
    );
    
    // Если вся карточка кликабельна, кнопка просто декоративная
    if (newsUrl) {
      return buttonContent;
    }
    
    // Если нет URL, кнопка неактивна
    return buttonContent;
  };
  
  // Содержимое карточки
  const cardContent = (
    <>
        {/* Отображение слайдера изображений */}
        <div className="h-40 overflow-hidden rounded-t-lg bg-gray-100">
          {imageOnlyImages.length > 0 ? (
            <NewsSliderWithMain 
              images={imageOnlyImages}
              className="h-40"
              height="160px"
              showDots={true}
              showCounter={false}
              autoPlay={true}
              interval={3000}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col p-6 h-full">
            <div className="flex-grow">
                <p className="text-gray-500 text-sm mb-2">{date}</p>
                <h2 className="text-gray-900 text-lg font-medium mb-4 line-clamp-3 h-[4.5rem]" title={description}>
                    {description}
                </h2>
                <ReadButton />
            </div>
        </div>
    </>
  );
  
  // Если есть URL, делаем всю карточку кликабельной
  if (newsUrl) {
    if (isMediaPublication) {
      return (
        <a 
          href={newsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full block cursor-pointer"
        >
          {cardContent}
        </a>
      );
    }
    
    return (
      <Link 
        href={newsUrl}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full block"
      >
        {cardContent}
      </Link>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full">
      {cardContent}
    </div>
  )
}

export default News_chlank
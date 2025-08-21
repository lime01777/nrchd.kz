import React from 'react'
import { Link } from '@inertiajs/react';
import NewsSliderWithMain from './NewsSliderWithMain';
import { isValidVideoUrl } from '../Utils/mediaUtils';

function News_chlank({ date, description, slug, image, images = [] }) {
  // Определяем изображения для отображения
  const displayImages = images && images.length > 0 ? images : (image ? [image] : []);
  
  // Фильтруем только изображения для карточек (видео показываем только на странице новости)
  const imageOnlyImages = displayImages.filter(img => {
    if (typeof img === 'string') {
      return !isValidVideoUrl(img);
    }
    return true; // Если это объект, считаем изображением
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full">
        {/* Отображение слайдера изображений */}
        <div className="h-40 overflow-hidden rounded-t-lg">
          <NewsSliderWithMain 
            images={imageOnlyImages}
            className="h-40"
            height="160px"
            showDots={true}
            showCounter={false}
            autoPlay={true}
            interval={3000}
          />
        </div>
        <div className="flex flex-col p-6 h-full">
            <div className="flex-grow">
                <p className="text-gray-500 text-sm mb-2">{date}</p>
                <h2 className="text-gray-900 text-lg font-medium mb-4 line-clamp-3 h-[4.5rem]" title={description}>
                    {description}
                </h2>
                {slug ? (
                  <Link 
                    href={route('news.show', slug)} 
                    className="mt-auto text-black inline-flex items-center border-gray-300 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    Читать новость
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                ) : (
                  <a className="mt-auto text-black inline-flex items-center border-gray-300 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                    Читать новость
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                )}
            </div>
        </div>
    </div>
  )
}

export default News_chlank
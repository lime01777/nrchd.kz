import React, { useState, useEffect } from 'react';

/**
 * Слайдер новостей с правильным порядком изображений
 * Главное изображение отображается первым
 */
export default function NewsSliderWithMain({ 
  images = [], 
  mainImage = null,
  className = '', 
  height = '160px',
  showDots = true,
  showCounter = false,
  autoPlay = true,
  interval = 3000
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Формируем правильный порядок изображений
  const orderedImages = React.useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];
    
    console.log('NewsSliderWithMain - обработка изображений:', {
      images,
      mainImage,
      imagesLength: images.length
    });
    
    // Если есть главное изображение, ставим его первым
    if (mainImage && images.includes(mainImage)) {
      const filteredImages = images.filter(img => img !== mainImage);
      const result = [mainImage, ...filteredImages];
      console.log('NewsSliderWithMain - результат с главным изображением:', result);
      return result;
    }
    
    // Если главного изображения нет, используем исходный порядок
    console.log('NewsSliderWithMain - исходный порядок:', images);
    return images;
  }, [images, mainImage]);

  // Автопрокрутка каждые 3 секунды
  useEffect(() => {
    if (!autoPlay || orderedImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % orderedImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [orderedImages.length, autoPlay, interval]);

  // Если нет изображений, возвращаем заглушку
  if (!Array.isArray(orderedImages) || orderedImages.length === 0) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${className}`} 
        style={{ height }}
      >
        <div className="text-gray-400 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-sm">Нет изображений</p>
        </div>
      </div>
    );
  }

  // Если только одно изображение, показываем его как слайдер с возможностью добавления
  if (orderedImages.length === 1) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg ${className}`} 
        style={{ height }}
      >
        <img
          src={orderedImages[0]}
          alt="Изображение новости"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', orderedImages[0]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Показываем счетчик даже для одного изображения */}
        {showCounter && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            1 / 1
          </div>
        )}
        
        {/* Показываем точки даже для одного изображения */}
        {showDots && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
          </div>
        )}
      </div>
    );
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ height }}
    >
      {/* Основное изображение */}
      <div className="relative w-full h-full">
        <img
          src={orderedImages[currentIndex]}
          alt={`Изображение новости ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', orderedImages[currentIndex]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
          onLoad={() => {
            console.log('Слайдер - изображение успешно загружено:', orderedImages[currentIndex]);
          }}
        />
        
        {/* Индикаторы (точки) - только если больше одного изображения */}
        {showDots && orderedImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {orderedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white shadow-sm'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Перейти к изображению ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Индикатор главного изображения */}
        {currentIndex === 0 && mainImage && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
            Главное
          </div>
        )}
      </div>

      {/* Счетчик изображений (опционально) */}
      {showCounter && orderedImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-10">
          {currentIndex + 1} / {orderedImages.length}
        </div>
      )}
    </div>
  );
}

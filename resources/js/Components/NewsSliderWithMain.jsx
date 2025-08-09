import React, { useState, useEffect, useCallback } from 'react';

/**
 * Слайдер новостей для отображения изображений
 * Автоматическая прокрутка каждые 3 секунды с ожиданием загрузки изображений
 */
export default function NewsSliderWithMain({ 
  images = [], 
  className = '', 
  height = '160px',
  showDots = true,
  showCounter = false,
  autoPlay = true,
  interval = 3000
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  // Проверяем и обрабатываем изображения
  const processedImages = React.useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];
    
    // Фильтруем пустые/недействительные изображения
    const validImages = images.filter(img => img && (typeof img === 'string' || img instanceof File));
    
    console.log('NewsSliderWithMain - обработка изображений:', {
      images,
      validImages,
      imagesLength: images.length,
      validLength: validImages.length
    });
    
    return validImages;
  }, [images]);

  // Обработчик загрузки изображения
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      
      // Проверяем, загружены ли все изображения
      if (newSet.size >= processedImages.length) {
        setIsLoading(false);
      }
      
      return newSet;
    });
  }, [processedImages.length]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = useCallback((index) => {
    setErrorImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    
    // Считаем ошибку как "загруженное" изображение для логики завершения загрузки
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      
      // Проверяем, обработаны ли все изображения (загружены или с ошибкой)
      if (newSet.size >= processedImages.length) {
        setIsLoading(false);
      }
      
      return newSet;
    });
  }, [processedImages.length]);

  // Сброс состояний при изменении изображений
  useEffect(() => {
    setLoadedImages(new Set());
    setErrorImages(new Set());
    setIsLoading(false); // Убираем общий индикатор загрузки
    setCurrentIndex(0);
  }, [processedImages]);

  // Автопрокрутка - запускается только после загрузки первого изображения
  useEffect(() => {
    if (!autoPlay || processedImages.length <= 1) return;
    
    // Запускаем автопрокрутку только если первое изображение загружено
    if (!loadedImages.has(0)) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % processedImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [processedImages.length, autoPlay, interval, loadedImages]);

  // Если нет изображений, возвращаем заглушку
  if (!Array.isArray(processedImages) || processedImages.length === 0) {
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
  if (processedImages.length === 1) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg ${className}`} 
        style={{ height }}
      >
        {/* Индикатор загрузки */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <img
          src={processedImages[0]}
          alt="Изображение новости"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loadedImages.has(0) ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(0)}
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', processedImages[0]);
            handleImageError(0);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Показываем счетчик даже для одного изображения */}
        {showCounter && !isLoading && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            1 / 1
          </div>
        )}
        
        {/* Показываем точки даже для одного изображения */}
        {showDots && !isLoading && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
          </div>
        )}
      </div>
    );
  }

  // Функции навигации
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % processedImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? processedImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ height }}
    >
      {/* Основное изображение */}
      <div className="relative w-full h-full">
        <img
          src={processedImages[currentIndex]}
          alt={`Изображение ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loadedImages.has(currentIndex) ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', processedImages[currentIndex]);
            handleImageError(currentIndex);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Предварительная загрузка остальных изображений */}
        {processedImages.map((image, index) => 
          index !== currentIndex && (
            <img
              key={index}
              src={image}
              alt=""
              className="hidden"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          )
        )}
        
        {/* Индикатор ошибки загрузки текущего изображения */}
        {errorImages.has(currentIndex) && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p className="text-xs">Ошибка</p>
            </div>
          </div>
        )}
      </div>

      {/* Счетчик */}
      {showCounter && processedImages.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
          {currentIndex + 1} / {processedImages.length}
        </div>
      )}

      {/* Точки навигации */}
      {showDots && processedImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {processedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white opacity-100' 
                  : 'bg-white opacity-50 hover:opacity-75'
              }`}
              aria-label={`Перейти к изображению ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';

/**
 * Специализированный слайдер изображений для новостей
 * Автоматическая прокрутка каждые 3 секунды без стрелок управления с ожиданием загрузки
 */
export default function NewsImageSlider({ 
  images = [], 
  className = '', 
  height = '160px', // Высота по умолчанию для карточек новостей
  showDots = true,
  showCounter = false, // По умолчанию скрываем счетчик для карточек
  autoPlay = true,
  interval = 3000 // 3 секунды по требованию
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Фильтруем изображения и проверяем их валидность
  const validImages = React.useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];
    
    return images.filter(img => {
      if (!img || typeof img !== 'string') return false;
      
      // Проверяем, что это валидный URL или путь к изображению
      const trimmedImg = img.trim();
      if (trimmedImg === '') return false;
      
      // Проверяем расширения файлов
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        trimmedImg.toLowerCase().includes(ext)
      );
      
      // Если нет расширения, но это похоже на URL, считаем валидным
      if (!hasValidExtension && (trimmedImg.startsWith('http') || trimmedImg.startsWith('/'))) {
        return true;
      }
      
      return hasValidExtension;
    });
  }, [images]);

  // Обработчик загрузки изображения
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      
      // Проверяем, загружены ли все изображения
      if (newSet.size >= validImages.length) {
        setIsLoading(false);
      }
      
      return newSet;
    });
  }, [validImages.length]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = useCallback((index, imageUrl) => {
    console.error('Ошибка загрузки изображения:', imageUrl);
    
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
      if (newSet.size >= validImages.length) {
        setIsLoading(false);
      }
      
      return newSet;
    });
  }, [validImages.length]);

  // Сброс состояний при изменении изображений
  useEffect(() => {
    setLoadedImages(new Set());
    setErrorImages(new Set());
    setIsLoading(validImages.length > 0); // Показываем загрузку только если есть изображения
    setCurrentIndex(0);
  }, [validImages]);

  // Автопрокрутка - запускается для всех изображений
  useEffect(() => {
    if (!autoPlay || validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, autoPlay, interval]);

  // Функция для перехода к определенному слайду
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Если нет изображений, возвращаем заглушку
  if (!validImages || validImages.length === 0) {
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

  // Если только одно изображение, показываем его без слайдера
  if (validImages.length === 1) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg ${className}`} 
        style={{ height }}
      >
        <img
          src={validImages[0]}
          alt="Изображение новости"
          className="w-full h-full object-cover"
          onLoad={() => handleImageLoad(0)}
          onError={(e) => {
            handleImageError(0, validImages[0]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ height }}
    >
      {/* Основное изображение */}
      <div className="relative w-full h-full">
        <img
          src={validImages[currentIndex]}
          alt={`Изображение новости ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loadedImages.has(currentIndex) ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={(e) => {
            handleImageError(currentIndex, validImages[currentIndex]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Предварительная загрузка остальных изображений */}
        {validImages.map((image, index) => 
          index !== currentIndex && (
            <img
              key={index}
              src={image}
              alt=""
              className="hidden"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index, image)}
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
              <p className="text-xs">Ошибка загрузки</p>
            </div>
          </div>
        )}
        
        {/* Индикаторы (точки) - только если больше одного изображения */}
        {showDots && validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {validImages.map((_, index) => (
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
      </div>

      {/* Счетчик изображений (опционально) */}
      {showCounter && validImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-10">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  );
}

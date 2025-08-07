import React, { useState, useEffect } from 'react';

export default function ImageSlider({ 
  images = [], 
  className = '', 
  showDots = true, 
  autoPlay = true, 
  interval = 3000, // Изменено на 3 секунды по требованию
  showArrows = false, // Добавлен параметр для скрытия стрелок
  showCounter = true, // Добавлен параметр для счетчика
  height = 'auto' // Добавлен параметр для высоты
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Автопрокрутка
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, autoPlay, interval]);

  // Если нет изображений, возвращаем null
  if (!images || images.length === 0) {
    return null;
  }

  // Если только одно изображение, показываем его без слайдера
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height }}>
        <img
          src={images[0]}
          alt="Изображение"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', images[0]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
      </div>
    );
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height }}>
      {/* Основное изображение */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex]}
          alt={`Изображение ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', images[currentIndex]);
            e.target.onerror = null;
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Стрелки управления (если включены) */}
        {showArrows && images.length > 1 && (
          <>
            {/* Левая стрелка */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Предыдущее изображение"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            {/* Правая стрелка */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Следующее изображение"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
        
        {/* Индикаторы (точки) */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Перейти к изображению ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Счетчик изображений */}
      {showCounter && images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

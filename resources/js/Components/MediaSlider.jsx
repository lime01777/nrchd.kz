import React, { useState, useEffect } from 'react';
import SafeImage from './SafeImage';
import SafeVideo from './SafeVideo';

/**
 * Слайдер для изображений и видео
 * Поддерживает мультиязычность
 */
export default function MediaSlider({ media = [], className = '', autoPlay = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Фильтруем и нормализуем медиа
  const normalizedMedia = media.map(item => {
    if (typeof item === 'string') {
      // Определяем тип по расширению
      const extension = item.split('.').pop()?.toLowerCase();
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
      return {
        path: item,
        type: videoExtensions.includes(extension) ? 'video' : 'image',
        name: item.split('/').pop()
      };
    } else if (item && typeof item === 'object') {
      return {
        path: item.path || item,
        type: item.type || 'image',
        name: item.name || (window.translations?.media_file || 'Медиа файл')
      };
    }
    return null;
  }).filter(Boolean);

  // Автопрокрутка
  useEffect(() => {
    if (!autoPlay || !isPlaying || normalizedMedia.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % normalizedMedia.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPlaying, interval, normalizedMedia.length]);

  // Обработчики навигации
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? normalizedMedia.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % normalizedMedia.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Обработчик клика по слайдеру для паузы/воспроизведения
  const handleSliderClick = () => {
    if (autoPlay) {
      setIsPlaying(!isPlaying);
    }
  };

  if (normalizedMedia.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: '300px' }}>
        <div className="text-gray-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>{window.translations?.no_media_files || 'Нет медиа файлов для отображения'}</p>
        </div>
      </div>
    );
  }

  const currentMedia = normalizedMedia[currentIndex];

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Основной контент */}
      <div 
        className="relative w-full h-64 md:h-80 lg:h-96 bg-black cursor-pointer"
        onClick={handleSliderClick}
      >
        {currentMedia.type === 'video' ? (
          <SafeVideo
            key={currentMedia.path}
            src={currentMedia.path}
            className="w-full h-full object-contain"
            controls
            autoPlay={isPlaying}
            muted
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            fallbackContent={
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎥</div>
                  <div className="text-xs text-gray-600">Видео недоступно</div>
                </div>
              </div>
            }
          />
        ) : (
          <SafeImage
            src={currentMedia.path}
            alt={currentMedia.name}
            className="w-full h-full object-cover"
            fallbackSrc="/img/placeholder.jpg"
          />
        )}
        
        {/* Fallback для изображений */}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 bg-gray-100">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>

        {/* Индикатор типа медиа */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {currentMedia.type === 'video' ? '🎥 ' + (window.translations?.video || 'Видео') : '🖼️ ' + (window.translations?.image || 'Изображение')}
        </div>

        {/* Индикатор автовоспроизведения */}
        {autoPlay && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {isPlaying ? '⏸️ ' + (window.translations?.pause || 'Пауза') : '▶️ ' + (window.translations?.play || 'Воспроизвести')}
          </div>
        )}
      </div>

      {/* Навигационные кнопки */}
      {normalizedMedia.length > 1 && (
        <>
          {/* Кнопка "Назад" */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label={window.translations?.previous_slide || "Предыдущий слайд"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Кнопка "Вперед" */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label={window.translations?.next_slide || "Следующий слайд"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </>
      )}

      {/* Индикаторы слайдов */}
      {normalizedMedia.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {normalizedMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={window.translations?.go_to_slide ? `${window.translations.go_to_slide} ${index + 1}` : `Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}

              {/* Счетчик слайдов */}
        {normalizedMedia.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {normalizedMedia.length}
            {normalizedMedia.length >= 15 && (
              <span className="ml-1 text-yellow-300">(макс.)</span>
            )}
          </div>
        )}
    </div>
  );
}

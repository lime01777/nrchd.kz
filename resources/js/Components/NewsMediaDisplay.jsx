import React, { useState } from 'react';
import MediaSlider from './MediaSlider';

/**
 * Компонент для отображения медиа в новости
 * Автоматически определяет тип контента:
 * - Одно изображение: отображается как основное изображение
 * - Несколько изображений: отображается как слайдер
 * - Видео: отображается как видео плеер
 */
export default function NewsMediaDisplay({ media = [], className = '' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Определяем тип медиа
  const getMediaType = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      const extension = mediaItem.split('.').pop()?.toLowerCase();
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
      return videoExtensions.includes(extension) ? 'video' : 'image';
    }
    
    if (mediaItem.type) {
      return mediaItem.type;
    }
    
    if (mediaItem.path) {
      const extension = mediaItem.path.split('.').pop()?.toLowerCase();
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
      return videoExtensions.includes(extension) ? 'video' : 'image';
    }
    
    return 'image';
  };

  const getMediaPath = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return mediaItem;
    }
    return mediaItem.path || mediaItem;
  };

  const getMediaName = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return mediaItem.split('/').pop();
    }
    return mediaItem.name || mediaItem.path?.split('/').pop() || 'Медиа файл';
  };

  const getMediaThumbnail = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return mediaItem;
    }
    return mediaItem.thumbnail || mediaItem.path || mediaItem;
  };

  // Фильтруем медиа по типам
  const images = media.filter(item => getMediaType(item) === 'image');
  const videos = media.filter(item => getMediaType(item) === 'video');

  // Если нет медиа, не отображаем ничего
  if (media.length === 0) {
    return null;
  }

  // Если есть и изображения, и видео, или больше одного медиа - используем слайдер
  if (media.length > 1 || (images.length > 0 && videos.length > 0)) {
    return (
      <div className={`mb-6 ${className}`}>
        <MediaSlider 
          media={media}
          className="w-full"
          autoPlay={true}
          interval={5000}
        />
      </div>
    );
  }

  // Если есть только одно видео
  if (videos.length === 1 && images.length === 0) {
    const video = videos[0];
    return (
      <div className={`mb-6 ${className}`}>
        <div className="relative">
          <video
            controls
            className="w-full h-auto rounded-lg shadow-lg"
            src={getMediaPath(video)}
            poster={getMediaThumbnail(video)}
          >
            Ваш браузер не поддерживает видео.
          </video>
          <div className="mt-2 text-sm text-gray-600">
            {getMediaName(video)}
          </div>
        </div>
      </div>
    );
  }

  // Если есть только изображения
  if (images.length === 1) {
    // Одно изображение - отображаем как основное
    const image = images[0];
    return (
      <div className={`mb-6 ${className}`}>
        <div className="relative">
          <img
            src={getMediaPath(image)}
            alt={getMediaName(image)}
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden w-full h-64 bg-gray-200 rounded-lg shadow-lg items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Несколько изображений - отображаем как слайдер
  if (images.length > 1) {
    return (
      <div className={`mb-6 ${className}`}>
        <div className="relative">
          {/* Основное изображение */}
          <div className="relative">
            <img
              src={getMediaPath(images[currentImageIndex])}
              alt={getMediaName(images[currentImageIndex])}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-64 bg-gray-200 rounded-lg shadow-lg items-center justify-center text-gray-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          {/* Навигационные кнопки */}
          {images.length > 1 && (
            <>
              {/* Кнопка "Предыдущее" */}
              <button
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              {/* Кнопка "Следующее" */}
              <button
                onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              {/* Индикаторы */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>

              {/* Счетчик */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Миниатюры */}
          {images.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={getMediaPath(image)}
                    alt={getMediaName(image)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

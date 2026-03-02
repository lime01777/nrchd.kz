import React, { useState, useEffect } from 'react';
import SafeImage from '@/Components/SafeImage';
import SafeVideo from '@/Components/SafeVideo';
import MediaLightbox from '@/Components/MediaLightbox';

/**
 * Слайдер для изображений и видео
 * Поддерживает мультиязычность
 */
const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg', 'm4v'];

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `media-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const detectTypeByPath = (path = '') => {
  if (!path || typeof path !== 'string') {
    return 'image';
  }
  const lower = path.toLowerCase();
  const extension = lower.split('.').pop();
  if (videoExtensions.includes(extension)) {
    return 'video';
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('instagram.com') || lower.includes('aitube')) {
    return 'video';
  }
  return 'image';
};

export default function MediaSlider({ media = [], className = '', autoPlay = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Состояние открытия полноэкранного просмотра
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Фильтруем и нормализуем медиа (используем useMemo чтобы избежать лишних пересчетов)
  const normalizedMedia = React.useMemo(() => media
    .map((item, index) => {
      if (!item) {
        return null;
      }

      if (typeof item === 'string') {
        const type = detectTypeByPath(item);
        return {
          id: `media-str-${index}`,
          type,
          path: item,
          url: item,
          embed_url: null,
          is_external: item.startsWith('http'),
          is_embed: false,
          name: item.split('/').pop() || `Медиа ${index + 1}`,
        };
      }

      if (typeof item === 'object') {
        const rawPath = item.embed_url || item.path || item.url || item.src || '';
        const type = item.type || detectTypeByPath(rawPath);

        return {
          id: item.id || `media-obj-${index}`,
          type,
          path: rawPath,
          url: item.url || item.path || rawPath,
          embed_url: item.embed_url || null,
          is_external: Boolean(item.is_external ?? (typeof rawPath === 'string' && rawPath.startsWith('http'))),
          is_embed: Boolean(item.is_embed || (item.embed_url && item.embed_url === rawPath)),
          thumbnail: item.thumbnail || item.path || item.url || rawPath,
          name: item.name || item.title || `Медиа ${index + 1}`,
        };
      }

      return null;
    })
    .filter(Boolean), [media]);

  const mediaContainsVideo = normalizedMedia.some((item) => item?.type === 'video');
  const computedAutoPlay = autoPlay && !mediaContainsVideo && !isLightboxOpen;
  const [isPlaying, setIsPlaying] = useState(computedAutoPlay);

  useEffect(() => {
    setIsPlaying(computedAutoPlay);
  }, [computedAutoPlay]);

  useEffect(() => {
    if (!computedAutoPlay || !isPlaying || normalizedMedia.length <= 1 || isLightboxOpen) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % normalizedMedia.length);
    }, interval);

    return () => clearInterval(timer);
  }, [computedAutoPlay, isPlaying, interval, normalizedMedia.length, isLightboxOpen]);

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

  // Обработчик клика по основному изображению/видео
  const handleMainMediaClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Предотвращаем повторное открытие, если уже открыто
    if (!isLightboxOpen) {
      setIsPlaying(false);
      setLightboxIndex(currentIndex);
      setIsLightboxOpen(true);
    }
  };

  // Обработчик клика по превью для открытия в полном размере
  const handleThumbnailClick = (index) => {
    if (!isLightboxOpen) {
      setIsPlaying(false);
      setCurrentIndex(index);
      setLightboxIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const handleLightboxClose = () => {
    if (isLightboxOpen) {
      setIsLightboxOpen(false);
      setIsPlaying(computedAutoPlay);
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
    <>
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* Основной контент - большое изображение/видео */}
        <div
          className="relative w-full h-64 md:h-80 lg:h-96 bg-black rounded-lg overflow-hidden cursor-pointer group select-none"
          onClick={handleMainMediaClick}
          onMouseDown={(e) => {
            // Предотвращаем выделение текста при двойном клике
            if (e.detail > 1) {
              e.preventDefault();
            }
          }}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          {currentMedia.type === 'video' ? (
            currentMedia.is_embed && (currentMedia.embed_url || currentMedia.path) ? (
              <div className="w-full h-full relative">
                <iframe
                  key={currentMedia.id}
                  src={currentMedia.embed_url || currentMedia.path}
                  title={currentMedia.name || 'Видео'}
                  className="w-full h-full object-contain pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full h-full relative">
                <SafeVideo
                  key={currentMedia.path || currentMedia.url}
                  src={currentMedia.path || currentMedia.url || currentMedia.src}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay={false}
                  muted
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  fallbackContent={
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer" onClick={handleMainMediaClick}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎥</div>
                        <div className="text-xs text-gray-600">Видео недоступно</div>
                      </div>
                    </div>
                  }
                />
              </div>
            )
          ) : (
            <SafeImage
              src={currentMedia.path}
              alt={currentMedia.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              fallbackSrc="/img/placeholder.jpg"
            />
          )}

          {/* Overlay с иконкой увеличения - только для изображений */}
          {currentMedia.type === 'image' && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          )}

          {/* Индикатор типа медиа */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {currentMedia.type === 'video' ? '🎥 ' + (window.translations?.video || 'Видео') : '🖼️ ' + (window.translations?.image || 'Изображение')}
          </div>

          {/* Счетчик слайдов */}
          {normalizedMedia.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {currentIndex + 1} / {normalizedMedia.length}
            </div>
          )}
        </div>

        {/* Навигационная панель с превью снизу */}
        {normalizedMedia.length > 1 && (
          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {normalizedMedia.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={item.id || `thumb-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToSlide(index);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                    onMouseDown={(e) => {
                      // Предотвращаем выделение текста при двойном клике
                      if (e.detail > 1) {
                        e.preventDefault();
                      }
                    }}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                    className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 transition-all duration-200 select-none ${isActive
                      ? 'border-blue-600 ring-2 ring-blue-400 ring-offset-2 scale-105'
                      : 'border-gray-300 hover:border-blue-400 hover:scale-105'
                      }`}
                    aria-label={`Просмотр ${item.name || `Медиа ${index + 1}`}`}
                  >
                    {item.type === 'video' ? (
                      <>
                        <SafeImage
                          src={item.thumbnail || item.path}
                          alt={item.name || `Видео ${index + 1}`}
                          className="w-full h-full object-cover"
                          fallbackSrc="/img/placeholder.jpg"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Видео
                        </span>
                      </>
                    ) : (
                      <SafeImage
                        src={item.thumbnail || item.path}
                        alt={item.name || `Фото ${index + 1}`}
                        className="w-full h-full object-cover"
                        fallbackSrc="/img/placeholder.jpg"
                      />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-blue-600/20 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center select-none">
              Кликните на превью для переключения • Двойной клик для просмотра в полном размере
            </p>
          </div>
        )}
      </div>

      {/* Полноэкранный просмотр медиа */}
      {isLightboxOpen && (
        <MediaLightbox
          media={normalizedMedia}
          initialIndex={lightboxIndex}
          onClose={handleLightboxClose}
        />
      )}
    </>
  );
}

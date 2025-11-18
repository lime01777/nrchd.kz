import React, { useState } from 'react';

/**
 * Безопасный компонент для загрузки видео с обработкой ошибок
 * Предотвращает DOMException при загрузке невалидных видео-файлов
 */
export default function SafeVideo({ 
  src, 
  className = '', 
  fallbackContent = null,
  onLoad,
  onError,
  ...props 
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    console.warn('Ошибка загрузки видео:', src);
    setIsLoading(false);
    setHasError(true);
    
    if (onError) {
      onError(e);
    }
  };

  // Проверяем валидность src перед рендерингом
  const isValidSrc = src && (
    typeof src === 'string' && 
    src.trim() !== '' && 
    (src.startsWith('http') || src.startsWith('/'))
  );
  
  // Проверяем, является ли это blob URL (может вызвать CORS ошибки)
  const isBlobUrl = src && typeof src === 'string' && src.startsWith('blob:');
  
  // Если это blob URL, показываем fallback (избегаем CORS ошибок)
  if (isBlobUrl) {
    console.warn('Обнаружен blob URL для видео, показываем fallback:', src);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-xs">Предварительный просмотр</p>
        </div>
      </div>
    );
  }

  if (!isValidSrc) {
    console.warn('Невалидный src для видео:', src);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-xs">Видео недоступно</p>
        </div>
      </div>
    );
  }

  // Если есть ошибка, показываем fallback
  if (hasError) {
    if (fallbackContent) {
      return fallbackContent;
    }
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-xs">Видео недоступно</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      <video
        src={src}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoadedData={handleLoad}
        onCanPlay={handleLoad}
        onError={handleError}
        preload="metadata"
        {...props}
      />
    </>
  );
}

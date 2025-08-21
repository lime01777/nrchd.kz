import React, { useState } from 'react';

/**
 * Безопасный компонент для загрузки изображений с обработкой ошибок
 * Предотвращает DOMException при загрузке невалидных медиа-файлов
 */
export default function SafeImage({ 
  src, 
  alt = '', 
  className = '', 
  fallbackSrc = '/img/placeholder.jpg',
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
    console.warn('Ошибка загрузки изображения:', src);
    setIsLoading(false);
    setHasError(true);
    
    if (onError) {
      onError(e);
    }

    // Пытаемся загрузить fallback изображение
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      try {
        e.target.src = fallbackSrc;
        e.target.onerror = null; // Предотвращаем бесконечный цикл
      } catch (fallbackError) {
        console.error('Ошибка при загрузке fallback изображения:', fallbackError);
        e.target.style.display = 'none';
      }
    } else {
      // Если fallback тоже не загрузился, скрываем изображение
      e.target.style.display = 'none';
    }
  };

  // Проверяем валидность src перед рендерингом
  const isValidSrc = src && (
    typeof src === 'string' && 
    src.trim() !== '' && 
    (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('/'))
  );

  if (!isValidSrc) {
    console.warn('Невалидный src для изображения:', src);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-xs">Ошибка</p>
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
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''} ${hasError ? 'opacity-50' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
}

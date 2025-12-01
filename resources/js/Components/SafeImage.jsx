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
    // Предотвращаем бесконечный цикл - если уже пытались загрузить fallback, сразу показываем placeholder UI
    if (e.target.dataset.fallbackAttempted) {
      setIsLoading(false);
      setHasError(true);
      if (onError) {
        onError(e);
      }
      return;
    }

    console.warn('Ошибка загрузки изображения:', src);
    
    // Пытаемся загрузить fallback изображение только один раз и только если он указан и не пустой
    if (fallbackSrc && fallbackSrc.trim() !== '' && e.target.src !== fallbackSrc && !fallbackSrc.includes('data:image')) {
      try {
        e.target.dataset.fallbackAttempted = 'true';
        e.target.src = fallbackSrc;
        // Не устанавливаем hasError сразу, ждем результата загрузки fallback
        return;
      } catch (fallbackError) {
        console.error('Ошибка при загрузке fallback изображения:', fallbackError);
      }
    }
    
    // Если fallback не помог или его нет, сразу показываем placeholder UI
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
    console.warn('Обнаружен blob URL, показываем fallback:', src);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-xs">Предварительный просмотр</p>
        </div>
      </div>
    );
  }

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

  // Если произошла ошибка и fallback не помог, показываем placeholder UI
  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={props.style}>
        <div className="text-gray-400 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-xs text-gray-500">Нет изображения</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={props.style}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
}

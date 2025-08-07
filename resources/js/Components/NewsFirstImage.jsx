import React from 'react';

/**
 * Компонент для отображения первого изображения новости
 * Используется в карточках новостей и списках
 */
export default function NewsFirstImage({ 
  images = [], 
  image = null, 
  className = '', 
  height = '160px',
  alt = 'Изображение новости'
}) {
  // Определяем изображение для отображения
  const displayImage = images && images.length > 0 ? images[0] : (image || null);
  
  // Если нет изображений, показываем заглушку
  if (!displayImage) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${className}`} 
        style={{ height }}
      >
        <div className="text-gray-400 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-sm">Нет изображения</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ height }}
    >
      <img
        src={displayImage}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Ошибка загрузки изображения:', displayImage);
          e.target.onerror = null;
          e.target.src = '/img/placeholder.jpg';
        }}
      />
      
      {/* Индикатор множественных изображений */}
      {images && images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          +{images.length - 1}
        </div>
      )}
    </div>
  );
}

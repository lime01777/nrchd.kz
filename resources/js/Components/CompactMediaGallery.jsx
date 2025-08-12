import React, { useState } from 'react';

/**
 * Компактная галерея медиа (изображения и видео)
 */
export default function CompactMediaGallery({ 
  media = [], 
  setMedia, 
  maxFiles = 10,
  className = '' 
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRemoveMedia = (index) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
  };

  const handleMediaClick = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const getMediaType = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      // Если это строка, определяем по расширению
      const extension = mediaItem.split('.').pop()?.toLowerCase();
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
      return videoExtensions.includes(extension) ? 'video' : 'image';
    }
    
    // Если это объект с типом
    if (mediaItem.type) {
      return mediaItem.type;
    }
    
    // Если это объект с путем
    if (mediaItem.path) {
      const extension = mediaItem.path.split('.').pop()?.toLowerCase();
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
      return videoExtensions.includes(extension) ? 'video' : 'image';
    }
    
    return 'image'; // По умолчанию
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

  const getMediaSize = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return '';
    }
    return mediaItem.size || '';
  };

  const getMediaDuration = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return '';
    }
    return mediaItem.duration || '';
  };

  const getMediaThumbnail = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return mediaItem;
    }
    return mediaItem.thumbnail || mediaItem.path || mediaItem;
  };

  if (media.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <p className="mt-2">Медиа файлы не выбраны</p>
        <p className="text-sm">Добавьте изображения или видео для отображения в новости</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Заголовок */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          Выбранные медиа файлы ({media.length}/{maxFiles})
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {media.length === 1 && getMediaType(media[0]) === 'image' && 'Будет отображаться одно изображение'}
          {media.length > 1 && media.every(m => getMediaType(m) === 'image') && 'Будет отображаться слайдер изображений'}
          {media.some(m => getMediaType(m) === 'video') && 'Будет отображаться видео'}
        </p>
      </div>

      {/* Сетка медиа */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((mediaItem, index) => {
          const mediaType = getMediaType(mediaItem);
          const mediaPath = getMediaPath(mediaItem);
          const mediaName = getMediaName(mediaItem);
          const mediaSize = getMediaSize(mediaItem);
          const mediaDuration = getMediaDuration(mediaItem);
          const mediaThumbnail = getMediaThumbnail(mediaItem);

          return (
            <div key={index} className="relative group">
              <div 
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
                onClick={() => handleMediaClick(index)}
              >
                {mediaType === 'video' ? (
                  <>
                    <img
                      src={mediaThumbnail}
                      alt={mediaName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    {/* Иконка воспроизведения */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Длительность видео */}
                    {mediaDuration && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {mediaDuration}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={mediaPath}
                    alt={mediaName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                )}
                
                {/* Fallback для ошибок загрузки */}
                <div className="hidden w-full h-full items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              {/* Информация о файле */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
                <div className="text-xs">
                  <div className="font-medium truncate">{mediaName}</div>
                  <div className="text-gray-300">
                    {mediaSize && `${mediaSize}`}
                    {mediaSize && mediaDuration && ' • '}
                    {mediaDuration && `${mediaDuration}`}
                  </div>
                </div>
              </div>

              {/* Кнопка удаления */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMedia(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Индикатор типа медиа */}
              <div className="absolute top-2 left-2">
                {mediaType === 'video' ? (
                  <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    ВИДЕО
                  </div>
                ) : (
                  <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    ФОТО
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно для просмотра */}
      {showModal && selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {getMediaName(media[selectedIndex])}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              {getMediaType(media[selectedIndex]) === 'video' ? (
                <video
                  controls
                  className="w-full max-h-96 object-contain"
                  src={getMediaPath(media[selectedIndex])}
                >
                  Ваш браузер не поддерживает видео.
                </video>
              ) : (
                <img
                  src={getMediaPath(media[selectedIndex])}
                  alt={getMediaName(media[selectedIndex])}
                  className="w-full max-h-96 object-contain"
                />
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Имя файла:</strong> {getMediaName(media[selectedIndex])}</p>
              <p><strong>Тип:</strong> {getMediaType(media[selectedIndex]) === 'video' ? 'Видео' : 'Изображение'}</p>
              {getMediaSize(media[selectedIndex]) && (
                <p><strong>Размер:</strong> {getMediaSize(media[selectedIndex])}</p>
              )}
              {getMediaDuration(media[selectedIndex]) && (
                <p><strong>Длительность:</strong> {getMediaDuration(media[selectedIndex])}</p>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

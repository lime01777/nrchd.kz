import React, { useState } from 'react';
import SafeImage from '../SafeImage';

/**
 * Менеджер медиа-файлов для выбора из библиотеки
 * Поддерживает изображения и видео
 */
export default function MediaManager({ 
  onSelect, 
  selectedMedia = [], 
  maxFiles = 10,
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Статические медиа-файлы для тестирования
  const staticMedia = [
    {
      name: 'placeholder.jpg',
      path: '/img/news/placeholder.jpg',
      size: '305 байт',
      type: 'image'
    },
    {
      name: '1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      path: '/img/news/1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      size: '269 KB',
      type: 'image'
    },
    {
      name: '3HKPGskY-wallha.com.png',
      path: '/img/news/3HKPGskY-wallha.com.png',
      size: '8.4 MB',
      type: 'image'
    },
    {
      name: 'mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      path: '/img/news/mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      size: '443 KB',
      type: 'image'
    },
    {
      name: 'placeholder-video.mp4',
      path: '/videos/news/placeholder-video.mp4',
      size: '1.2 KB',
      type: 'video'
    }
  ];

  const handleMediaSelect = (mediaItem) => {
    if (onSelect) {
      onSelect(mediaItem);
    }
    setIsOpen(false);
  };

  const isMediaSelected = (mediaItem) => {
    return selectedMedia.some(selected => 
      selected.path === mediaItem.path || selected === mediaItem.path
    );
  };

  const getMediaIcon = (type) => {
    return type === 'video' ? '🎥' : '🖼️';
  };

  return (
    <div className={className}>
      {/* Кнопка открытия менеджера */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        Выбрать из библиотеки
      </button>

      {/* Модальное окно с медиа */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Выберите медиа-файлы</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {staticMedia.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleMediaSelect(mediaItem)}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${isMediaSelected(mediaItem) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="aspect-square bg-gray-100">
                    {mediaItem.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎥</div>
                          <div className="text-xs text-gray-600">Видео</div>
                        </div>
                      </div>
                    ) : (
                      <SafeImage
                        src={mediaItem.path}
                        alt={mediaItem.name}
                        className="w-full h-full object-cover"
                        fallbackSrc="/img/placeholder.jpg"
                      />
                    )}
                  </div>

                  {/* Информация о файле */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                    <div className="text-xs">
                      <div className="font-medium truncate">{mediaItem.name}</div>
                      <div className="text-gray-300">{mediaItem.size}</div>
                    </div>
                  </div>

                  {/* Индикатор выбора */}
                  {isMediaSelected(mediaItem) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Индикатор типа медиа */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {getMediaIcon(mediaItem.type)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsOpen(false)}
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

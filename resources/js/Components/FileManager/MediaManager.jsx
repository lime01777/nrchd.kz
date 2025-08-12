import React, { useState, useRef } from 'react';

/**
 * Медиа менеджер для изображений и видео
 */
export default function MediaManager({ 
  onSelect, 
  selectedMedia = [], 
  className = '',
  maxFiles = 10
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('images'); // 'images' или 'videos'
  const fileInputRef = useRef(null);

  // Статические изображения для тестирования
  const staticImages = [
    {
      name: 'placeholder.jpg',
      path: '/storage/news/placeholder.jpg',
      size: '305 байт',
      type: 'image'
    },
    {
      name: '1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      path: '/storage/news/1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      size: '269 KB',
      type: 'image'
    },
    {
      name: '3HKPGskY-wallha.com.png',
      path: '/storage/news/3HKPGskY-wallha.com.png',
      size: '8.4 MB',
      type: 'image'
    },
    {
      name: 'mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      path: '/storage/news/mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      size: '443 KB',
      type: 'image'
    }
  ];

  // Статические видео для тестирования
  const staticVideos = [
    {
      name: 'presentation.mp4',
      path: '/videos/news/presentation.mp4',
      size: '15.2 MB',
      type: 'video',
      duration: '2:34',
      thumbnail: '/storage/news/video-thumbnail-1.jpg'
    },
    {
      name: 'interview.mp4',
      path: '/videos/news/interview.mp4',
      size: '8.7 MB',
      type: 'video',
      duration: '1:45',
      thumbnail: '/storage/news/video-thumbnail-2.jpg'
    }
  ];

  const handleMediaSelect = (media) => {
    if (onSelect) {
      onSelect(media);
    }
    setIsOpen(false);
  };

  const isMediaSelected = (media) => {
    return selectedMedia.some(selected => 
      selected.path === media.path || selected === media.path
    );
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (isVideo || isImage) {
        const media = {
          name: file.name,
          path: URL.createObjectURL(file),
          size: formatFileSize(file.size),
          type: isVideo ? 'video' : 'image',
          file: file,
          duration: isVideo ? '0:00' : null,
          thumbnail: isVideo ? '/storage/news/video-thumbnail-default.jpg' : null
        };
        
        handleMediaSelect(media);
      }
    });
    
    // Очищаем input
    event.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentMedia = () => {
    return activeTab === 'images' ? staticImages : staticVideos;
  };

  return (
    <div className={className}>
      {/* Кнопка открытия менеджера */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        Выбрать медиа из библиотеки
      </button>

      {/* Кнопка загрузки файлов */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mb-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        Загрузить файлы
      </button>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Модальное окно с медиа */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Выберите медиа</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Табы для переключения между изображениями и видео */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('images')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Изображения
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Видео
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {getCurrentMedia().map((media, index) => (
                <div
                  key={index}
                  onClick={() => handleMediaSelect(media)}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${isMediaSelected(media) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="aspect-square bg-gray-100">
                    {media.type === 'video' ? (
                      <>
                        <img
                                                     src={media.thumbnail || '/storage/news/video-thumbnail-default.jpg'}
                          alt={media.name}
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
                        {media.duration && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                            {media.duration}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <img
                          src={media.path}
                          alt={media.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Информация о файле */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                    <div className="text-xs">
                      <div className="font-medium truncate">{media.name}</div>
                      <div className="text-gray-300">{media.size}</div>
                    </div>
                  </div>

                  {/* Индикатор выбора */}
                  {isMediaSelected(media) && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
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

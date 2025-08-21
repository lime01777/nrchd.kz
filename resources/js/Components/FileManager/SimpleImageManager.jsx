import React, { useState } from 'react';
import SafeImage from '../SafeImage';

/**
 * Упрощенный файловый менеджер для изображений
 */
export default function SimpleImageManager({ 
  onSelect, 
  selectedImages = [], 
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Статические изображения для тестирования
  const staticImages = [
    {
      name: 'placeholder.jpg',
      path: '/img/news/placeholder.jpg',
      size: '305 байт'
    },
    {
      name: '1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      path: '/img/news/1700550154_pictures-pibig-info-p-gerb-kazakhstana-risunok-krasivo-67.jpg',
      size: '269 KB'
    },
    {
      name: '3HKPGskY-wallha.com.png',
      path: '/img/news/3HKPGskY-wallha.com.png',
      size: '8.4 MB'
    },
    {
      name: 'mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      path: '/img/news/mlPAlHD6wpdfvaksa4KgiaqUnrfz6Uez0kTC4IZS.jpg',
      size: '443 KB'
    }
  ];

  const handleImageSelect = (image) => {
    if (onSelect) {
      onSelect(image);
    }
    setIsOpen(false);
  };

  const isImageSelected = (image) => {
    return selectedImages.some(selected => 
      selected.path === image.path || selected === image.path
    );
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Выбрать изображения из библиотеки
      </button>

      {/* Модальное окно с изображениями */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Выберите изображения</h3>
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
              {staticImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageSelect(image)}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${isImageSelected(image) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="aspect-square bg-gray-100">
                    <SafeImage
                      src={image.path}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      fallbackSrc="/img/placeholder.jpg"
                    />
                  </div>

                  {/* Информация о файле */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                    <div className="text-xs">
                      <div className="font-medium truncate">{image.name}</div>
                      <div className="text-gray-300">{image.size}</div>
                    </div>
                  </div>

                  {/* Индикатор выбора */}
                  {isImageSelected(image) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
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

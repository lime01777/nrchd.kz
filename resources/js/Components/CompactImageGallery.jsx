import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Компактная галерея изображений для админки
 * Минимальное место, максимальная функциональность
 */
export default function CompactImageGallery({ 
  images = [], 
  setImages, 
  maxImages = 10,
  className = ''
}) {
  const [processedImages, setProcessedImages] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [selectedLibraryImages, setSelectedLibraryImages] = useState([]);
  const fileInputRef = useRef(null);

  // Обработка существующих изображений
  useEffect(() => {
    if (images && images.length > 0) {
      const processed = images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `existing-${index}-${img}`, // Более уникальный id
            url: img,
            name: `Изображение ${index + 1}`,
            type: 'url'
          };
        } else if (img instanceof File) {
          return {
            id: `file-${index}-${img.name}-${img.size}`, // Более уникальный id
            file: img,
            url: URL.createObjectURL(img),
            name: img.name,
            type: 'file'
          };
        }
        return null;
      }).filter(Boolean);
      setProcessedImages(processed);
    } else {
      setProcessedImages([]);
    }
    
    // Очистка URL объектов при размонтировании или изменении
    return () => {
      processedImages.forEach(img => {
        if (img.type === 'file' && img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  // Drag & Drop обработка
  const onDrop = useCallback((acceptedFiles) => {
    try {
      const validFiles = acceptedFiles.filter(file => 
        file.type.startsWith('image/') && file.size > 0
      );

      if (validFiles.length === 0) {
        console.warn('Нет корректных изображений для загрузки');
        return;
      }

      const currentImagesCount = images ? images.length : 0;
      const availableSlots = maxImages - currentImagesCount;
      
      if (availableSlots <= 0) {
        alert(`Достигнуто максимальное количество изображений: ${maxImages}`);
        return;
      }

      const filesToAdd = validFiles.slice(0, availableSlots);
      const updatedImages = images ? [...images, ...filesToAdd] : filesToAdd;
      
      console.log('CompactImageGallery: Добавление файлов', filesToAdd);
      setImages(updatedImages);
    } catch (error) {
      console.error('Ошибка при обработке файлов:', error);
    }
  }, [images, maxImages, setImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  // Загрузка библиотеки изображений
  const loadLibraryImages = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const response = await fetch('/api/library-images');
      if (response.ok) {
        const data = await response.json();
        setLibraryImages(data.images || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки библиотеки:', error);
      // Временная заглушка с тестовыми изображениями
      setLibraryImages([
        '/img/HeroImg/hero1.png',
        '/img/HeroImg/hero2.png',
        '/img/HeroImg/hero3.png',
        '/img/banner.png'
      ]);
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  // Открытие файлового диалога
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Открытие библиотеки
  const handleSelectClick = () => {
    setShowLibrary(true);
    setSelectedLibraryImages([]);
    loadLibraryImages();
  };

  // Обработка выбора файлов
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onDrop(files);
    // Сброс значения input для возможности выбора тех же файлов снова
    event.target.value = '';
  };

  // Удаление изображения
  const removeImage = (index) => {
    try {
      if (index < 0 || index >= images.length) {
        console.error('Неверный индекс изображения:', index);
        return;
      }

      // Очищаем URL объект если это файл
      const imageToRemove = images[index];
      if (imageToRemove instanceof File) {
        const processedImg = processedImages.find(img => img.file === imageToRemove);
        if (processedImg && processedImg.url) {
          URL.revokeObjectURL(processedImg.url);
        }
      }

      const updatedImages = images.filter((_, i) => i !== index);
      console.log('CompactImageGallery: Удаление изображения', index, updatedImages);
      setImages(updatedImages);
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  // Переключение выбора в библиотеке
  const toggleLibraryImage = (imageUrl) => {
    setSelectedLibraryImages(prev => 
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  // Добавление выбранных изображений из библиотеки
  const addSelectedLibraryImages = () => {
    try {
      if (selectedLibraryImages.length === 0) {
        setShowLibrary(false);
        return;
      }

      const currentUrls = images ? images.filter(img => typeof img === 'string') : [];
      const currentFiles = images ? images.filter(img => img instanceof File) : [];
      
      // Добавляем только те, которых еще нет
      const newImages = selectedLibraryImages.filter(url => !currentUrls.includes(url));
      const totalImages = currentUrls.length + currentFiles.length + newImages.length;
      
      if (totalImages <= maxImages) {
        const updatedImages = [...currentUrls, ...newImages, ...currentFiles];
        console.log('CompactImageGallery: Добавление из библиотеки', newImages);
        setImages(updatedImages);
        setShowLibrary(false);
        setSelectedLibraryImages([]);
      } else {
        alert(`Максимальное количество изображений: ${maxImages}. Можно добавить еще ${maxImages - (currentUrls.length + currentFiles.length)}`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении изображений из библиотеки:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Кнопки управления */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          Загрузить
        </button>
        
        <button
          type="button"
          onClick={handleSelectClick}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          Выбрать
        </button>
      </div>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag & Drop зона (только если нет изображений) */}
      {processedImages.length === 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите изображения сюда или нажмите кнопки выше'}
          </p>
        </div>
      )}

      {/* Компактный список изображений */}
      {processedImages.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Изображения ({processedImages.length}/{maxImages})
            </span>
            {processedImages.length < maxImages && (
              <div
                {...getRootProps()}
                className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <input {...getInputProps()} />
                + Добавить еще
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {processedImages.map((img, index) => (
              <div key={img.id} className="relative group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Кнопка удаления */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                
                {/* Номер изображения */}
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно библиотеки */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLibrary(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Выбрать из библиотеки</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {loadingLibrary ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto mb-4">
                  {libraryImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      onClick={() => toggleLibraryImage(imageUrl)}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedLibraryImages.includes(imageUrl)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={`Библиотека ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {selectedLibraryImages.includes(imageUrl) && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Выбрано: {selectedLibraryImages.length}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLibrary(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={addSelectedLibraryImages}
                      disabled={selectedLibraryImages.length === 0}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Добавить ({selectedLibraryImages.length})
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

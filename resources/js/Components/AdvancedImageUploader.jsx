import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import NewsSliderWithMain from './NewsSliderWithMain';

/**
 * Продвинутый компонент загрузки изображений для слайдера
 * Поддерживает drag & drop, выбор из папки, выбор из библиотеки, превью
 */
export default function AdvancedImageUploader({ 
  images = [], 
  setImages, 
  maxImages = 18 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef(null);

  // Обработка существующих изображений
  useEffect(() => {
    if (images && images.length > 0) {
      const processed = images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `existing-${index}`,
            url: img,
            name: `Изображение ${index + 1}`,
            size: 0,
            type: 'url'
          };
        } else if (img && typeof img === 'object' && img.url) {
          return {
            id: img.id || `existing-${index}`,
            url: img.url,
            name: img.name || `Изображение ${index + 1}`,
            size: img.size || 0,
            type: img.type || 'url'
          };
        } else {
          return {
            id: `file-${index}`,
            file: img,
            url: URL.createObjectURL(img),
            name: img.name,
            size: img.size,
            type: 'file'
          };
        }
      });
      setProcessedImages(processed);
    } else {
      setProcessedImages([]);
    }
  }, [images]);

  // Загрузка изображений из библиотеки
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
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  // Открытие библиотеки без автоматической загрузки
  const openLibrary = useCallback(() => {
    setShowLibrary(true);
    // Загружаем изображения только при открытии библиотеки с небольшой задержкой
    setTimeout(() => {
      loadLibraryImages();
    }, 100);
  }, [loadLibraryImages]);

  // Обработка drag & drop
  const onDrop = useCallback((acceptedFiles) => {
    console.log('AdvancedImageUploader - onDrop вызван:', acceptedFiles);
    
    const newFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      processedImages.length < maxImages
    );

    console.log('AdvancedImageUploader - отфильтрованные файлы:', newFiles);

    if (newFiles.length === 0) return;

    const newImageUrls = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: 'file'
    }));

    const updatedImages = [...processedImages, ...newImageUrls];
    setProcessedImages(updatedImages);
    
    // Обновляем родительский компонент
    const newImages = updatedImages.map(img => img.file || img.url);
    console.log('AdvancedImageUploader - обновляем родительский компонент:', newImages);
    setImages(newImages);
  }, [processedImages, maxImages, setImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled: processedImages.length >= maxImages
  });

  // Обработка выбора файлов через input
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onDrop(files);
    event.target.value = ''; // Сбрасываем input
  };

  // Выбор изображения из библиотеки
  const selectFromLibrary = (imageUrl) => {
    if (processedImages.length >= maxImages) return;

    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: imageUrl,
      name: `Изображение из библиотеки`,
      size: 0,
      type: 'url'
    };

    const updatedImages = [...processedImages, newImage];
    setProcessedImages(updatedImages);
    
    // Обновляем родительский компонент
    const newImages = updatedImages.map(img => img.file || img.url);
    setImages(newImages);
    
    setShowLibrary(false);
  };

  // Удаление изображения
  const removeImage = (imageId) => {
    const updatedImages = processedImages.filter(img => img.id !== imageId);
    setProcessedImages(updatedImages);
    
    // Обновляем родительский компонент
    const newImages = updatedImages.map(img => img.file || img.url);
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop зона */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${processedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите изображения сюда'}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium px-4 py-2 border border-blue-600 rounded hover:bg-blue-50"
                disabled={processedImages.length >= maxImages}
              >
                Выбрать файлы
              </button>
              <button
                type="button"
                onClick={openLibrary}
                className="text-green-600 hover:text-green-500 font-medium px-4 py-2 border border-green-600 rounded hover:bg-green-50"
                disabled={processedImages.length >= maxImages}
              >
                Из библиотеки
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Поддерживаемые форматы: JPG, PNG, GIF, WEBP (максимум {maxImages} файлов)
            </p>
            {processedImages.length > 0 && (
              <p className="text-xs text-gray-500">
                Загружено: {processedImages.length} / {maxImages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Список изображений */}
      {processedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Изображения для слайдера</h3>
            <div className="text-sm text-gray-500">
              {processedImages.length} из {maxImages}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {processedImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => removeImage(image.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>

                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate" title={image.name}>
                    {image.name}
                  </p>
                  {image.size > 0 && (
                    <p className="text-xs text-gray-400">
                      {(image.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Предварительный просмотр слайдера */}
      {processedImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-900">Предварительный просмотр слайдера</h3>
          <div className="h-48 rounded-lg overflow-hidden border">
            <NewsSliderWithMain
              images={processedImages.map(img => img.url)}
              className="h-48"
              height="192px"
              showDots={true}
              showCounter={true}
              autoPlay={true}
              interval={3000}
            />
          </div>
        </div>
      )}

      {/* Модальное окно библиотеки */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Выбор изображения из библиотеки</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {loadingLibrary ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2">Загрузка библиотеки...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {libraryImages.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectFromLibrary(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.name || `Изображение ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">
                        {image.name || `Изображение ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

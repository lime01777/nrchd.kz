import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import NewsSliderWithMain from './NewsSliderWithMain';

/**
 * Современный компонент загрузки изображений
 * Поддерживает drag & drop, выбор из папки, предварительный просмотр
 */
export default function ModernImageUploader({ 
  images = [], 
  setImages, 
  mainImage, 
  setMainImage, 
  maxImages = 18 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Преобразуем существующие изображения в нужный формат
  const [processedImages, setProcessedImages] = useState([]);

  useEffect(() => {
    // Обрабатываем существующие изображения только при изменении images
    if (images && images.length > 0) {
      const processed = images.map((img, index) => {
        if (typeof img === 'string') {
          // Если это URL строки
          return {
            id: `existing-${index}`,
            url: img,
            name: `Изображение ${index + 1}`,
            size: 0,
            type: 'url'
          };
        } else if (img && typeof img === 'object' && img.url) {
          // Если это уже объект с URL
          return {
            id: img.id || `existing-${index}`,
            url: img.url,
            name: img.name || `Изображение ${index + 1}`,
            size: img.size || 0,
            type: img.type || 'url'
          };
        } else {
          // Если это File объект
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

  // Обработка drag & drop
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      processedImages.length < maxImages
    );

    if (newFiles.length === 0) return;

    // Создаем URL для предварительного просмотра
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
    
    // Обновляем родительский компонент - передаем только файлы
    const newImages = updatedImages.map(img => img.file || img.url);
    setImages(newImages);

    // Если главное изображение не выбрано, устанавливаем первое
    if (!mainImage && newImageUrls.length > 0) {
      const firstImageUrl = newImageUrls[0].url;
      setMainImage(firstImageUrl);
    }
  }, [processedImages, setImages, mainImage, setMainImage, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxImages - processedImages.length,
    disabled: processedImages.length >= maxImages
  });

  // Обработка выбора файлов через кнопку
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onDrop(files);
  };

  // Удаление изображения
  const removeImage = (imageId) => {
    const updatedImages = processedImages.filter(img => img.id !== imageId);
    setProcessedImages(updatedImages);
    
    // Обновляем родительский компонент
    const newImages = updatedImages.map(img => img.file || img.url);
    setImages(newImages);
    
    // Если удаляем главное изображение, выбираем первое из оставшихся
    if (mainImage && !updatedImages.find(img => img.url === mainImage)) {
      const newMainImage = updatedImages.length > 0 ? updatedImages[0].url : null;
      setMainImage(newMainImage);
    }
  };

  // Установка главного изображения
  const setMainImageHandler = (imageUrl) => {
    setMainImage(imageUrl);
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop зона */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
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
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите изображения сюда'}
            </h3>
            <p className="text-sm text-gray-500">
              или{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={processedImages.length >= maxImages}
              >
                выберите файлы
              </button>
            </p>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Загруженные изображения</h3>
            <div className="text-sm text-gray-500">
              {processedImages.length} из {maxImages}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {processedImages.map((image, index) => (
              <div
                key={image.id}
                className={`
                  relative group border rounded-lg overflow-hidden bg-white shadow-sm
                  ${mainImage === image.url ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
                  transition-all duration-200
                `}
              >
                {/* Изображение */}
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                  
                  {/* Overlay при наведении */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2">
                      <button
                        onClick={() => setMainImageHandler(image.url)}
                        className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
                      >
                        {mainImage === image.url ? 'Главное' : 'Сделать главным'}
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  {/* Индикатор главного изображения */}
                  {mainImage === image.url && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Главное
                    </div>
                  )}

                  {/* Номер изображения */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>

                {/* Информация о файле */}
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Предварительный просмотр слайдера</h3>
          <div className="h-64 rounded-lg overflow-hidden border">
            <NewsSliderWithMain
              images={processedImages.map(img => img.url)}
              mainImage={mainImage}
              className="h-64"
              height="256px"
              showDots={true}
              showCounter={true}
              autoPlay={true}
              interval={3000}
            />
          </div>
        </div>
      )}

      {/* Информация о главном изображении */}
      {mainImage && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-blue-700">
              Главное изображение выбрано. Оно будет отображаться первым в слайдере.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

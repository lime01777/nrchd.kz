import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import FileManager from './FileManager';

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
  const [showFileManager, setShowFileManager] = useState(false);
  const fileInputRef = useRef(null);

  // Обработка существующих изображений
  useEffect(() => {
    // Очищаем предыдущие URL объекты перед созданием новых
    processedImages.forEach(img => {
      if (img.type === 'file' && img.url && img.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(img.url);
        } catch (error) {
          console.warn('Ошибка при очистке URL объекта:', error);
        }
      }
    });

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
          try {
            return {
              id: `file-${index}-${img.name}-${img.size}`, // Более уникальный id
              file: img,
              url: URL.createObjectURL(img),
              name: img.name,
              type: 'file'
            };
          } catch (error) {
            console.error('Ошибка при создании URL объекта для файла:', img.name, error);
            return null;
          }
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
        if (img.type === 'file' && img.url && img.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(img.url);
          } catch (error) {
            console.warn('Ошибка при очистке URL объекта при размонтировании:', error);
          }
        }
      });
    };
  }, [images]);

  // Drag & Drop обработка
  const onDrop = useCallback((acceptedFiles) => {
    try {
      const maxFileSize = 5 * 1024 * 1024; // 5MB максимум
      
      const validFiles = acceptedFiles.filter(file => {
        if (!file.type.startsWith('image/') || file.size === 0) {
          return false;
        }
        
        if (file.size > maxFileSize) {
          alert(`Файл "${file.name}" слишком большой. Максимальный размер: 5MB`);
          return false;
        }
        
        return true;
      });

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



  // Открытие файлового диалога
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Открытие файлового менеджера
  const handleSelectClick = () => {
    setShowFileManager(true);
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

  // Обработка выбора изображений из файлового менеджера
  const handleFileManagerSelect = (selectedImages) => {
    try {
      const imagesArray = Array.isArray(selectedImages) ? selectedImages : [selectedImages];
      
      if (imagesArray.length === 0) {
        setShowFileManager(false);
        return;
      }

      const currentUrls = images ? images.filter(img => typeof img === 'string') : [];
      const currentFiles = images ? images.filter(img => img instanceof File) : [];
      
      // Добавляем только те, которых еще нет
      const newImages = imagesArray.filter(img => !currentUrls.includes(img.url));
      
      if (newImages.length === 0) {
        setShowFileManager(false);
        return;
      }

      const currentImagesCount = images ? images.length : 0;
      const availableSlots = maxImages - currentImagesCount;
      
      if (availableSlots <= 0) {
        alert(`Достигнуто максимальное количество изображений: ${maxImages}`);
        setShowFileManager(false);
        return;
      }

      const imagesToAdd = newImages.slice(0, availableSlots).map(img => img.url);
      const updatedImages = images ? [...images, ...imagesToAdd] : imagesToAdd;
      
      console.log('CompactImageGallery: Добавление из файлового менеджера', imagesToAdd);
      setImages(updatedImages);
      setShowFileManager(false);
    } catch (error) {
      console.error('Ошибка при добавлении из файлового менеджера:', error);
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

      {/* Файловый менеджер */}
      {showFileManager && (
        <FileManager
          onSelect={handleFileManagerSelect}
          onClose={() => setShowFileManager(false)}
          multiple={true}
          initialPath="/storage/news"
          allowedExtensions={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
        />
      )}
    </div>
  );
}

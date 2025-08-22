import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import SafeImage from './SafeImage';
import SafeVideo from './SafeVideo';
import { 
  isValidImageFile, 
  isValidVideoFile,
  isValidImageUrl, 
  isValidVideoUrl,
  createSafeObjectURL, 
  revokeSafeObjectURL 
} from '../Utils/mediaUtils';

/**
 * Современный компонент загрузки медиа-файлов (изображения и видео)
 * Поддерживает drag & drop, выбор из папки, предварительный просмотр
 */
export default function ModernMediaUploader({ 
  media = [], 
  setMedia, 
  maxFiles = 10,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [processedMedia, setProcessedMedia] = useState([]);
  const fileInputRef = useRef(null);

  // Обработка существующих медиа-файлов
  useEffect(() => {
    // Очищаем предыдущие URL объекты перед созданием новых
    processedMedia.forEach(item => {
      if (item.type === 'file' && item.url) {
        revokeSafeObjectURL(item.url);
      }
    });

    if (media && media.length > 0) {
      const processed = media.map((item, index) => {
        if (typeof item === 'string') {
          // Если это URL строка
          const isVideo = isValidVideoUrl(item);
          return {
            id: `existing-${index}`,
            url: item,
            name: `Медиа ${index + 1}`,
            size: 0,
            type: 'url',
            mediaType: isVideo ? 'video' : 'image'
          };
        } else if (item && typeof item === 'object' && item.url) {
          // Если это уже объект с URL
          const isVideo = isValidVideoUrl(item.url);
          return {
            id: item.id || `existing-${index}`,
            url: item.url,
            name: item.name || `Медиа ${index + 1}`,
            size: item.size || 0,
            type: item.type || 'url',
            mediaType: isVideo ? 'video' : 'image'
          };
        } else if (item instanceof File) {
          // Если это File объект
          const isVideo = isValidVideoFile(item);
          console.log('ModernMediaUploader - обработка существующего файла:', {
            name: item.name,
            type: item.type,
            size: item.size,
            isVideo: isVideo,
            isValidImage: isValidImageFile(item)
          });
          
          const objectUrl = createSafeObjectURL(item);
          if (objectUrl) {
            return {
              id: `file-${index}`,
              file: item,
              url: objectUrl,
              name: item.name,
              size: item.size,
              type: 'file',
              mediaType: isVideo ? 'video' : 'image'
            };
          }
        }
        return null;
      }).filter(Boolean);

      setProcessedMedia(processed);
    } else {
      setProcessedMedia([]);
    }

    // Очистка ресурсов при размонтировании компонента
    return () => {
      processedMedia.forEach(item => {
        if (item.type === 'file' && item.url) {
          revokeSafeObjectURL(item.url);
        }
      });
    };
  }, [media]);

  // Обработка drag & drop
  const onDrop = useCallback((acceptedFiles) => {
    try {
      // Фильтруем только валидные медиа-файлы
      const validFiles = acceptedFiles.filter(file => {
        const isValidImage = isValidImageFile(file);
        const isValidVideo = isValidVideoFile(file);
        return (isValidImage || isValidVideo) && processedMedia.length < maxFiles;
      });

      if (validFiles.length === 0) {
        console.warn('Нет валидных медиа-файлов для загрузки');
        return;
      }

      // Создаем URL для предварительного просмотра
      const newMediaUrls = validFiles.map(file => {
        const isVideo = isValidVideoFile(file);
        console.log('ModernMediaUploader - определение типа файла:', {
          name: file.name,
          type: file.type,
          size: file.size,
          isVideo: isVideo,
          isValidImage: isValidImageFile(file)
        });
        
        const objectUrl = createSafeObjectURL(file);
        if (objectUrl) {
          return {
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: objectUrl,
            name: file.name,
            size: file.size,
            type: 'file',
            mediaType: isVideo ? 'video' : 'image'
          };
        }
        return null;
      }).filter(Boolean);

      if (newMediaUrls.length === 0) {
        console.warn('Не удалось создать URL объекты для файлов');
        return;
      }

      const updatedMedia = [...processedMedia, ...newMediaUrls];
      setProcessedMedia(updatedMedia);
      
      // Обновляем родительский компонент - передаем файлы с информацией о типе
      const newMedia = updatedMedia.map(item => {
        if (item.file) {
          // Для файлов добавляем информацию о типе медиа
          const mediaItem = item.file;
          mediaItem.mediaType = item.mediaType; // Добавляем тип медиа к файлу
          return mediaItem;
        }
        return item.url;
      });
      
      console.log('ModernMediaUploader - передаем медиа родителю:', newMedia.map(item => ({
        type: typeof item,
        isFile: item instanceof File,
        name: item?.name,
        mimeType: item?.type,
        mediaType: item?.mediaType
      })));
      
      setMedia(newMedia);
    } catch (error) {
      console.error('Ошибка при обработке файлов:', error);
    }
  }, [processedMedia, setMedia, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    },
    maxFiles: maxFiles - processedMedia.length,
    disabled: processedMedia.length >= maxFiles
  });

  // Обработка выбора файлов через кнопку
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onDrop(files);
  };

  // Удаление медиа-файла
  const removeMedia = (mediaId) => {
    // Находим медиа для удаления
    const mediaToRemove = processedMedia.find(item => item.id === mediaId);
    
    // Очищаем URL объект если это файл
    if (mediaToRemove && mediaToRemove.type === 'file' && mediaToRemove.url) {
      revokeSafeObjectURL(mediaToRemove.url);
    }

    const updatedMedia = processedMedia.filter(item => item.id !== mediaId);
    setProcessedMedia(updatedMedia);
    
    // Обновляем родительский компонент - передаем файлы с информацией о типе
    const newMedia = updatedMedia.map(item => {
      if (item.file) {
        // Для файлов добавляем информацию о типе медиа
        const mediaItem = item.file;
        mediaItem.mediaType = item.mediaType; // Добавляем тип медиа к файлу
        return mediaItem;
      }
      return item.url;
    });
    
    console.log('ModernMediaUploader - удаление медиа, передаем родителю:', newMedia.map(item => ({
      type: typeof item,
      isFile: item instanceof File,
      name: item?.name,
      mimeType: item?.type,
      mediaType: item?.mediaType
    })));
    
    setMedia(newMedia);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Drag & Drop зона */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${processedMedia.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
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
              {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите медиа-файлы сюда'}
            </h3>
            <p className="text-sm text-gray-500">
              или{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={processedMedia.length >= maxFiles}
              >
                выберите файлы
              </button>
            </p>
            <p className="text-xs text-gray-400">
              Поддерживаемые форматы: JPG, PNG, GIF, WEBP, MP4, AVI, MOV, WMV, FLV, WEBM (максимум {maxFiles} файлов)
            </p>
            {processedMedia.length > 0 && (
              <p className="text-xs text-gray-500">
                Загружено: {processedMedia.length} / {maxFiles}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Список медиа-файлов */}
      {processedMedia.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Загруженные медиа-файлы</h3>
            <div className="text-sm text-gray-500">
              {processedMedia.length} из {maxFiles}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {processedMedia.map((item, index) => (
              <div
                key={item.id}
                className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                                 {/* Медиа-файл */}
                 <div className="aspect-square relative">
                   {item.mediaType === 'video' ? (
                     <SafeVideo
                       src={item.url}
                       className="w-full h-full object-cover"
                       muted
                       fallbackContent={
                         <div className="w-full h-full flex items-center justify-center bg-gray-200">
                           <div className="text-center">
                             <div className="text-4xl mb-2">🎥</div>
                             <div className="text-xs text-gray-600">Видео недоступно</div>
                           </div>
                         </div>
                       }
                     />
                   ) : (
                     <SafeImage
                       src={item.url}
                       alt={item.name}
                       className="w-full h-full object-cover"
                       fallbackSrc="/img/placeholder.jpg"
                     />
                   )}
                  
                  {/* Overlay при наведении */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => removeMedia(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  {/* Индикатор типа медиа */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {item.mediaType === 'video' ? '🎥' : '🖼️'}
                  </div>

                  {/* Номер файла */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>

                {/* Информация о файле */}
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate" title={item.name}>
                    {item.name}
                  </p>
                  {item.size > 0 && (
                    <p className="text-xs text-gray-400">
                      {(item.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {item.mediaType === 'video' ? 'Видео' : 'Изображение'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

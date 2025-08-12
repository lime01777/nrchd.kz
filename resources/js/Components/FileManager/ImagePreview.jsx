import React, { useState, useEffect } from 'react';

/**
 * Компонент для предварительного просмотра изображений в файловом менеджере
 */
export default function ImagePreview({ 
  file, 
  onSelect, 
  isSelected = false,
  className = '' 
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Функция для преобразования путей к изображениям
  const transformImagePath = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return imagePath;
    
    const trimmedPath = imagePath.trim();
    
    // Если это уже полный URL, оставляем как есть
    if (trimmedPath.startsWith('http')) {
      return trimmedPath;
    }
    
    // Если это старый путь к storage, преобразуем в новый путь к img
    if (trimmedPath.startsWith('/storage/news/')) {
      return trimmedPath.replace('/storage/news/', '/img/news/');
    }
    
    // Если это новый путь к img, оставляем как есть
    if (trimmedPath.startsWith('/img/news/')) {
      return trimmedPath;
    }
    
    // Если это относительный путь без /storage/ или /img/, добавляем /img/news/
    if (trimmedPath.startsWith('/') && !trimmedPath.startsWith('/storage/') && !trimmedPath.startsWith('/img/')) {
      return `/img/news${trimmedPath}`;
    }
    
    // Если это просто имя файла, добавляем путь к новостям
    if (!trimmedPath.startsWith('/')) {
      return `/img/news/${trimmedPath}`;
    }
    
    return trimmedPath;
  };

  useEffect(() => {
    if (!file) return;

    // Если это URL (строка)
    if (typeof file === 'string') {
      setPreview(transformImagePath(file));
      setLoading(false);
      return;
    }

    // Если это File объект
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setLoading(false);
      };
      reader.onerror = () => {
        setError(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(file);
    }
  };

  const getFileInfo = () => {
    if (typeof file === 'string') {
      return {
        name: file.split('/').pop(),
        size: 'N/A',
        type: 'image'
      };
    }
    
    if (file instanceof File) {
      return {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type
      };
    }

    return { name: 'Unknown', size: 'N/A', type: 'unknown' };
  };

  const fileInfo = getFileInfo();

  return (
    <div 
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Изображение */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span className="text-xs">Ошибка загрузки</span>
          </div>
        )}
        
        {preview && !loading && !error && (
          <img
            src={preview}
            alt={fileInfo.name}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        )}
      </div>

      {/* Информация о файле */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <div className="text-xs">
          <div className="font-medium truncate">{fileInfo.name}</div>
          <div className="text-gray-300">{fileInfo.size}</div>
        </div>
      </div>

      {/* Индикатор выбора */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Overlay при наведении */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

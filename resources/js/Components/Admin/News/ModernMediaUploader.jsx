import React, { useState, useCallback } from 'react';

export default function ModernMediaUploader({ 
  existingMedia = [], 
  onMediaUploaded, 
  onMediaRemoved, 
  maxFiles = 20,
  className = '' 
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      // Создаем FormData для загрузки файлов
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`media_files[${index}]`, file);
      });

      // Загружаем файлы на сервер
      const response = await fetch('/admin/news/upload-media', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки файлов');
      }

      const result = await response.json();
      
      if (onMediaUploaded && result.success && result.media) {
        onMediaUploaded(result.media);
      }
    } catch (error) {
      console.error('Ошибка загрузки медиа:', error);
      alert('Ошибка загрузки файлов: ' + error.message);
    } finally {
      setUploading(false);
    }
  }, [onMediaUploaded]);

  const handleRemove = (mediaId) => {
    if (onMediaRemoved) {
      onMediaRemoved(mediaId);
    }
  };

  return (
    <div className={className}>
      {/* Зона загрузки */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer border-gray-300 hover:border-gray-400">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Нажмите для выбора файлов
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Поддерживаются изображения и видео до 50MB
            </p>
          </div>
        </label>
      </div>

      {/* Список загруженных файлов */}
      {existingMedia.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Загруженные файлы:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {existingMedia.map((media, index) => (
              <div key={media.id || `media-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {media.type === 'video' ? (
                    <video
                      src={media.path}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={media.path}
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Индикатор загрузки */}
                {media.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">Загрузка...</div>
                  </div>
                )}
                
                {/* Кнопка удаления */}
                <button
                  type="button"
                  onClick={() => handleRemove(media.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                
                {/* Название файла */}
                <div className="mt-1 text-xs text-gray-600 truncate">
                  {media.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
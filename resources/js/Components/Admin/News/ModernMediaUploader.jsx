import React, { useState, useCallback } from 'react';

export default function ModernMediaUploader({ 
  existingMedia = [], 
  onMediaUploaded, 
  onMediaRemoved, 
  maxFiles = 20,
  className = '' 
}) {
  const [uploading, setUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalError, setExternalError] = useState('');

  const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `external-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const detectExternalMedia = useCallback((rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return { error: 'Укажите ссылку на внешний ресурс' };
    }

    const trimmed = rawUrl.trim();

    let parsedUrl;
    try {
      parsedUrl = new URL(trimmed);
    } catch (_error) {
      return { error: 'Некорректная ссылка. Проверьте адрес.' };
    }

    const url = parsedUrl.toString();
    const lower = url.toLowerCase();

    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return {
        type: 'video',
        provider: 'youtube',
        url,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        name: 'YouTube видео',
      };
    }

    const instagramMatch = url.match(/instagram\.com\/(p|reel|tv)\/([^/?&]+)/i);
    if (instagramMatch) {
      const resourceType = instagramMatch[1];
      const resourceId = instagramMatch[2];
      return {
        type: 'video',
        provider: 'instagram',
        url,
        embedUrl: `https://www.instagram.com/${resourceType}/${resourceId}/embed/`,
        name: 'Instagram видео',
      };
    }

    if (lower.includes('aitube.kz') || lower.includes('aitube.com') || lower.includes('aitu.kz')) {
      return {
        type: 'video',
        provider: 'aitube',
        url,
        embedUrl: url,
        name: 'Aitu видео',
      };
    }

    if (lower.match(/\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/)) {
      return {
        type: 'image',
        provider: 'external',
        url,
        embedUrl: null,
        name: 'Внешнее изображение',
      };
    }

    return {
      type: 'video',
      provider: 'external',
      url,
      embedUrl: url,
      name: 'Внешнее видео',
    };
  }, []);

  const handleFileSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) {
      return;
    }

    const availableSlots = Math.max(0, maxFiles - existingMedia.length);
    if (availableSlots <= 0) {
      alert(`Достигнут лимит файлов (${maxFiles}). Удалите лишние медиа, чтобы загрузить новые.`);
      event.target.value = '';
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (filesToUpload.length === 0) {
      event.target.value = '';
      return;
    }

    setUploading(true);
    
    try {
      // Создаем FormData для загрузки файлов
      const formData = new FormData();
      filesToUpload.forEach((file, index) => {
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
      event.target.value = '';
    }
  }, [existingMedia.length, maxFiles, onMediaUploaded]);

  const handleExternalSubmit = useCallback(() => {
    if (existingMedia.length >= maxFiles) {
      setExternalError(`Достигнут лимит файлов (${maxFiles}). Удалите лишние медиа, чтобы добавить новые ссылки.`);
      return;
    }

    const parsed = detectExternalMedia(externalUrl);
    if (parsed.error) {
      setExternalError(parsed.error);
      return;
    }

    const newMedia = {
      id: generateId(),
      type: parsed.type === 'image' ? 'image' : 'video',
      path: parsed.url,
      url: parsed.url,
      embed_url: parsed.embedUrl,
      provider: parsed.provider,
      source: 'external',
      is_external: true,
      is_embed: Boolean(parsed.embedUrl && parsed.embedUrl !== parsed.url),
      name: parsed.name || 'Внешний ресурс',
      position: existingMedia.length,
      thumbnail: parsed.thumbnail || null,
    };

    if (onMediaUploaded) {
      onMediaUploaded([newMedia]);
    }

    setExternalUrl('');
    setExternalError('');
  }, [detectExternalMedia, existingMedia.length, externalUrl, maxFiles, onMediaUploaded]);

  const handleExternalKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleExternalSubmit();
    }
  }, [handleExternalSubmit]);

  const remainingSlots = Math.max(0, maxFiles - existingMedia.length);
  const uploadDisabled = uploading || remainingSlots <= 0;

  const handleRemove = (mediaId) => {
    if (onMediaRemoved) {
      onMediaRemoved(mediaId);
    }
  };

  return (
    <div className={className}>
      {/* Зона загрузки */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploadDisabled ? 'cursor-not-allowed opacity-60 border-gray-200' : 'cursor-pointer border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
          disabled={uploadDisabled}
        />
        <label
          htmlFor="media-upload"
          className={uploadDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        >
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
            <p className="mt-2 text-xs text-gray-400">
              Осталось {remainingSlots} из {maxFiles} файлов
            </p>
          </div>
        </label>
      </div>

      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          Или вставьте ссылку на внешнее видео: поддерживаются YouTube, Instagram, Aitube и прямые ссылки на файлы.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={externalUrl}
            onChange={(event) => {
              setExternalUrl(event.target.value);
              if (externalError) {
                setExternalError('');
              }
            }}
            onKeyDown={handleExternalKeyDown}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={handleExternalSubmit}
            disabled={uploadDisabled || externalUrl.trim() === ''}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Добавить ссылку
          </button>
        </div>
        {externalError && (
          <p className="mt-2 text-xs text-red-500">
            {externalError}
          </p>
        )}
      </div>

      {/* Список загруженных файлов */}
      {existingMedia.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Загруженные файлы:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {existingMedia.map((media, index) => {
              const displayName = media.name || media.provider || 'Медиа';
              const mediaUrl = media.embed_url || media.url || media.path;
              const originalUrl = media.url || media.path;
              const thumbnail = media.thumbnail || (media.type === 'image' ? mediaUrl : null);
              const isExternal = Boolean(media.is_external);
              const isEmbed = Boolean(media.is_embed && media.embed_url);
              const providerLabel = media.provider ? media.provider.toUpperCase() : null;

              return (
                <div key={media.id || `media-${index}`} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {media.type === 'video' ? (
                      isEmbed ? (
                        <iframe
                          src={media.embed_url || mediaUrl}
                          title={displayName}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={mediaUrl}
                          poster={thumbnail || undefined}
                          className="w-full h-full object-cover"
                          muted
                          controls
                        />
                      )
                    ) : (
                      <img
                        src={thumbnail || originalUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {providerLabel && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {providerLabel}
                    </span>
                  )}
                  {isExternal && !isEmbed && media.type === 'video' && (
                    <span className="absolute left-1.5 bottom-1.5 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Ссылка
                    </span>
                  )}
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
                    {displayName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
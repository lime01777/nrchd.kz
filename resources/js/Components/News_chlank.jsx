import React, { useMemo } from 'react'
import { Link } from '@inertiajs/react';
import NewsSliderWithMain from './NewsSliderWithMain';
import SafeVideo from './SafeVideo';
import { isValidVideoUrl } from '../Utils/mediaUtils';
import translationService from '@/services/TranslationService';

const News_chlank = React.memo(({ date, description, slug, image, images = [], external_url, type }) => {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  // Мемоизируем обработку изображений, чтобы массив не пересоздавался при каждом рендере
  const imageOnlyImages = useMemo(() => {
    const rawImages = images && images.length > 0 ? images : (image ? [image] : []);
    const normalizedImages = rawImages
      .map((img) => {
        if (!img) return null;
        if (typeof img === 'string') {
          return img;
        }
        if (typeof img === 'object') {
          return img.url || img.path || null;
        }
        return null;
      })
      .filter(Boolean);

    return normalizedImages.filter((src) => !isValidVideoUrl(src));
  }, [images, image]);

  // Мемоизируем обработку видео
  const videoItems = useMemo(() => {
    const rawMedia = images && images.length > 0 ? images : (image ? [image] : []);
    const normalizedVideos = rawMedia
      .map((item) => {
        if (!item) return null;
        
        // Если это строка, проверяем, является ли она видео
        if (typeof item === 'string') {
          if (isValidVideoUrl(item)) {
            return {
              src: item,
              url: item,
              embed_url: null,
              is_external: item.startsWith('http'),
              is_embed: false
            };
          }
          return null;
        }
        
        // Если это объект, проверяем тип и извлекаем данные
        if (typeof item === 'object') {
          const url = item.url || item.path || null;
          if (!url) return null;
          
          // Проверяем, является ли это видео
          if (item.type === 'video' || isValidVideoUrl(url)) {
            return {
              src: item.embed_url || url,
              url: url,
              embed_url: item.embed_url || null,
              is_external: Boolean(item.is_external || url.startsWith('http')),
              is_embed: Boolean(item.is_embed || item.embed_url),
              thumbnail: item.thumbnail || null
            };
          }
        }
        
        return null;
      })
      .filter(Boolean);

    return normalizedVideos;
  }, [images, image]);

  // Создаём стабильный ключ для слайдера на основе изображений
  const sliderKey = useMemo(() => {
    return imageOnlyImages.join('|');
  }, [imageOnlyImages]);
  
  // Определяем, является ли это публикацией из СМИ
  const isMediaPublication = type === 'media' && external_url;
  
  // Определяем URL для перехода
  const newsUrl = isMediaPublication ? external_url : (slug ? route('news.show', slug) : null);
  
  // Компонент кнопки "Читать новость"
  const ReadButton = () => {
    const buttonContent = (
      <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200 pointer-events-none">
        {t('common.readNews', 'Читать новость')}
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
            strokeWidth="2" className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </span>
    );
    
    // Если вся карточка кликабельна, кнопка просто декоративная
    if (newsUrl) {
      return buttonContent;
    }
    
    // Если нет URL, кнопка неактивна
    return buttonContent;
  };
  
  // Содержимое карточки
  const cardContent = (
    <>
        {/* Отображение медиа (видео или изображения) - уменьшенное */}
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative group">
          {videoItems.length > 0 ? (
            // Если есть видео, показываем первое видео
            (() => {
              const firstVideo = videoItems[0];
              // Если это внешнее видео с embed (YouTube и т.д.), показываем iframe
              if (firstVideo.is_external && firstVideo.is_embed && firstVideo.embed_url) {
                return (
                  <div className="w-full h-full relative">
                    <iframe
                      src={firstVideo.embed_url}
                      title={description}
                      className="w-full h-full object-contain"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                );
              }
              // Если это обычное видео, показываем через SafeVideo
              return (
                <div className="w-full h-full relative">
                  <SafeVideo
                    src={firstVideo.src || firstVideo.url}
                    className="w-full h-full object-contain"
                    controls={false}
                    muted
                    playsInline
                    poster={firstVideo.thumbnail}
                  />
                  {/* Иконка видео поверх */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-60 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : imageOnlyImages.length > 0 ? (
            <div className="w-full h-full">
              <NewsSliderWithMain 
                key={sliderKey}
                images={imageOnlyImages}
                className="w-full h-full"
                height="100%"
                showDots={true}
                showCounter={false}
                autoPlay={true}
                interval={3000}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          {/* Градиентный оверлей при наведении */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Контент карточки - упрощенный, только заголовок */}
        <div className="flex flex-col p-4 bg-white flex-shrink-0">
            <div className="flex flex-col">
                {/* Заголовок - только первые три строки */}
                <h2 className="text-gray-900 text-sm font-semibold line-clamp-3" title={description}>
                    {description}
                </h2>
            </div>
        </div>
    </>
  );
  
  // Обработчик клика для предотвращения зависания
  const handleClick = React.useCallback((e) => {
    // Предотвращаем всплытие события только для интерактивных элементов
    const target = e.target;
    // Если клик на кнопке, ссылке или внутри iframe/video, не обрабатываем
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.closest('a') ||
      target.tagName === 'IFRAME' ||
      target.tagName === 'VIDEO' ||
      target.closest('iframe') ||
      target.closest('video')
    ) {
      e.stopPropagation();
      return;
    }
    // Для остальных случаев позволяем Inertia обработать переход
  }, []);

  // Если есть URL, делаем всю карточку кликабельной
  if (newsUrl) {
    if (isMediaPublication) {
      return (
        <a 
          href={newsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
          onClick={handleClick}
        >
          {cardContent}
        </a>
      );
    }
    
    return (
      <Link 
        href={newsUrl}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
        onClick={handleClick}
        preserveScroll={true}
      >
        {cardContent}
      </Link>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden border border-gray-100">
      {cardContent}
    </div>
  )
});

News_chlank.displayName = 'News_chlank';

export default News_chlank
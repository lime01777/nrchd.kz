import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import SafeImage from './SafeImage';
import SafeVideo from './SafeVideo';
import translationService from '@/services/TranslationService';

/**
 * Полноэкранное модальное окно для просмотра медиа.
 *
 * Показывает крупное изображение/видео, управление слайдером и мини-превью.
 */
export default function MediaLightbox({
  media = [],
  initialIndex = 0,
  onClose,
}) {
  // Функция перевода
  const t = (key, fallback = '') => {
    try {
      return translationService.t(key, fallback);
    } catch (error) {
      return fallback;
    }
  };

  // Сохраняем текущий индекс выбранного медиа
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // При смене initialIndex обновляем состояние (например, открытие по клику)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Безопасное закрытие с гарантированным восстановлением прокрутки
  const handleClose = useCallback(() => {
    try {
      // Принудительно восстанавливаем прокрутку
      if (document.body) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      
      // Вызываем callback закрытия
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error closing lightbox:', error);
      // В любом случае восстанавливаем прокрутку
      if (document.body) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }
  }, [onClose]);

  // Нормализуем список медиа и кешируем, чтобы не пересчитывать лишний раз
  const normalizedMedia = useMemo(() => {
    return (media || []).filter(Boolean);
  }, [media]);

  // Обработчик перехода к предыдущему элементу
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? normalizedMedia.length - 1 : prev - 1,
    );
  }, [normalizedMedia.length]);

  // Обработчик перехода к следующему элементу
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % normalizedMedia.length);
  }, [normalizedMedia.length]);

  // Обработчик выбора конкретного элемента из миниатюр
  const handleSelect = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Блокировка прокрутки при монтировании
  useEffect(() => {
    if (!document.body) return;

    // Сохраняем оригинальные значения
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Получаем ширину скроллбара
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Блокируем прокрутку и компенсируем скроллбар
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Очистка при размонтировании - ВСЕГДА восстанавливаем прокрутку
    return () => {
      if (document.body) {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.paddingRight = originalPaddingRight || '';
      }
    };
  }, []); // Запускается только при монтировании/размонтировании

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, handleNext, handlePrevious]);

  if (typeof document === 'undefined') {
    return null;
  }

  const currentMedia = normalizedMedia[currentIndex];

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        // Закрываем лайтбокс при клике на фон
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Шапка модального окна */}
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wider text-white/80">
            {t('components.mediaLightbox.mediaFiles', 'Медиафайлы')}
          </span>
          <span className="text-lg font-semibold">
            {currentMedia?.name || `${t('components.mediaLightbox.media', 'Медиа')} ${currentIndex + 1}`}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          {t('components.mediaLightbox.close', 'Закрыть')}
        </button>
      </div>

      {/* Основная область просмотра */}
      <div 
        className="relative flex flex-1 items-center justify-center px-6 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          aria-label={t('components.mediaLightbox.previous', 'Предыдущий')}
        >
          ‹
        </button>

        <div className="flex h-full w-full max-w-7xl items-center justify-center px-4">
          {currentMedia?.type === 'video' ? (
            currentMedia.is_embed && (currentMedia.embed_url || currentMedia.path || currentMedia.url) ? (
              <iframe
                key={currentMedia.id || `embed-${currentIndex}`}
                src={currentMedia.embed_url || currentMedia.path || currentMedia.url}
                title={currentMedia.name || 'Видео'}
                className="h-full w-full max-h-[85vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <SafeVideo
                key={currentMedia.path || currentMedia.url || currentMedia.id || `video-${currentIndex}`}
                src={currentMedia.path || currentMedia.url || currentMedia.src}
                className="h-full w-full max-h-[85vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                controls
                autoPlay
                playsInline
                preload="auto"
              />
            )
          ) : (
            <SafeImage
              src={currentMedia?.path || currentMedia?.url}
              alt={currentMedia?.name || t('components.mediaLightbox.image', 'Изображение')}
              className="max-h-[85vh] w-auto h-auto rounded-xl border border-white/10 object-contain shadow-2xl"
              style={{ maxWidth: '100%' }}
            />
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          aria-label={t('components.mediaLightbox.next', 'Следующий')}
        >
          ›
        </button>
      </div>

      {/* Нижняя панель с миниатюрами */}
      {normalizedMedia.length > 1 && (
        <div className="border-t border-white/10 bg-black/70 px-6 py-4">
          <div className="flex items-center justify-between pb-2 text-xs uppercase tracking-wide text-white/60">
            <span>
              {currentIndex + 1} / {normalizedMedia.length}
            </span>
            <span className="text-white/50">{t('components.mediaLightbox.selectMedia', 'Выберите медиа для просмотра')}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {normalizedMedia.map((item, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  type="button"
                  key={item.id || `thumb-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(index);
                  }}
                  className={`relative flex h-20 w-32 shrink-0 overflow-hidden rounded-lg border transition ${
                    isActive
                      ? 'border-white/90 ring-2 ring-blue-400'
                      : 'border-white/20 hover:border-white/60'
                  }`}
                >
                  {item.type === 'video' ? (
                    <>
                      <SafeImage
                        src={item.thumbnail || item.path}
                        alt={item.name || `${t('components.mediaLightbox.video', 'Видео')} ${index + 1}`}
                        className="h-full w-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                        {t('components.mediaLightbox.video', 'Видео')}
                      </span>
                    </>
                  ) : (
                    <SafeImage
                      src={item.thumbnail || item.path}
                      alt={item.name || `${t('components.mediaLightbox.photo', 'Фото')} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}


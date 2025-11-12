import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import SafeImage from './SafeImage';
import SafeVideo from './SafeVideo';

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
  // Сохраняем текущий индекс выбранного медиа
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // При смене initialIndex обновляем состояние (например, открытие по клику)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Нормализуем список медиа и кешируем, чтобы не пересчитывать лишний раз
  const normalizedMedia = useMemo(() => {
    return (media || []).filter(Boolean);
  }, [media]);

  // Закрытие окна по клавише Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
      if (event.key === 'ArrowRight') {
        handleNext();
      }
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Блокируем прокрутку страницы, пока открыт лайтбокс
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, currentIndex, normalizedMedia.length]);

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

  if (typeof document === 'undefined') {
    return null;
  }

  const currentMedia = normalizedMedia[currentIndex];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm">
      {/* Шапка модального окна */}
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wider text-white/80">
            Медиафайлы
          </span>
          <span className="text-lg font-semibold">
            {currentMedia?.name || `Медиа ${currentIndex + 1}`}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Закрыть
        </button>
      </div>

      {/* Основная область просмотра */}
      <div className="relative flex flex-1 items-center justify-center px-6 pb-6">
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          aria-label="Предыдущий"
        >
          ‹
        </button>

        <div className="flex h-full w-full max-w-5xl items-center justify-center">
          {currentMedia?.type === 'video' ? (
            currentMedia.is_embed && (currentMedia.embed_url || currentMedia.path) ? (
              <iframe
                key={currentMedia.id}
                src={currentMedia.embed_url || currentMedia.path}
                title={currentMedia.name || 'Видео'}
                className="h-full w-full max-h-[80vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <SafeVideo
                key={currentMedia.path}
                src={currentMedia.path}
                className="h-full w-full max-h-[80vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                controls
                autoPlay
              />
            )
          ) : (
            <SafeImage
              src={currentMedia?.path}
              alt={currentMedia?.name || 'Изображение'}
              className="h-full w-full max-h-[80vh] rounded-xl border border-white/10 object-contain shadow-2xl"
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          aria-label="Следующий"
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
            <span className="text-white/50">Выберите медиа для просмотра</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {normalizedMedia.map((item, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  type="button"
                  key={item.id || `thumb-${index}`}
                  onClick={() => handleSelect(index)}
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
                        alt={item.name || `Видео ${index + 1}`}
                        className="h-full w-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                        Видео
                      </span>
                    </>
                  ) : (
                    <SafeImage
                      src={item.thumbnail || item.path}
                      alt={item.name || `Фото ${index + 1}`}
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


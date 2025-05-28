import React, { useEffect, useRef } from 'react';

function VideoModal({ videoUrl, isOpen, onClose, fileName }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // Предотвращаем прокрутку страницы при открытом модальном окне
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const getMediaType = (url) => {
    if (!url) return null;
    
    // Получаем расширение файла
    const extension = url.split('.').pop().toLowerCase();
    
    // Видео форматы
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    
    if (videoTypes.includes(extension)) {
      return 'video';
    }
    
    return null;
  };

  // Извлекаем имя файла из URL, если fileName не передан
  const getFileNameFromUrl = (url) => {
    if (!url) return 'Медиафайл';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // Используем переданное имя файла или извлекаем из URL
  const displayName = fileName || getFileNameFromUrl(videoUrl);
  const mediaType = getMediaType(videoUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex justify-center items-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 truncate" data-translate>{displayName}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow p-4 flex justify-center items-center bg-gray-800 overflow-auto">
          {mediaType === 'video' && (
            <video 
              className="max-w-full max-h-[70vh]" 
              controls 
              autoPlay
              src={videoUrl}
            ></video>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
          >
            <span data-translate>Закрыть</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;

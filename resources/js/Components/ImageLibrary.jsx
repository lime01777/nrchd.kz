import React, { useState, useEffect } from 'react';

export default function ImageLibrary({ onSelect, onClose, multiple = false }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Загрузка изображений при монтировании компонента
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/admin/images/news');
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setImages(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке изображений:', err);
      setError('Не удалось загрузить изображения. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    if (multiple) {
      // Для множественного выбора
      if (selectedImages.some(img => img.url === image.url)) {
        setSelectedImages(selectedImages.filter(img => img.url !== image.url));
      } else {
        setSelectedImages([...selectedImages, image]);
      }
    } else {
      // Для одиночного выбора
      setSelectedImages([image]);
    }
  };

  const handleConfirm = () => {
    if (selectedImages.length > 0) {
      onSelect(multiple ? selectedImages : selectedImages[0]);
    }
    onClose();
  };

  const filteredImages = searchTerm 
    ? images.filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : images;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Библиотека изображений</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Поиск изображений..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              {searchTerm ? 'Изображения не найдены' : 'Нет доступных изображений'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedImages.some(img => img.url === image.url) 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="w-full h-32 object-cover"
                  />
                  {selectedImages.some(img => img.url === image.url) && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="p-2 bg-white text-xs truncate">{image.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div className="text-sm text-gray-500">
            {selectedImages.length > 0 ? `Выбрано: ${selectedImages.length}` : 'Выберите изображения'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedImages.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedImages.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

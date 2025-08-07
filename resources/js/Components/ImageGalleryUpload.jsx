import React, { useRef, useState, useEffect } from 'react';
import ImageLibrary from './ImageLibrary';
import NewsSliderWithMain from './NewsSliderWithMain';

export default function ImageGalleryUpload({ images, setImages, mainImage, setMainImage, max = 18 }) {
  const inputRef = useRef();
  const [showLibrary, setShowLibrary] = useState(false);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    if (images) {
      setImages(images);
    }
  }, [images]);

  useEffect(() => {
    if (mainImage) {
      setMainImage(mainImage);
    }
  }, [mainImage]);

  // Drag&Drop обработка
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      addFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      addFiles(files);
    }
  };

  const addFiles = (files) => {
    const currentImages = Array.isArray(images) ? images : [];
    const newFiles = files.slice(0, max - currentImages.length);
    const updatedImages = [...currentImages, ...newFiles];
    setImages(updatedImages);
    
    // Если главное изображение не выбрано, устанавливаем первое из новых
    if (!mainImage && newFiles.length > 0) {
      setMainImage(newFiles[0]);
    }
  };

  const handleRemove = (idx) => {
    const currentImages = Array.isArray(images) ? images : [];
    const newArr = currentImages.filter((_, i) => i !== idx);
    setImages(newArr);
    
    // Если удаляем главное изображение, устанавливаем первое из оставшихся
    if (mainImage === currentImages[idx]) {
      setMainImage(newArr[0] || null);
    }
  };

  const handleSetMain = (img) => {
    setMainImage(img);
  };
  
  // Открытие библиотеки изображений
  const openLibrary = () => {
    setShowLibrary(true);
  };
  
  // Обработка выбора изображений из библиотеки
  const handleLibrarySelect = (selectedImages) => {
    const newImages = Array.isArray(selectedImages) ? selectedImages : [selectedImages];
    const currentImages = Array.isArray(images) ? images : [];
    
    // Добавляем только уникальные изображения, которых еще нет в списке
    const uniqueNewImages = newImages.filter(newImg => 
      !currentImages.some(existingImg => 
        typeof existingImg === 'string' && existingImg === newImg.url
      )
    );
    
    // Добавляем URL изображений в список
    const newUrls = uniqueNewImages.map(img => img.url);
    const updatedImages = [...currentImages, ...newUrls];
    setImages(updatedImages);
    
    // Если главное изображение не выбрано, устанавливаем первое из новых
    if (!mainImage && newUrls.length > 0) {
      setMainImage(newUrls[0]);
    }
  };

  const currentImages = Array.isArray(images) ? images : [];

  // Отладочная информация
  console.log('ImageGalleryUpload - текущее состояние:', {
    images,
    currentImages,
    mainImage,
    currentImagesLength: currentImages.length
  });

  return (
    <div>
      {showLibrary && (
        <ImageLibrary 
          onSelect={handleLibrarySelect} 
          onClose={() => setShowLibrary(false)} 
          multiple={true} 
        />
      )}
      
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Изображения</h3>
        <button
          type="button"
          onClick={openLibrary}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Выбрать из библиотеки
        </button>
      </div>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer mb-4"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        style={{ minHeight: '120px' }}
      >
        <div className="flex flex-col items-center">
          <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="text-blue-600 font-medium cursor-pointer">Перетащите или выберите до {max} изображений</span>
          <span className="text-xs text-gray-400">PNG, JPG, GIF, WEBP</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
      {/* Слайдер предварительного просмотра */}
      {currentImages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Предварительный просмотр слайдера:</h4>
          <div className="h-48 rounded-lg overflow-hidden">
            <NewsSliderWithMain 
              images={currentImages}
              mainImage={mainImage}
              className="h-48"
              height="192px"
              showDots={true}
              showCounter={true}
              autoPlay={true}
              interval={3000}
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentImages.map((img, idx) => {
          // Отладочная информация
          console.log('Обработка изображения:', {
            img,
            type: typeof img,
            isString: typeof img === 'string',
            isFile: img instanceof File,
            name: img?.name,
            url: typeof img === 'string' ? img : null
          });
          
          const url = typeof img === 'string' ? img : URL.createObjectURL(img);
          const isMain = mainImage === img;
          
          console.log('Созданный URL:', url);
          
          return (
            <div key={idx} className={`relative group border rounded-lg overflow-hidden shadow bg-white ${isMain ? 'ring-2 ring-blue-500' : ''}`}>
              <img 
                src={url} 
                alt={typeof img === 'string' ? 'Загруженное' : img.name} 
                className="w-full h-32 object-cover" 
                onError={(e) => {
                  console.error('Ошибка загрузки изображения:', url);
                  e.target.onerror = null;
                  e.target.src = '/img/placeholder.jpg';
                }}
                onLoad={() => {
                  console.log('Изображение успешно загружено:', url);
                }}
              />
              
              {/* Кнопка удаления */}
              <button
                type="button"
                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
                title="Удалить изображение"
                onClick={e => { e.stopPropagation(); handleRemove(idx); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Галочка для выбора главного изображения */}
              <button
                type="button"
                className={`absolute bottom-1 left-1 bg-white bg-opacity-90 rounded-full p-1.5 shadow hover:bg-blue-100 transition ${
                  isMain ? 'bg-blue-500 text-white' : 'hover:bg-blue-50'
                }`}
                title={isMain ? "Главное изображение" : "Сделать главным"}
                onClick={e => { e.stopPropagation(); handleSetMain(img); }}
              >
                {isMain ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              
              {/* Индикатор главного изображения */}
              {isMain && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Главное
                </div>
              )}
              
              {/* Номер изображения */}
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                {idx + 1}
              </div>
              
              {/* Отладочная информация */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                {typeof img === 'string' ? 'URL' : 'File'}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Информация о выбранном главном изображении */}
      {mainImage && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-blue-700">
              Главное изображение выбрано. Оно будет отображаться первым в слайдере.
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useRef } from 'react';

export default function ImageGalleryUpload({ images, setImages, mainImage, setMainImage, max = 18 }) {
  const inputRef = useRef();

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
    const newFiles = files.slice(0, max - images.length);
    setImages([...images, ...newFiles]);
    if (!mainImage && newFiles.length > 0) {
      setMainImage(newFiles[0]);
    }
  };

  const handleRemove = (idx) => {
    const newArr = images.filter((_, i) => i !== idx);
    setImages(newArr);
    if (mainImage === images[idx]) {
      setMainImage(newArr[0] || null);
    }
  };

  const handleSetMain = (img) => {
    setMainImage(img);
  };

  return (
    <div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => {
          const url = typeof img === 'string' ? img : URL.createObjectURL(img);
          return (
            <div key={idx} className="relative group border rounded-lg overflow-hidden shadow bg-white">
              <img src={url} alt={typeof img === 'string' ? 'Загруженное' : img.name} className="w-full h-32 object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
                title="Удалить изображение"
                onClick={e => { e.stopPropagation(); handleRemove(idx); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <button
                type="button"
                className={`absolute bottom-1 left-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-yellow-100 transition ${mainImage === img ? 'ring-2 ring-yellow-400' : ''}`}
                title="Сделать главным"
                onClick={e => { e.stopPropagation(); handleSetMain(img); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={mainImage === img ? 'gold' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.44 4.73L5.8 21z" /></svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
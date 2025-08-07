import React from 'react';

/**
 * Простой тестовый компонент для проверки отображения изображений
 */
export default function ImageTest({ images = [], mainImage = null }) {
  console.log('ImageTest - полученные данные:', { images, mainImage });

  // Безопасное получение длины массива
  const imagesLength = Array.isArray(images) ? images.length : 0;

  // Безопасное отображение значений
  const safeString = (value) => {
    if (value === null || value === undefined) return 'null/undefined';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Тест отображения изображений</h3>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Информация:</h4>
        <ul className="text-sm space-y-1">
          <li>Количество изображений: {safeString(imagesLength)}</li>
          <li>Тип images: {safeString(typeof images)}</li>
          <li>Главное изображение: {safeString(mainImage || 'не выбрано')}</li>
          <li>Тип главного изображения: {safeString(typeof mainImage)}</li>
        </ul>
      </div>

      {Array.isArray(images) && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index} className="border rounded p-2 bg-white">
              <h5 className="font-medium mb-2">Изображение {index + 1}</h5>
              <div className="text-xs text-gray-600 mb-2">
                <div>Тип: {safeString(typeof img)}</div>
                <div>Значение: {safeString(img).substring(0, 50)}...</div>
                {img instanceof File && (
                  <div>Имя файла: {safeString(img.name)}</div>
                )}
              </div>
              <div className="h-32 border rounded overflow-hidden">
                <img
                  src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                  alt={`Тест ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Ошибка загрузки изображения:', img);
                    e.target.style.backgroundColor = 'red';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = 'ОШИБКА';
                  }}
                  onLoad={() => {
                    console.log('Изображение загружено:', img);
                  }}
                />
              </div>
              {mainImage === img && (
                <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Главное изображение
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">Нет изображений для отображения</div>
      )}
    </div>
  );
}

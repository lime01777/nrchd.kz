import React from 'react';

/**
 * Максимально простой тестовый компонент
 */
export default function SimpleImageTest({ images, mainImage }) {
  return (
    <div className="p-4 border rounded-lg bg-red-50">
      <h3 className="text-lg font-medium mb-4">Простой тест изображений</h3>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Данные:</h4>
        <div className="text-sm space-y-1">
          <div>Images: {JSON.stringify(images)}</div>
          <div>MainImage: {JSON.stringify(mainImage)}</div>
          <div>Images type: {typeof images}</div>
          <div>MainImage type: {typeof mainImage}</div>
          <div>Is array: {Array.isArray(images) ? 'Yes' : 'No'}</div>
          <div>Length: {Array.isArray(images) ? images.length : 'N/A'}</div>
        </div>
      </div>

      {Array.isArray(images) && images.length > 0 ? (
        <div>
          <h4 className="font-medium mb-2">Изображения:</h4>
          <div className="space-y-2">
            {images.map((img, index) => (
              <div key={index} className="border p-2 bg-white">
                <div>Индекс: {index}</div>
                <div>Тип: {typeof img}</div>
                <div>Значение: {JSON.stringify(img)}</div>
                {typeof img === 'string' && (
                  <div>
                    <img 
                      src={img} 
                      alt={`Test ${index}`}
                      className="w-32 h-32 object-cover border"
                      onError={(e) => {
                        e.target.style.backgroundColor = 'red';
                        e.target.innerHTML = 'ERROR';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Нет изображений</div>
      )}
    </div>
  );
}

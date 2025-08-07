import React, { useState } from 'react';

/**
 * Компонент для отладки проблем с изображениями
 */
export default function ImageDebug({ images = [], mainImage = null }) {
  const [testResults, setTestResults] = useState([]);

  const testImage = async (url, index) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        url,
        index,
        status: response.status,
        ok: response.ok,
        error: null
      };
    } catch (error) {
      return {
        url,
        index,
        status: null,
        ok: false,
        error: error.message
      };
    }
  };

  const runTests = async () => {
    const results = [];
    
    if (!Array.isArray(images) || images.length === 0) {
      setTestResults([]);
      return;
    }
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const url = typeof img === 'string' ? img : URL.createObjectURL(img);
      const result = await testImage(url, i);
      results.push(result);
    }
    
    setTestResults(results);
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h3 className="text-lg font-medium mb-4">Отладка изображений</h3>
      
      <button 
        onClick={runTests}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Запустить тесты
      </button>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Данные:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify({ images, mainImage }, null, 2)}
        </pre>
      </div>
      
      {testResults.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Результаты тестов:</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-2 rounded text-sm ${
                result.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div>Изображение {result.index + 1}:</div>
                <div>URL: {result.url}</div>
                <div>Статус: {result.status}</div>
                {result.error && <div>Ошибка: {result.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Прямые ссылки:</h4>
        <div className="space-y-2">
          {images.map((img, index) => {
            const url = typeof img === 'string' ? img : URL.createObjectURL(img);
            return (
              <div key={index} className="text-sm">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Изображение {index + 1}: {url}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

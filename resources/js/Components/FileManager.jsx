import React, { useState, useEffect, useCallback } from 'react';

/**
 * Файловый менеджер для выбора изображений
 * Поддерживает навигацию по папкам, просмотр изображений, множественный выбор
 */
export default function FileManager({ 
  onSelect, 
  onClose, 
  multiple = true,
  initialPath = '/storage/news',
  allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
}) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Загрузка содержимого папки
  const loadDirectory = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/file-manager/browse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ 
          path: path,
          allowedExtensions: allowedExtensions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setItems(data.items || []);
        setBreadcrumbs(data.breadcrumbs || []);
        setCurrentPath(path);
      } else {
        throw new Error(data.message || 'Ошибка загрузки папки');
      }
    } catch (err) {
      console.error('Ошибка загрузки папки:', err);
      setError(err.message);
      // Показываем тестовые данные для демонстрации
      setItems([
        { 
          name: 'hero1.png', 
          type: 'file', 
          path: '/storage/news/hero1.png',
          size: '245 KB',
          modified: '2025-01-15 10:30:00',
          url: '/storage/news/hero1.png'
        },
        { 
          name: 'hero2.png', 
          type: 'file', 
          path: '/storage/news/hero2.png',
          size: '312 KB',
          modified: '2025-01-15 10:35:00',
          url: '/storage/news/hero2.png'
        },
        { 
          name: 'banner.png', 
          type: 'file', 
          path: '/storage/news/banner.png',
          size: '156 KB',
          modified: '2025-01-15 10:40:00',
          url: '/storage/news/banner.png'
        },
        { 
          name: 'subfolder', 
          type: 'directory', 
          path: '/storage/news/subfolder',
          size: '-',
          modified: '2025-01-15 10:45:00'
        }
      ]);
      setBreadcrumbs([
        { name: 'storage', path: '/storage' },
        { name: 'news', path: '/storage/news' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [allowedExtensions]);

  // Загрузка при монтировании
  useEffect(() => {
    loadDirectory(initialPath);
  }, [loadDirectory, initialPath]);

  // Навигация по папкам
  const navigateTo = (path) => {
    loadDirectory(path);
    setSelectedItems([]);
  };

  // Переход по хлебным крошкам
  const navigateBreadcrumb = (path) => {
    navigateTo(path);
  };

  // Переход на уровень выше
  const goUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 2) { // Минимум /storage/news
      pathParts.pop();
      const parentPath = '/' + pathParts.join('/');
      navigateTo(parentPath);
    }
  };

  // Выбор элемента
  const handleItemClick = (item) => {
    if (item.type === 'directory') {
      navigateTo(item.path);
    } else if (item.type === 'file') {
      if (multiple) {
        setSelectedItems(prev => {
          const isSelected = prev.some(selected => selected.path === item.path);
          if (isSelected) {
            return prev.filter(selected => selected.path !== item.path);
          } else {
            return [...prev, item];
          }
        });
      } else {
        setSelectedItems([item]);
      }
    }
  };

  // Подтверждение выбора
  const handleConfirm = () => {
    if (selectedItems.length > 0) {
      const selectedImages = selectedItems.map(item => ({
        url: item.url,
        name: item.name,
        path: item.path
      }));
      onSelect(multiple ? selectedImages : selectedImages[0]);
    }
    onClose();
  };

  // Отмена выбора
  const handleCancel = () => {
    onClose();
  };

  // Проверка, выбран ли элемент
  const isSelected = (item) => {
    return selectedItems.some(selected => selected.path === item.path);
  };

  // Форматирование размера файла
  const formatFileSize = (size) => {
    if (size === '-') return size;
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Файловый менеджер</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Хлебные крошки */}
        <div className="flex items-center p-3 bg-gray-50 border-b">
          <button
            onClick={goUp}
            disabled={currentPath === '/storage/news'}
            className="mr-2 p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="На уровень выше"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          
          <div className="flex items-center space-x-1">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                )}
                <button
                  onClick={() => navigateBreadcrumb(crumb.path)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Основное содержимое */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Загрузка...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <p className="text-sm">{error}</p>
                <p className="text-xs text-gray-500 mt-1">Показаны тестовые данные</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Заголовки таблицы */}
              <div className="sticky top-0 bg-gray-50 border-b">
                <div className="grid grid-cols-12 gap-4 p-3 text-xs font-medium text-gray-600">
                  <div className="col-span-6">Имя</div>
                  <div className="col-span-2">Размер</div>
                  <div className="col-span-3">Изменен</div>
                  <div className="col-span-1">Тип</div>
                </div>
              </div>

              {/* Список файлов и папок */}
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className={`grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected(item) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    {/* Имя и иконка */}
                    <div className="col-span-6 flex items-center space-x-3">
                      {item.type === 'directory' ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                        </svg>
                      )}
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      {isSelected(item) && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>

                    {/* Размер */}
                    <div className="col-span-2 text-sm text-gray-600">
                      {formatFileSize(item.size)}
                    </div>

                    {/* Дата изменения */}
                    <div className="col-span-3 text-sm text-gray-600">
                      {item.modified}
                    </div>

                    {/* Тип */}
                    <div className="col-span-1 text-sm text-gray-600">
                      {item.type === 'directory' ? 'Папка' : 'Файл'}
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <p>Папка пуста</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Футер с кнопками */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Выбрано: {selectedItems.length} {selectedItems.length === 1 ? 'элемент' : 'элементов'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Добавить ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

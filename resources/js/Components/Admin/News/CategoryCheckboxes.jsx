import React, { useState, useEffect } from 'react';

const CategoryCheckboxes = ({ 
  selectedCategories = [], 
  onCategoriesChange, 
  availableCategories = [],
  error = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Фильтруем категории по поиску
  const filteredCategories = availableCategories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Показываем либо все, либо первые 10
  const displayCategories = showAll ? filteredCategories : filteredCategories.slice(0, 10);

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    onCategoriesChange(newCategories);
  };

  const handleSelectAll = () => {
    onCategoriesChange([...availableCategories]);
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Поиск категорий */}
      <div>
        <input
          type="text"
          placeholder="Поиск категорий..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Выбрать все
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Очистить
        </button>
      </div>

      {/* Список категорий */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        {displayCategories.length === 0 ? (
          <div className="p-3 text-gray-500 text-center">
            {searchTerm ? 'Категории не найдены' : 'Нет доступных категорий'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {displayCategories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}

        {/* Показать больше/меньше */}
        {filteredCategories.length > 10 && (
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-sm text-blue-600 hover:text-blue-800 py-1"
            >
              {showAll 
                ? `Скрыть (показано ${filteredCategories.length})` 
                : `Показать все (${filteredCategories.length} категорий)`
              }
            </button>
          </div>
        )}
      </div>

      {/* Выбранные категории */}
      {selectedCategories.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-2">
            Выбрано: {selectedCategories.length} категорий
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {category}
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ошибка валидации */}
      {error && (
        <div className="text-sm text-red-600 mt-1">
          {error}
        </div>
      )}

      {/* Инструкция */}
      <div className="text-sm text-gray-500">
        Выберите хотя бы одну категорию
      </div>
    </div>
  );
};

export default CategoryCheckboxes;

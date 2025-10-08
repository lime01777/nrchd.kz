import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function CategorySelector({ 
  selectedCategories = [], 
  onCategoriesChange, 
  availableCategories = [], 
  maxCategories = 5,
  placeholder = "Выберите категории...",
  className = '' 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(cat => cat !== category));
    } else {
      if (selectedCategories.length >= maxCategories) {
        alert(`Максимальное количество категорий: ${maxCategories}`);
        return;
      }
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    const categoriesToSelect = availableCategories.slice(0, maxCategories);
    onCategoriesChange(categoriesToSelect);
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  const filteredCategories = availableCategories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <InputLabel value="Категории" />
      
      {/* Поиск */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Поиск категорий..."
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />

      {/* Кнопки управления */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Выбрать все
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Очистить
        </button>
      </div>

      {/* Список категорий */}
      <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
        {filteredCategories.map((category) => (
          <label key={category} className="flex items-center px-3 py-2 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{category}</span>
          </label>
        ))}
      </div>

      {/* Выбранные категории */}
      {selectedCategories.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Выбрано: {selectedCategories.length}/{maxCategories}</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {category}
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <InputError message={null} className="mt-2" />
    </div>
  );
}
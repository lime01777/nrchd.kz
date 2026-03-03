import React, { useState, useRef, useEffect } from 'react';
import InputLabel from '@/Components/Forms/InputLabel';
import InputError from '@/Components/Forms/InputError';

export default function CategorySelector({
  selectedCategories = [],
  onCategoriesChange,
  availableCategories = [],
  maxCategories = 5,
  placeholder = "Выберите категории...",
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleClearAll = (e) => {
    e.stopPropagation();
    onCategoriesChange([]);
  };

  const filteredCategories = availableCategories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <InputLabel value="Категории" className="mb-1" />

      {/* Кнопка-триггер выпадающего списка */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex-1 truncate">
          {selectedCategories.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <span className="text-gray-700 font-medium">
              Выбрано: {selectedCategories.length} из {maxCategories}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Очистить все"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Выбранные категории (бейджи) */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
            >
              {category}
              <button
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-50 bg-gray-50/50">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск категорий..."
                className="w-full pl-9 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <ul className="max-h-60 overflow-y-auto p-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <li key={category}>
                  <label className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="peer w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-all checked:border-blue-500 checked:bg-blue-500 focus:ring-blue-500/30"
                      />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`text-sm select-none ${selectedCategories.includes(category) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {category}
                    </span>
                  </label>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                Категории не найдены
              </li>
            )}

            {/* Добавление своей категории */}
            {searchTerm.trim() !== '' && !filteredCategories.includes(searchTerm.trim()) && (
              <li className="px-2 pb-1 pt-2 border-t border-gray-100 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newCat = searchTerm.trim();
                    if (selectedCategories.length >= maxCategories) {
                      alert(`Максимальное количество категорий: ${maxCategories}`);
                      return;
                    }
                    onCategoriesChange([...selectedCategories, newCat]);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors flex items-center gap-2 group text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить "{searchTerm.trim()}"
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
      <InputError message={null} className="mt-2" />
    </div>
  );
}
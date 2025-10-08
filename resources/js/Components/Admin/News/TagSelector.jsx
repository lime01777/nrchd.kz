import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function TagSelector({ 
  selectedTags = [], 
  onTagsChange, 
  availableTags = [], 
  maxTags = 10,
  placeholder = "Добавить теги...",
  className = '' 
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (tag) => {
    if (selectedTags.length >= maxTags) {
      alert(`Максимальное количество тегов: ${maxTags}`);
      return;
    }
    
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = inputValue.trim();
      if (tag) {
        handleAddTag(tag);
      }
    }
  };

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) && 
    !selectedTags.includes(tag)
  );

  return (
    <div className={className}>
      <InputLabel value="Теги" />
      
      {/* Выбранные теги */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Поле ввода */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />

      {/* Предложения */}
      {inputValue && filteredTags.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-lg max-h-32 overflow-y-auto">
          {filteredTags.slice(0, 5).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <InputError message={null} className="mt-2" />
    </div>
  );
}
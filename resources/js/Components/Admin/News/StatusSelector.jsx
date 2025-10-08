import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function StatusSelector({ value, onChange, error, className = '' }) {
  const statusOptions = [
    { value: 'draft', label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
    { value: 'scheduled', label: 'Запланировано', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'published', label: 'Опубликовано', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Архив', color: 'bg-red-100 text-red-800' }
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <InputLabel value="Статус" />
      <select
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <InputError message={error} className="mt-2" />
    </div>
  );
}

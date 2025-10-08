import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function DateTimePicker({ 
  value, 
  onChange, 
  minDate, 
  error, 
  className = '' 
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Форматируем дату для input[type="datetime-local"]
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Получаем минимальную дату в правильном формате
  const getMinDate = () => {
    if (!minDate) return '';
    return formatDateForInput(minDate);
  };

  return (
    <div className={className}>
      <InputLabel value="Дата и время публикации" />
      <input
        type="datetime-local"
        value={formatDateForInput(value)}
        onChange={handleChange}
        min={getMinDate()}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <InputError message={error} className="mt-2" />
    </div>
  );
}
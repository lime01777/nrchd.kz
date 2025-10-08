import React from 'react';

/**
 * Компонент для отображения статуса новости
 */
export default function StatusBadge({ status, className = "" }) {
  const statusConfig = {
    draft: {
      label: 'Черновик',
      className: 'bg-gray-100 text-gray-800',
      icon: '📝'
    },
    scheduled: {
      label: 'Запланировано',
      className: 'bg-yellow-100 text-yellow-800',
      icon: '⏰'
    },
    published: {
      label: 'Опубликовано',
      className: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    archived: {
      label: 'Архив',
      className: 'bg-gray-100 text-gray-600',
      icon: '📦'
    }
  };

  // Маппинг старых статусов для обратной совместимости
  const statusMap = {
    'Черновик': 'draft',
    'Запланировано': 'scheduled',
    'Опубликовано': 'published',
    'Архив': 'archived'
  };

  const normalizedStatus = statusMap[status] || status;
  const config = statusConfig[normalizedStatus] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Компонент для выбора статуса
 */
export function StatusSelector({ value, onChange, className = "" }) {
  const statuses = [
    { value: 'draft', label: 'Черновик', icon: '📝' },
    { value: 'scheduled', label: 'Запланировано', icon: '⏰' },
    { value: 'published', label: 'Опубликовано', icon: '✅' },
    { value: 'archived', label: 'Архив', icon: '📦' }
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.icon} {status.label}
        </option>
      ))}
    </select>
  );
}

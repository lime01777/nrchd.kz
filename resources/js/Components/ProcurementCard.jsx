import React from 'react';

/**
 * Компонент карточки закупки
 * Отображает информацию об одной закупке в виде карточки
 */
export default function ProcurementCard({ procurement }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Заголовок - название закупки */}
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base flex-shrink-0">
        {procurement.name || 'Без названия'}
      </h3>
      
      {/* Информация о закупке */}
      <div className="space-y-2 text-sm text-gray-600 flex-grow">
        {procurement.customer && (
          <p>
            <span className="font-medium text-gray-700">Заказчик:</span>{' '}
            <span className="text-gray-600">{procurement.customer}</span>
          </p>
        )}
        {procurement.method && (
          <p>
            <span className="font-medium text-gray-700">Способ закупки:</span>{' '}
            <span className="text-gray-600">{procurement.method}</span>
          </p>
        )}
        {procurement.amount && (
          <p>
            <span className="font-medium text-gray-700">Сумма:</span>{' '}
            <span className="text-gray-600 font-semibold text-base">{procurement.amount}</span>
          </p>
        )}
        {procurement.status && (
          <p>
            <span className="font-medium text-gray-700">Статус:</span>{' '}
            <span className="text-gray-600">{procurement.status}</span>
          </p>
        )}
        {procurement.date && (
          <p>
            <span className="font-medium text-gray-700">Срок закупки:</span>{' '}
            <span className="text-gray-600">{procurement.date}</span>
          </p>
        )}
      </div>
      
      {/* Ссылка на подробности */}
      {procurement.link && (
        <a
          href={procurement.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 flex-shrink-0"
        >
          <span>Подробнее</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}


import React from 'react';

export default function ServiceTimeline({ items }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 sm:p-5 my-4 sm:my-6 bg-white shadow-sm">
      <h3 className="font-semibold text-lg text-gray-800 mb-3 sm:mb-4">Сроки выполнения</h3>
      {items.map((item, index) => (
        <div key={index} className={`${index > 0 ? 'mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100' : ''}`}>
          <h4 className="font-medium text-sm sm:text-base text-gray-800">{item.title}</h4>
          <p className="text-gray-700 text-sm sm:text-base">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

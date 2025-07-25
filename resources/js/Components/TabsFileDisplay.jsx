import React, { useState } from 'react';
import SimpleFileDisplay from './SimpleFileDisplay';

/*
 * Универсальный компонент вкладок над SimpleFileDisplay
 * props:
 *  tabs: [{ label: 'Законадательство', folder: 'ЗОЖ/Законадательство' }]
 *  defaultIndex: номер активной вкладки по умолчанию
 *  borderColor: Tailwind класс рамки (по умолчанию border-blue-200)
 */
export default function TabsFileDisplay({ tabs = [], defaultIndex = 0, borderColor = 'border-blue-200' }) {
  const [active, setActive] = useState(defaultIndex);

  if (!tabs.length) return null;

  return (
    <div className={`border ${borderColor} rounded-lg p-4`}>      
      {/* Панель вкладок */}
      <div className="flex flex-wrap border-b border-gray-200 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-150
              ${idx === active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Содержимое активной вкладки */}
      <SimpleFileDisplay folder={tabs[active].folder} title={tabs[active].label} bgColor="bg-white" />
    </div>
  );
}

import React from 'react';

export default function PriceList({ title, items, notes }) {
  return (
    <div className="my-8 sm:my-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">{title}</h2>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 sm:py-4 px-4 font-medium text-sm sm:text-base text-gray-700">Наименование услуги</th>
              <th className="text-left py-3 sm:py-4 px-4 font-medium text-sm sm:text-base text-gray-700">Единица измерения</th>
              <th className="text-left py-3 sm:py-4 px-4 font-medium text-sm sm:text-base text-gray-700">Стоимость с НДС</th>
              <th className="text-left py-3 sm:py-4 px-4 font-medium text-sm sm:text-base text-gray-700">Стоимость без НДС</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr 
                key={index} 
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-3 sm:py-4 px-4 text-sm sm:text-base text-gray-700">{item.name}</td>
                <td className="py-3 sm:py-4 px-4 text-sm sm:text-base text-gray-700">{item.unit}</td>
                <td className="py-3 sm:py-4 px-4 text-sm sm:text-base text-gray-700">{item.priceWithVAT}</td>
                <td className="py-3 sm:py-4 px-4 text-sm sm:text-base text-gray-700">{item.priceWithoutVAT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {notes && notes.length > 0 && (
        <div className="mt-4 px-4 sm:px-0">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Примечание:</p>
            <ul className="list-none space-y-1">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  {index === 0 ? null : <span className="mr-1">*</span>}
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

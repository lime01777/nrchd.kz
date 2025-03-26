import React from 'react';

export default function NormativeDocumentsList({ documents, title, bgColor = 'bg-white', singleColumn = false }) {
  return (
    <div className={`py-6 ${bgColor}`}>
      {title && (
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
      )}
      
      {!documents || documents.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
          Нет доступных документов
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Нормативно-правовые акты, регламентирующие процесс проведения клинических исследований в Казахстане
          </h3>
          
          <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {documents.map((document, index) => (
              <div className="w-full" key={index}>
                <div className="flex flex-col h-[200px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <div className="flex-grow overflow-hidden">
                    <h2 className="font-medium leading-normal text-gray-800 line-clamp-6 mb-3">{document.title}</h2>
                  </div>
                  <div className="flex mt-auto justify-between items-center">
                    <div className="flex space-x-2">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                        Открыть
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import React from 'react';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function ActualFile({ title, folder, bgColor = 'bg-white', onVideoClick, hideDownload = false }) {
  return (
    <div className="text-gray-600 body-font py-10">
      <div className="container mx-auto px-5">
        <div className={`${bgColor} p-6 rounded-lg flex flex-wrap md:flex-nowrap`}>
          {/* Левая часть с документами (1/3 ширины) */}
          <div className="w-full md:w-1/3 pr-0 md:pr-4">
            {/* Переопределяем стили SimpleFileDisplay для отображения в одну колонку */}
            <div className="actfile-container">
              <style jsx>{`
                .actfile-container :global(.grid) {
                  grid-template-columns: 1fr !important;
                }
              `}</style>
              <SimpleFileDisplay 
                folder={folder} 
                title=""
                bgColor={bgColor}
                onVideoClick={onVideoClick}
                limit={2} // Ограничиваем только двумя документами
                singleColumn={true} // Явно указываем отображение в одну колонку
                hideDownload={hideDownload}
              />
            </div>
          </div>
          
          {/* Правая часть с заголовком (2/3 ширины) */}
          <div className="w-full md:w-2/3 flex items-center justify-center mt-6 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-medium title-font text-gray-900 tracking-widest text-center">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

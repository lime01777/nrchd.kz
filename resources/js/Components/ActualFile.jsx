import React from 'react';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function ActualFile({ title, folder, bgColor = 'bg-white', onVideoClick, hideDownload = false }) {
  return (
    <div className="text-gray-600 body-font py-10">
      <div className="container mx-auto px-5">
        <div className={`${bgColor} p-4 sm:p-6 rounded-lg flex flex-col md:flex-row flex-wrap md:flex-nowrap`}>
          {/* Заголовок - первый на мобильных, второй на десктопе */}
          <div className="w-full md:w-2/3 flex items-center justify-center mb-6 md:mb-0 md:order-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium title-font text-gray-900 tracking-widest text-center break-words">
              {title}
            </h1>
          </div>
          
          {/* Документы - второй на мобильных, первый на десктопе */}
          <div className="w-full md:w-1/3 pr-0 md:pr-4 md:order-1">
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
        </div>
      </div>
    </div>
  );
}

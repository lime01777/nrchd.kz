import React, { useState } from 'react';

function LeadershipCard({ name, position, photo, biography, contact }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      {/* Карточка руководства */}
      <div 
        className="p-4 lg:w-1/2 xl:w-1/3 w-full"
        onClick={handleOpenModal}
      >
        <div className="h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
          {/* Аватар с инициалами */}
          <div className="p-6 pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl font-bold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Информация о руководителе */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center line-clamp-2">
              {name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center line-clamp-3">
              {position}
            </p>
            
            {/* Контактная информация */}
            {contact && (
              <div className="space-y-1 text-xs text-gray-500">
                {contact.email && (
                  <p className="flex items-center justify-center">
                    <span className="mr-2">📧</span>
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="flex items-center justify-center">
                    <span className="mr-2">📞</span>
                    {contact.phone}
                  </p>
                )}
              </div>
            )}
            
            {/* Кнопка "Подробнее" */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <span className="text-fuchsia-600 text-sm font-medium group-hover:text-fuchsia-700 transition-colors duration-200">
                Подробнее →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно с подробной информацией */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Руководство</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Содержимое модального окна */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Фото и основная информация */}
                <div className="lg:w-1/3">
                  <div className="sticky top-0">
                    {photo ? (
                      <img 
                        src={photo} 
                        alt={name} 
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-6xl font-bold">
                          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                        <p className="text-gray-600 font-medium">{position}</p>
                      </div>
                      
                      {contact && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">Контактная информация</h4>
                          {contact.email && (
                            <p className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📧</span>
                              {contact.email}
                            </p>
                          )}
                          {contact.phone && (
                            <p className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📞</span>
                              {contact.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                                 {/* Биография */}
                 <div className="lg:w-2/3">
                   <div className="prose prose-gray max-w-none">
                     <h4 className="text-lg font-semibold text-gray-900 mb-4">Биография</h4>
                     <div className="text-gray-700 leading-relaxed">
                       <p className="whitespace-pre-line">{biography}</p>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeadershipCard;

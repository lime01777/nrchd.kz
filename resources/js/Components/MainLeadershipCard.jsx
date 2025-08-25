import React, { useState } from 'react';

function MainLeadershipCard({ name, position, photo, biography, contact }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      {/* Главная карточка руководства */}
      <div className="w-full p-4">
        <div 
          className="h-full bg-white border-2 border-fuchsia-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          onClick={handleOpenModal}
        >
          {/* Аватар с инициалами */}
          <div className="p-8 pb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-bold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Информация о руководителе */}
          <div className="px-8 pb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center line-clamp-2">
              {name}
            </h3>
            <p className="text-base text-gray-600 mb-6 text-center line-clamp-3">
              {position}
            </p>
            
            {/* Контактная информация */}
            {contact && (
              <div className="space-y-2 text-sm text-gray-500">
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
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <span className="text-fuchsia-600 text-base font-semibold group-hover:text-fuchsia-700 transition-colors duration-200">
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
            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Председатель Правления</h2>
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
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-7xl font-bold">
                          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
                        <p className="text-gray-600 font-medium text-lg">{position}</p>
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
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Биография</h4>
                    <div className="text-gray-700 leading-relaxed">
                      <div className="whitespace-pre-line text-base space-y-4">
                        {biography.split('\n\n').map((section, index) => {
                          if (section.startsWith('Образование:')) {
                            return (
                              <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <h5 className="font-semibold text-blue-900 mb-2">Образование</h5>
                                <div className="text-blue-800">
                                  {section.replace('Образование:', '').split('\n').map((item, i) => (
                                    <p key={i} className="mb-1">{item}</p>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (section.startsWith('Ученая степень:')) {
                            return (
                              <div key={index} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                                <h5 className="font-semibold text-purple-900 mb-2">Ученая степень</h5>
                                <p className="text-purple-800">{section.replace('Ученая степень:', '')}</p>
                              </div>
                            );
                          } else if (section.startsWith('Трудовая деятельность:')) {
                            return (
                              <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                <h5 className="font-semibold text-green-900 mb-2">Трудовая деятельность</h5>
                                <div className="text-green-800">
                                  {section.replace('Трудовая деятельность:', '').split('\n').map((item, i) => (
                                    <p key={i} className="mb-1">{item}</p>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (section.startsWith('Награды:')) {
                            return (
                              <div key={index} className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                                <h5 className="font-semibold text-amber-900 mb-2">Награды</h5>
                                <p className="text-amber-800">{section.replace('Награды:', '')}</p>
                              </div>
                            );
                          } else {
                            return (
                              <p key={index} className="text-gray-700">{section}</p>
                            );
                          }
                        })}
                      </div>
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

export default MainLeadershipCard;

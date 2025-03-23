import React, { useState } from 'react'

function BannerCatalog() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    // Блокируем прокрутку страницы при открытии модального окна
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Разблокируем прокрутку страницы при закрытии модального окна
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 pb-24 items-center justify-center flex-col">
            <div className='relative w-full flex flex-col items-center content-center'>
                <img className="inset-0 w-full h-96 object-cover rounded-2xl" alt="catalog-program" src="./img/banner.png" />
                <div className="absolute text-center h-full w-full align-middle items-center md:content-center content-end justify-between">
                    <div className='flex justify-center mb-1'>
                        <img className='w-24 h-24' src="https://img.icons8.com/emoji/96/open-book-emoji.png" alt="open-book-emoji"/>
                    </div>
                    <h1 className="title-font sm:text-4xl text-3xl md:mb-4 mb-6 font-semibold text-gray-900">Каталог образовательных программ</h1>
                    <div className="flex justify-center px-4 md:mb-0 mb-8">
                        <button
                            onClick={openModal}
                            className="md:w-auto w-full items-center text-white bg-green-900 border-0 py-3 px-6 transition ease-in duration-150 focus:outline-none hover:bg-green-600 hover:shadow-lg rounded-lg text-lg">Перейти в каталог</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Модальное окно */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="relative bg-white w-full h-full flex flex-col">
              {/* Заголовок модального окна */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  Каталог образовательных программ
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              {/* Содержимое модального окна - iframe с внешней страницей */}
              <div className="p-0 flex-grow overflow-hidden">
                <iframe 
                  src="http://89.218.81.108/#/catalog/view" 
                  className="w-full h-full border-0"
                  title="Каталог образовательных программ"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        )}
    </section>
  )
}

export default BannerCatalog
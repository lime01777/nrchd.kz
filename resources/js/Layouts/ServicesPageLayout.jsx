import React, { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

export default function ServicesPageLayout({ children, title, img, bgColor = "bg-yellow-100" }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Submitted data:', formData);
    // TODO: добавить API для отправки данных
    alert('Заявка успешно отправлена!');
    // Сброс формы
    setFormData({
      name: '',
      organization: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const scrollToTimeline = (e) => {
    e.preventDefault();
    const element = document.getElementById('service-timeline');
    if (element) {
      // Вычисляем высоту хедера (примерно 80px, но можно настроить)
      const headerHeight = 80;
      // Вычисляем позицию элемента относительно верха страницы
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      // Прокручиваем к элементу с учетом высоты хедера
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Header />
      
      {/* Services Hero Section with Yellow Background */}
      <section className={`${bgColor} text-gray-800 body-font relative`}>
        <div className="container mx-auto px-5 py-12 md:py-24">
          <div className="flex flex-wrap -mx-4 items-center">
            {/* Левая колонка - заголовок и кнопка */}
            <div className="w-full lg:w-1/2 px-4 py-8 lg:py-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex flex-wrap">
                <button 
                  onClick={scrollToTimeline}
                  className="bg-transparent hover:bg-blue-100 text-blue-500 border border-blue-500 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-md font-medium transition-all duration-300 inline-flex items-center w-full sm:w-auto justify-center"
                >
                  Подробнее
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Правая колонка - форма заявки */}
            <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">Свяжитесь с нами</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">ФИО</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="organization" className="block text-gray-700 text-sm font-medium mb-1">Название организации</label>
                    <input 
                      type="text" 
                      id="organization" 
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Телефон</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">Сообщение</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="consent" className="ml-2 block text-xs text-gray-700">
                      Я согласен на обработку персональных данных
                    </label>
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md text-sm transition duration-300 w-auto"
                    >
                      Отправить заявку
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="text-gray-600 body-font" id="service-timeline">
        {children}
      </section>
      
      <Footer />
    </>
  );
}

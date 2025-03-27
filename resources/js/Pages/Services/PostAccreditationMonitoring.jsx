import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';

export default function PostAccreditationMonitoring() {
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
  };

  return (
    <>
      <Head title="Постаккредитационный мониторинг" />
      
      {/* Двухколоночная структура: текст + форма */}
      <section className="text-gray-600 body-font">
        <div className="container mx-auto py-8 md:py-16 px-4 md:px-5">
          <div className="flex flex-wrap -mx-2 md:-mx-4">
            
            {/* Левая колонка - описание услуги */}
            <div className="w-full lg:w-1/2 px-2 md:px-4 mb-8 md:mb-10 lg:mb-0">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">О постаккредитационном мониторинге</h2>
              <p className="leading-relaxed text-sm md:text-base mb-3 md:mb-4">
                Постаккредитационный мониторинг - это система контроля за деятельностью аккредитованных медицинских организаций 
                с целью подтверждения их соответствия установленным стандартам качества и безопасности.
              </p>
              <p className="leading-relaxed text-sm md:text-base mb-3 md:mb-4">
                Данная услуга включает:
              </p>
              <ul className="list-disc pl-4 md:pl-5 mb-4 md:mb-6 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Регулярный анализ ключевых показателей деятельности аккредитованной организации</li>
                <li>Проверку соблюдения стандартов и критериев аккредитации</li>
                <li>Выявление областей для улучшения качества оказываемых услуг</li>
                <li>Рекомендации по устранению выявленных несоответствий</li>
              </ul>
              
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100 mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-medium text-blue-800 mb-1 md:mb-2">Сроки проведения</h3>
                <p className="text-blue-700 text-sm md:text-base">
                  <strong>Периодичность мониторинга:</strong> раз в квартал<br/>
                  <strong>Продолжительность процедуры:</strong> 5-7 рабочих дней
                </p>
              </div>
              
              <p className="leading-relaxed text-sm md:text-base mb-5 md:mb-0">
                Для получения более подробной информации о постаккредитационном мониторинге или подачи заявки на 
                услугу, пожалуйста, заполните форму ниже или свяжитесь с нашими специалистами по телефону.
              </p>
            </div>
            
            {/* Правая колонка - форма заявки */}
            <div className="w-full lg:w-1/2 px-2 md:px-4">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4 text-center">Заявка на услугу</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 md:mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2">ФИО</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      required
                    />
                  </div>
                  
                  <div className="mb-3 md:mb-4">
                    <label htmlFor="organization" className="block text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2">Название организации</label>
                    <input 
                      type="text" 
                      id="organization" 
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2">Телефон</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4 md:mb-6">
                    <label htmlFor="message" className="block text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2">Сообщение</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="consent" className="ml-2 block text-xs md:text-sm text-gray-700">
                      Я согласен на обработку персональных данных
                    </label>
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 md:px-6 rounded-md text-sm md:text-base transition duration-300 w-full sm:w-auto"
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
    </>
  );
}

PostAccreditationMonitoring.layout = (page) => <ServicesPageLayout title="Постаккредитационный мониторинг" img="service-accreditation">{page}</ServicesPageLayout>;

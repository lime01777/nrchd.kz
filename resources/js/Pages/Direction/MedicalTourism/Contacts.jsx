import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/Services/TranslationService';

export default function MedicalTourismContacts() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medicalTourismSubpages.contacts.title', 'Контакты')} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Наша команда специалистов по медицинскому туризму готова помочь вам в организации 
              получения медицинских услуг в Казахстане. Мы предоставляем полную поддержку на всех 
              этапах: от первичной консультации до завершения лечения.
            </p>
          </div>
          
          <div className="px-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Основные контакты</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Телефон горячей линии</h4>
                    <p className="text-gray-700">+7 (7172) 648-951</p>
                    <p className="text-sm text-gray-500">Пн-Пт: 9:00-18:00 (Астана)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Email</h4>
                    <p className="text-gray-700">medical.tourism@nrchd.kz</p>
                    <p className="text-sm text-gray-500">Ответ в течение 24 часов</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Адрес</h4>
                    <p className="text-gray-700">
                      г. Астана, ул. Кенесары, 40<br />
                      Национальный научный центр развития здравоохранения<br />
                      имени Салидат Каирбековой
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Специалисты по направлениям</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Координатор медицинского туризма</h4>
                    <p className="text-gray-700">Нургожина Мадина Темирбековна</p>
                    <p className="text-sm text-gray-500">m.nurgozhina@nrchd.kz</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Специалист по сертификации</h4>
                    <p className="text-gray-700">Тлеужан Аруана Аманкелдіқызы</p>
                    <p className="text-sm text-gray-500">a.tleuzhan@nrchd.kz</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Координатор по работе с пациентами</h4>
                    <p className="text-gray-700">Топаева Нурайым Ерболқызы</p>
                    <p className="text-sm text-gray-500">n.topaeva@nrchd.kz</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Форма обратной связи</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Имя *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Страна</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Выберите страну</option>
                    <option>Россия</option>
                    <option>Узбекистан</option>
                    <option>Кыргызстан</option>
                    <option>Туркменистан</option>
                    <option>Таджикистан</option>
                    <option>Азербайджан</option>
                    <option>Грузия</option>
                    <option>Армения</option>
                    <option>Другая</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Интересующая услуга</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Выберите услугу</option>
                    <option>Кардиология</option>
                    <option>Ортопедия</option>
                    <option>Репродуктивная медицина</option>
                    <option>Онкология</option>
                    <option>Стоматология</option>
                    <option>Пластическая хирургия</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Сообщение</label>
                  <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Опишите ваши потребности или задайте вопрос..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                    Отправить заявку
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <div className="text-3xl text-green-500 mb-2">📞</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Телефонная консультация</h4>
                <p className="text-gray-600">Получите бесплатную консультацию по телефону</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <div className="text-3xl text-green-500 mb-2">💬</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Онлайн чат</h4>
                <p className="text-gray-600">Задайте вопрос в режиме реального времени</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <div className="text-3xl text-green-500 mb-2">📧</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Email поддержка</h4>
                <p className="text-gray-600">Отправьте подробный запрос на email</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismContacts.layout = page => <LayoutFolderChlank 
  h1="Контакты" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

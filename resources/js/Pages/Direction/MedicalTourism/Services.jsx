import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/services/TranslationService';

export default function MedicalTourismServices() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medicalTourismSubpages.services.title', 'Услуги')} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Казахстан предлагает широкий спектр высококачественных медицинских услуг для иностранных пациентов. 
              Наши медицинские центры оснащены современным оборудованием и укомплектованы квалифицированными 
              специалистами, что позволяет оказывать медицинскую помощь на международном уровне.
            </p>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 px-4">Основные направления медицинских услуг:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4">
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Кардиология</h4>
                <p className="text-gray-600 mb-3">Диагностика и лечение сердечно-сосудистых заболеваний</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Коронарография</li>
                  <li>• Стентирование сосудов</li>
                  <li>• Кардиохирургия</li>
                  <li>• Реабилитация</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Ортопедия</h4>
                <p className="text-gray-600 mb-3">Лечение заболеваний опорно-двигательного аппарата</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Эндопротезирование суставов</li>
                  <li>• Артроскопия</li>
                  <li>• Спортивная травматология</li>
                  <li>• Реабилитация</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Репродуктивная медицина</h4>
                <p className="text-gray-600 mb-3">Лечение бесплодия и планирование семьи</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• ЭКО (ИКСИ)</li>
                  <li>• Криоконсервация</li>
                  <li>• Суррогатное материнство</li>
                  <li>• Генетическая диагностика</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Онкология</h4>
                <p className="text-gray-600 mb-3">Диагностика и лечение онкологических заболеваний</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Химиотерапия</li>
                  <li>• Лучевая терапия</li>
                  <li>• Хирургическое лечение</li>
                  <li>• Таргетная терапия</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Стоматология</h4>
                <p className="text-gray-600 mb-3">Современная стоматологическая помощь</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Имплантация</li>
                  <li>• Протезирование</li>
                  <li>• Ортодонтия</li>
                  <li>• Эстетическая стоматология</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Пластическая хирургия</h4>
                <p className="text-gray-600 mb-3">Эстетическая и реконструктивная хирургия</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Лифтинг лица</li>
                  <li>• Ринопластика</li>
                  <li>• Маммопластика</li>
                  <li>• Липосакция</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Преимущества медицинского туризма в Казахстане:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Доступные цены</h4>
                  <p className="text-gray-700">
                    Стоимость медицинских услуг в Казахстане на 30-70% ниже, чем в странах Европы и США, 
                    при сохранении высокого качества лечения.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Современные технологии</h4>
                  <p className="text-gray-700">
                    Ведущие клиники оснащены современным оборудованием и применяют передовые методики лечения.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Квалифицированные специалисты</h4>
                  <p className="text-gray-700">
                    Врачи проходят обучение в ведущих медицинских центрах мира и регулярно повышают квалификацию.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Безвизовый режим</h4>
                  <p className="text-gray-700">
                    Граждане многих стран могут въезжать в Казахстан без визы на срок до 30 дней.
                  </p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismServices.layout = page => <LayoutFolderChlank 
  h1="Популярные услуги" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

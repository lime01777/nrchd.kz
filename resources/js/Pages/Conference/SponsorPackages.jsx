import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Страница спонсорских пакетов конференции
 * Отображает информацию о возможностях спонсорства
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.locale Текущая локаль
 * @returns {React.ReactElement} Компонент страницы спонсорских пакетов
 */
export default function SponsorPackages({ locale }) {
  return (
    <ConferenceLayout title="Спонсорские пакеты">
      <Head>
        <title>Спонсорские пакеты - NRCHD Conference 2025</title>
        <meta name="description" content="Возможности спонсорства международной конференции по медицинскому туризму" />
      </Head>
      
      {/* Введение */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Спонсорские пакеты</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-12">
              Станьте спонсором международной конференции по медицинскому туризму и получите 
              уникальные возможности для продвижения вашего бренда среди целевой аудитории
            </p>
          </div>
        </div>
      </section>
      
      {/* Спонсорские пакеты */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Платиновый спонсор */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Платиновый</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Платиновый спонсор</h3>
                  <div className="text-3xl font-bold text-gray-600 mb-2">5,000,000 ₸</div>
                  <p className="text-sm text-gray-500">Эксклюзивный пакет</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Логотип на главной странице сайта
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Выступление на пленарном заседании
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Эксклюзивный стенд 3x3м
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    10 бесплатных регистраций
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Реклама в материалах конференции
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    VIP-прием для руководства
                  </li>
                </ul>
                <Link href="mailto:sponsors@conference.nrchd.kz" className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Стать спонсором
                </Link>
              </div>
              
              {/* Золотой спонсор */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-yellow-400 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Золотой</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Золотой спонсор</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">3,000,000 ₸</div>
                  <p className="text-sm text-gray-500">Премиум пакет</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Логотип на сайте конференции
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Выступление на секционном заседании
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Стенд 2x3м
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    5 бесплатных регистраций
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Реклама в программе
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Участие в кофе-брейках
                  </li>
                </ul>
                <Link href="mailto:sponsors@conference.nrchd.kz" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Стать спонсором
                </Link>
              </div>
              
              {/* Серебряный спонсор */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-400">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Серебряный спонсор</h3>
                  <div className="text-3xl font-bold text-gray-600 mb-2">1,500,000 ₸</div>
                  <p className="text-sm text-gray-500">Стандартный пакет</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Логотип в разделе спонсоров
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Участие в круглом столе
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Стенд 2x2м
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3 бесплатные регистрации
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Упоминание в материалах
                  </li>
                </ul>
                <Link href="mailto:sponsors@conference.nrchd.kz" className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Стать спонсором
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Дополнительные возможности */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Дополнительные возможности</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Спонсорство кофе-брейков</h4>
                <div className="text-2xl font-bold text-blue-600 mb-4">500,000 ₸</div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Брендирование зоны кофе-брейков</li>
                  <li>• Логотип на всех кофе-брейках</li>
                  <li>• 2 бесплатные регистрации</li>
                  <li>• Упоминание в программе</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Спонсорство обеда</h4>
                <div className="text-2xl font-bold text-green-600 mb-4">800,000 ₸</div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Брендирование обеденной зоны</li>
                  <li>• Логотип на всех обедах</li>
                  <li>• 3 бесплатные регистрации</li>
                  <li>• Приветственное слово</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Спонсорство материалов</h4>
                <div className="text-2xl font-bold text-purple-600 mb-4">300,000 ₸</div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Логотип на всех материалах</li>
                  <li>• Реклама в программе</li>
                  <li>• 1 бесплатная регистрация</li>
                  <li>• Упоминание в пресс-релизах</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Информационный спонсор</h4>
                <div className="text-2xl font-bold text-orange-600 mb-4">200,000 ₸</div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Логотип на сайте конференции</li>
                  <li>• Упоминание в СМИ</li>
                  <li>• 1 бесплатная регистрация</li>
                  <li>• Размещение пресс-релизов</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Преимущества спонсорства */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Преимущества спонсорства</h3>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Целевая аудитория</h4>
                <p className="text-gray-600 text-sm">Доступ к профессиональной аудитории из сферы здравоохранения и туризма</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Медиа-покрытие</h4>
                <p className="text-gray-600 text-sm">Упоминание в СМИ и социальных сетях конференции</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Нетворкинг</h4>
                <p className="text-gray-600 text-sm">Возможность установить деловые контакты с ключевыми игроками отрасли</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Географический охват</h4>
                <p className="text-gray-600 text-sm">Доступ к международной аудитории из 45 стран</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Долгосрочный эффект</h4>
                <p className="text-gray-600 text-sm">Материалы конференции доступны в течение года</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Репутация</h4>
                <p className="text-gray-600 text-sm">Укрепление репутации как социально ответственной компании</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Контакты для спонсоров */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Свяжитесь с нами</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Отдел по работе со спонсорами</h4>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Email:</strong> <a href="mailto:sponsors@conference.nrchd.kz" className="text-blue-600 hover:text-blue-800">sponsors@conference.nrchd.kz</a></p>
                    <p><strong>Телефон:</strong> +7 (7XX) XXX-XX-XX</p>
                    <p><strong>Мобильный:</strong> +7 (7XX) XXX-XX-XX</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Индивидуальные предложения</h4>
                  <p className="text-gray-600 mb-4">
                    Мы готовы обсудить индивидуальные условия спонсорства, 
                    которые соответствуют вашим маркетинговым целям.
                  </p>
                  <Link href="mailto:sponsors@conference.nrchd.kz" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                    Обсудить условия
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

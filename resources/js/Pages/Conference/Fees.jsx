import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Страница регистрационных взносов конференции
 * Отображает информацию о стоимости участия в конференции
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.locale Текущая локаль
 * @returns {React.ReactElement} Компонент страницы регистрационных взносов
 */
export default function Fees({ locale }) {
  return (
    <ConferenceLayout title="Регистрационные взносы">
      <Head>
        <title>Регистрационные взносы - NRCHD Conference 2025</title>
        <meta name="description" content="Информация о стоимости участия в международной конференции по медицинскому туризму" />
      </Head>
      
      {/* Введение */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Регистрационные взносы</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-12">
              Выберите подходящий тариф для участия в международной конференции по медицинскому туризму. 
              Все цены указаны в тенге (KZT) и включают НДС.
            </p>
          </div>
        </div>
      </section>
      
      {/* Тарифы для участников */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Тарифы для участников</h3>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Ранняя регистрация */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Ранняя регистрация</h4>
                  <p className="text-sm text-gray-600 mb-4">До 31 августа 2025</p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">150,000 ₸</div>
                  <p className="text-sm text-gray-500">Экономия 50,000 ₸</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Доступ ко всем сессиям
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Материалы конференции
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Кофе-брейки
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Сертификат участника
                  </li>
                </ul>
                <Link href={route('conference.registration')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Зарегистрироваться
                </Link>
              </div>
              
              {/* Стандартная регистрация */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-400 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Популярный</span>
                </div>
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Стандартная регистрация</h4>
                  <p className="text-sm text-gray-600 mb-4">1 сентября - 30 сентября 2025</p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">200,000 ₸</div>
                  <p className="text-sm text-gray-500">Стандартная цена</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Доступ ко всем сессиям
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Материалы конференции
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Кофе-брейки и обеды
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Сертификат участника
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Доступ к записям сессий
                  </li>
                </ul>
                <Link href={route('conference.registration')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Зарегистрироваться
                </Link>
              </div>
              
              {/* Поздняя регистрация */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Поздняя регистрация</h4>
                  <p className="text-sm text-gray-600 mb-4">1 октября - 13 октября 2025</p>
                  <div className="text-3xl font-bold text-gray-600 mb-2">250,000 ₸</div>
                  <p className="text-sm text-gray-500">Повышенная цена</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Доступ ко всем сессиям
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Материалы конференции
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Кофе-брейки и обеды
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Сертификат участника
                  </li>
                </ul>
                <Link href={route('conference.registration')} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors">
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Специальные тарифы */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Специальные тарифы</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Студенты */}
              <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Студенты и молодые ученые</h4>
                <div className="text-2xl font-bold text-green-600 mb-4">75,000 ₸</div>
                <p className="text-gray-600 mb-4">
                  Специальная цена для студентов медицинских вузов, аспирантов и молодых ученых 
                  (до 35 лет) при предъявлении соответствующих документов.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Скидка 50% от стандартной цены</li>
                  <li>• Требуется подтверждение статуса</li>
                  <li>• Ограниченное количество мест</li>
                </ul>
              </div>
              
              {/* Групповая регистрация */}
              <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-500">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Групповая регистрация</h4>
                <div className="text-2xl font-bold text-purple-600 mb-4">от 150,000 ₸</div>
                <p className="text-gray-600 mb-4">
                  Специальные условия для групп от 5 человек. Чем больше участников, 
                  тем больше скидка.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 5-10 человек: скидка 15%</li>
                  <li>• 11-20 человек: скидка 25%</li>
                  <li>• Более 20 человек: скидка 35%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Что включено в стоимость */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Что включено в стоимость участия</h3>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Доступ к сессиям</h4>
                <p className="text-gray-600 text-sm">Участие во всех пленарных заседаниях, секционных заседаниях и круглых столах</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Материалы конференции</h4>
                <p className="text-gray-600 text-sm">Электронные материалы, презентации спикеров и сборник тезисов</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Кофе-брейки</h4>
                <p className="text-gray-600 text-sm">Утренние и дневные кофе-брейки с легкими закусками</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Сертификат</h4>
                <p className="text-gray-600 text-sm">Сертификат участника международной конференции</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Записи сессий</h4>
                <p className="text-gray-600 text-sm">Доступ к записям всех сессий в течение 3 месяцев</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Нетворкинг</h4>
                <p className="text-gray-600 text-sm">Возможность общения с экспертами и коллегами</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Способы оплаты */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Способы оплаты</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Банковский перевод</h4>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Банк:</strong> АО "Народный Банк Казахстана"</p>
                    <p><strong>БИН:</strong> 920140000043</p>
                    <p><strong>ИИК:</strong> KZ12345678901234567890</p>
                    <p><strong>Назначение платежа:</strong> Регистрационный взнос за участие в конференции</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Онлайн оплата</h4>
                  <div className="space-y-3 text-gray-600">
                    <p>• Банковские карты (Visa, MasterCard)</p>
                    <p>• Электронные кошельки</p>
                    <p>• Мобильные платежи</p>
                    <p>• QR-код оплата</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Примечание:</strong> После оплаты вы получите подтверждение на указанный email. 
                  Для получения счета-фактуры свяжитесь с оргкомитетом.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

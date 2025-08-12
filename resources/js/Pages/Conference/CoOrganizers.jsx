import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head } from '@inertiajs/react';

/**
 * Страница со-организаторов конференции
 * Отображает информацию о со-организаторах мероприятия
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.locale Текущая локаль
 * @returns {React.ReactElement} Компонент страницы со-организаторов
 */
export default function CoOrganizers({ locale }) {
  return (
    <ConferenceLayout title="Со-организаторы">
      <Head>
        <title>Со-организаторы - NRCHD Conference 2025</title>
        <meta name="description" content="Со-организаторы международной конференции по медицинскому туризму" />
      </Head>
      
      {/* Введение */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Со-организаторы конференции</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-12">
              Наши со-организаторы - это ведущие организации, которые вносят значительный вклад 
              в развитие медицинского туризма и здравоохранения в Казахстане
            </p>
          </div>
        </div>
      </section>
      
      {/* Со-организаторы */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Ассоциация организаторов */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-3-2a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM7 14a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">РОО «Ассоциация организаторов в сфере охраны здоровья»</h3>
                  <p className="text-blue-600 font-semibold">Со-организатор</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Общественная организация, объединяющая ведущих специалистов и организации 
                  в сфере здравоохранения для развития отрасли и повышения качества медицинских услуг.
                </p>
              </div>
              
              {/* DeConsilior */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">DeConsilior</h3>
                  <p className="text-green-600 font-semibold">Со-организатор</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Международная консалтинговая компания, специализирующаяся на развитии 
                  медицинского туризма и организации международных медицинских мероприятий.
                </p>
              </div>
              
              {/* Ассоциация медицинского туризма */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Казахстанская ассоциация медицинского туризма</h3>
                  <p className="text-purple-600 font-semibold">Со-организатор</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Профессиональная ассоциация, объединяющая медицинские учреждения, 
                  туристические компании и специалистов в области медицинского туризма.
                </p>
              </div>
              
              {/* Международная ассоциация */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Международная ассоциация медицинского туризма</h3>
                  <p className="text-orange-600 font-semibold">Международный партнер</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Ведущая международная организация, устанавливающая стандарты 
                  и продвигающая лучшие практики в области медицинского туризма.
                </p>
              </div>
              
              {/* Ассоциация клиник */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Ассоциация частных клиник Казахстана</h3>
                  <p className="text-red-600 font-semibold">Со-организатор</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Объединение ведущих частных медицинских учреждений, 
                  специализирующихся на оказании высококачественных медицинских услуг.
                </p>
              </div>
              
              {/* Туристическая ассоциация */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Ассоциация туристических компаний</h3>
                  <p className="text-teal-600 font-semibold">Со-организатор</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Профессиональное объединение туристических компаний, 
                  специализирующихся на медицинском туризме и оздоровительных турах.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Роли со-организаторов */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Роли со-организаторов</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Организационная поддержка</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Координация участников и спикеров</li>
                  <li>• Организация технической поддержки</li>
                  <li>• Помощь в проведении сессий</li>
                  <li>• Логистическое обеспечение</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Экспертная поддержка</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Формирование научной программы</li>
                  <li>• Привлечение международных экспертов</li>
                  <li>• Методологическая поддержка</li>
                  <li>• Оценка качества контента</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Информационная поддержка</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Продвижение конференции</li>
                  <li>• Работа со СМИ</li>
                  <li>• Социальные сети и PR</li>
                  <li>• Международная коммуникация</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Финансовая поддержка</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Спонсорские взносы</li>
                  <li>• Привлечение инвесторов</li>
                  <li>• Финансовое планирование</li>
                  <li>• Бюджетный контроль</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

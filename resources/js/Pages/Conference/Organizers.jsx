import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head } from '@inertiajs/react';

/**
 * Страница организаторов конференции
 * Отображает информацию об основных организаторах мероприятия
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.locale Текущая локаль
 * @returns {React.ReactElement} Компонент страницы организаторов
 */
export default function Organizers({ locale }) {
  return (
    <ConferenceLayout title="Организаторы">
      <Head>
        <title>Организаторы - NRCHD Conference 2025</title>
        <meta name="description" content="Организаторы международной конференции по медицинскому туризму" />
      </Head>
      
      {/* Основные организаторы */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Основные организаторы</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-12">
              Международная конференция проводится при поддержке ведущих организаций в сфере здравоохранения Казахстана
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* ННЦРЗ */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК</h3>
                  <p className="text-blue-600 font-semibold">Главный организатор</p>
                </div>
                <p className="text-gray-600 text-center">
                  Ведущая организация в области развития здравоохранения, координации научных исследований 
                  и внедрения инновационных технологий в медицине Казахстана.
                </p>
              </div>
              
              {/* Минздрав */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.2 5.6a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8zm0 4.8a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8zm0 4.8a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Министерство здравоохранения Республики Казахстан</h3>
                  <p className="text-green-600 font-semibold">Поддержка</p>
                </div>
                <p className="text-gray-600 text-center">
                  Центральный орган исполнительной власти, осуществляющий руководство и координацию 
                  деятельности в сфере здравоохранения Республики Казахстан.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Организационный комитет */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Организационный комитет</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Председатель оргкомитета</h4>
                <p className="text-gray-600">Доктор медицинских наук, профессор</p>
                <p className="text-blue-600 font-medium">Иванов Иван Иванович</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Заместитель председателя</h4>
                <p className="text-gray-600">Кандидат медицинских наук</p>
                <p className="text-blue-600 font-medium">Петров Петр Петрович</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Научный секретарь</h4>
                <p className="text-gray-600">Доктор медицинских наук</p>
                <p className="text-blue-600 font-medium">Сидоров Сидор Сидорович</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Координатор программы</h4>
                <p className="text-gray-600">Магистр здравоохранения</p>
                <p className="text-blue-600 font-medium">Козлова Анна Сергеевна</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Технический директор</h4>
                <p className="text-gray-600">Инженер-технолог</p>
                <p className="text-blue-600 font-medium">Морозов Дмитрий Александрович</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-2">Координатор по связям</h4>
                <p className="text-gray-600">Специалист по PR</p>
                <p className="text-blue-600 font-medium">Новикова Елена Владимировна</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Контакты оргкомитета */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Контакты организационного комитета</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Общие вопросы</h3>
                  <div className="space-y-3">
                    <p><strong>Email:</strong> <a href="mailto:info@conference.nrchd.kz" className="text-blue-600 hover:text-blue-800">info@conference.nrchd.kz</a></p>
                    <p><strong>Телефон:</strong> +7 (7XX) XXX-XX-XX</p>
                    <p><strong>Факс:</strong> +7 (7XX) XXX-XX-XX</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Регистрация участников</h3>
                  <div className="space-y-3">
                    <p><strong>Email:</strong> <a href="mailto:registration@conference.nrchd.kz" className="text-blue-600 hover:text-blue-800">registration@conference.nrchd.kz</a></p>
                    <p><strong>Телефон:</strong> +7 (7XX) XXX-XX-XX</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Адрес оргкомитета</h3>
                <p className="text-gray-600">
                  г. Астана, ул. Мангилик ел, 20<br />
                  Национальный научный центр развития здравоохранения имени Салидат Каирбековой<br />
                  Кабинет 507, 5 этаж
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

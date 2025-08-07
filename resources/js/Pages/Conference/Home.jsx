import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Главная страница конференции по медицинскому туризму
 * Отображает информацию о мероприятии, ключевые даты и регистрационные взносы
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.locale Текущая локаль
 * @returns {React.ReactElement} Компонент главной страницы
 */
export default function Home({ locale }) {
  return (
    <ConferenceLayout>
      <Head>
        <title>Международная конференция по медицинскому туризму в Казахстане</title>
        <meta name="description" content="Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»" />
      </Head>
      
      {/* Главный баннер */}
      <section className="bg-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Международная конференция и выставка</h1>
          <h2 className="text-xl md:text-2xl mb-8">«Развитие медицинского туризма в Казахстане: перспективы и возможности»</h2>
          <p className="text-lg md:text-xl mb-8">13-15 октября 2025, г. Астана • 16-17 октября 2025, г. Алматы</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={route('conference.registration')} className="bg-white text-blue-700 hover:bg-blue-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Регистрация
            </Link>
            <Link href={route('conference.program')} className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Программа
            </Link>
          </div>
        </div>
      </section>
      
      {/* О мероприятии */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">О мероприятии</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              Первая международная конференция по медицинскому туризму представляет собой уникальную площадку 
              для продвижения туристического потенциала Казахстана и укрепления международного имиджа страны 
              в сфере туризма и медицины.
            </p>
            <p className="text-lg mb-6">
              Медицинский туризм - это ответственное и многогранное направление, требующее особого внимания, 
              ведь речь идёт о здоровье людей. В данном сегменте ключевое значение имеют качество предоставляемых услуг, 
              уровень технического оснащения клиник, опыт медицинского персонала и высокая квалификация врачей.
            </p>
            <p className="text-lg mb-6">
              Как отметил Глава государства: «Мы видим большой потенциал в развитии медицинского туризма, 
              особенно в высокотехнологичных отраслях…... Готовы выстраивать устойчивые трансграничные связи 
              для достижения прогресса в этой сфере.»
            </p>
            <p className="text-lg mb-6">
              Наша миссия - развитие медицинского туризма в Казахстане, популяризация уникальных туристических 
              достопримечательностей и привлечение иностранной валюты в экономику страны. Мы стремимся повысить 
              международную узнаваемость Казахстана как центра туризма и медицины, способствовать созданию новых 
              рабочих мест и укреплению имиджа страны на мировом уровне.
            </p>
            <div className="text-center mt-8">
              <Link href={route('conference.about')} className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center">
                Подробнее о мероприятии
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="#" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Спикеры
              </Link>
              <Link href="#" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Спонсоры
              </Link>
              <Link href="#" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Партнеры
              </Link>
              <Link href="#" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Спонсорские пакеты
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ключевая информация */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Масштаб мероприятия</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <p>делегатов из 45 стран</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">300+</div>
              <p>профильных специалистов из Казахстана</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <p>медицинских организаций и партнеров</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <p>целевых посетителей</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Организаторы */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Организаторы</h2>
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-center text-lg">
              Международная конференция проводится при поддержке Министерства здравоохранения Республики Казахстан, 
              при организации РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК, 
              РОО «Ассоциация организаторов в сфере охраны здоровья» и DeConsilior.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                {/* Здесь будет логотип Минздрав */}
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.2 5.6a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8zm0 4.8a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8zm0 4.8a.8.8 0 01.8-.8h6a.8.8 0 110 1.6h-6a.8.8 0 01-.8-.8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Министерство здравоохранения РК</h3>
              <p className="text-gray-600">Поддержка</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                {/* Здесь будет логотип ННЦРЗ */}
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">ННЦРЗ им. С. Каирбековой</h3>
              <p className="text-gray-600">Организатор</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                {/* Здесь будет логотип Ассоциации */}
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-3-2a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM7 14a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">РОО «Ассоциация организаторов в сфере охраны здоровья»</h3>
              <p className="text-gray-600">Со-организатор</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href={route('conference.registration')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Индивидуальная регистрация
            </Link>
            <div className="mt-4 text-gray-600">
              <p>Место проведения конференции: г. Астана - Президентский центр Республики Казахстан</p>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

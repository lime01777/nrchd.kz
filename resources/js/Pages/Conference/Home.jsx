import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Главная страница конференции
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg font-semibold text-gray-700 mb-2">13-15 октября 2025, г.Астана</p>
              <p className="text-lg font-semibold text-gray-700 mb-4">16-17 октября 2025, г.Алматы</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»</h3>
            </div>
            
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
            
            <p className="text-lg mb-6">
              Международная конференция проводится при поддержке Министерства здравоохранения Республики Казахстан, 
              при организации РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК, 
              РОО «Ассоциация организаторов в сфере охраны здоровья» и DeConsilior.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Главное событие Казахстана в сфере развития медицинского туризма</h4>
              <p className="text-lg">
                — Первая международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности».
              </p>
              <p className="text-lg mt-3">
                Мероприятие объединит под одной крышей <strong>200 делегатов из 45 стран</strong>, <strong>300 профильных специалистов из Казахстана</strong>, 
                представителей <strong>100 медицинских организаций и партнеров</strong>, а также <strong>1000 целевых посетителей</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Место проведения */}
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Место проведения конференции</h2>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">г. Астана - Президентский центр Республики Казахстан</h3>
              <p className="text-lg text-gray-600 mb-6">
                Престижная площадка для проведения международных мероприятий, расположенная в сердце столицы Казахстана.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Адрес:</h4>
                  <p className="text-gray-600">г. Астана, ул. Мангилик ел, 20</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Дата проведения:</h4>
                  <p className="text-gray-600">13-15 октября 2025 года</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ключевая информация */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Масштаб мероприятия</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <p>делегатов из 45 стран</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <p>экспертов и спикеров</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
              <p>спонсоров и партнеров</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <p>дней интенсивной работы</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Быстрые ссылки */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Информация для участников</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link href={route('conference.speakers')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Спикеры</h3>
              <p className="text-gray-600">Познакомьтесь с ведущими экспертами в области медицинского туризма</p>
            </Link>
            <Link href={route('conference.organizers')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Организаторы</h3>
              <p className="text-gray-600">Узнайте о команде организаторов конференции</p>
            </Link>
            <Link href={route('conference.co-organizers')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Со-организаторы</h3>
              <p className="text-gray-600">Наши партнеры по организации мероприятия</p>
            </Link>
            <Link href={route('conference.supporters')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Нас поддержали</h3>
              <p className="text-gray-600">Организации, поддержавшие проведение конференции</p>
            </Link>
            <Link href={route('conference.sponsors')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Наши спонсоры</h3>
              <p className="text-gray-600">Компании, спонсирующие конференцию</p>
            </Link>
            <Link href={route('conference.partners')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Партнеры</h3>
              <p className="text-gray-600">Стратегические партнеры конференции</p>
            </Link>
            <Link href={route('conference.info-partners')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Информационный партнер</h3>
              <p className="text-gray-600">СМИ и информационные партнеры</p>
            </Link>
            <Link href={route('conference.registration')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Индивидуальная регистрация</h3>
              <p className="text-gray-600">Зарегистрируйтесь для участия в конференции</p>
            </Link>
            <Link href={route('conference.fees')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Регистрационные взносы</h3>
              <p className="text-gray-600">Информация о стоимости участия</p>
            </Link>
            <Link href={route('conference.sponsor-packages')} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Спонсорские пакеты</h3>
              <p className="text-gray-600">Возможности для спонсоров конференции</p>
            </Link>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

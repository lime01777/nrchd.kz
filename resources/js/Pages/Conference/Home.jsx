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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">Международная конференция и выставка</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 leading-tight px-2">«Развитие медицинского туризма в Казахстане: перспективы и возможности»</h2>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 px-2">13-14 октября 2025, г. Астана • 16-17 октября 2025, г. Алматы</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
            <Link href={route('conference.registration')} className="bg-white text-blue-700 hover:bg-blue-100 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base md:text-lg transition-colors w-full sm:w-auto">
              Регистрация
            </Link>
            <Link href={route('conference.program')} className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base md:text-lg transition-colors w-full sm:w-auto">
              Программа
            </Link>
          </div>
        </div>
      </section>
      
      {/* О мероприятии */}
      <section className="py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">О мероприятии</h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 md:mb-8 px-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">Международная научно-практическая конференция «Здравоохранение Казахстана: инновации, доступность, глобализация»</h3>
              <p className="text-base md:text-lg font-semibold text-gray-700 mb-2">13-14 октября 2025, г.Астана</p>
              <p className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">16-17 октября 2025, г.Алматы</p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»</h4>
            </div>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Первая международная конференция по медицинскому туризму представляет собой уникальную площадку 
              для продвижения туристического потенциала Казахстана и укрепления международного имиджа страны 
              в сфере туризма и медицины.
            </p>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Медицинский туризм - это ответственное и многогранное направление, требующее особого внимания, 
              ведь речь идёт о здоровье людей. В данном сегменте ключевое значение имеют качество предоставляемых услуг, 
              уровень технического оснащения клиник, опыт медицинского персонала и высокая квалификация врачей.
            </p>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Как отметил Глава государства: «Мы видим большой потенциал в развитии медицинского туризма, 
              особенно в высокотехнологичных отраслях…... Готовы выстраивать устойчивые трансграничные связи 
              для достижения прогресса в этой сфере.»
            </p>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Наша миссия - развитие медицинского туризма в Казахстане, популяризация уникальных туристических 
              достопримечательностей и привлечение иностранной валюты в экономику страны. Мы стремимся повысить 
              международную узнаваемость Казахстана как центра туризма и медицины, способствовать созданию новых 
              рабочих мест и укреплению имиджа страны на мировом уровне.
            </p>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Международная конференция проводится при поддержке Министерства здравоохранения Республики Казахстан, 
              при организации РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК, 
              РОО «Ассоциация организаторов в сфере охраны здоровья» и DeConsilior.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
              <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">Главное событие Казахстана в сфере развития медицинского туризма</h4>
              <p className="text-base md:text-lg leading-relaxed">
                — Первая международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности».
              </p>
              <p className="text-base md:text-lg mt-2 md:mt-3 leading-relaxed">
                Мероприятие объединит под одной крышей <strong>200 делегатов из 45 стран</strong>, <strong>300 профильных специалистов из Казахстана</strong>, 
                представителей <strong>100 медицинских организаций и партнеров</strong>, а также <strong>1000 целевых посетителей</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Место проведения */}
      <section className="bg-blue-50 py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Место проведения конференции</h2>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 leading-tight">Место проведения: г. Астана - Фонд Президента, улица Бокейхана 1</h3>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                Престижная площадка для проведения международных мероприятий, расположенная в сердце столицы Казахстана.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Адрес:</h4>
                  <p className="text-gray-600 text-sm md:text-base">г. Астана, ул. Бокейхана, 1</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Дата проведения:</h4>
                  <p className="text-gray-600 text-sm md:text-base">13-14 октября 2025 года</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ключевая информация */}
      <section className="py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Масштаб мероприятия</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">200+</div>
              <p className="text-sm md:text-base">делегатов из 45 стран</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">50+</div>
              <p className="text-sm md:text-base">экспертов и спикеров</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">30+</div>
              <p className="text-sm md:text-base">спонсоров и партнеров</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">5</div>
              <p className="text-sm md:text-base">дней интенсивной работы</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Быстрые ссылки */}
      <section className="bg-gray-50 py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Информация для участников</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <Link href={route('conference.speakers')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Спикеры</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Познакомьтесь с ведущими экспертами в области медицинского туризма</p>
            </Link>
            <Link href={route('conference.organizers')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Организаторы</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Узнайте о команде организаторов конференции</p>
            </Link>
            <Link href={route('conference.co-organizers')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Со-организаторы</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Наши партнеры по организации мероприятия</p>
            </Link>
            <Link href={route('conference.supporters')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Нас поддержали</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Организации, поддержавшие проведение конференции</p>
            </Link>
            <Link href={route('conference.sponsors')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Наши спонсоры</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Компании, спонсирующие конференцию</p>
            </Link>
            <Link href={route('conference.partners')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Партнеры</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Стратегические партнеры конференции</p>
            </Link>
            <Link href={route('conference.info-partners')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Информационный партнер</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">СМИ и информационные партнеры</p>
            </Link>
            <Link href={route('conference.registration')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Индивидуальная регистрация</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Зарегистрируйтесь для участия в конференции</p>
            </Link>
            <Link href={route('conference.fees')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Регистрационные взносы</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Информация о стоимости участия</p>
            </Link>
            <Link href={route('conference.sponsor-packages')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Спонсорские пакеты</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Возможности для спонсоров конференции</p>
            </Link>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

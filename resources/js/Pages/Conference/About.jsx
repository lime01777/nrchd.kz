import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head } from '@inertiajs/react';

/**
 * Страница "О мероприятии" - Международная конференция по медицинскому туризму
 * 
 * @returns {React.ReactElement} Страница с подробной информацией о конференции по медицинскому туризму
 */
export default function About() {
  return (
    <ConferenceLayout title="О мероприятии">
      <Head>
        <title>О мероприятии - Международная конференция по медицинскому туризму</title>
        <meta name="description" content="Подробная информация о международной конференции и выставке «Развитие медицинского туризма в Казахстане: перспективы и возможности»" />
      </Head>
      
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg mb-4 md:mb-6 font-semibold text-blue-800 text-center leading-tight px-2">
              Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="border-b-2 border-blue-600 w-24"></div>
            </div>
            
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Цель Конференции – создание диалоговой площадки для обсуждения актуальных тенденций и вызовов в сфере здравоохранения, обмена опытом между национальными и международными экспертами, а также презентации инновационных решений, технологий, лекарственных средств и медицинского оборудования, способствующих устойчивому развитию отрасли.
            </p>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Участники конференции</h3>
            <p className="text-base md:text-lg mb-3 md:mb-6 leading-relaxed">
              Конференция объединит ключевых участников медицинской отрасли:
            </p>
            <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 mb-4 md:mb-6 text-sm md:text-base">
              <li>Руководителей Управлений здравоохранения всех 19 областей Казахстана;</li>
              <li>Представителей крупных медицинских центров и частных клиник;</li>
              <li>Экспертов в области диагностики, лечения и инновационных технологий;</li>
              <li>Международных партнеров в сфере медицинского туризма.</li>
            </ul>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Масштаб мероприятия</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center border border-blue-200">
                <p className="text-2xl md:text-3xl font-bold text-blue-800">200+</p>
                <p className="text-xs md:text-sm text-gray-700 leading-tight">делегатов из 45 стран</p>
              </div>
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center border border-blue-200">
                <p className="text-2xl md:text-3xl font-bold text-blue-800">300+</p>
                <p className="text-xs md:text-sm text-gray-700 leading-tight">специалистов из Казахстана</p>
              </div>
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center border border-blue-200">
                <p className="text-2xl md:text-3xl font-bold text-blue-800">50+</p>
                <p className="text-xs md:text-sm text-gray-700 leading-tight">организаций-участников</p>
              </div>
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center border border-blue-200">
                <p className="text-2xl md:text-3xl font-bold text-blue-800">1000+</p>
                <p className="text-xs md:text-sm text-gray-700 leading-tight">посетителей выставки</p>
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Даты и места проведения</h3>
            <div className="bg-blue-50 p-4 md:p-6 rounded-lg mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border-b md:border-r md:border-b-0 border-blue-200 pb-3 md:pb-0 md:pr-4">
                  <h4 className="text-lg md:text-xl font-semibold text-blue-800">Астана</h4>
                  <p className="text-base md:text-lg">13-14 октября 2025 г.</p>
                  <p className="text-sm md:text-base">Президентский центр Республики Казахстан</p>
                </div>
                <div className="flex-1 pt-3 md:pt-0 md:pl-4">
                  <h4 className="text-lg md:text-xl font-semibold text-blue-800">Алматы</h4>
                  <p className="text-base md:text-lg">16-17 октября 2025 г.</p>
                  <p className="text-sm md:text-base">Выездные сессии в ведущие клиники города</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Миссия конференции</h3>
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Создание эффективной платформы для развития медицинского туризма в Казахстане, укрепления 
              международных связей и формирования долгосрочных стратегий, которые позволят стране 
              занять достойное место на глобальной карте медицинского туризма.
            </p>
            
            <div className="bg-blue-50 p-4 md:p-6 rounded-lg my-6 md:my-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-800">Основные направления конференции:</h3>
              <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Государственная политика и стратегические инициативы в сфере медицинского туризма</li>
                <li>Международные стандарты качества медицинских услуг и аккредитация</li>
                <li>Маркетинг и продвижение услуг медицинского туризма</li>
                <li>Развитие инфраструктуры и сервисов для иностранных пациентов</li>
                <li>Инвестиционные возможности в секторе медицинского туризма</li>
                <li>Цифровые технологии и телемедицина как драйверы роста</li>
                <li>Санаторно-курортное лечение и оздоровительный туризм</li>
              </ul>
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Организаторы</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="border border-gray-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-16 md:h-20 w-24 md:w-32 bg-gray-100 mb-2 md:mb-3 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold text-sm md:text-base leading-tight">Министерство здравоохранения<br />Республики Казахстан</p>
              </div>
              <div className="border border-gray-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-16 md:h-20 w-24 md:w-32 bg-gray-100 mb-2 md:mb-3 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold text-sm md:text-base leading-tight">ННЦРЗ им. Салидат Каирбековой</p>
              </div>
              <div className="border border-gray-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-16 md:h-20 w-24 md:w-32 bg-gray-100 mb-2 md:mb-3 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold text-sm md:text-base leading-tight">РОО "Ассоциация организаторов<br />в сфере охраны здоровья"</p>
              </div>
              <div className="border border-gray-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-16 md:h-20 w-24 md:w-32 bg-gray-100 mb-2 md:mb-3 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold text-sm md:text-base leading-tight">DeConsilior</p>
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800">Поддержка на государственном уровне</h3>
            <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
              Конференция проводится при поддержке Правительства Республики Казахстан в рамках реализации 
              государственной программы по развитию экспорта медицинских услуг и укреплению позиций 
              Казахстана на международном рынке медицинского туризма.
            </p>
            
            <div className="mt-8 md:mt-12 p-4 md:p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center text-blue-800">Контактная информация</h3>
              <p className="text-center text-sm md:text-base leading-relaxed">
                По вопросам участия: <a href="mailto:info@medtourism.kz" className="text-blue-600 hover:underline">info@medtourism.kz</a><br />
                По вопросам выступления: <a href="mailto:speakers@medtourism.kz" className="text-blue-600 hover:underline">speakers@medtourism.kz</a><br />
                По вопросам сотрудничества: <a href="mailto:partners@medtourism.kz" className="text-blue-600 hover:underline">partners@medtourism.kz</a><br />
                Телефон оргкомитета: <a href="tel:+77172123456" className="text-blue-600 hover:underline">+7 (7172) 12-34-56</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

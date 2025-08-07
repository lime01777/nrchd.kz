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
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-6 font-semibold text-blue-800 text-center">
              Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="border-b-2 border-blue-600 w-24"></div>
            </div>
            
            <p className="text-lg mb-6">
              Впервые в Казахстане пройдет масштабная международная конференция и выставка, посвященная 
              развитию медицинского туризма. Мероприятие объединит ведущих международных экспертов, 
              представителей госорганов, руководителей медицинских организаций и туристической отрасли 
              для выработки стратегических решений и обмена опытом.              
            </p>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">О конференции</h3>
            <p className="text-lg mb-6">
              Медицинский туризм – одно из наиболее динамично развивающихся направлений в глобальной 
              индустрии здравоохранения и туризма. Казахстан, обладающий уникальными природными ресурсами, 
              качественной медицинской инфраструктурой и выгодным географическим положением, имеет огромный 
              потенциал для развития этой отрасли.
            </p>
            <p className="text-lg mb-6">
              Конференция станет крупнейшей платформой, где представители различных секторов обсудят 
              стратегические вопросы развития медицинского туризма, познакомятся с лучшими международными 
              практиками и наладят деловые связи для дальнейшего сотрудничества.  
            </p>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">Масштаб мероприятия</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <p className="text-3xl font-bold text-blue-800">200+</p>
                <p className="text-gray-700">делегатов из 45 стран</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <p className="text-3xl font-bold text-blue-800">300+</p>
                <p className="text-gray-700">специалистов из Казахстана</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <p className="text-3xl font-bold text-blue-800">50+</p>
                <p className="text-gray-700">организаций-участников</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <p className="text-3xl font-bold text-blue-800">1000+</p>
                <p className="text-gray-700">посетителей выставки</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">Даты и места проведения</h3>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border-b md:border-r md:border-b-0 border-blue-200 pb-4 md:pb-0 md:pr-4">
                  <h4 className="text-xl font-semibold text-blue-800">Астана</h4>
                  <p className="text-lg">13-15 октября 2025 г.</p>
                  <p>Президентский центр Республики Казахстан</p>
                </div>
                <div className="flex-1 pt-4 md:pt-0 md:pl-4">
                  <h4 className="text-xl font-semibold text-blue-800">Алматы</h4>
                  <p className="text-lg">16-17 октября 2025 г.</p>
                  <p>Выездные сессии в ведущие клиники города</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">Миссия конференции</h3>
            <p className="text-lg mb-6">
              Создание эффективной платформы для развития медицинского туризма в Казахстане, укрепления 
              международных связей и формирования долгосрочных стратегий, которые позволят стране 
              занять достойное место на глобальной карте медицинского туризма.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg my-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Основные направления конференции:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Государственная политика и стратегические инициативы в сфере медицинского туризма</li>
                <li>Международные стандарты качества медицинских услуг и аккредитация</li>
                <li>Маркетинг и продвижение услуг медицинского туризма</li>
                <li>Развитие инфраструктуры и сервисов для иностранных пациентов</li>
                <li>Инвестиционные возможности в секторе медицинского туризма</li>
                <li>Цифровые технологии и телемедицина как драйверы роста</li>
                <li>Санаторно-курортное лечение и оздоровительный туризм</li>
              </ul>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">Организаторы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-20 w-32 bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold">Министерство здравоохранения<br />Республики Казахстан</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-20 w-32 bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold">ННЦРЗ им. Салидат Каирбековой</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-20 w-32 bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold">РОО "Ассоциация организаторов<br />в сфере охраны здоровья"</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="h-20 w-32 bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Логотип</span>
                </div>
                <p className="font-semibold">DeConsilior</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-blue-800">Поддержка на государственном уровне</h3>
            <p className="text-lg mb-6">
              Конференция проводится при поддержке Правительства Республики Казахстан в рамках реализации 
              государственной программы по развитию экспорта медицинских услуг и укреплению позиций 
              Казахстана на международном рынке медицинского туризма.
            </p>
            
            <div className="mt-12 p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-xl font-semibold mb-4 text-center text-blue-800">Контактная информация</h3>
              <p className="text-center">
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

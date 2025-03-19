import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function StrategicInitiatives() {
  return (
    <>
      <Head title="Стратегические инициативы и международное сотрудничество" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Стратегические инициативы</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой реализует ряд стратегических инициатив, 
              направленных на совершенствование системы здравоохранения Казахстана и достижение ключевых показателей здоровья населения.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Основные стратегические направления:</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Развитие человеческого капитала</h4>
                <p className="text-gray-700">
                  Совершенствование системы медицинского образования, повышение квалификации медицинских работников, 
                  внедрение современных образовательных технологий и методик.
                </p>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Цифровизация здравоохранения</h4>
                <p className="text-gray-700">
                  Развитие единой информационной системы здравоохранения, внедрение телемедицинских технологий, 
                  создание электронных паспортов здоровья и цифровых сервисов для пациентов.
                </p>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Повышение качества медицинской помощи</h4>
                <p className="text-gray-700">
                  Разработка и внедрение клинических протоколов, стандартов и индикаторов качества, 
                  развитие системы аккредитации медицинских организаций.
                </p>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Развитие медицинской науки</h4>
                <p className="text-gray-700">
                  Поддержка приоритетных научных исследований, развитие инновационных технологий, 
                  интеграция науки и практического здравоохранения.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Международное сотрудничество</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg text-gray-700 mb-4">
              Национальный научный центр развития здравоохранения активно развивает международное сотрудничество 
              с ведущими организациями здравоохранения, научными и образовательными учреждениями разных стран.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Ключевые партнеры:</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <img src="/img/partners/who.png" alt="Всемирная организация здравоохранения" className="h-16 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Всемирная организация здравоохранения (ВОЗ)</h4>
                <p className="text-gray-600">Сотрудничество в области разработки политики здравоохранения, обмена опытом и экспертизы</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <img src="/img/partners/unicef.png" alt="ЮНИСЕФ" className="h-16 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">ЮНИСЕФ</h4>
                <p className="text-gray-600">Совместные проекты по охране здоровья матери и ребенка, вакцинации и питанию</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <img src="/img/partners/worldbank.png" alt="Всемирный банк" className="h-16 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Всемирный банк</h4>
                <p className="text-gray-600">Проекты по модернизации системы здравоохранения и повышению эффективности</p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Направления международного сотрудничества:</h3>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Обмен опытом и лучшими практиками в области организации здравоохранения</li>
              <li>Совместные научные исследования и публикации</li>
              <li>Образовательные программы и стажировки для специалистов здравоохранения</li>
              <li>Участие в международных конференциях, симпозиумах и форумах</li>
              <li>Реализация совместных проектов по приоритетным направлениям здравоохранения</li>
              <li>Консультативная поддержка в разработке нормативных документов и стандартов</li>
            </ul>
            
            <div className="mt-10 bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Международные проекты</h4>
              <p className="text-gray-700 mb-4">
                В настоящее время Центр участвует в реализации нескольких международных проектов, направленных на:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Повышение доступности и качества первичной медико-санитарной помощи</li>
                <li>Развитие системы общественного здравоохранения</li>
                <li>Совершенствование системы медицинского образования</li>
                <li>Внедрение инновационных технологий в здравоохранение</li>
                <li>Борьбу с неинфекционными заболеваниями</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

StrategicInitiatives.layout = page => <LayoutDirection img="international" h1="Стратегические инициативы и международное сотрудничество">{page}</LayoutDirection>;

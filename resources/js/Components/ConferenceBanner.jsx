import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Компонент баннера конференции для главной страницы
 * Отображает информацию о международной конференции по медицинскому туризму
 * 
 * @returns {React.ReactElement} Компонент баннера конференции
 */
export default function ConferenceBanner() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Заголовок конференции */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
            Международная научно-практическая конференция
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 leading-tight px-2">
            «Здравоохранение Казахстана: инновации, доступность, глобализация»
          </h3>
          
          {/* Даты и места проведения */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 lg:gap-8 mb-6 md:mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto">
              <p className="text-base md:text-lg font-semibold">13-14 октября 2025</p>
              <p className="text-xs md:text-sm opacity-90">г. Астана</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto">
              <p className="text-base md:text-lg font-semibold">16-17 октября 2025</p>
              <p className="text-xs md:text-sm opacity-90">г. Алматы</p>
            </div>
          </div>
          
          {/* Краткое описание */}
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            Создание диалоговой площадки для обсуждения актуальных тенденций и вызовов в сфере здравоохранения, 
            обмена опытом между национальными и международными экспертами
          </p>
          
          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
            <Link 
              href="https://conference.nrchd.kz" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base md:text-lg transition-colors duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Подробнее о конференции
            </Link>
            <Link 
              href="https://conference.nrchd.kz/registration" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base md:text-lg transition-colors duration-300 w-full sm:w-auto"
            >
              Регистрация
            </Link>
          </div>
          
          {/* Дополнительная информация */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm px-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
              <p className="font-semibold mb-1">Место проведения</p>
              <p className="opacity-90 leading-tight">Президентский центр Республики Казахстан</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
              <p className="font-semibold mb-1">Участники</p>
              <p className="opacity-90 leading-tight">200+ делегатов из 45 стран</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 sm:col-span-2 md:col-span-1">
              <p className="font-semibold mb-1">Организатор</p>
              <p className="opacity-90 leading-tight">ННЦРЗ им. Салидат Каирбековой</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

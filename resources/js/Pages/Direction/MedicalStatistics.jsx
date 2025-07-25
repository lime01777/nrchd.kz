import { Head, Link } from '@inertiajs/react';
import route from '../../Utils/routeWithLocale';
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FilesAccord from '@/Components/FilesAccord';
import FolderChlank from '@/Components/FolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import SwitchableChart from '@/Components/SwitchableChart';
import DocumentCards from '@/Components/DocumentCards';

export default function MedicalStatistics() {
    const [showFullText, setShowFullText] = useState(false);

    return (
        <LayoutDirection img="static" h1="Медицинская статистика" useVideo={true}>
            <Head title="Медицинская статистика | NNCRZ" meta={[{ name: 'description', content: 'Медицинская статистика: данные, отчеты и аналитическая информация о состоянии здравоохранения.' }]} />
            
            {/* Блок с текстом и кнопкой "Читать далее" */}
            <div className="container px-5 py-12 mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
                    <p className="tracking-wide text-gray-700 leading-relaxed text-lg mb-4">
                        Департамент медико-статистического анализа осуществляет сбор, обработку и систематический анализ статистических данных в сфере здравоохранения Республики Казахстан. Его задачи включают изучение динамики показателей здоровья населения, эффективности деятельности медицинских организаций, а также прогнозирование потребностей системы здравоохранения в ресурсах.
                    </p>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            showFullText ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="border-t border-gray-100 pt-4 mb-4">
                            <p className="tracking-wide text-gray-700 leading-relaxed text-lg mb-4">
                                В рамках своей деятельности Департамент проводит эпидемиологические и демографические исследования, анализирует ключевые индикаторы по приоритетным направлениям здравоохранения, формирует статистические обзоры и обеспечивает методологическое сопровождение по расчету и интерпретации показателей.
                            </p>
                            
                            <p className="tracking-wide text-gray-700 leading-relaxed text-lg">
                                Вместе с тем, организовывает обучающие мероприятия, направленные на повышение качества статистического учета и аналитики в медицинских организациях.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={() => setShowFullText(!showFullText)} 
                        className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                        rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
                    >
                        {showFullText ? 'Скрыть' : 'Читать далее'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                            <rect x="11.5" y="5" width="1" height="14" />
                            <rect x="5" y="11.5" width="14" height="1" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Блок с папками и подстраницами */}
            <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
            <div className="flex md:flex-row flex-wrap">
                <FolderChlank 
                    h1="Отчёты" 
                    color="bg-purple-200" 
                    colorsec="bg-purple-300" 
                    href={route('medical.statistics.reports')}
                />
                <FolderChlank 
                    h1="Статистические данные" 
                    color="bg-purple-200" 
                    colorsec="bg-purple-300" 
                    href={route('medical.statistics.statdata')}
                />
                <FolderChlank 
                    h1="Аналитические материалы" 
                    color="bg-purple-200" 
                    colorsec="bg-purple-300" 
                    href={route('medical.statistics.analytics')}
                />
            </div>
        </div>
    </section>
                        
            {/* Блок с переключаемым графиком */}
            <section className="text-gray-600 body-font py-16 bg-white">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800"></h2>
                    
                    <div className="flex flex-wrap">
                        <div className="w-full px-4">
                            <SwitchableChart />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Карточки с приказами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <DocumentCards 
                title="Приказы"
                bgColor="bg-purple-100"
                documents={[
                    {
                        title: "Приказ Министра здравоохранения Республики Казахстан от 31 июля 2020 года № КР ДСМ-64/2020",
                        url: "https://adilet.zan.kz/rus/docs/V2000021579"
                    },
                    {
                        title: "Приказ Министра здравоохранения Республики Казахстан от 21 августа 2020 года № КР ДСМ-96/2020",
                        url: "https://adilet.zan.kz/rus/docs/V2000021879"
                    },
                    {
                        title: "Приказ Министра здравоохранения Республики Казахстан от 14 августа 2020 года № КР ДСМ-92/2020",
                        url: "https://adilet.zan.kz/rus/docs/V2000021769"
                    },
                    {
                        title: "Приказ Министра здравоохранения Республики Казахстан от 11 августа 2020 года № КР ДСМ-89/2020",
                        url: "https://adilet.zan.kz/rus/docs/V2000021698"
                    },
                ]}
            />
            
            {/* Второй аккордеон */}
            <FilesAccord 
                folder="Медицинская статистика/Методические рекомендации"
                title="Методические рекомендации"
                bgColor="bg-purple-200"
                defaultOpen={true}
            />
        </div>
    </section>

{/* Контактная информация */}
<section className="text-gray-600 body-font">
<div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
<div className="mt-20">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Контактная информация</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Первый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Начальник управления статистического учета и отчетности в области здравоохранения</h3>
      <p className="text-gray-600">Ильясова Жанагул Рахымбековна</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1110</p>
    </div>
    
    {/* Второй блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Начальник управления статистического наблюдения в области здравоохранения </h3>
      <p className="text-gray-600">Ракишева Динара Муктаровна</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1076</p>
    </div>

    
    {/* Третий блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Директор департамента медицинской статистики</h3>
      <p className="text-gray-600">Карашутова Жадыра Нургалиевна</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1134</p>
    </div>

    {/* Четвертый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Эксперт в Бюро кодирования</h3>
      <p className="text-gray-600">Жаниязова Гульнур Ахметбековна</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1073</p>
    </div>
  </div>
</div>
</div>
</section>

        </LayoutDirection>
    );
}

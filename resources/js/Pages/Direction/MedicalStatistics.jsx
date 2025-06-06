import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FilesAccord from '@/Components/FilesAccord';
import ChartHead from '@/Components/ChartHead';
import FolderChlank from '@/Components/FolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function MedicalStatistics() {
    const [showFullText, setShowFullText] = useState(false);

    return (
        <LayoutDirection img="static" h1="Медицинская статистика" useVideo={true}>
            <Head title="Медицинская статистика | NNCRZ" />
            
            {/* Блок с текстом и кнопкой "Читать далее" */}
            <div className="container px-5 py-12 mx-auto">
                <p className="tracking-wide text-gray-700 leading-relaxed">
                    Национальный научный центр развития здравоохранения им. Салидат Каирбековой предоставляет актуальные статистические данные в области здравоохранения Республики Казахстан. Центр осуществляет сбор, анализ и публикацию различных статистических показателей, связанных с здоровьем населения.  
                </p>
                
                <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        showFullText ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <p className="tracking-wide mt-4 text-gray-700 leading-relaxed">
                        Медицинская статистика является важным инструментом для планирования и оценки эффективности системы здравоохранения. Она позволяет отслеживать тенденции в области здоровья населения, распространенность заболеваний, факторы риска и эффективность медицинских вмешательств. Наш центр предоставляет следующие виды статистических данных:
                        <br/><br/>
                        1. Демографические показатели - данные о рождаемости, смертности, ожидаемой продолжительности жизни.
                        <br/>
                        2. Показатели заболеваемости - статистика по распространенности различных заболеваний.
                        <br/>
                        3. Ресурсы здравоохранения - информация о медицинских учреждениях, кадрах и финансировании.
                    </p>
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
            
            {/* Блок с графиком из примера */}
            <div className="container px-5 py-10 mx-auto bg-purple-100 rounded-lg my-10">
                <h2 className="text-2xl font-semibold mb-8 text-gray-800">Статистические исследования</h2>
                
                <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-100%">
                        <ChartHead 
                            chartType="injuries" 
                            className="h-[500px]"
                        />
                    </div>
                </div>
            </div>
            
            {/* Блок ActualFile c слайдом документов */}
            <div className="py-8">
                <div className="container mx-auto px-5">
                    <div className="bg-purple-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Действующие документы</h2>
                        <SimpleFileDisplay 
                            folder="Медицинская статистика/Актуальные документы"
                            title=""
                            bgColor="transparent"
                            hideDownload={true}
                            autoOpen={true}
                            hideTitle={true}
                            className="h-[400px] overflow-hidden"
                        />
                    </div>
                </div>
            </div>
            
            {/* Блок ActualFile с тремя документами */}
            <div className="container px-5 py-10 mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Актуальные статистические данные</h2>
                <div className="bg-purple-100 p-6 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Первый документ */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-medium text-lg mb-2">Статистический сборник</h3>
                            <p className="text-sm text-gray-600 mb-3">Ежегодный статистический сборник по здравоохранению Республики Казахстан</p>
                            <div className="flex space-x-2">
                                <button className="text-xs bg-purple-50 text-blue-700 px-3 py-1 rounded">Открыть</button>
                            </div>
                        </div>
                        
                        {/* Второй документ */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-medium text-lg mb-2">Демографические показатели</h3>
                            <p className="text-sm text-gray-600 mb-3">Статистические данные по населению за 2023 год с аналитическими материалами</p>
                            <div className="flex space-x-2">
                                <button className="text-xs bg-purple-50 text-blue-700 px-3 py-1 rounded">Открыть</button>
                            </div>
                        </div>
                        
                        {/* Третий документ */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-medium text-lg mb-2">Заболеваемость населения</h3>
                            <p className="text-sm text-gray-600 mb-3">Сводные данные по заболеваемости населения и факторам риска</p>
                            <div className="flex space-x-2">
                                <button className="text-xs bg-purple-50 text-blue-700 px-3 py-1 rounded">Открыть</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Блок с двумя графиками как на главной странице */}
            <section className="text-gray-600 body-font py-16 bg-white">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">Статистика и аналитика</h2>
                    
                    <div className="flex flex-wrap -mx-4">
                        {/* График травм */}
                        <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="h-80">
                                    {/* Здесь будет график травм */}
                                    <ChartHead 
                                        chartType="injuries" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* График аккредитаций */}
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="h-80">
                                    {/* Здесь будет график аккредитаций */}
                                    <ChartHead 
                                        chartType="accreditation" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Блок FilesAccord с двумя заголовками и двумя компонентами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <FilesAccord 
                folder="Медицинская статистика/Приказы"
                title="Приказы"
                bgColor="bg-purple-200"
                defaultOpen={true}
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
        </LayoutDirection>
    );
}

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

{/* Контактная информация */}
<section className="text-gray-600 body-font">
<div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
<div className="mt-20">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Контактная информация</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Первый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Отдел по аккредитации</h3>
      <p className="text-gray-600">г. Астана, улица Мангилик Ел, 20</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1014, 1049, 1079</p>
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center">
          <a href="https://wa.me/77472996410" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 747 299 6410</span>
          </a>
        </div>
        
        <div className="flex items-center">
          <a href="https://wa.me/77019825870" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 701 982 5870</span>
          </a>
        </div>
      </div>
    </div>
    
    {/* Второй блок - График работы */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Отдел по аккредитации</h3>
      <p className="text-gray-600">г. Астана, улица Мангилик Ел, 20</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1014, 1049, 1079</p>
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center">
          <a href="https://wa.me/77472996410" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 747 299 6410</span>
          </a>
        </div>
        
        <div className="flex items-center">
          <a href="https://wa.me/77019825870" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 701 982 5870</span>
          </a>
        </div>
      </div>
    </div>
    
    {/* Третий блок - Документы */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Отдел по аккредитации</h3>
      <p className="text-gray-600">г. Астана, улица Мангилик Ел, 20</p>
      <p className="text-gray-600">8-7172-648-951, вн: 1014, 1049, 1079</p>
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center">
          <a href="https://wa.me/77472996410" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 747 299 6410</span>
          </a>
        </div>
        
        <div className="flex items-center">
          <a href="https://wa.me/77019825870" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 701 982 5870</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

        </LayoutDirection>
    );
}

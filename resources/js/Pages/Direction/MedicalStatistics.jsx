import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FilesAccord from '@/Components/FilesAccord';
import FolderChlank from '@/Components/FolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import SwitchableChart from '@/Components/SwitchableChart';
import DocumentCards from '@/Components/DocumentCards';
import translationService from '@/services/TranslationService';

const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

export default function MedicalStatistics() {
    const [showFullText, setShowFullText] = useState(false);

    return (
        <LayoutDirection img="static" h1={t('directionsPages.medicalStatistics.title', 'Медицинская статистика')} useVideo={false}>
            <Head title={t('directionsPages.medicalStatistics.title', 'Медицинская статистика')} />
            
            {/* Блок с текстом и кнопкой "Читать далее" */}
            <div className="container px-5 py-12 mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
                    <p className="tracking-wide text-gray-700 leading-relaxed text-lg mb-4">
                        {t('directionsPages.medicalStatistics.intro')}
                    </p>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            showFullText ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="border-t border-gray-100 pt-4 mb-4">
                            <p className="tracking-wide text-gray-700 leading-relaxed text-lg mb-4">
                                {t('directionsPages.medicalStatistics.additionalInfo1')}
                            </p>
                            
                            <p className="tracking-wide text-gray-700 leading-relaxed text-lg">
                                {t('directionsPages.medicalStatistics.additionalInfo2')}
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
                        {showFullText ? t('directionsPages.medicalStatistics.hide') : t('directionsPages.medicalStatistics.readMore')}
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
                    title={t('directionsPages.medicalStatistics.subfolders.reports.title')} 
                    description={t('directionsPages.medicalStatistics.subfolders.reports.description')}
                    color="bg-purple-200" 
                    colorsec="bg-purple-300" 
                    href={route('medical.statistics.reports')}
                />
                <FolderChlank 
                    title={t('directionsPages.medicalStatistics.subfolders.statData.title')} 
                    description={t('directionsPages.medicalStatistics.subfolders.statData.description')}
                    color="bg-purple-200" 
                    colorsec="bg-purple-300" 
                    href={route('medical.statistics.statdata')}
                />
                <FolderChlank 
                    title={t('directionsPages.medicalStatistics.subfolders.analytics.title')} 
                    description={t('directionsPages.medicalStatistics.subfolders.analytics.description')}
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
                title={t('directionsPages.medicalStatistics.ordersTitle')}
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
                folder={t('directionsPages.medicalStatistics.methodologicalRecommendationsFolder')}
                title={t('directionsPages.medicalStatistics.methodologicalRecommendationsTitle')}
                bgColor="bg-purple-200"
                defaultOpen={true}
            />
        </div>
    </section>

{/* Контактная информация */}
<section className="text-gray-600 body-font">
<div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
<div className="mt-20">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('directionsPages.medicalStatistics.contactInfoTitle')}</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Первый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('directionsPages.medicalStatistics.contact1Position')}</h3>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact1Name')}</p>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact1Phone')}</p>
    </div>
    
    {/* Второй блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('directionsPages.medicalStatistics.contact2Position')}</h3>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact2Name')}</p>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact2Phone')}</p>
    </div>

    
    {/* Третий блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('directionsPages.medicalStatistics.contact3Position')}</h3>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact3Name')}</p>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact3Phone')}</p>
    </div>

    {/* Четвертый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('directionsPages.medicalStatistics.contact4Position')}</h3>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact4Name')}</p>
      <p className="text-gray-600">{t('directionsPages.medicalStatistics.contact4Phone')}</p>
    </div>
  </div>
</div>
</div>
</section>

        </LayoutDirection>
    );
}

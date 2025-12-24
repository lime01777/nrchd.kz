import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import FolderChlank from '@/Components/FolderChlank';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FilesAccord from '@/Components/FilesAccord';
import PageAccordions from "@/Components/PageAccordions";
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function HealthRate() {

  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title={t('directionsPages.healthRate.title', 'Оценка технологий здравоохранения')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        <strong>{t('directionsPages.healthRate.intro1')}</strong>
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.healthRate.intro2')}
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.healthRate.intro3')}
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.healthRate.intro4')}
                    </p>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.additionalInfo1')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.additionalInfo2')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.additionalInfo3')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.additionalInfo4')}
                            </p>
                            
                            <ul className="list-disc list-inside px-4 mb-4">
                                <li>{t('directionsPages.healthRate.bulletItem1')}</li>
                                <li>{t('directionsPages.healthRate.bulletItem2')}</li>
                                <li>{t('directionsPages.healthRate.bulletItem3')}</li>
                                <li>{t('directionsPages.healthRate.bulletItem4')}</li>
                                <li>{t('directionsPages.healthRate.bulletItem5')}</li>
                            </ul>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.htaDescription')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.htaLimitations')}
                            </p>
                            <p className="mb-4">
                                <strong>{t('directionsPages.healthRate.regulatoryTitle')}</strong>
                            </p>
                            <ul className="list-disc list-inside px-4 mb-4">
                                <li>{t('directionsPages.healthRate.regulatoryItem1')}</li>
                                <li>{t('directionsPages.healthRate.regulatoryItem2')}</li>
                            </ul>
                            <p className="mb-4">
                                <strong>{t('directionsPages.healthRate.partnership')}</strong>
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.healthRate.partnershipInfo')}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setShowFullText(!showFullText)} 
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105"
                >
                    {showFullText ? t('directionsPages.healthRate.hide') : t('directionsPages.healthRate.readMore')}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`ml-2 transform transition-transform duration-300 ${showFullText ? 'rotate-45' : ''}`}
                    >
                        {showFullText ? (
                            <path d="M19 13H5v-2h14v2z" />
                        ) : (
                            <>
                                <rect x="11.5" y="5" width="1" height="14" />
                                <rect x="5" y="11.5" width="14" height="1" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </div>
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-fuchsia-200"
                    colorsec="bg-fuchsia-300"
                    title={t('directionsPages.healthRate.subfolders.otzReports.title')} 
                    description={t('directionsPages.healthRate.subfolders.otzReports.description')}
                    href={route('health.rate.otz.reports')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

HealthRate.layout = (page) => <LayoutDirection img="healthrate" h1={t('directions.health_rate', 'Оценка технологий здравоохранения')} folder={t('directions.medical_rating', 'Рейтинг медицинских организаций')}>{page}</LayoutDirection>;

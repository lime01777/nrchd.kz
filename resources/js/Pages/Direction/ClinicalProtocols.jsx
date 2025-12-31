import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ClinicalProtocolsTabs from '@/Components/ClinicalProtocolsTabs';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function ClinicalProtocols() {

  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title={t('directionsPages.clinicalProtocols.title', 'Клинические протоколы')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        <strong>{t('directionsPages.clinicalProtocols.intro1Title')}</strong> {t('directionsPages.clinicalProtocols.intro1')}
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.clinicalProtocols.intro2')}
                    </p>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                {t('directionsPages.clinicalProtocols.typesInfo')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.clinicalProtocols.developmentInfo')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.clinicalProtocols.regulationInfo')}
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.clinicalProtocols.reviewInfo')}
                            </p>
                            
                            <p className="mb-4 font-semibold">
                                {t('directionsPages.clinicalProtocols.regulatoryDocsTitle')}
                            </p>
                            
                            <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
                                <li>{t('directionsPages.clinicalProtocols.regulatoryDoc1')}</li>
                                <li>{t('directionsPages.clinicalProtocols.regulatoryDoc2')}</li>
                                <li>{t('directionsPages.clinicalProtocols.regulatoryDoc3')}</li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setShowFullText(!showFullText)} 
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105"
                >
                    {showFullText ? t('directionsPages.clinicalProtocols.hide') : t('directionsPages.clinicalProtocols.readMore')}
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
    
    {/* Блок с вкладками и таблицами */}
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto">
            <ClinicalProtocolsTabs />
        </div>
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.clinicalProtocols.subfolders.catalog.title')} 
                    description={t('directionsPages.clinicalProtocols.subfolders.catalog.description')}
                    href={route('clinical.protocols.catalog')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.clinicalProtocols.subfolders.commission.title')} 
                    description={t('directionsPages.clinicalProtocols.subfolders.commission.description')}
                    href={route('clinical.protocols.commission')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.clinicalProtocols.subfolders.monitoring.title')} 
                    description={t('directionsPages.clinicalProtocols.subfolders.monitoring.description')}
                    href={route('clinical.protocols.monitoring')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

ClinicalProtocols.layout = (page) => <LayoutDirection img="clinicalprotocols" h1={t('directions.clinical_protocols', 'Клинические протоколы')}>{page}</LayoutDirection>;

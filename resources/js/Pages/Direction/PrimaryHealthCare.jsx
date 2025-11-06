import { Head, usePage, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import ChartHead from '@/Components/ChartHead'
import PageAccordions from '@/Components/PageAccordions';
import FolderChlank from '@/Components/FolderChlank';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function PrimaryHealthCare() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
          <Head title={t('directionsPages.primaryHealthcare.title', 'Первичная медико-санитарная помощь')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
                {t('directionsPages.primaryHealthcare.intro')}
                <br /><br />
                {t('directionsPages.primaryHealthcare.principlesTitle')}
                <br />- {t('directionsPages.primaryHealthcare.principle1')}
                <br />- {t('directionsPages.primaryHealthcare.principle2')}
                <br />- {t('directionsPages.primaryHealthcare.principle3')}
                <br />- {t('directionsPages.primaryHealthcare.principle4')}
                <br />- {t('directionsPages.primaryHealthcare.principle5')}
                <br /><br />
                {t('directionsPages.primaryHealthcare.directionsTitle')}
                <br />- {t('directionsPages.primaryHealthcare.direction1')}
                <br />- {t('directionsPages.primaryHealthcare.direction2')}
                <br />- {t('directionsPages.primaryHealthcare.direction3')}
                <br />- {t('directionsPages.primaryHealthcare.direction4')}
                <br />- {t('directionsPages.primaryHealthcare.direction5')}
                <br />- {t('directionsPages.primaryHealthcare.direction6')}
            </p>
          </div>
            
            <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setShowFullText(!showFullText)} 
                  className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                  rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
                >
                                          {showFullText ? t('directionsPages.primaryHealthcare.hide') : t('directionsPages.primaryHealthcare.readMore')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                        <rect x="11.5" y="5" width="1" height="14" />
                        <rect x="5" y="11.5" width="14" height="1" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
    <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
            <div className="flex md:flex-row flex-wrap">
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.primaryHealthcare.subfolders.outpatient.title')} 
                    description={t('directionsPages.primaryHealthcare.subfolders.outpatient.description')}
                    href={route('primary.healthcare.outpatient')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.primaryHealthcare.subfolders.prevention.title')} 
                    description={t('directionsPages.primaryHealthcare.subfolders.prevention.description')}
                    href={route('primary.healthcare.prevention')}
                />
            </div>
        </div>
    </section>
    <ChartHead />
    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-24 mx-auto">
        <PageAccordions />
      </div>
    </section>
    </>
  )
}

PrimaryHealthCare.layout = (page) => <LayoutDirection img={'pmsp'} h1={t('directions.primary_healthcare', 'Первичная медико-санитарная помощь')} useVideo={false}>{page}</LayoutDirection>;

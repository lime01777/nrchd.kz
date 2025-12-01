import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FilesAccord from '@/Components/FilesAccord';
import FolderChlank from '@/Components/FolderChlank';
import FAQ from '@/Components/FAQ';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function DrugPolicy() {

  const faqItems = [
    {
      question: t('directionsPages.drugPolicy.faq1Question'),
      answer: (
        <div className="space-y-2">
          <div className="flex flex-col space-y-4">
            <a href="https://adilet.zan.kz/rus/docs/V2100022782" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link1')}
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2000021479" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link2')}
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100024078" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link3')}
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100023885" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link4')}
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link5')}
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link6')}
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2100023783" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link7')}
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq1Link8')}
            </a>
          </div>
        </div>
      )
    },
    {
      question: t('directionsPages.drugPolicy.faq2Question'),
      answer: (
        <div className="space-y-2">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('directionsPages.drugPolicy.faq1Link8')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('directionsPages.drugPolicy.faq1Link6')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('directionsPages.drugPolicy.faq1Link5')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100023783#z120" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('directionsPages.drugPolicy.faq1Link7')}
              </a>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: t('directionsPages.drugPolicy.faq3Question'),
      answer: (
        <div className="space-y-2">
          <p>
            <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('directionsPages.drugPolicy.faq3Link')}
            </a>
          </p>
          <p className="mt-3">
            {t('directionsPages.drugPolicy.faq3Answer')}
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <Head title={t('directionsPages.drugPolicy.title', 'Лекарственная политика')} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.drugPolicy.intro1')}
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.drugPolicy.intro2')}
            </p>
            
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>{t('directionsPages.drugPolicy.direction1')}</li>
              <li>{t('directionsPages.drugPolicy.direction2')}</li>
              <li>{t('directionsPages.drugPolicy.direction3')}</li>
              <li>{t('directionsPages.drugPolicy.direction4')}</li>
              <li>{t('directionsPages.drugPolicy.direction5')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
          <div className='flex flex-wrap'>
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.drugPolicy.subfolders.regulations.title')} 
              description={t('directionsPages.drugPolicy.subfolders.regulations.description')}
              href={route('drug.policy.regulations')}
            />
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.drugPolicy.subfolders.commission.title')} 
              description={t('directionsPages.drugPolicy.subfolders.commission.description')}
              href={route('drug.policy.commission')}
            />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('directionsPages.drugPolicy.faqTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('directionsPages.drugPolicy.faqSubtitle')}
            </p>
          </div>
          <FAQ items={faqItems} />
        </div>
      </section>
    </>
  );
}

DrugPolicy.layout = (page) => <LayoutDirection img="politica" h1={t('directions.drug_policy', 'Лекарственная политика')}>{page}</LayoutDirection>;

import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ImportantDoc from '@/Components/ImportantDoc';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FilesAccord from '@/Components/FilesAccord';
import ActualFile from '@/Components/ActualFile';
import FAQ from '@/Components/FAQ';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function HealthAccounts() {

  return (
    <>
    <Head title={t('directionsPages.healthAccounts.title', 'Национальные счета здравоохранения')} />
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed text-lg text-gray-700">
            {t('directionsPages.healthAccounts.intro')}
          </p>
        </div>
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <FolderChlank 
          color="bg-gray-200"
          colorsec="bg-gray-300"
          title={t('directionsPages.healthAccounts.subfolders.documents.title')} 
          description={t('directionsPages.healthAccounts.subfolders.documents.description')}
          href={route('health.accounts')}
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <ActualFile 
          folder={t('directionsPages.healthAccounts.actualInfoFolder')} 
          title={t('directionsPages.healthAccounts.actualInfoTitle')} 
          bgColor="bg-purple-100"
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <FilesAccord 
            folder={t('directionsPages.healthAccounts.reportsFolder')} 
            title={t('directionsPages.healthAccounts.reportsTitle')} 
            bgColor="bg-purple-50"
          />
        </div>
      </div>
    </section>

    </>
  );
}

HealthAccounts.layout = (page) => <LayoutDirection img="account" h1={t('directions.health_accounts', 'Национальные счета здравоохранения')}>{page}</LayoutDirection>;

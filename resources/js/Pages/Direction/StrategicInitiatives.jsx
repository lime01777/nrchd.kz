import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import translationService from '@/services/TranslationService';

// Функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

export default function StrategicInitiatives() {
  return (
    <>
      <Head title={t('directionsPages.strategicInitiatives.title', 'Стратегические инициативы')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">

            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
          <div className='flex md:flex-row flex-wrap'>
            <FolderChlank h1={t('directionsPages.strategicInitiatives.subfolders.initiatives.title')} color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.initiatives')} />
            <FolderChlank h1={t('directionsPages.strategicInitiatives.subfolders.partnership.title')} color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.partnership')} />
            <FolderChlank h1={t('directionsPages.strategicInitiatives.subfolders.expert.title')} color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.expert')} />
            <FolderChlank h1={t('directionsPages.strategicInitiatives.subfolders.coalition.title')} color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.coalition')} />
          </div>
        </div>
      </section>
    </>
  );
}

StrategicInitiatives.layout = page => <LayoutDirection img="strategy" h1={t('directions.strategic_initiatives', 'Стратегические инициативы и международное сотрудничество')} useVideo={true}>{page}</LayoutDirection>;

import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import BannerCatalog from '@/Components/BannerCatalog';
import translationService from '@/services/TranslationService';

export default function ActiveStandards() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.accreditationSubpages.activeStandards.title', 'Действующие стандарты')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">{t('directionsPages.accreditationSubpages.activeStandards.h1')}</h1>
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.accreditationSubpages.activeStandards.intro')}
            </p>
          </div>
        </div>
      </section>
      
      <BannerCatalog />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-yellow-100">
            <FilesAccord 
              folder={t('directionsPages.accreditationSubpages.activeStandards.folder')}
              title={t('directionsPages.accreditationSubpages.activeStandards.accordionTitle')}
              bgColor="bg-yellow-100"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

ActiveStandards.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white" 
    h1={translationService.t('directionsPages.accreditationSubpages.activeStandards.h1')} 
    parentRoute={route('medical.accreditation')} 
    parentName={translationService.t('directionsPages.accreditationSubpages.activeStandards.parentName')}
    heroBgColor="bg-yellow-100"
    buttonBgColor="bg-yellow-100"
    buttonHoverBgColor="hover:bg-yellow-200"
    buttonBorderColor="border-yellow-200"
    breadcrumbs={[
      { name: translationService.t('directionsPages.accreditationSubpages.activeStandards.breadcrumbDirections'), route: 'directions' },
      { name: translationService.t('directionsPages.accreditationSubpages.activeStandards.breadcrumbAccreditation'), route: 'medical.accreditation' },
      { name: translationService.t('directionsPages.accreditationSubpages.activeStandards.h1'), route: null }
    ]}
  >
    {page}
  </LayoutFolderChlank>
);

import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import BannerCatalog from '@/Components/BannerCatalog';
import translationService from '@/services/TranslationService';

export default function StandardsArchive() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.accreditationSubpages.standardsArchive.title', 'Архив стандартов')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.accreditationSubpages.standardsArchive.intro')}
            </p>
          </div>
        </div>
      </section>
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-yellow-100">
            <FilesAccord 
              folder={t('directionsPages.accreditationSubpages.standardsArchive.folder')}
              title={t('directionsPages.accreditationSubpages.standardsArchive.accordionTitle')}
              bgColor="bg-yellow-100"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

StandardsArchive.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white" 
    h1={translationService.t('directionsPages.accreditationSubpages.standardsArchive.h1')} 
    parentRoute={route('medical.accreditation')} 
    parentName={translationService.t('directionsPages.accreditationSubpages.standardsArchive.parentName')}
    heroBgColor="bg-yellow-100"
    buttonBgColor="bg-yellow-100"
    buttonHoverBgColor="hover:bg-yellow-200"
    buttonBorderColor="border-yellow-200"
    breadcrumbs={[
      { name: translationService.t('directionsPages.accreditationSubpages.standardsArchive.breadcrumbDirections'), route: 'directions' },
      { name: translationService.t('directionsPages.accreditationSubpages.standardsArchive.breadcrumbAccreditation'), route: 'medical.accreditation' },
      { name: translationService.t('directionsPages.accreditationSubpages.standardsArchive.h1'), route: null }
    ]}
  >
    {page}
  </LayoutFolderChlank>
);

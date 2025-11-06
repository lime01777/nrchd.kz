import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function GosoTup() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medEducationSubpages.gosoTup.title', 'ГОСО и ТУП')} />

      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">{t('directionsPages.medEducationSubpages.gosoTup.mainTitle')}</h1>
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.medEducationSubpages.gosoTup.intro')}
            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-green-50">
            <FilesAccord
              folder={t('directionsPages.medEducationSubpages.gosoTup.accordionFolder')}
              title={t('directionsPages.medEducationSubpages.gosoTup.accordionTitle')}
              bgColor="bg-green-50"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

GosoTup.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white"
    heroBgColor="bg-green-100"
    buttonBgColor="bg-green-100"
    buttonHoverBgColor="hover:bg-green-200"
    h1={translationService.t('directionsPages.medEducationSubpages.gosoTup.title')}
    parentRoute={route('direction.medical.education')} 
    parentName={translationService.t('directionsPages.medEducationSubpages.gosoTup.parentName')}
    breadcrumbs={[
      { name: translationService.t('directionsPages.medEducationSubpages.gosoTup.breadcrumbDirections'), route: 'directions' },
      { name: translationService.t('directionsPages.medEducationSubpages.gosoTup.breadcrumbMedicalEducation'), route: 'direction.medical.education' },
      { name: translationService.t('directionsPages.medEducationSubpages.gosoTup.title'), route: null }
    ]}
  >
    {page}
  </LayoutFolderChlank>
);



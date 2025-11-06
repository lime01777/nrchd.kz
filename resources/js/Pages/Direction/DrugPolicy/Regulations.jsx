import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/services/TranslationService';

export default function Regulations() {
  const t = (key, fallback = '') => translationService.t(key, fallback);

  return (
    <>
      <Head title={t('directionsPages.drugPolicySubpages.regulations.title', 'Протоколы')} />

      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SimpleFileDisplay 
              folder={t('directionsPages.drugPolicySubpages.regulations.folder')} 
              title={t('directionsPages.drugPolicySubpages.regulations.documentsTitle')} 
              bgColor="bg-white"
            />
          </div>
        </div>
      </section>
    </>
  );
}

Regulations.layout = page => <LayoutFolderChlank 
  bgColor="bg-amber-100"
  h1={translationService.t('directionsPages.drugPolicySubpages.regulations.h1')} 
  parentRoute={route('drug.policy')} 
  parentName={translationService.t('directionsPages.drugPolicySubpages.regulations.parentName')}
  heroBgColor="bg-amber-100"
  breadcrumbs={[
    { name: translationService.t('directionsPages.drugPolicySubpages.regulations.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.drugPolicySubpages.regulations.breadcrumbDrugPolicy'), route: 'drug.policy' },
    { name: translationService.t('directionsPages.drugPolicySubpages.regulations.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

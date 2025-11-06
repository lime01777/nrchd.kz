import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import SimpleFileDisplay from "@/Components/SimpleFileDisplay";
import translationService from '@/services/TranslationService';

export default function BioethicsExpertise() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.bioethicsSubpages.expertise.title', 'СОП')} />

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <SimpleFileDisplay 
                folder={t('directionsPages.bioethicsSubpages.expertise.folder')}
                bgColor="bg-white"
            />
        </div>
    </section>
    </>
  )
}

BioethicsExpertise.layout = page => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.bioethicsSubpages.expertise.h1')}
  title="Стандартные операционные процедуры биоэтической экспертизы"
  parentRoute={route('bioethics')}
  parentName={translationService.t('directionsPages.bioethicsSubpages.expertise.parentName')}
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  buttonBorderColor="border-blue-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.bioethicsSubpages.expertise.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.bioethicsSubpages.expertise.breadcrumbBioethics'), route: 'bioethics' },
    { name: translationService.t('directionsPages.bioethicsSubpages.expertise.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>

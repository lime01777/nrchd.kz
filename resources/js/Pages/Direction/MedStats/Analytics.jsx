import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/services/TranslationService';

export default function Analytics() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medStatsSubpages.analytics.title', 'Аналитика')} />
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="mb-5">
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <SimpleFileDisplay 
              folder={t('directionsPages.medStatsSubpages.analytics.folder')} 
              title="" 
            />
          </div>
        </div>
      </section>
    </>
  );
}

Analytics.layout = page => <LayoutFolderChlank  
  h1={translationService.t('directionsPages.medStatsSubpages.analytics.h1')} 
  parentRoute={route('medical.statistics')} 
  parentName={translationService.t('directionsPages.medStatsSubpages.analytics.parentName')}
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medStatsSubpages.analytics.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medStatsSubpages.analytics.breadcrumbMedicalStatistics'), route: 'medical.statistics' },
    { name: translationService.t('directionsPages.medStatsSubpages.analytics.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

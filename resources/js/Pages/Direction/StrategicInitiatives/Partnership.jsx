import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';
import Sponsors from '@/Components/Sponsors';
import translationService from '@/services/TranslationService';

export default function Partnership() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.strategicInitiativesSubpages.partnership.title', 'Партнерство')} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">{t('directionsPages.strategicInitiativesSubpages.partnership.mainTitle')}</h2>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.partnership.intro1')}
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.partnership.intro2')}
            </p>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">{t('directionsPages.strategicInitiativesSubpages.partnership.partnersTitle')}</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
              <li>
                <strong>{t('directionsPages.strategicInitiativesSubpages.partnership.partner1Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.partnership.partner1Text')}
              </li>
              <li>
                <strong>{t('directionsPages.strategicInitiativesSubpages.partnership.partner2Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.partnership.partner2Text')}
              </li>
              <li>
                <strong>{t('directionsPages.strategicInitiativesSubpages.partnership.partner3Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.partnership.partner3Text')}
              </li>
              <li>
                <strong>{t('directionsPages.strategicInitiativesSubpages.partnership.partner4Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.partnership.partner4Text')}
              </li>
              <li>
                <strong>{t('directionsPages.strategicInitiativesSubpages.partnership.partner5Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.partnership.partner5Text')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Sponsors />
    </>
  );
}

Partnership.layout = page => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.strategicInitiativesSubpages.partnership.h1')} 
  parentRoute={route('strategic.initiatives')} 
  parentName={translationService.t('directionsPages.strategicInitiativesSubpages.partnership.parentName')}
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.partnership.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.partnership.breadcrumbStrategic'), route: 'strategic.initiatives' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.partnership.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

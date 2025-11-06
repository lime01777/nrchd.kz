import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';
import BannerCatalog from '@/Components/BannerCatalog';
import translationService from '@/services/TranslationService';

export default function Outpatient() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title={t('directionsPages.primaryHealthCareSubpages.outpatient.title', 'Амбулаторная помощь')} />
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
              {t('directionsPages.primaryHealthCareSubpages.outpatient.intro')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.outpatient.componentsTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component5')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component6')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.component7')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.outpatient.tasksTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task5')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.task6')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.outpatient.perspectivesTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.perspective1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.perspective2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.perspective3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.perspective4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.outpatient.perspective5')}
            </p>
          </div>
            
          <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowFullText(!showFullText)} 
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
              >
                  {showFullText ? t('directionsPages.primaryHealthCareSubpages.outpatient.hide') : t('directionsPages.primaryHealthCareSubpages.outpatient.readMore')}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                      <rect x="11.5" y="5" width="1" height="14" />
                      <rect x="5" y="11.5" width="14" height="1" />
                  </svg>
              </button>
          </div>
        </div>
    </section>
    <BannerCatalog />
    <PageAccordions />
    </>
  )
}

Outpatient.layout = (page) => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.primaryHealthCareSubpages.outpatient.h1')}
  parentRoute={route('primary.healthcare')}
  parentName={translationService.t('directionsPages.primaryHealthCareSubpages.outpatient.parentName')}
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.outpatient.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.outpatient.breadcrumbPrimaryHealthcare'), route: 'primary.healthcare' },
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.outpatient.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

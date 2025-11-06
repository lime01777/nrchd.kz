import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';
import BannerCatalog from '@/Components/BannerCatalog';
import translationService from '@/services/TranslationService';

export default function Prevention() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title={t('directionsPages.primaryHealthCareSubpages.prevention.title', 'Профилактика')} />
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
              {t('directionsPages.primaryHealthCareSubpages.prevention.intro')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.prevention.typesTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.type1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.type2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.type3')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.prevention.screeningTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening5')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.screening6')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.prevention.componentsTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component5')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.component6')}
              <br></br><br></br>
              <strong>{t('directionsPages.primaryHealthCareSubpages.prevention.benefitsTitle')}</strong>
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.benefit1')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.benefit2')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.benefit3')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.benefit4')}
              <br></br>- {t('directionsPages.primaryHealthCareSubpages.prevention.benefit5')}
            </p>
          </div>
            
          <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowFullText(!showFullText)} 
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
              >
                  {showFullText ? t('directionsPages.primaryHealthCareSubpages.prevention.hide') : t('directionsPages.primaryHealthCareSubpages.prevention.readMore')}
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

Prevention.layout = (page) => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.primaryHealthCareSubpages.prevention.h1')}
  parentRoute={route('primary.healthcare')}
  parentName={translationService.t('directionsPages.primaryHealthCareSubpages.prevention.parentName')}
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.prevention.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.prevention.breadcrumbPrimaryHealthcare'), route: 'primary.healthcare' },
    { name: translationService.t('directionsPages.primaryHealthCareSubpages.prevention.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

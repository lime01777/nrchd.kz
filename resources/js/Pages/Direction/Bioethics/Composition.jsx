import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/services/TranslationService';

export default function BioethicsComposition() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.bioethicsSubpages.composition.title', 'Состав Центральной комиссии по биоэтике')} />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('directionsPages.bioethicsSubpages.composition.mainTitle')}</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">
                  {t('directionsPages.bioethicsSubpages.composition.orderInfo')}
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.bioethicsSubpages.composition.chairmanTitle')}</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  {t('directionsPages.bioethicsSubpages.composition.chairmanInfo')}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('directionsPages.bioethicsSubpages.composition.workingBodyTitle')}</h4>
                <p className="text-gray-700 mb-2">
                  <strong>{t('directionsPages.bioethicsSubpages.composition.workingBodyName')}</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('directionsPages.bioethicsSubpages.composition.addressLabel')}</strong> {t('directionsPages.bioethicsSubpages.composition.addressValue')}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('directionsPages.bioethicsSubpages.composition.phoneLabel')}</strong> {t('directionsPages.bioethicsSubpages.composition.phoneValue')}
                </p>
                <p className="text-gray-700">
                  <strong>{t('directionsPages.bioethicsSubpages.composition.emailLabel')}</strong> <a href="mailto:bioethics@nrchd.kz" className="text-blue-600 hover:text-blue-800">bioethics@nrchd.kz</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BioethicsComposition.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.bioethicsSubpages.composition.h1')} 
  parentRoute={route('bioethics')} 
  parentName={translationService.t('directionsPages.bioethicsSubpages.composition.parentName')}
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.bioethicsSubpages.composition.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.bioethicsSubpages.composition.breadcrumbBioethics'), route: 'bioethics' },
    { name: translationService.t('directionsPages.bioethicsSubpages.composition.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>

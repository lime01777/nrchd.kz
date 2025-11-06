import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/services/TranslationService';


export default function Commission() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.accreditationSubpages.commission.title', 'Комиссия')} />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('directionsPages.accreditationSubpages.commission.mainTitle')}</h2>
            
            <p className="text-gray-700 mb-4">
              {t('directionsPages.accreditationSubpages.commission.intro1')}
            </p>
            
            <p className="text-gray-700 mb-4">
              {t('directionsPages.accreditationSubpages.commission.intro2')}
            </p>

            <p className="text-gray-700 mb-4">
              {t('directionsPages.accreditationSubpages.commission.intro3')}
            </p>

            <p className="text-gray-700 mb-6">
              {t('directionsPages.accreditationSubpages.commission.intro4')}
            </p>
            
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('directionsPages.accreditationSubpages.commission.compositionTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/2.png" alt="Фото Мукашева Айгуль Сагатовна" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Байжунусов Эрик Абенович</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/4.png" alt="Фото Алиева Гульнара Танатовна" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Сексенбаев Бахытжан Дерибсалиевич</h4>
              </div>


              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/1.png" alt="Фото Сарсембаев Канат Талгатович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Карибеков Темирлан Сибирьевич</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/3.png" alt="Фото Нурманбетов Даулет Нурманбетович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Локшин Вячеслав Нотанович</h4>
              </div>

              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/5.png" alt="Фото Нуралиев Марат Аманкулович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Шайхиев Саин Саинович</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Commission.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white"
    heroBgColor="bg-yellow-100"
    buttonBgColor="bg-yellow-100"
    buttonHoverBgColor="hover:bg-yellow-200"
    h1={translationService.t('directionsPages.accreditationSubpages.commission.h1')} 
    parentRoute={route('medical.accreditation')} 
    parentName={translationService.t('directionsPages.accreditationSubpages.commission.parentName')}
    breadcrumbs={[
      { name: translationService.t('directionsPages.accreditationSubpages.commission.breadcrumbDirections'), route: 'directions' },
      { name: translationService.t('directionsPages.accreditationSubpages.commission.breadcrumbAccreditation'), route: 'medical.accreditation' },
      { name: translationService.t('directionsPages.accreditationSubpages.commission.h1'), route: null }
    ]}
  >
    {page}
  </LayoutFolderChlank>
);

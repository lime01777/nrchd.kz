import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function Documents() {
  const t = (key, fallback = '') => translationService.t(key, fallback);

  return (
    <>
      <Head title={t('directionsPages.medEducationSubpages.documents.title', 'Документы')} />
      <section className="text-gray-600 body-font pt-8 pb-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="lg:w-full md:w-full px-4 mb-6 md:mb-0">
              <div className="h-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.medEducationSubpages.documents.expertiseTitle')}</h2>
                <p className="text-gray-700 mb-4">
                  {t('directionsPages.medEducationSubpages.documents.expertiseIntro')}
                </p>
                
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">{t('directionsPages.medEducationSubpages.documents.tableHeaderNum')}</th>
                        <th className="py-2 px-3 border-b border-r text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('directionsPages.medEducationSubpages.documents.tableHeaderName')}</th>
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">{t('directionsPages.medEducationSubpages.documents.tableHeaderUnit')}</th>
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">{t('directionsPages.medEducationSubpages.documents.tableHeaderQuantity')}</th>
                        <th className="py-2 px-3 border-b text-center text-xs font-medium text-gray-700 uppercase tracking-wider">{t('directionsPages.medEducationSubpages.documents.tableHeaderPrice')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 border-b border-r text-center">1</td>
                        <td className="py-2 px-3 border-b border-r text-sm">{t('directionsPages.medEducationSubpages.documents.tableRow1Service')}</td>
                        <td className="py-2 px-3 border-b border-r text-center">{t('directionsPages.medEducationSubpages.documents.tableRow1Unit')}</td>
                        <td className="py-2 px-3 border-b border-r text-center">{t('directionsPages.medEducationSubpages.documents.tableRow1Quantity')}</td>
                        <td className="py-2 px-3 border-b text-center">{t('directionsPages.medEducationSubpages.documents.tableRow1Price')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 border-b border-r text-center">2</td>
                        <td className="py-2 px-3 border-b border-r text-sm">{t('directionsPages.medEducationSubpages.documents.tableRow2Service')}</td>
                        <td className="py-2 px-3 border-b border-r text-center">{t('directionsPages.medEducationSubpages.documents.tableRow2Unit')}</td>
                        <td className="py-2 px-3 border-b border-r text-center">{t('directionsPages.medEducationSubpages.documents.tableRow2Quantity')}</td>
                        <td className="py-2 px-3 border-b text-center">{t('directionsPages.medEducationSubpages.documents.tableRow2Price')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {t('directionsPages.medEducationSubpages.documents.conclusionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap -m-4">
            <FilesAccord
              folder={t('directionsPages.medEducationSubpages.documents.accordionFolder')} 
              title={t('directionsPages.medEducationSubpages.documents.accordionTitle')} 
              bgColor="bg-green-50"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
      
    </>
  )
}

Documents.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.medEducationSubpages.documents.h1')} 
  parentRoute={route('direction.medical.education')} 
  parentName={translationService.t('directionsPages.medEducationSubpages.documents.parentName')}
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medEducationSubpages.documents.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medEducationSubpages.documents.breadcrumbMedicalEducation'), route: 'direction.medical.education' },
    { name: translationService.t('directionsPages.medEducationSubpages.documents.h1'), route: null }
  ]}
  children={page}
/>

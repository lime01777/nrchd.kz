import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function EducationPrograms() {
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

  return (
    <>
              <Head title={t('servicesPages.educationPrograms.title')} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-full px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('servicesPages.educationPrograms.intro')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('servicesPages.educationPrograms.procedure')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('servicesPages.educationPrograms.results')}
            </p>
          </div>
          
        </div>
      </div>
      <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-24 mx-auto">
        <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden bg-white">
          <div className="p-6 lg:p-10">
            <h1 className="title-font text-2xl font-medium text-gray-900 mb-3">{t('servicesPages.educationPrograms.serviceDescription.title')}</h1>
            <p className="leading-relaxed mb-3">
              {t('servicesPages.educationPrograms.serviceDescription.paragraph1')}
            </p>
            <p className="leading-relaxed mb-3">
              {t('servicesPages.educationPrograms.serviceDescription.paragraph2')}
            </p>
            <div className="flex items-center flex-wrap">
              <a href="#" className="text-green-500 inline-flex items-center md:mb-2 lg:mb-0">
                {t('servicesPages.educationPrograms.serviceDescription.moreLink')}
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Прайс-лист */}
      <div className="container px-5 py-16 mx-auto">
        <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden bg-white">
          <div className="p-6 lg:p-10">
            <h1 className="title-font text-2xl font-medium text-gray-900 mb-6">{t('servicesPages.educationPrograms.pricing.title')}</h1>
            <p className="leading-relaxed mb-6">
              {t('servicesPages.educationPrograms.pricing.description')}
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-green-200 py-3 px-4 text-center">
                      №
                    </th>
                    <th className="border border-green-200 py-3 px-4 text-left">
                      {t('servicesPages.educationPrograms.pricing.serviceName')}
                    </th>
                    <th className="border border-green-200 py-3 px-4 text-center">
                      {t('servicesPages.educationPrograms.pricing.unit')}
                    </th>
                    <th className="border border-green-200 py-3 px-4 text-center">
                      {t('servicesPages.educationPrograms.pricing.quantity')}
                    </th>
                    <th className="border border-green-200 py-3 px-4 text-center">
                      {t('servicesPages.educationPrograms.pricing.priceWithVAT')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-green-50">
                    <td className="border border-green-200 py-3 px-4 text-center">
                      1
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-left">
                      {t('servicesPages.educationPrograms.pricing.service1')}
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center">
                      {t('servicesPages.educationPrograms.pricing.serviceUnit')}
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center">
                      1
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center font-medium">
                      {t('servicesPages.educationPrograms.pricing.free')}<br/><span className="text-sm">({t('servicesPages.educationPrograms.pricing.freeNote')})</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="border border-green-200 py-3 px-4 text-center">
                      2
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-left">
                      {t('servicesPages.educationPrograms.pricing.service2')}
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center">
                      {t('servicesPages.educationPrograms.pricing.serviceUnit')}
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center">
                      1
                    </td>
                    <td className="border border-green-200 py-3 px-4 text-center font-medium">
                      93 200 {t('servicesPages.educationPrograms.pricing.currency')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 italic">
              {t('servicesPages.educationPrograms.pricing.note')}
            </div>
          </div>
        </div>
      </div>
      

 <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            
            {/* Второй аккордеон */}
                <FilesAccord 
                    folder="Услуги/Экспертиза образовательных программ/НПА"
                    title={t('servicesPages.educationPrograms.regulatoryActs')}
                    bgColor="bg-green-100"
                    defaultOpen={true}
                />
            
            {/* Третий аккордеон */}
                <FilesAccord 
                    folder="Услуги/Экспертиза образовательных программ/Полезные материалы"
                    title={t('servicesPages.educationPrograms.usefulMaterials')}
                    bgColor="bg-green-100"
                    defaultOpen={true}
                  />
            
        </div>
    </section>

      <div className="container px-5 py-12 mx-auto">
        <div className="bg-green-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t('servicesPages.educationPrograms.contact.title')}
          </h3>
          <p className="text-lg mb-4">
            {t('servicesPages.educationPrograms.contact.description')}
          </p>
          
          <div className="pl-4 border-l-4 border-green-300 mt-5 mb-5">
            <p className="font-medium text-gray-700 mb-1">{t('servicesPages.educationPrograms.contact.department')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('servicesPages.educationPrograms.contact.workPhone')}:</p>
                  <p className="text-base font-medium">+7(7172) 700950 (вн. 1114)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('servicesPages.educationPrograms.contact.mobilePhone')}:</p>
                  <p className="text-base font-medium">+7(707)189-46-80</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('servicesPages.educationPrograms.contact.email')}:</p>
                  <a href="mailto:ddmes.rcrz@mail.ru" className="text-base font-medium text-green-700 hover:underline">ddmes.rcrz@mail.ru</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('servicesPages.educationPrograms.contact.contactPerson')}:</p>
                  <p className="text-base font-medium">{t('servicesPages.educationPrograms.contact.personName')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

EducationPrograms.layout = (page) => {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout title={t('services.educationPrograms')} img="service-education" bgColor='bg-green-100'>{page}</ServicesPageLayout>;
};

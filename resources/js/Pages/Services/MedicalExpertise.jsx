import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function MedicalExpertise() {
  const tLocal = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };

  const timelineItems = [
    { title: tLocal('servicesPages.medicalExpertise.timeline.applicationRegistration'), value: tLocal('servicesPages.medicalExpertise.timeline.applicationRegistrationTime') },
    { title: tLocal('servicesPages.medicalExpertise.timeline.expertisePeriod'), value: tLocal('servicesPages.medicalExpertise.timeline.expertisePeriodTime') },
    { title: tLocal('servicesPages.medicalExpertise.timeline.conclusionProvision'), value: tLocal('servicesPages.medicalExpertise.timeline.conclusionProvisionTime') }
  ];

  return (
    <>
              <Head title={tLocal('servicesPages.medicalExpertise.title')} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.medicalExpertise.description1')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.medicalExpertise.description2')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.medicalExpertise.description3')}
            </p>
          </div>
          
          <div className="w-full lg:w-1/3 px-4">
            <ServiceTimeline items={timelineItems} />
          </div>
        </div>
      </div>
    </>
  );
}

MedicalExpertise.layout = (page) => {
  const tLocal = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout title={tLocal('services.medicalExpertise')} img="service-expertise" bgColor='bg-gray-200'>{page}</ServicesPageLayout>;
};

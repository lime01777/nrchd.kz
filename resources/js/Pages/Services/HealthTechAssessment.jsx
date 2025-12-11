import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function HealthTechAssessment() {
  const tLocal = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };

  const timelineItems = [
    { title: tLocal('servicesPages.healthTechAssessment.timeline.applicationForm'), value: tLocal('servicesPages.healthTechAssessment.timeline.applicationFormTime') },
    { title: tLocal('servicesPages.healthTechAssessment.timeline.fullReport'), value: tLocal('servicesPages.healthTechAssessment.timeline.fullReportTime') },
    { title: tLocal('servicesPages.healthTechAssessment.timeline.shortReport'), value: tLocal('servicesPages.healthTechAssessment.timeline.shortReportTime') },
    { title: tLocal('servicesPages.healthTechAssessment.timeline.refOverview'), value: tLocal('servicesPages.healthTechAssessment.timeline.refOverviewTime') }
  ];

  const handleDownloadForm = () => {
    const fileUrl = '/storage/documents/Услуги/Оценка технологий здравоохранения/Форма заявки на проведение ОТЗ.docx';
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'Форма заявки на проведение ОТЗ.docx');
    link.setAttribute('target', '_blank');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadLetter = () => {
    const fileUrl = '/storage/documents/Услуги/Оценка технологий здравоохранения/Сопроводительное письмо на проведение ОТЗ.docx';
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'Сопроводительное письмо на проведение ОТЗ.docx');
    link.setAttribute('target', '_blank');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
              <Head title={tLocal('servicesPages.healthTechAssessment.title')} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
          <br />
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.healthTechAssessment.description1')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.healthTechAssessment.description2')}
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              {tLocal('servicesPages.healthTechAssessment.description3')}
            </p>
          </div>
          
          <div className="w-full lg:w-1/3 px-4">
            <ServiceTimeline items={timelineItems} />
          </div>
        </div>
        
        {/* Блок "Как подать технологию на оценку?" */}
        <div className="mt-12 bg-gray-50 rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">{tLocal('servicesPages.healthTechAssessment.howToSubmit.title')}</h2>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              {tLocal('servicesPages.healthTechAssessment.howToSubmit.paragraph1')}
            </p>
            
            {/* Блок с кнопками для скачивания документов */}
            <div className="flex flex-col md:flex-row gap-4 my-6 justify-center">
              <button 
                onClick={handleDownloadForm}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base transition duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {tLocal('servicesPages.healthTechAssessment.howToSubmit.downloadForm')}
              </button>
              
              <button 
                onClick={handleDownloadLetter}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base transition duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {tLocal('servicesPages.healthTechAssessment.howToSubmit.downloadLetter')}
              </button>
            </div>
            
            <p>
              {tLocal('servicesPages.healthTechAssessment.howToSubmit.paragraph2')}
            </p>
            
            <p>
              {tLocal('servicesPages.healthTechAssessment.howToSubmit.paragraph3')}
            </p>
            
            <div className="my-6 bg-white rounded-lg p-5 border border-blue-100">
              <h3 className="text-lg font-medium text-black mb-3">{tLocal('servicesPages.healthTechAssessment.howToSubmit.stagesTitle')}</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>{tLocal('servicesPages.healthTechAssessment.howToSubmit.stage1')}</li>
                <li>{tLocal('servicesPages.healthTechAssessment.howToSubmit.stage2')}</li>
                <li>{tLocal('servicesPages.healthTechAssessment.howToSubmit.stage3')}</li>
                <li>{tLocal('servicesPages.healthTechAssessment.howToSubmit.stage4')}</li>
                <li>{tLocal('servicesPages.healthTechAssessment.howToSubmit.stage5')}</li>
              </ol>
            </div>
            
            <p>
              {tLocal('servicesPages.healthTechAssessment.howToSubmit.paragraph4')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

HealthTechAssessment.layout = (page) => {
  const tLocal = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout title={tLocal('services.healthTechAssessment')} img="service-hta">{page}</ServicesPageLayout>;
};

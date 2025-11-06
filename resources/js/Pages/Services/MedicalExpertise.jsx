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
  const timelineItems = [
    { title: t('servicesPages.accreditation.applicationRegistration'), value: `1 ${t('servicesPages.commonElements.workingDay')}` },
    { title: "Срок проведения экспертизы", value: `15 ${t('servicesPages.commonElements.workingDays')}` },
    { title: "Предоставление экспертного заключения", value: `3 ${t('servicesPages.commonElements.workingDays')}` }
  ];

  return (
    <>
              <Head title={t('servicesPages.medicalExpertise.title')} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              Научно-медицинская экспертиза проводится высококвалифицированными 
              специалистами центра с целью оценки научной обоснованности и 
              клинической эффективности медицинских технологий, методов и практик.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Процесс экспертизы включает анализ предоставленных научных данных, 
              результатов исследований, методологии и соответствия современным 
              научным стандартам. При необходимости может быть проведена консультация 
              с профильными экспертами.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              По результатам экспертизы заказчику выдается официальное заключение, 
              содержащее аргументированную оценку, выводы и рекомендации для 
              дальнейшего применения или совершенствования рассматриваемой 
              медицинской технологии или метода.
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

MedicalExpertise.layout = (page) => <ServicesPageLayout title={t('services.medical_expertise', 'Научно-медицинская экспертиза')} img="service-expertise" bgColor='bg-gray-200'>{page}</ServicesPageLayout>;

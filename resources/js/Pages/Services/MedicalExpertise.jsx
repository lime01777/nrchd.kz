import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';

export default function MedicalExpertise() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Срок проведения экспертизы", value: "15 рабочих дней" },
    { title: "Предоставление экспертного заключения", value: "3 рабочих дня" }
  ];

  return (
    <>
      <Head title="Научно-медицинская экспертиза" meta={[{ name: 'description', content: 'Услуги научно-медицинской экспертизы.' }]} />
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

MedicalExpertise.layout = (page) => <ServicesPageLayout title="Научно-медицинская экспертиза" img="service-expertise" bgColor='bg-gray-200'>{page}</ServicesPageLayout>;

import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';

export default function EducationPrograms() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Срок проведения оценки", value: "10 рабочих дней" },
    { title: "Выдача заключения", value: "2 рабочих дня" }
  ];

  return (
    <>
      <Head title="Экспертиза научно-образовательных программ дополнительного образования" />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              Проведение экспертизы образовательной программы (ОП) для включения 
              ОП ДО в Каталог осуществляется на основании заключенного с 
              заявителем договора об оказании услуг.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Процедура экспертизы предполагает анализ содержания, структуры 
              и оформления образовательной программы на соответствие требованиям 
              и стандартам качества, актуальности и применимости информации, 
              а также оценку практической ценности программы.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              По итогам экспертизы заявителю предоставляется подробное экспертное 
              заключение с рекомендациями по улучшению программы или одобрением 
              для включения в Каталог программ дополнительного образования.
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

EducationPrograms.layout = (page) => <ServicesPageLayout title="Экспертиза научно-образовательных программ дополнительного образования" img="service-education">{page}</ServicesPageLayout>;

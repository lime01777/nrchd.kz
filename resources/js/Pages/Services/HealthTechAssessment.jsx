import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';

export default function HealthTechAssessment() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Проведение первичного анализа", value: "5 рабочих дней" },
    { title: "Оценка технологии", value: "20 рабочих дней" },
    { title: "Подготовка отчета", value: "7 рабочих дней" }
  ];

  return (
    <>
      <Head title="Оценка технологий здравоохранения" />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              Оценка технологий здравоохранения (ОТЗ) - это систематический процесс 
              анализа клинической эффективности, безопасности и экономической 
              целесообразности новых или существующих медицинских технологий, 
              включая лекарственные препараты, медицинские изделия и процедуры.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Наш центр проводит комплексную оценку с использованием современных 
              методологий, основанных на доказательной медицине. Команда экспертов 
              анализирует научные данные, проводит экономический анализ и оценивает 
              влияние технологии на систему здравоохранения.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Результаты оценки представляются в виде детального отчета, содержащего 
              объективное заключение о целесообразности внедрения и применения оцениваемой 
              технологии, рекомендации по оптимизации использования и снижению 
              потенциальных рисков.
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

HealthTechAssessment.layout = (page) => <ServicesPageLayout title="Оценка технологий здравоохранения" img="service-hta">{page}</ServicesPageLayout>;

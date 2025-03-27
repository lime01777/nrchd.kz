import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import PriceList from '@/Components/PriceList';

export default function AdsEvaluation() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Проведение экспертизы", value: "5 рабочих дней" },
    { title: "Выдача заключения", value: "2 рабочих дня" }
  ];

  const priceItems = [
    { 
      name: "Оценка рекламной статьи", 
      unit: "1 статья", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    },
    { 
      name: "Оценка рекламного видеоролика", 
      unit: "1 видеоролик", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    },
    { 
      name: "Оценка печатного рекламного модуля", 
      unit: "1 модуль", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    },
    { 
      name: "Оценка рекламного аудиоролика", 
      unit: "1 аудиоролик", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    },
    { 
      name: "Оценка рекламного баннера (одно тексто-графическое изображение)", 
      unit: "1 модуль", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    },
    { 
      name: "Оценка рекламного баннера (ряд тексто-графических изображений)", 
      unit: "1 модуль", 
      priceWithVAT: "132 531 тенге", 
      priceWithoutVAT: "132 531 тенге" 
    }
  ];

  return (
    <>
      <Head title="Оценка рекламных материалов" />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
            <p className="mb-6 text-gray-700 leading-relaxed">
              Наш центр проводит профессиональную оценку рекламных материалов 
              на соответствие требованиям законодательства и этическим нормам 
              в области рекламы и медицинской информации.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Экспертиза включает анализ содержания рекламного материала, 
              проверку достоверности представленной информации, оценку 
              корректности использования терминологии и соответствие 
              заявленных свойств и характеристик фактическим данным.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              По результатам проверки заказчику выдается официальное экспертное 
              заключение, которое может использоваться при взаимодействии 
              с контролирующими органами и размещении рекламы в средствах 
              массовой информации.
            </p>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <ServiceTimeline items={timelineItems} />
          </div>
        </div>
        
        <PriceList 
          title="Прейскурант" 
          items={priceItems} 
        />
      </div>
    </>
  );
}

AdsEvaluation.layout = (page) => <ServicesPageLayout title="Оценка рекламных материалов" img="service-ads">{page}</ServicesPageLayout>;

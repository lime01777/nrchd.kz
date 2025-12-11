import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import PriceList from '@/Components/PriceList';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function DrugExpertise() {
  const tLocal = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };

  const timelineItems = [
    { title: tLocal('servicesPages.drugExpertise.timeline.initialEvaluation'), value: tLocal('servicesPages.drugExpertise.timeline.initialEvaluationTime') },
    { title: tLocal('servicesPages.drugExpertise.timeline.professionalExpertise'), value: tLocal('servicesPages.drugExpertise.timeline.professionalExpertiseTime') },
    { title: tLocal('servicesPages.drugExpertise.timeline.conclusion'), value: tLocal('servicesPages.drugExpertise.timeline.conclusionTime') },
  ];

  const faqItems = [
    {
      question: tLocal('servicesPages.drugExpertise.faq.question1'),
      answer: (
        <div className="space-y-2">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100022782" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.drugExpertise.faq.answer1.law1')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100023885#z4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.drugExpertise.faq.answer1.law2')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100024078" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.drugExpertise.faq.answer1.law3')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021479" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.drugExpertise.faq.answer1.law4')}
              </a>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: t('servicesPages.commonElements.formationRules'),
      answer: (
        <div className="space-y-2">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 16 октября 2020 года № ҚР ДСМ-135/2020 «Об утверждении правил формирования перечня орфанных заболеваний и лекарственных средств для их лечения»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ и.о. Министра здравоохранения Республики Казахстан от 24 декабря 2020 года № ҚР ДСМ-326/2020 «Об утверждении правил формирования Казахстанского национального лекарственного формуляра, а также правил разработки лекарственных формуляров организаций здравоохранения»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ и.о. Министра здравоохранения Республики Казахстан от 24 декабря 2020 года № ҚР ДСМ-324/2020 «Об утверждении правил формирования перечня закупа лекарственных средств и медицинских изделий в рамках гарантированного объема бесплатной медицинской помощи и (или) в системе обязательного социального медицинского страхования»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100023783#z120" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 29 июля 2021 года № ҚР ДСМ-68 «Об утверждении Правил формирования перечня лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан Республики Казахстан с определенными заболеваниями (состояниями)»
              </a>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: "Нормативно-правовая база",
      answer: (
        <div className="space-y-2">
          <p>
            <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК «О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ»
            </a>
          </p>
          <p className="mt-3">
            Данный Кодекс регулирует общественные отношения в области здравоохранения с целью реализации конституционного права граждан на охрану здоровья.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
              <Head title={tLocal('services.drugExpertise')} meta={[{ name: 'description', content: tLocal('servicesPages.drugExpertise.metaDescription') }]} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-0 shadow-sm">
              <p className="text-gray-700 leading-relaxed p-6 mb-0">
                {tLocal('servicesPages.drugExpertise.description1')}
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 mb-0">
                {tLocal('servicesPages.drugExpertise.description2')}
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 mb-0">
                {tLocal('servicesPages.drugExpertise.description3')}
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 pb-6">
                {tLocal('servicesPages.drugExpertise.description4')}
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div id="service-timeline">
              <ServiceTimeline items={timelineItems} />
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <FAQ 
            title={tLocal('servicesPages.drugExpertise.regulatoryDocuments')}
            items={faqItems}
          />
        </div>
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Профессиональная экспертиза лекарственных средств/как получить услугу" 
            title={tLocal('servicesPages.drugExpertise.howToGetService')} 
            bgColor="bg-purple-100"
            defaultOpen={true}
          />
        </div>
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Профессиональная экспертиза лекарственных средств/полезные материалы" 
            title={tLocal('servicesPages.drugExpertise.usefulMaterials')} 
            bgColor="bg-purple-100"
            defaultOpen={true}
          />
        </div>
      </div>
    </>
  );
}

DrugExpertise.layout = (page) => {
  const tLocal = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout title={tLocal('services.drugExpertise')} img="service-drug" bgColor="bg-purple-100">{page}</ServicesPageLayout>;
};

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


export default function AdsEvaluation() {
  const tLocal = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };

  const timelineItems = [
    { title: tLocal('servicesPages.adsEvaluation.timeline.registration'), value: tLocal('servicesPages.adsEvaluation.timeline.registrationTime') },
    { title: tLocal('servicesPages.adsEvaluation.timeline.evaluation'), value: tLocal('servicesPages.adsEvaluation.timeline.evaluationTime') },
  ];

  const priceItems = [
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.article'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.articleUnit'), 
      priceWithVAT: "141 150,00", 
      priceWithoutVAT: "126 026,79" 
    },
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.video'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.videoUnit'), 
      priceWithVAT: "131 400,00", 
      priceWithoutVAT: "117 321,43" 
    },
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.printModule'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.moduleUnit'), 
      priceWithVAT: "152 740,00", 
      priceWithoutVAT: "136 375,00" 
    },
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.audio'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.audioUnit'), 
      priceWithVAT: "101 000,00", 
      priceWithoutVAT: "90 178,57" 
    },
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.bannerSingle'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.bannerUnit'), 
      priceWithVAT: "131 860,00", 
      priceWithoutVAT: "117 732,14" 
    },
    { 
      name: tLocal('servicesPages.adsEvaluation.priceList.bannerMultiple'), 
      unit: tLocal('servicesPages.adsEvaluation.priceList.bannerUnit'), 
      priceWithVAT: "153 000,00", 
      priceWithoutVAT: "136 607,14" 
    }
  ];
  
  const priceNotes = [

  ];

  const faqItems = [
    {
      question: tLocal('servicesPages.adsEvaluation.faq.question1'),
      answer: (
        <div>
          <h3 className="font-semibold mb-2">{tLocal('servicesPages.adsEvaluation.faq.answer1.subtitle')}</h3>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: tLocal('servicesPages.adsEvaluation.faq.answer1.paragraph1') }} />
          <p className="mb-4">{tLocal('servicesPages.adsEvaluation.faq.answer1.paragraph2')}</p>
          <p className="mb-2">{tLocal('servicesPages.adsEvaluation.faq.answer1.documentsTitle')}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc1')}</li>
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc2')}</li>
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc3')}</li>
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc4')}</li>
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc5')}</li>
            <li>{tLocal('servicesPages.adsEvaluation.faq.answer1.doc6')}</li>
          </ul>
          <p>{tLocal('servicesPages.adsEvaluation.faq.answer1.submission')}</p>
          <p className="mt-2">{tLocal('servicesPages.adsEvaluation.faq.answer1.contact')}</p>
        </div>
      )
    },
    {
      question: tLocal('servicesPages.adsEvaluation.faq.question2'),
      answer: (
        <div>
          <ul className="space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.adsEvaluation.faq.answer2.law1')}
              </a>
            </li>
            <li>
              <a href="https://online.zakon.kz/Document/?doc_id=1045608" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.adsEvaluation.faq.answer2.law2')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021872" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {tLocal('servicesPages.adsEvaluation.faq.answer2.law3')}
              </a>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <>
              <Head title={tLocal('services.adsEvaluation')} meta={[{ name: 'description', content: tLocal('servicesPages.adsEvaluation.metaDescription') }]} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {tLocal('servicesPages.adsEvaluation.description')}
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div id="service-timeline">
              <ServiceTimeline items={timelineItems} />
            </div>
          </div>
        </div>
        
        <PriceList 
          title={tLocal('servicesPages.adsEvaluation.priceListTitle')} 
          items={priceItems}
          notes={priceNotes} 
        />
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Оценка рекламных материалов" 
            title={tLocal('servicesPages.adsEvaluation.usefulMaterials')} 
            bgColor="bg-yellow-50"
            defaultOpen={true}
          />
        </div>

        <div className="mt-10">
          <FAQ 
            title=""
            items={faqItems}
            defaultOpen={false}
          />
        </div>
      </div>
    </>
  );
}

AdsEvaluation.layout = (page) => {
  const tLocal = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout title={tLocal('services.adsEvaluation')} img="service-ads" bgColor="bg-yellow-50" hideForm={true}>{page}</ServicesPageLayout>;
};

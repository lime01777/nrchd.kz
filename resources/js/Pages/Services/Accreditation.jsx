import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import ServiceTimeline from '@/Components/ServiceTimeline';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';
import translationService from '@/services/TranslationService';

// Компонент формы аккредитации для отображения в шапке (уменьшенная версия)
const AccreditationForm = () => {
  const [files, setFiles] = useState([]);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    alert('Форма отправлена');
  };
};

export default function Accreditation() {
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };
  const timelineItems = [
    { title: t('servicesPages.accreditation.applicationRegistration'), value: `1 ${t('servicesPages.commonElements.workingDay')}` },
    { title: t('servicesPages.accreditation.serviceDelivery'), value: `27 ${t('servicesPages.commonElements.workingDays')}` },
  ];

  const faqItems = [
    {
      question: t('servicesPages.commonElements.howToGetService'),
      answer: (
        <div>
          <h3 className="font-semibold mb-2">{t('servicesPages.accreditation.faq.applicationProcedure.title')}</h3>
          <p className="mb-4">
            {t('servicesPages.accreditation.faq.applicationProcedure.text1')}
          </p>
          <p className="mb-4">
            {t('servicesPages.accreditation.faq.applicationProcedure.text2')}
          </p>
        </div>
      )
    },
    {
      question: t('servicesPages.commonElements.regulatoryActs'),
      answer: (
        <div>
          <ul className="space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('servicesPages.accreditation.faq.regulatoryActs.code')}
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021852" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('servicesPages.accreditation.faq.regulatoryActs.order')}
              </a>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <>
              <Head title={t('servicesPages.accreditation.title')} />

      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('servicesPages.accreditation.description1')}
              </p>
              
              <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('servicesPages.accreditation.procedureTitle')}</h4>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>{t('servicesPages.accreditation.procedureItem1')}</li>
                <li>{t('servicesPages.accreditation.procedureItem2')}</li>
                <li>{t('servicesPages.accreditation.procedureItem3')}</li>
              </ul>

              <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('servicesPages.accreditation.advantagesTitle')}</h4>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>{t('servicesPages.accreditation.advantage1')}</li>
                <li>{t('servicesPages.accreditation.advantage2')}</li>
                <li>{t('servicesPages.accreditation.advantage3')}</li>
                <li>{t('servicesPages.accreditation.advantage4')}</li>
                <li>{t('servicesPages.accreditation.advantage5')}</li>
                <li>{t('servicesPages.accreditation.advantage6')}</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4">
                {t('servicesPages.accreditation.description2')}
              </p>

              <p className="text-gray-700 leading-relaxed">
                {t('servicesPages.accreditation.description3')}
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div id="service-timeline">
              <ServiceTimeline items={timelineItems} />
            </div>
          </div>
        </div>
        
        <ActualFile 
          title={t('servicesPages.accreditation.currentDocument')} 
          folder="Услуги/Аккредитация/Документ"
          bgColor="bg-purple-50"
          hideDownload={true}
        />
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Аккредитация" 
            title={t('servicesPages.accreditation.usefulMaterials')} 
            bgColor="bg-fuchsia-50"
            defaultOpen={true}
          />
        </div>

        <div className="mt-10">
          <FAQ 
            title={t('servicesPages.accreditation.serviceInfo')}
            items={faqItems}
          />
        </div>
        
        {/* Контактная информация */}
{/* Контактная информация */}
<div className="mt-20">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('servicesPages.accreditation.contacts.title')}</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Первый блок - Контакты */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('servicesPages.accreditation.contacts.department')}</h3>
      <p className="text-gray-600">{t('servicesPages.accreditation.contacts.address')}</p>
      <p className="text-gray-600">{t('servicesPages.accreditation.contacts.phone')}</p>
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center">
          <a href="https://wa.me/77472996410" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 747 299 6410</span>
          </a>
        </div>
        
        <div className="flex items-center">
          <a href="https://wa.me/77019825870" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm font-medium">+7 701 982 5870</span>
          </a>
        </div>
      </div>
    </div>
    
    {/* Второй блок - График работы */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('servicesPages.accreditation.contacts.scheduleTitle')}</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.workDays')}</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.lunchBreak')}</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.weekends')}</span>
        </li>
      </ul>
    </div>
    
    {/* Третий блок - Документы */}
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('servicesPages.accreditation.contacts.documentsTitle')}</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.document1')} <a href="https://nrchd.kz/files/%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5 2023/%D0%BF%D0%B5%D1%80%D0%B5%D1%87%D0%B5%D0%BD%D1%8C %D0%BD%D0%B5%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B8%D0%BC%D1%8B%D1%85 %D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2 %D0%B4%D0%BB%D1%8F %D0%BC%D0%B5%D0%B4%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D1%85 %D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8 %D0%B4%D0%BB%D1%8F %D0%BF%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F %D1%82%D0%BE%D1%87%D0%BA%D0%B8 %D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0 %D0%BA %D0%98%D0%A1 %D0%9C%D0%97 %D0%A0%D0%9A %C2%AB%D0%A1%D0%A3%D0%9A%D0%9C%D0%A3%C2%BB.docx" className="text-blue-600 hover:underline">({t('servicesPages.commonElements.downloadForm')})</a></span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.document2')} <a href="https://nrchd.kz/files/%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5 2023/%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%B5%D1%86 %D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8 %D0%BD%D0%B0 %D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F %D0%98%D0%A1 %D0%9C%D0%97 %D0%A0%D0%9A.docx" className="text-blue-600 hover:underline">({t('servicesPages.commonElements.downloadForm')})</a></span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{t('servicesPages.accreditation.contacts.document3')} <a href="https://nrchd.kz/files/%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5 2023/%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%B5%D1%86 %D0%BE%D0%B1%D1%8A%D1%8F%D0%B7%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0 %D0%BE %D0%BD%D0%B5%D1%80%D0%B0%D0%B7%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B8.docx" className="text-blue-600 hover:underline">({t('servicesPages.commonElements.downloadForm')})</a></span>
        </li>
      </ul>
    </div>
  </div>
</div>
      </div>
    </>
  );
}

Accreditation.layout = (page) => {
  const tLocal = (key, fallback = '') => translationService.t(key, fallback);
  return <ServicesPageLayout 
    title={tLocal('servicesPages.accreditation.layoutTitle')} 
    img="service-accreditation" 
    bgColor="bg-orange-300"
  >{page}</ServicesPageLayout>;
};

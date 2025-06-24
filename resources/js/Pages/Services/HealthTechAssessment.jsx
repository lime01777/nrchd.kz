import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';

export default function HealthTechAssessment() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "10 рабочих дней" },
    { title: "Полный отчет оценки технологий здравоохранения", value: "не более 3 месяцев" },
    { title: "Краткий отчет оценки технологий здравоохранения", value: "от 1 до 3 месяцев" },
    { title: "Справочный обзор технологии здравоохранения", value: "не более 1 месяца" }
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
      <Head title="Оценка технологий здравоохранения" meta={[{ name: 'description', content: 'Оценка технологий здравоохранения для медицинских организаций.' }]} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4">
          <br />
            <p className="mb-6 text-gray-700 leading-relaxed">
              Оценка технологий здравоохранения (ОТЗ) - это систематический процесс 
              анализа клинической эффективности, безопасности и экономической 
              целесообразности новых или существующих медицинских технологий, 
              включая лекарственные препараты, медицинские изделия и процедуры.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
            Согласно Правилам проведения оценки технологий здравоохранения и их применения РГП на ПХВ «Национальный научный центр развития здравоохранения им.Салидат Каирбековой» проводит оценку технологий здравоохранения для одобрения заявляемой технологии здравоохранения к применению, включения заявляемой технологии здравоохранения в перечни для оплаты в рамках ГОБМП в качестве специализированной медицинской помощи/высокотехнологичной медицинской помощи, включения заявляемой технологии здравоохранения в перечни для оплаты в рамках ОСМС в качестве специализированной медицинской помощи.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Результаты оценки представляются в виде детального отчета, содержащего 
              объективное заключение о целесообразности внедрения и применения оцениваемой 
              технологии, рекомендации по оптимизации использования и снижению 
              потенциальных рисков.
            </p>

            <p className="mb-6 text-gray-700 leading-relaxed">
            </p>
          </div>
          
          <div className="w-full lg:w-1/3 px-4">
            <ServiceTimeline items={timelineItems} />
          </div>
        </div>
        
        {/* Блок "Как подать технологию на оценку?" */}
        <div className="mt-12 bg-gray-50 rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Как подать технологию на оценку?</h2>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Как инициатор, первым шагом для подачи технологии на оценку является подготовка и подача официального запроса, включающего в себя сопроводительное письмо и заявку на проведение ОТЗ в электронном или бумажном формате Национальному научному центру развития здравоохранения имени Салидат Каирбековой.
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
                Скачать форму заявки
              </button>
              
              <button 
                onClick={handleDownloadLetter}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base transition duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Скачать сопроводительное письмо
              </button>
            </div>
            
            <p>
              Исполнители ОТЗ затем проверят предоставленные документы и, если необходимо, запросят дополнительные материалы в течение 10 рабочих дней. После этого процесса происходит приоритизация, где выбираются наиболее актуальные технологии для оценки.
            </p>
            
            <p>
              Технологии, не вошедшие в список приоритетных, могут быть рассмотрены на договорной основе исполнителями ОТЗ.
            </p>
            
            <div className="my-6 bg-white rounded-lg p-5 border border-blue-100">
              <h3 className="text-lg font-medium text-black mb-3">Этапы рассмотрения после проведения оценки:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Результаты передаются на рассмотрение Комитета</li>
                <li>Комитет принимает решение о передаче отчета на рассмотрение Объединенной комиссии по качеству медицинских услуг (ОКК) или отклоняет технологию с указанием причин</li>
                <li>Заявитель может предоставить дополнительные данные на основе замечаний Комитета для пересмотра решения</li>
                <li>ОКК принимает решение о дальнейших шагах по технологии</li>
                <li>Если заявка отклонена, она может быть рассмотрена повторно через год при предоставлении новых данных</li>
              </ol>
            </div>
            
            <p>
              В конечном итоге, решение о финансировании технологии принимает Бюджетная Комиссия, основываясь на доступных средствах и правилах формирования тарифов на медицинские услуги.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

HealthTechAssessment.layout = (page) => <ServicesPageLayout title="Оценка технологий здравоохранения" img="service-hta">{page}</ServicesPageLayout>;

import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import PriceList from '@/Components/PriceList';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';

export default function AdsEvaluation() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Срок проведения оценки", value: "10 рабочих дней" },
  ];

  const priceItems = [
    { 
      name: "Оценка рекламной статьи", 
      unit: "1 статья", 
      priceWithVAT: "141 150,00", 
      priceWithoutVAT: "126 026,79" 
    },
    { 
      name: "Оценка рекламного видеоролика", 
      unit: "1 видеоролик", 
      priceWithVAT: "131 400,00", 
      priceWithoutVAT: "117 321,43" 
    },
    { 
      name: "Оценка печатного рекламного модуля", 
      unit: "1 модуль", 
      priceWithVAT: "152 740,00", 
      priceWithoutVAT: "136 375,00" 
    },
    { 
      name: "Оценка рекламного аудиоролика", 
      unit: "1 аудиоролик", 
      priceWithVAT: "101 000,00", 
      priceWithoutVAT: "90 178,57" 
    },
    { 
      name: "Оценка рекламного баннера (одно тексто-графическое изображение)", 
      unit: "1 баннер", 
      priceWithVAT: "131 860,00", 
      priceWithoutVAT: "117 732,14" 
    },
    { 
      name: "Оценка рекламного баннера (ряд тексто-графических изображений)", 
      unit: "1 баннер", 
      priceWithVAT: "153 000,00", 
      priceWithoutVAT: "136 607,14" 
    }
  ];
  
  const priceNotes = [

  ];

  const faqItems = [
    {
      question: "Как получить услугу?",
      answer: (
        <div>
          <h3 className="font-semibold mb-2">Порядок подачи заявления на проведение оценки рекламных материалов лекарственных средств и медицинских изделий</h3>
          <p className="mb-4">
            Для получения заключения о соответствии рекламы требованиям законодательства Республики Казахстан в области здравоохранения заявитель заключает с РГП на ПХВ «Национальный научный центр развития здравоохранения им. С. Каирбековой» (далее – ННЦРЗ) договор установленного образца о проведении оценки рекламных материалов лекарственных средств и медицинских изделий.
          </p>
          <p className="mb-4">
            Оплата стоимости за проведение оценки рекламных материалов лекарственных средств и медицинских изделий осуществляется заявителем в соответствии с прейскурантом, утвержденным ННЦРЗ.
          </p>
          <p className="mb-2">После проведения оплаты заявитель направляет в ННЦРЗ следующие документы и материалы:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Сопроводительное письмо согласно приложению</li>
            <li>Заявление по форме согласно приложению</li>
            <li>Рекламный материал на бумажном и электронном носителях на казахском и русском языках (модуль, статья, раскадровка видео рекламы или баннера, рекламный текст аудио рекламы)</li>
            <li>Видео-, аудиозаписи рекламы на казахском и русском языках при распространении на видео-, радио каналах</li>
            <li>Эксплуатационный документ медицинского изделия (в случае предоставления рекламы на медицинские изделия)</li>
            <li>Сведения, подтверждающие оплату заявителем на расчетный счет ННЦРЗ суммы для проведения оценки рекламных материалов лекарственных средств и медицинских изделий</li>
          </ul>
          <p>
            Вышеуказанные материалы заявитель направляет на электронную почту ННЦРЗ (s.zhaldybaeva@nrchd.kz ) и оригиналы документов предоставляет нарочно в Департамент совершенствования лекарственной политики ННЦРЗ по адресу г. Астана, ул. Мангилик ел, 20 (4 этаж), в рабочие дни с 9-00 до 17-00, перерыв на обед с 13-00 до 14-00.
          </p>
          <p className="mt-2">
            По всем вопросам обращаться по телефонам: 8 7172 700 950 (1049/1079).
          </p>
        </div>
      )
    },
    {
      question: "Нормативно-правовые акты",
      answer: (
        <div>
          <ul className="space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК «О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ»
              </a>
            </li>
            <li>
              <a href="https://online.zakon.kz/Document/?doc_id=1045608" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Закон Республики Казахстан от 19 декабря 2003 года № 508-II «О рекламе» (с изменениями и дополнениями по состоянию на 10.09.2023 г.)
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021872" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 20 декабря 2020 года № ҚР ДСМ-288/2020 «Об утверждении правил осуществления рекламы лекарственных средств и медицинских изделий»
              </a>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <>
      <Head title="Оценка рекламных материалов" meta={[{ name: 'description', content: 'Оценка рекламных материалов для медицинских и фармацевтических услуг.' }]} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Национальный научный центр развития здравоохранения проводит оценку рекламных материалов, содержащих информацию о лекарственных средствах и медицинских изделиях.
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
          title="Прейскурант" 
          items={priceItems}
          notes={priceNotes} 
        />
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Оценка рекламных материалов" 
            title="Полезные материалы" 
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

AdsEvaluation.layout = (page) => <ServicesPageLayout title="Оценка рекламных материалов" img="service-ads" bgColor="bg-yellow-50" hideForm={true}>{page}</ServicesPageLayout>;

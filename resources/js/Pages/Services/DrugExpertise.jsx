import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import ServiceTimeline from '@/Components/ServiceTimeline';
import PriceList from '@/Components/PriceList';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';

export default function DrugExpertise() {
  const timelineItems = [
    { title: "Первичная оценка", value: "5 рабочих дней" },
    { title: "Проведение профессиональной экспертизы", value: "20 рабочих дней / 30 рабочих дней / 40 рабочих дней" },
    { title: "Формирование и предоставление заключения", value: "5 рабочих дней" },
  ];

  const faqItems = [
    {
      question: "Перечни возмещения в рамках ГОБМП и ОСМС",
      answer: (
        <div className="space-y-2">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100022782" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 18 мая 2021 года № ҚР ДСМ – 41 «Об утверждении Казахстанского национального лекарственного формуляра»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100023885#z4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 5 августа 2021 года № ҚР ДСМ – 75 «Об утверждении Перечня лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан Республики Казахстан с определенными заболеваниями (состояниями)»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100024078" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 20 августа 2021 года № ҚР ДСМ-88 «Об определении перечня лекарственных средств и медицинских изделий, закупаемых у единого дистрибьютора»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021479" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 20 октября 2020 года № ҚР ДСМ - 142/2020 «Об утверждении перечня орфанных заболеваний и лекарственных средств для их лечения (орфанных)»
              </a>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: "Правила формирования перечней",
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
      <Head title="Экспертиза лекарственных средств" meta={[{ name: 'description', content: 'Экспертиза лекарственных средств и фармацевтических препаратов.' }]} />
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-0 shadow-sm">
              <p className="text-gray-700 leading-relaxed p-6 mb-0">
                Профессиональная экспертиза результатов технологий здравоохранения является видом деятельности, именуемым в международном опыте Health Technology Appraisal. Согласно информации, размещенной на сайте Министерства здравоохранения Великобритании, «Health Technology Appraisal определяет, должны ли лекарство, медицинское изделие или хирургическая процедура финансироваться государством, исходя из их экономической эффективности».
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 mb-0">
                На основании профессиональной экспертизы определяются клинически и экономически эффективные технологии и предоставляются Министерству здравоохранения Республики Казахстан рекомендации для принятия решений о целесообразности их финансирования и применения в рамках поддерживаемых государством перечней лекарственных препаратов, медицинских изделий и пакетов медицинских услуг.
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 mb-0">
                Данный вид деятельности выполняется РГП «ННЦРЗ имени Салидат Каирбековой» с позиций государства с целью выработки политики здравоохранения и принятия эффективных решений по финансированию. Предоставление объективной и достоверной информации о технологиях необходимо для обеспечения доступности к непредвзятой, профессиональной и качественной информации, что способствует эффективному использованию технологий и принятию научно обоснованных решений на основе доказательной медицины и экономической обоснованности.
              </p>
              <p className="text-gray-700 leading-relaxed px-6 py-3 pb-6">
                Профессиональная экспертиза лекарственных средств для включения в КНФ, Перечень амбулаторного лекарственного обеспечения и Перечень закупа предусматривает оценку данных о клинической и экономической эффективности лекарственного средства. РГП «ННЦРЗ имени Салидат Каирбековой» проводит подготовку заключений по результатам профессиональной экспертизы для Формулярной комиссии, которая на основании этих заключений принимает решения о формировании и утверждении перечней лекарственных средств.
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
            title="Нормативные документы"
            items={faqItems}
          />
        </div>
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Экспертиза лекарственных средств/как получить услугу" 
            title="Как получить услугу" 
            bgColor="bg-purple-100"
            defaultOpen={true}
          />
        </div>
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Экспертиза лекарственных средств/полезные материалы" 
            title="Полезные материалы" 
            bgColor="bg-purple-100"
            defaultOpen={true}
          />
        </div>
      </div>
    </>
  );
}

DrugExpertise.layout = (page) => <ServicesPageLayout title="Экспертиза лекарственных средств" img="service-drug" bgColor="bg-purple-100">{page}</ServicesPageLayout>;

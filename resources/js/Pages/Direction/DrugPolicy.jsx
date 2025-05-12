import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FilesAccord from '@/Components/FilesAccord';
import FolderChlank from '@/Components/FolderChlank';
import FAQ from '@/Components/FAQ';

export default function DrugPolicy() {

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
    <Head title="Лекарственная политика"/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Лекарственное обеспечение занимает значительную часть в расходах здравоохранения и важное место в оказании медицинской помощи населению. В связи с чем, нерациональное использование лекарственных средств имеет медицинские, социальные и экономические последствия для системы общественного здравоохранения.
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Министерством здравоохранения Республики Казахстан проводится постоянная работа по повышению рационального использования лекарственных средств и контролю за качеством медицинских услуг.
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Внедрение и развитие рационального использования лекарственных средств путем совершенствования формулярной системы регламентировано статьей 264 «Рациональное использование лекарственных средств» Кодекса Республики Казахстан «О здоровье народа и системе здравоохранения».
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Согласно Кодексу, рациональное использование лекарственных средств – медикаментозное лечение, соответствующее клиническим показаниям, в дозах, отвечающих индивидуальным потребностям пациента, в течение достаточного периода времени и при наименьших затратах. 
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Организации здравоохранения обеспечивают рациональное использование лекарственных средств, подготовку клинических фармакологов, клинических фармацевтов и регулярное повышение квалификации специалистов в области здравоохранения по рациональному использованию лекарственных средств. 
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Основой для рационального применения лекарственных средств является дальнейшее развитие доказательной медицины, в том числе путем совершенствования формулярной системы. 
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Продолжаются меры по рациональному применению лекарственных средств через совершенствование перечней возмещения в рамках гарантированного объема бесплатной медицинской помощи (ГОБМП) и в системе обязательного социального медицинского страхования (ОСМС): Казахстанский национальный лекарственный формуляр (КНФ), Перечень лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан Республики Казахстан с определенными заболеваниями (состояниями) (Перечень амбулаторного лекарственного обеспечения), Перечень лекарственных средств и медицинских изделий, закупаемых у единого дистрибьютора (Перечень закупа ЕД) и Перечень орфанных заболеваний и лекарственных средств для их лечения.
          </p>
        </div>
      </div>
    </section>



    {/* Блок с формулярами */}
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    h1="Формулярная комиссия МЗ РК" 
                    color="bg-amber-100" 
                    colorsec="bg-amber-200" 
                    href={route('drug.policy.commission')}
                />
                <FolderChlank 
                    h1="Протоколы заседаний Формулярной комиссии за 2023 год" 
                    color="bg-amber-100" 
                    colorsec="bg-amber-200" 
                    href={route('drug.policy.regulations')}
                />
            </div>
        </div>
    </section>

    {/* Блок с FAQ */}
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
        <div className="mt-10">
      <FAQ 
        title="Нормативные документы"
        items={faqItems}
      />
    </div>
        </div>
    </section>


    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
           
                <FilesAccord 
                    folder="Лекарственная политика\Набор — Перечни возмещения в рамках ГОБМП и ОСМС"
                    title="Перечни возмещения в рамках ГОБМП и ОСМС"
                    bgColor="bg-amber-100"
                    defaultOpen={true}
                />
         

                <FilesAccord 
                    folder="Лекарственная политика\Набор — Правила формирования перечней"
                    title="Правила формирования перечней"
                    bgColor="bg-amber-100"
                    defaultOpen={true}
                />
        </div>
    </section>

    </>
  )
}

DrugPolicy.layout = page => <LayoutDirection img="politica" h1="Лекарственная политика">{page}</LayoutDirection>;

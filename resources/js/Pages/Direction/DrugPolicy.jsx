import React from 'react';
import { Head } from '@inertiajs/react';
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
          <div className="flex flex-col space-y-4">
            <a href="https://adilet.zan.kz/rus/docs/V2100022782" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              КНФ - Казахстанский национальный лекарственный формуляр
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2000021479" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень орфанных заболеваний и лекарственных средств
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100024078" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень закупа ЕД (единого дистрибьютора)
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100023885" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень АЛО (амбулаторного лекарственного обеспечения)
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня ЕД
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования КНФ
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2100023783" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня АЛО (утратили силу)
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня орфанных заболеваний и ЛС
            </a>
          </div>
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
    <Head title="Лекарственная политика" meta={[{ name: 'description', content: 'Лекарственная политика: информация о регулировании, доступности и применении лекарственных средств в системе здравоохранения Казахстана.' }]} />
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
                    h1="Протоколы заседаний Формулярной комиссии" 
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


    </>
  )
}

DrugPolicy.layout = page => <LayoutDirection img="politica" h1="Лекарственная политика" useVideo={true}>{page}</LayoutDirection>;

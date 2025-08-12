import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsBiobanks() {
  return (
    <>
      <Head title="Биобанки" meta={[{ name: 'description', content: 'Биобанки: надзор, регулирование и этические аспекты.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Биобанки представляют собой специализированные учреждения, осуществляющие сбор, хранение и использование биологических материалов для научных и медицинских целей.
            </p>
            <p className="tracking-wide leading-relaxed">
            Центральная комиссия по биоэтике осуществляет надзор за деятельностью биобанков, обеспечивая соблюдение этических принципов при работе с биологическими материалами.
            </p>
            <p className="tracking-wide leading-relaxed">
            В сферу надзора входит оценка процедур получения информированного согласия доноров, обеспечения конфиденциальности данных, качества хранения материалов и их использования.
            </p>
            <p className="tracking-wide leading-relaxed">
            Комиссия разрабатывает этические стандарты для работы биобанков, проводит экспертизу проектов создания новых биобанков и осуществляет мониторинг их деятельности.
            </p>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder="Bioethics/Biobanks/Regulation"
                title="Регулирование деятельности биобанков"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/Biobanks/EthicalStandards"
                title="Этические стандарты"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Biobanks/QualityControl"
                title="Контроль качества"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Biobanks/Registration"
                title="Регистрация биобанков"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

BioethicsBiobanks.layout = page => <LayoutFolderChlank title="Биобанки">{page}</LayoutFolderChlank>

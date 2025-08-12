import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsExpertise() {
  return (
    <>
      <Head title="Биоэтическая экспертиза" meta={[{ name: 'description', content: 'Биоэтическая экспертиза: процедуры, требования и документы.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Биоэтическая экспертиза является обязательной процедурой для всех клинических исследований, проводимых на территории Республики Казахстан.
            </p>
            <p className="tracking-wide leading-relaxed">
            Экспертиза проводится с целью оценки соответствия планируемого исследования этическим принципам и стандартам, защиты прав и безопасности участников исследования.
            </p>
            <p className="tracking-wide leading-relaxed">
            В процессе экспертизы оцениваются научная обоснованность исследования, соотношение риска и пользы, информированное согласие участников, квалификация исследователей и другие аспекты.
            </p>
            <p className="tracking-wide leading-relaxed">
            Центральная комиссия по биоэтике разрабатывает методические рекомендации по проведению биоэтической экспертизы и осуществляет надзор за деятельностью локальных комиссий.
            </p>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder="Bioethics/Expertise/Procedures"
                title="Процедуры биоэтической экспертизы"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/Expertise/Requirements"
                title="Требования к документации"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Expertise/Forms"
                title="Формы документов"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Expertise/Guidelines"
                title="Методические рекомендации"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

BioethicsExpertise.layout = page => <LayoutFolderChlank title="Биоэтическая экспертиза">{page}</LayoutFolderChlank>

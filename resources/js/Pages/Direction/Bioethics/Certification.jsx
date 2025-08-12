import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsCertification() {
  return (
    <>
      <Head title="Сертификация локальных комиссий по биоэтике" meta={[{ name: 'description', content: 'Сертификация локальных комиссий по биоэтике: процедуры и требования.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Сертификация локальных комиссий по биоэтике является важным механизмом обеспечения качества биоэтической экспертизы в Республике Казахстан.
            </p>
            <p className="tracking-wide leading-relaxed">
            Процедура сертификации включает оценку соответствия локальных комиссий установленным стандартам и требованиям, включая состав комиссии, процедуры работы и качество принимаемых решений.
            </p>
            <p className="tracking-wide leading-relaxed">
            Центральная комиссия по биоэтике разрабатывает критерии сертификации, проводит обучение членов локальных комиссий и осуществляет мониторинг их деятельности.
            </p>
            <p className="tracking-wide leading-relaxed">
            Сертифицированные локальные комиссии получают право проводить биоэтическую экспертизу клинических исследований в соответствии с установленными стандартами.
            </p>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder="Bioethics/Certification/Procedures"
                title="Процедуры сертификации"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/Certification/Requirements"
                title="Требования к локальным комиссиям"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Certification/Standards"
                title="Стандарты сертификации"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Certification/Training"
                title="Обучение и повышение квалификации"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

BioethicsCertification.layout = page => <LayoutFolderChlank title="Сертификация локальных комиссий по биоэтике">{page}</LayoutFolderChlank>

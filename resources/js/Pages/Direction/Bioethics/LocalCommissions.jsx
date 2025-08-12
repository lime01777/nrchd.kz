import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsLocalCommissions() {
  return (
    <>
      <Head title="Перечень локальных этических комиссий" meta={[{ name: 'description', content: 'Перечень локальных этических комиссий по биоэтике в Республике Казахстан.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Локальные этические комиссии являются основными органами, осуществляющими биоэтическую экспертизу клинических исследований на местах.
            </p>
            <p className="tracking-wide leading-relaxed">
            Каждая комиссия создается при медицинских организациях, научно-исследовательских институтах или высших учебных заведениях, проводящих клинические исследования.
            </p>
            <p className="tracking-wide leading-relaxed">
            Центральная комиссия по биоэтике ведет реестр локальных комиссий, осуществляет координацию их деятельности и обеспечивает единообразие подходов к биоэтической экспертизе.
            </p>
            <p className="tracking-wide leading-relaxed">
            В данном разделе представлен актуальный перечень всех сертифицированных локальных этических комиссий с контактной информацией и сферой компетенции.
            </p>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Registry"
                title="Реестр локальных комиссий"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Contacts"
                title="Контактная информация"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Competence"
                title="Сферы компетенции"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Reports"
                title="Отчеты о деятельности"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

BioethicsLocalCommissions.layout = page => <LayoutFolderChlank title="Перечень локальных этических комиссий">{page}</LayoutFolderChlank>

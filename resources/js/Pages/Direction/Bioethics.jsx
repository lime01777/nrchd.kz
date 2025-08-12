import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function Bioethics() {
  return (
    <>
      <Head title="Центральная комиссия по биоэтике" meta={[{ name: 'description', content: 'Центральная комиссия по биоэтике: экспертиза, сертификация и надзор в области биоэтики.' }]} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Центральная комиссия по биоэтике является ключевым органом, обеспечивающим соблюдение этических принципов в медицинских исследованиях и клинической практике в Республике Казахстан.
            </p>
            <p className="tracking-wide leading-relaxed">
            Основной целью комиссии является защита прав, достоинства и благополучия участников медицинских исследований, а также обеспечение высоких стандартов биоэтической экспертизы.
            </p>
            <p className="tracking-wide leading-relaxed">
            Комиссия осуществляет координацию деятельности локальных этических комиссий, разрабатывает методические рекомендации и проводит обучение специалистов в области биоэтики.
            </p>
            <p className="tracking-wide leading-relaxed">
            В сферу деятельности комиссии входит экспертиза клинических исследований, надзор за биобанками, сертификация локальных комиссий и формирование национальной политики в области биоэтики.
            </p>
            <p className="tracking-wide leading-relaxed">
            Комиссия активно сотрудничает с международными организациями и участвует в разработке международных стандартов биоэтической экспертизы.
            </p>
          </div>
          <div className='flex flex-wrap px-12 justify-center mb-4'>
          </div>
        </div>
      </section>

      {/* Основные направления */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap">
            <FolderChlank 
              h1="БИОЭТИЧЕСКАЯ ЭКСПЕРТИЗА" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.expertise')}
            />
            <FolderChlank 
              h1="СЕРТИФИКАЦИЯ ЛОКАЛЬНЫХ КОМИССИЙ ПО БИОЭТИКЕ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.certification')}
            />
            <FolderChlank 
              h1="БИОБАНКИ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.biobanks')}
            />
            <FolderChlank 
              h1="ПЕРЕЧЕНЬ ЛОКАЛЬНЫХ ЭТИЧЕСКИХ КОМИССИЙ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.local-commissions')}
            />
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Аккордеоны с документами */}
            <FilesAccord 
                folder="Bioethics/Expertise"
                title="Биоэтическая экспертиза"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/Certification"
                title="Сертификация локальных комиссий"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/Biobanks"
                title="Биобанки"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions"
                title="Локальные этические комиссии"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

Bioethics.layout = page => <LayoutDirection img="medicalscience" h1="Центральная комиссия по биоэтике" useVideo={false}>{page}</LayoutDirection>

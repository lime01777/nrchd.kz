import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function MedicalScience() {
  return (
    <>
      <Head title="Медицинская наука" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            Развитие научных исследований – поддержка и координация фундаментальных и прикладных исследований, направленных на решение актуальных проблем здравоохранения.
            </p>
            <p className="tracking-wide leading-relaxed">
            Анализ и оценка научной деятельности – мониторинг результативности исследований, научно-технических и инновационных проектов.
            </p>
            <p className="tracking-wide leading-relaxed">
            Разработка и внедрение инноваций – содействие трансферу технологий и интеграции передовых научных достижений в клиническую практику.
            </p>
            <p className="tracking-wide leading-relaxed">
            Формирование научной политики – разработка стратегий и рекомендаций по совершенствованию медицинской науки и образования.
            </p>
            <p className="tracking-wide leading-relaxed">
            Международное сотрудничество – взаимодействие с ведущими мировыми научными центрами и участие в международных проектах.
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
              h1="Перечень утвержденных научно-медицинских разработок" 
              color="bg-gray-200" 
              colorsec="bg-gray-300" 
              href={route('medical.science.research')}
            />
            <FolderChlank 
              h1="Клинические исследования" 
              color="bg-gray-200" 
              colorsec="bg-gray-300" 
              href={route('medical.science.clinical')}
            />
            <FolderChlank 
              h1="Ученый совет" 
              color="bg-gray-200" 
              colorsec="bg-gray-300" 
              href={route('medical.science.council')}
            />
          </div>
        </div>
      </section>

      {/* Локальная комиссия по биоэтике */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <FilesAccord 
                folder="Медицинская наука/Локальная комиссия по биоэтике"
                title="Локальная комиссия по биоэтике"
                bgColor="bg-gray-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="MedicalEducation/nma"
                title="Научно-медицинская экспертиза "
                bgColor="bg-gray-200"
                defaultOpen={true}
            />
        </div>
    </section>
    </>
  )
}

MedicalScience.layout = page => <LayoutDirection img="medicalscience" h1="Медицинская наука">{page}</LayoutDirection>

import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import ChartHead from '@/Components/ChartHead'
import PageAccordions from '@/Components/PageAccordions';
import FolderChlank from '@/Components/FolderChlank';
import { Link } from '@inertiajs/react';

export default function PrimaryHealthCare() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title="Первичная медико-санитарная помощь" meta={[{ name: 'description', content: 'Первичная медико-санитарная помощь: информация о развитии и организации первичной медицинской помощи.' }]} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
                Первичная медико-санитарная помощь (ПМСП) – это ключевой компонент системы здравоохранения, обеспечивающий 
                доступные и качественные медицинские услуги населению на уровне первого контакта с системой здравоохранения. 
                ПМСП включает в себя основные медицинские услуги, которые доступны всем гражданам, независимо от социально-экономического 
                статуса и географического положения.
                <br /><br />
                Основные принципы ПМСП:
                <br />- Доступность и всеобщий охват населения медицинскими услугами
                <br />- Ориентированность на нужды и потребности пациентов
                <br />- Профилактическая направленность медицинской помощи
                <br />- Преемственность и непрерывность оказания медицинской помощи
                <br />- Координация с другими уровнями здравоохранения
                <br /><br />
                Основные направления развития ПМСП:
                <br />- Укрепление кадрового потенциала и повышение статуса медицинских работников
                <br />- Развитие инфраструктуры ПМСП в соответствии с современными требованиями
                <br />- Внедрение цифровых технологий и информационных систем
                <br />- Совершенствование механизмов финансирования ПМСП
                <br />- Расширение профилактических программ и скрининговых исследований
                <br />- Улучшение доступности лекарственного обеспечения
            </p>
          </div>
            
            <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setShowFullText(!showFullText)} 
                  className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                  rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
                >
                    {showFullText ? 'Скрыть' : 'Читать далее'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                        <rect x="11.5" y="5" width="1" height="14" />
                        <rect x="5" y="11.5" width="14" height="1" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
    <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
            <div className="flex md:flex-row flex-wrap">
                <FolderChlank 
                    h1="Амбулаторная помощь" 
                    color="bg-green-100" 
                    colorsec="bg-green-200" 
                    href={route('primary.healthcare.outpatient')}
                />
                <FolderChlank 
                    h1="Профилактика и скрининг" 
                    color="bg-green-100" 
                    colorsec="bg-green-200" 
                    href={route('primary.healthcare.prevention')}
                />
            </div>
        </div>
    </section>
    <ChartHead />
    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-24 mx-auto">
        <PageAccordions />
      </div>
    </section>
    </>
  )
}

PrimaryHealthCare.layout = (page) => <LayoutDirection img={'pmsp'} h1={'Первичная медико-санитарная помощь'} useVideo={true}>{page}</LayoutDirection>;

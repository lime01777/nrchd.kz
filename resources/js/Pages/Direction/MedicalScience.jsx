import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import BannerCatalog from "@/Components/BannerCatalog";
import FilesAccord from "@/Components/FilesAccord";
import FAQ from "@/Components/FAQ";
import GoogleDriveFiles from "@/Components/GoogleDriveFiles";
import FolderChlank from '@/Components/FolderChlank';

export default function MedicalScience() {
  return (
    <>
      <Head title="Медицинская наука" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Департамент медицинского образования и науки – подразделение ННЦРЗ, главная миссия которого – 
              содействовать развитию и модернизации медицинского образования и науки и способствовать внедрению 
              инновационных технологий в отрасли и разработке эффективных управленческих решений.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Департамент вправе представлять и пересматривать статус научной организации в области 
              здравоохранения, проводить оценки результативности научной, научно-технической и инновационной 
              деятельности.
            </p>
          </div>
          <div className='flex flex-wrap px-12 justify-center mb-4'>
            <button className="cursor-pointer mt-3 text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
              Читать далее
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Основные направления */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap">
            <FolderChlank 
              h1="Программа и методология научно-медицинских исследований" 
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
              h1="Отраслевой центр технологических компетенций" 
              color="bg-gray-200" 
              colorsec="bg-gray-300" 
              href={route('medical.science.tech')}
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

      <BannerCatalog />
      <FilesAccord 
        bgColor="bg-gray-100"
        sections={[
          {
            title: "Научно-медицинская экспертиза",
            documents: [
              { 
                description: "МР по оформлению и утверждению НМР", 
                filetype: "pdf", 
                img: 2, 
                filesize: "1.2 MB",
                date: "15.03.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              },
              { 
                description: "О проведении НМЭ", 
                filetype: "doc", 
                img: 1,
                filesize: "850 KB",
                date: "10.03.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              }
            ]
          },
          {
            title: "Методические рекомендации",
            documents: [
              { 
                description: "Совершенствование системы оценки медицинских технологий", 
                filetype: "pdf", 
                img: 2,
                filesize: "2.4 MB",
                date: "20.03.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              }
            ]
          }
        ]}
      />
    </>
  )
}

MedicalScience.layout = page => <LayoutDirection img="medicalscience" h1="Медицинская наука">{page}</LayoutDirection>

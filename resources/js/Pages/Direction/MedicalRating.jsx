import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function MedicalRating() {
  return (
    <>
      <Head title="Рейтинг медицинских организаций" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Клинический протокол — научно доказанные рекомендации по профилактике, диагностике, лечению, 
              медицинской реабилитации и паллиативной медицинской помощи при определенном заболевании или 
              состоянии пациентов в соответствии с законодательством Республики Казахстан.
            </p>
          </div>
        </div>
      </section>

      {/* Блок с рейтингами */}
      <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
          <div className="flex md:flex-row flex-wrap">
            <FolderChlank 
              h1="Рейтинг медицинских организаций по профилю в разрезе регионов за 2021-2022 г." 
              color="bg-blue-100" 
              colorsec="bg-blue-200" 
              href={route('medical.rating.regional')}
            />
            <FolderChlank 
              h1="Итоги рейтингования медицинских организаций по критериям доступности и качества медицинской помощи" 
              color="bg-blue-100" 
              colorsec="bg-blue-200" 
              href={route('medical.rating.quality')}
            />
          </div>
        </div>
      </section>

      {/* Методические рекомендации */}
      <FilesAccord 
        bgColor="bg-blue-50"
        sections={[
          {
            title: "Методические рекомендации",
            documents: [
              { 
                description: "Методические рекомендации «Индикаторы оценки деятельности медицинских организаций, оказывающих экстренную, неотложную медицинскую помощь»", 
                filetype: "pdf", 
                img: 2, 
                filesize: "3.5 MB",
                date: "12.03.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              },
              { 
                description: "Методические рекомендации по проведению рейтинговой оценки медицинских организаций", 
                filetype: "pdf", 
                img: 2,
                filesize: "2.1 MB",
                date: "15.02.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              },
              { 
                description: "Методические рекомендации по оценке качества медицинской помощи", 
                filetype: "pdf", 
                img: 2,
                filesize: "1.8 MB",
                date: "20.01.2024",
                url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
              }
            ]
          }
        ]}
      />

      {/* Лучшие из лучших */}
      <section className="text-gray-600 body-font bg-blue-50 py-10">
        <div className="container mx-auto px-5">
          <div className="flex flex-col w-full mb-10">
            <h1 className="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest text-center">
              Лучшие из лучших в здравоохранении Республики Казахстан
            </h1>
          </div>
          <div className="flex flex-wrap -m-4">
            {/* Здесь можно добавить карточки лучших организаций */}
          </div>
        </div>
      </section>
    </>
  )
}

MedicalRating.layout = page => <LayoutDirection img="reiting" h1="Рейтинг медицинских организаций">{page}</LayoutDirection>;

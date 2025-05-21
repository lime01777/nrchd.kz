import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';


export default function MedicalRating() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedFileName('');
  };

  return (
    <>
      <Head title="Рейтинг медицинских организаций" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Рейтинговая оценка медицинских организаций позволяет выявить клиники с наилучшими результатами деятельности, а также даёт инструменты менеджменту клиник сфокусироваться на улучшении качества предоставляемой медицинской помощи.
              Целью рейтинговой оценки является выстраивание доверительных отношений между социумом и системой здравоохранения.
            </p>
          </div>
        </div>
      </section>

      {/* Блок с рейтингами */}
      <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
          <div className="flex md:flex-row flex-wrap">
            <FolderChlank 
              h1="Архив рейтингов" 
              color="bg-blue-100" 
              colorsec="bg-blue-200" 
              href={route('medical.rating.regional')}
            />
          </div>
        </div>
      </section>

      {/* Блок с лучшими организациями */}
      <ActualFile 
        title="Лучшие из лучших в здравоохранении Республики Казахстан"
        folder="Рейтинг медицинских организаций" 
        bgColor="bg-blue-100"
      />

      {/* Блок с методические документами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <FilesAccord 
                folder="Рейтинг медицинских организаций/Набор - Методические руководства по рейтингу медицинских организаций"
                title="Методические рекомендации"
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
        </div>
    </section>
    </>
  )
}

MedicalRating.layout = page => <LayoutDirection img="reiting" h1="Рейтинг медицинских организаций" useVideo={true}>{page}</LayoutDirection>;

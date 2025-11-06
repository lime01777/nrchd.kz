import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

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
      <Head title={t('directionsPages.medicalRating.title', 'Рейтинг медицинских организаций')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.medicalRating.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Блок с рейтингами */}
      <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
          <div className="flex md:flex-row flex-wrap">
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.medicalRating.subfolders.archive.title')} 
              description={t('directionsPages.medicalRating.subfolders.archive.description')}
              href={route('medical.rating.regional')}
            />
          </div>
        </div>
      </section>

      {/* Блок с лучшими организациями */}
      <ActualFile 
        title={t('directionsPages.medicalRating.bestOrganizationsTitle')}
        folder={t('directions.medical_rating', 'Рейтинг медицинских организаций')} 
        bgColor="bg-blue-100"
      />

      {/* Блок с методические документами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <FilesAccord 
                folder={t('directionsPages.medicalRating.methodologicalFolder')}
                title={t('directionsPages.medicalRating.methodologicalRecommendations')}
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
        </div>
    </section>
    </>
  );
}

MedicalRating.layout = (page) => <LayoutDirection img="reiting" h1={t('directions.medical_rating', 'Рейтинг медицинских организаций')}>{page}</LayoutDirection>;

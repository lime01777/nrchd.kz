import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Regional() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
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
      <Head title={t('directionsPages.medicalRatingSubpages.regional.title', 'Региональный рейтинг')} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SimpleFileDisplay 
              folder={t('directionsPages.medicalRatingSubpages.regional.folder')} 
              title="" 
            />
            <FilesAccord 
                folder={t('directionsPages.medicalRatingSubpages.regional.rating2018Folder')}
                title={t('directionsPages.medicalRatingSubpages.regional.rating2018Title')}
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
            <FilesAccord 
                folder={t('directionsPages.medicalRatingSubpages.regional.rating2017Folder')}  
                title={t('directionsPages.medicalRatingSubpages.regional.rating2017Title')}
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
            <FilesAccord 
                folder={t('directionsPages.medicalRatingSubpages.regional.rating2016Folder')}
                title={t('directionsPages.medicalRatingSubpages.regional.rating2016Title')}
                bgColor="bg-blue-100"
                defaultOpen={true}
            />

          </div>
        </div>
      </section>

    </>
  );
}

Regional.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.medicalRatingSubpages.regional.h1')} 
  parentRoute={route('medical.rating')} 
  parentName={translationService.t('directionsPages.medicalRatingSubpages.regional.parentName')}
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medicalRatingSubpages.regional.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medicalRatingSubpages.regional.breadcrumbMedicalRating'), route: 'medical.rating' },
    { name: translationService.t('directionsPages.medicalRatingSubpages.regional.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

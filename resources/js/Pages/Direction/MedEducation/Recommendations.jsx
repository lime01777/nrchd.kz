import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Recommendations() {
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
      <Head title={t('directionsPages.medEducationSubpages.recommendations.title', 'Рекомендации')} />
      <section className="text-gray-600 body-font pt-8 pb-24 bg-gray-50">
        <div className="container px-5 mx-auto">
          <SimpleFileDisplay 
            folder={t('directionsPages.medEducationSubpages.recommendations.folder')} 
            title="" 
            bgColor="bg-gray-50"
            onVideoClick={openVideoModal}
          />
        </div>
      </section>
      
      {isModalOpen && (
        <VideoModal
          videoUrl={selectedVideo}
          isOpen={isModalOpen}
          onClose={closeVideoModal}
          fileName={selectedFileName}
        />
      )}
    </>
  )
}

Recommendations.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  h1={translationService.t('directionsPages.medEducationSubpages.recommendations.h1')} 
  parentRoute={route('direction.medical.education')} 
  parentName={translationService.t('directionsPages.medEducationSubpages.recommendations.parentName')}
  breadcrumbs={[
    { name: translationService.t('directionsPages.medEducationSubpages.recommendations.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medEducationSubpages.recommendations.breadcrumbMedicalEducation'), route: 'direction.medical.education' },
    { name: translationService.t('directionsPages.medEducationSubpages.recommendations.h1'), route: null }
  ]}
  children={page}
/>

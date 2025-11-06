import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Rating() {
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
      <Head title={t('directionsPages.medEducationSubpages.rating.title', 'Рейтинг')} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">
            
            <SimpleFileDisplay 
              folder={t('directionsPages.medEducationSubpages.rating.folder')} 
              title="" 
              onVideoClick={openVideoModal}
            />

          </div>
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

Rating.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  h1={translationService.t('directionsPages.medEducationSubpages.rating.h1')} 
  parentRoute={route('direction.medical.education')} 
  parentName={translationService.t('directionsPages.medEducationSubpages.rating.parentName')}
  breadcrumbs={[
    { name: translationService.t('directionsPages.medEducationSubpages.rating.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medEducationSubpages.rating.breadcrumbMedicalEducation'), route: 'direction.medical.education' },
    { name: translationService.t('directionsPages.medEducationSubpages.rating.h1'), route: null }
  ]}
  children={page}
/>

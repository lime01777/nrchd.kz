import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Research() {
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
      <Head title={t('directionsPages.medicalScienceSubpages.research.title', 'Исследования')} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">

            
            <SimpleFileDisplay 
              folder={t('directionsPages.medicalScienceSubpages.research.folder')} 
              title="" 
              bgColor="bg-white"
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
  );
}

Research.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.medicalScienceSubpages.research.h1')} 
  parentRoute={route('medical.science')} 
  parentName={translationService.t('directionsPages.medicalScienceSubpages.research.parentName')}
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medicalScienceSubpages.research.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.research.breadcrumbMedicalScience'), route: 'medical.science' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.research.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

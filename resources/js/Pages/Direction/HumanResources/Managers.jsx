import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Managers() {
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
      <Head title={t('directionsPages.humanResourcesSubpages.managers.title', 'Менеджеры')} />

      {/* Документы для руководителей */}
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder={t('directionsPages.humanResourcesSubpages.managers.folder')} 
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

Managers.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.humanResourcesSubpages.managers.h1')} 
  parentRoute={route('human.resources')} 
  parentName={translationService.t('directionsPages.humanResourcesSubpages.managers.parentName')}
  heroBgColor="bg-red-100"
  breadcrumbs={[
    { name: translationService.t('directionsPages.humanResourcesSubpages.managers.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.humanResourcesSubpages.managers.breadcrumbHumanResources'), route: 'human.resources' },
    { name: translationService.t('directionsPages.humanResourcesSubpages.managers.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

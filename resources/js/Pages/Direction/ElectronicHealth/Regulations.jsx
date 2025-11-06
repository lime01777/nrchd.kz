import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Regulations() {
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
      <Head title={t('directionsPages.electronicHealthSubpages.regulations.title', 'Нормативно-правовые акты')} />

      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder={t('directionsPages.electronicHealthSubpages.regulations.folder')} 
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

Regulations.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.electronicHealthSubpages.regulations.h1')} 
  parentRoute={route('electronic.health')} 
  parentName={translationService.t('directionsPages.electronicHealthSubpages.regulations.parentName')}
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
  buttonBorderColor="border-fuchsia-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.electronicHealthSubpages.regulations.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.electronicHealthSubpages.regulations.breadcrumbElectronicHealth'), route: 'electronic.health' },
    { name: translationService.t('directionsPages.electronicHealthSubpages.regulations.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

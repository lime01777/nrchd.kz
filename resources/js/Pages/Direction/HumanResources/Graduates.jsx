import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Graduates() {
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
      <Head title={t('directionsPages.humanResourcesSubpages.graduates.title', 'Выпускники')} />
<br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder={t('directionsPages.humanResourcesSubpages.graduates.folder')} 
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

Graduates.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.humanResourcesSubpages.graduates.h1')} 
  parentRoute={route('human.resources')} 
  parentName={translationService.t('directionsPages.humanResourcesSubpages.graduates.parentName')}
  heroBgColor="bg-red-100"
  breadcrumbs={[
    { name: translationService.t('directionsPages.humanResourcesSubpages.graduates.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.humanResourcesSubpages.graduates.breadcrumbHumanResources'), route: 'human.resources' },
    { name: translationService.t('directionsPages.humanResourcesSubpages.graduates.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

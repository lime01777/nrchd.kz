import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Tech() {
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
      <Head title={t('directionsPages.medicalScienceSubpages.tech.title', 'Технологии')} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">
              {t('directionsPages.medicalScienceSubpages.tech.intro')}
              <br />
              <br />
              {t('directionsPages.medicalScienceSubpages.tech.tasksTitle')}
              <br />
              <ul className="list-disc pl-6">
                <li className="list-item">{t('directionsPages.medicalScienceSubpages.tech.task1')}</li>
                <li className="list-item">{t('directionsPages.medicalScienceSubpages.tech.task2')}</li>
                <li className="list-item">{t('directionsPages.medicalScienceSubpages.tech.task3')}</li>
              </ul>
              {t('directionsPages.medicalScienceSubpages.tech.conclusion')}
              </p>
            </div>
            
            <SimpleFileDisplay 
              folder={t('directionsPages.medicalScienceSubpages.tech.npaFolder')} 
              title={t('directionsPages.medicalScienceSubpages.tech.npaTitle')} 
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

Tech.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.medicalScienceSubpages.tech.h1')} 
  parentRoute={route('medical.science')} 
  parentName={translationService.t('directionsPages.medicalScienceSubpages.tech.parentName')}
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medicalScienceSubpages.tech.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.tech.breadcrumbMedicalScience'), route: 'medical.science' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.tech.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

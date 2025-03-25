import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';

export default function ClinicalProtocolsMonitoring() {
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
    <Head title='Мониторинг клинических протоколов' />

    <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder="Клинические протоколы\Папка - Мониторинг клинических протоколов\Набор - Материалы" 
              title="Материалы" 
              bgColor="bg-white"
              onVideoClick={openVideoModal}
            />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder="Клинические протоколы\Папка - Мониторинг клинических протоколов\Папка - Отчеты" 
              title="Отчеты" 
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

ClinicalProtocolsMonitoring.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Мониторинг" 
  parentRoute={route('clinical.protocols')} 
  parentName="Клинические протоколы"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;

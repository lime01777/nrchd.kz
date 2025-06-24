import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';

export default function MedicalWorkers() {
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
      <Head title="Медработникам" meta={[{ name: 'description', content: 'Информация для медицинских работников: документы, материалы и полезные ресурсы для специалистов здравоохранения.' }]} />

      {/* Документы для медработников */}
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder="Кадровые ресурсы/Папка-Медработникам" 
              title="Документы для медицинских работников" 
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

MedicalWorkers.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Медработникам" 
  parentRoute={route('human.resources')} 
  parentName="Кадровые ресурсы"
  heroBgColor="bg-red-100"
>{page}</LayoutFolderChlank>;

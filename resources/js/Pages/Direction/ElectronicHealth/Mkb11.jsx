import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';

export default function Mkb11() {
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
      <Head title="МКБ-11" />

      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6">
            <SimpleFileDisplay 
              folder="Электронное здравоохранение\Папка — МКБ 11" 
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

Mkb11.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="МКБ-11" 
  parentRoute={route('electronic.health')} 
  parentName="Электронное здравоохранение"
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
>{page}</LayoutFolderChlank>;

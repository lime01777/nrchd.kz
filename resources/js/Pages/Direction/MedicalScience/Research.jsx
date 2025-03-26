import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';

export default function Research() {
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
      <Head title="Перечень утвержденных научно-медицинских разработок" />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">

            
            <SimpleFileDisplay 
              folder="Медицинская наука/Папка — Перечень утвержденных научно-медицинских разработок" 
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
  h1="Перечень утвержденных научно-медицинских разработок" 
  parentRoute={route('medical.science')} 
  parentName="Медицинская наука"
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
>{page}</LayoutFolderChlank>;

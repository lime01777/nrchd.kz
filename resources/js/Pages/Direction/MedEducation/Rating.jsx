import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';

export default function Rating() {
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
      <Head title="Рейтинговая оценка МОО" />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">
            
            <SimpleFileDisplay 
              folder="Медицинское образование/Папка — Рейтинговая оценка МОО" 
              title="Результаты рейтинговой оценки медицинских организаций образования" 
              bgColor="bg-purple-50"
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
  h1="Рейтинговая оценка МОО" 
  parentRoute={route('direction.medical.education')} 
  parentName="Медицинское образование"
  breadcrumbs={[
    { name: 'Направления', route: 'directions' },
    { name: 'Медицинское образование', route: 'direction.medical.education' },
    { name: 'Рейтинговая оценка МОО', route: null }
  ]}
  children={page}
/>

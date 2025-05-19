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
      <Head title="Результаты рейтинговой оценки по образовательной деятельности медицинских ВУЗов, НИИ, НЦ, ВМК и МК" />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">
            
            <SimpleFileDisplay 
              folder="MedicalEducation/Rating" 
              title="" 
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
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  h1="Результаты рейтинговой оценки по образовательной деятельности медицинских ВУЗов, НИИ, НЦ, ВМК и МК" 
  parentRoute={route('direction.medical.education')} 
  parentName="Медицинское образование"
  breadcrumbs={[
    { name: 'Направления', route: 'directions' },
    { name: 'Медицинское образование', route: 'direction.medical.education' },
    { name: 'Результаты рейтинговой оценки по образовательной деятельности медицинских ВУЗов, НИИ, НЦ, ВМК и МК', route: null }
  ]}
  children={page}
/>

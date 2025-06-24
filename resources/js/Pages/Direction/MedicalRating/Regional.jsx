import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';

export default function Regional() {
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
      <Head title="Архив рейтингов медицинских организаций" meta={[{ name: 'description', content: 'Архив рейтингов медицинских организаций Казахстана за предыдущие периоды.' }]} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SimpleFileDisplay 
              folder="Рейтинг медицинских организаций/Архив рейтингов" 
              title="" 
            />
            <FilesAccord 
                folder="Рейтинг медицинских организаций/Архив рейтингов/Рейтинг медицинских организаций Республики Казахстан за 2018г"
                title="Рейтинг медицинских организаций Республики Казахстан за 2018г"
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Рейтинг медицинских организаций/Архив рейтингов/Рейтинг медицинских организаций Республики Казахстан за 2017г"  
                title="Рейтинг медицинских организаций Республики Казахстан за 2017г"
                bgColor="bg-blue-100"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Рейтинг медицинских организаций/Архив рейтингов/Рейтинг медицинских организаций Республики Казахстан за 2016г"
                title="Рейтинг медицинских организаций Республики Казахстан за 2016г"
                bgColor="bg-blue-100"
                defaultOpen={true}
            />

          </div>
        </div>
      </section>

    </>
  );
}

Regional.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Архив рейтингов" 
  parentRoute={route('medical.rating')} 
  parentName="Рейтинг медицинских организаций"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;

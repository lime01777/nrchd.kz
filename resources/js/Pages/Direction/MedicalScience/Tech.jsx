import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';

export default function Tech() {
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
      <Head title="Отраслевой центр технологических компетенций" />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">

              Отраслевой центр технологических компетенций (ОЦТК) в здравоохранении, создан на основании приказа Министра здравоохранения Республики Казахстан №667 от 18.10.2021 года на базе Национального научного центра развития здравоохранения имени Салидат Каирбековой,  
              <br />
              ОЦТК является ключевым элементом в развитии и внедрении инновационных технологий в систему здравоохранения.
              <br />
              Основные задачи деятельности ОЦТК:
              <br />
              <ul className="list-disc pl-6">
                <li className="list-item">Foresight прогнозирование в сфере науки и технологий, новых профессий и компетенций для системы здравоохранения;</li>
                <li className="list-item">участие в формировании технологических политик (стратегий);</li>
                <li className="list-item">содействие организациям здравоохранения во внедрении технологий мирового уровня и разработок казахстанских исследователей, в соответствии со спецификой организации.</li>
              </ul>
              ОЦТК ориентирован на содействие технологическому развитию и укреплению компетенций, способствуя прогрессу и инновациям.

              </p>
            </div>
            
            <SimpleFileDisplay 
              folder="Медицинская наука\Папка - Отраслевой центр технологических компетенций\Набор-НПА" 
              title="Нормативно правовые акты" 
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
  h1="Отраслевой центр технологических компетенций" 
  parentRoute={route('medical.science')} 
  parentName="Медицинская наука"
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
>{page}</LayoutFolderChlank>;

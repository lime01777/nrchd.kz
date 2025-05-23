import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import VideoModal from '@/Components/VideoModal';
import FilesAccord from '@/Components/FilesAccord';

export default function TechCompetence() {
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
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Отраслевой центр технологических компетенций</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                Отраслевой центр технологических компетенций (ОЦТК) в здравоохранении создан на основании приказа Министра здравоохранения Республики Казахстан №667 от 18.10.2021 года на базе Национального научного центра развития здравоохранения имени Салидат Каирбековой.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                ОЦТК является ключевым элементом в развитии и внедрении инновационных технологий в систему здравоохранения.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Основные задачи деятельности ОЦТК</h3>
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <ul className="list-none space-y-2">
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Foresight прогнозирование в сфере науки и технологий, новых профессий и компетенций для системы здравоохранения</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Участие в формировании технологических политик (стратегий)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Содействие организациям здравоохранения во внедрении технологий мирового уровня и разработок казахстанских исследователей, в соответствии со спецификой организации</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Основные направления деятельности</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Аналитическая работа</h4>
                  <p className="text-gray-700">Анализ мировых трендов и прогнозирование развития технологий в здравоохранении</p>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Развитие компетенций</h4>
                  <p className="text-gray-700">Формирование и развитие технологических компетенций у специалистов здравоохранения</p>
                </div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Внедрение технологий</h4>
                <p className="text-gray-700">Содействие организациям здравоохранения во внедрении современных технологий и инновационных разработок</p>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Координация и сотрудничество</h4>
                <p className="text-gray-700">Координация взаимодействия между организациями здравоохранения, научными центрами и исследовательскими институтами</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              ОЦТК ориентирован на содействие технологическому развитию и укреплению компетенций, способствуя прогрессу и инновациям в системе здравоохранения Республики Казахстан.
            </p>
          </div>
        </div>
      </section>
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <FilesAccord 
            folder="Медицинская наука\Папка - Отраслевой центр технологических компетенций\Набор-НПА" 
            title="Нормативная документация" 
            bgColor="bg-blue-100"
            onVideoClick={openVideoModal}
          />
        </div>
      </section>
      {isModalOpen && (
        <VideoModal
          videoUrl={selectedVideo}
          fileName={selectedFileName}
          onClose={closeVideoModal}
        />
      )}
    </>
  );
}

TechCompetence.layout = (page) => <LayoutDirection img={'techcomtence'} h1={'Отраслевой центр технологических компетенций'} useVideo={true} className="text-white">{page}</LayoutDirection>;

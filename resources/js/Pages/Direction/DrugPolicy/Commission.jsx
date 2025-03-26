import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import VideoModal from '@/Components/VideoModal';
import { Link } from '@inertiajs/react';

export default function Commission() {
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
      <Head title="Формулярная комиссия МЗ РК" />

      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto">
          <div className="flex justify-center mb-8">
            <Link 
              href={route('drug.policy')} 
              className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3"
            >
              <svg 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2"
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Вернуться к лекарственной политике
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className='text-justify mb-4'>
              <p className="tracking-wide leading-relaxed text-lg text-gray-700 mb-4">
                Формулярная комиссия Министерства здравоохранения Республики Казахстан является 
                консультативно-совещательным органом, созданным для формирования и обновления 
                Казахстанского национального лекарственного формуляра, а также для обеспечения 
                рационального использования лекарственных средств.
              </p>
              <p className="tracking-wide leading-relaxed text-lg text-gray-700">
                Комиссия осуществляет свою деятельность в соответствии с законодательством 
                Республики Казахстан в области здравоохранения и обращения лекарственных средств.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SimpleFileDisplay 
              folder="Лекарственная политика/Формулярная комиссия" 
              title="Документы Формулярной комиссии" 
              bgColor="bg-amber-50"
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

Commission.layout = page => <LayoutFolderChlank 
  bgColor="bg-amber-50"
  h1="Формулярная комиссия МЗ РК" 
  parentRoute={route('drug.policy')} 
  parentName="Лекарственная политика"
  heroBgColor="bg-amber-100"
>{page}</LayoutFolderChlank>;

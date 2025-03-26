import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function Regulations() {

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };


  return (
    <>
      <Head title="Протоколы заседаний Формулярной комиссии" />

      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SimpleFileDisplay 
              folder="Лекарственная политика/Папка — Протоколы заседаний Формулярной комиссии за 2023 год" 
              title="Протоколы заседаний Формулярной комиссии" 
              bgColor="bg-white"
            />
          </div>
        </div>
      </section>
    </>
  );
}

Regulations.layout = page => <LayoutFolderChlank 
  bgColor="bg-amber-100"
  h1="Протоколы заседаний Формулярной комиссии" 
  parentRoute={route('drug.policy')} 
  parentName="Лекарственная политика"
  heroBgColor="bg-amber-100"
>{page}</LayoutFolderChlank>;

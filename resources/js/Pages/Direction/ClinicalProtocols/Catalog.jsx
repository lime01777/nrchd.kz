import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function ClinicalProtocolsCatalog() {
  return (
    <>
      <Head title='Клинические протоколы' />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="relative w-full h-[800px]">
              <iframe 
                src="https://diseases.medelement.com/rcrz" 
                width="100%" 
                height="100%" 
                className="border-0 rounded-md"
                title="Клинические протоколы"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

ClinicalProtocolsCatalog.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Клинический протокол" 
  parentRoute={route('clinical.protocols')} 
  parentName="Клинические протоколы"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;
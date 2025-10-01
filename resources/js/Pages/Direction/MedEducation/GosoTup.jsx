import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function GosoTup() {
  return (
    <>
      <Head title="ГОСО и ТУП | Медицинское образование" h1="ГОСО и ТУП" />

      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">ГОСО и ТУП</h1>
            <p className="tracking-wide leading-relaxed">
              В данном разделе представлены государственные общеобязательные стандарты образования (ГОСО)
              и типовые учебные планы (ТУП) по медицинскому образованию.
            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-green-50">
            <FilesAccord
              folder="MedEducation/ГОСО и ТУП"
              title="ГОСО и ТУП"
              bgColor="bg-green-50"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

GosoTup.layout = page => (
  <LayoutFolderChlank bgColor="bg-white">
    {page}
  </LayoutFolderChlank>
);



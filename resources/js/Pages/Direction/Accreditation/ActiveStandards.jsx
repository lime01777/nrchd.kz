import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import BannerCatalog from '@/Components/BannerCatalog';

export default function ActiveStandards() {
  return (
    <>
      <Head title="Действующие стандарты и критерии аккредитации | ННЦРЗ" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">Действующие стандарты и критерии аккредитации</h1>
            <p className="tracking-wide leading-relaxed">
              В данном разделе представлены актуальные нормативные документы, регламентирующие стандарты и критерии 
              аккредитации медицинских организаций в Республике Казахстан. Здесь вы найдете утвержденные требования, 
              которым должна соответствовать медицинская организация для получения аккредитации.
            </p>
          </div>
        </div>
      </section>
      
      <BannerCatalog />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-yellow-100">
            <FilesAccord 
              folder="Accreditation/Standards"
              title="Действующие стандарты и критерии"
              bgColor="bg-yellow-100"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

ActiveStandards.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white" 
    h1="Действующие стандарты и критерии аккредитации" 
    parentRoute={route('medical.accreditation')} 
    parentName="Аккредитация медицинских организаций"
    heroBgColor="bg-yellow-100"
    buttonBgColor="bg-yellow-100"
    buttonHoverBgColor="hover:bg-yellow-200"
    buttonBorderColor="border-yellow-200"
  >
    {page}
  </LayoutFolderChlank>
);

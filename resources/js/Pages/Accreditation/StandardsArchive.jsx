import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import BannerCatalog from '@/Components/BannerCatalog';

export default function StandardsArchive() {
  return (
    <>
      <Head title="Архив стандартов аккредитации | ННЦРЗ" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">Архив стандартов аккредитации</h1>
            <p className="tracking-wide leading-relaxed">
              В этом разделе собраны ранее действовавшие стандарты и критерии аккредитации медицинских организаций 
              Республики Казахстан, которые уже не применяются, но сохраняют историческую и научную ценность. 
              Документы в этом разделе могут быть полезны для изучения эволюции системы аккредитации 
              и сравнительного анализа.
            </p>
          </div>
        </div>
      </section>
      
      <BannerCatalog />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-yellow-100">
            <FilesAccord 
              folder="Accreditation/Archive"
              title="Архив стандартов аккредитации"
              bgColor="bg-yellow-100"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

StandardsArchive.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white" 
    h1="Архив стандартов аккредитации" 
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

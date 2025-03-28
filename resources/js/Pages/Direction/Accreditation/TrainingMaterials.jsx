import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import BannerCatalog from '@/Components/BannerCatalog';

export default function TrainingMaterials() {
  return (
    <>
      <Head title="Обучающие материалы по аккредитации | ННЦРЗ" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">Обучающие материалы по аккредитации</h1>
            <p className="tracking-wide leading-relaxed">
              Для успешного прохождения аккредитации медицинской организации необходима тщательная подготовка всех специалистов. 
              В этом разделе вы найдете учебные и методические материалы, презентации, видеозаписи вебинаров и другие ресурсы, 
              которые помогут вашей организации эффективно подготовиться к процедуре внешней комплексной оценки.
            </p>
          </div>
        </div>
      </section>
      
      <BannerCatalog />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
          <div className="flex flex-wrap px-5 bg-yellow-100">
            <FilesAccord 
              folder="Accreditation/Training"
              title="Обучающие материалы по аккредитации"
              bgColor="bg-yellow-100"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}

TrainingMaterials.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white" 
    h1="Обучающие материалы по аккредитации" 
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

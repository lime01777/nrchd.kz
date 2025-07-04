import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function QualityCommission() {
  return (
    <>
      <Head 
        title="Объединенная комиссия по качеству медицинских услуг" 
        meta={[{ name: 'description', content: 'Информация о деятельности Объединенной комиссии по качеству медицинских услуг Республики Казахстан.' }]} 
      />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Объединенная комиссия по качеству медицинских услуг</h3>
              
              <p className="text-gray-700 mb-4">
                Объединенная комиссия по качеству медицинских услуг (ОКК) является консультативно-совещательным 
                органом при уполномоченном органе в области здравоохранения Республики Казахстан. Комиссия 
                занимается оценкой и мониторингом качества медицинских услуг, рассматривает результаты оценки 
                технологий здравоохранения и принимает решения по их внедрению в систему здравоохранения.
              </p>

              <p className="text-gray-700 mb-4">
                В полномочия Объединенной комиссии входит рассмотрение и утверждение клинических протоколов, 
                стандартов оказания медицинской помощи, а также принятие решений о возможности включения 
                новых технологий и лекарственных средств в систему финансирования в рамках ГОБМП и ОСМС.
              </p>
              
              <div className="mt-8">
                <SimpleFileDisplay 
                  folder="Оценка технологий здравоохранения/Объединенная комиссия по качеству медицинских услуг" 
                  title="Документы и материалы" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

QualityCommission.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Объединенная комиссия по качеству медицинских услуг" 
  parentRoute={route('health.rate')} 
  parentName="Оценка медицинских технологий"
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
  buttonBorderColor="border-fuchsia-200"
/>;

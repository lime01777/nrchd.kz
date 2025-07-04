import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function OmtReports() {
  return (
    <>
      <Head 
        title="Отчеты ОМТ" 
        meta={[{ name: 'description', content: 'Отчеты по оценке медицинских технологий (ОМТ) для здравоохранения Казахстана.' }]} 
      />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Отчеты по оценке медицинских технологий</h3>
              
              <p className="text-gray-700 mb-4">
                В данном разделе представлены отчеты по оценке медицинских технологий (ОМТ), 
                подготовленные Национальным научным центром развития здравоохранения имени 
                Салидат Каирбековой. Отчеты содержат анализ клинической эффективности, 
                безопасности и экономической целесообразности медицинских технологий для 
                принятия решений о их внедрении в систему здравоохранения.
              </p>
              
              <div className="mt-8">
                <SimpleFileDisplay 
                  folder="Оценка технологий здравоохранения/Отчеты ОМТ" 
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

OmtReports.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Отчеты ОМТ" 
  parentRoute={route('health.rate')} 
  parentName="Оценка медицинских технологий"
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
  buttonBorderColor="border-fuchsia-200"
/>;

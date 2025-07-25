import React from 'react';
import { Head } from '@inertiajs/react';
import route from '../../../Utils/routeWithLocale';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function Analytics() {
  return (
    <>
      <Head title="Аналитические материалы" meta={[{ name: 'description', content: 'Аналитические материалы по медицинской статистике и здравоохранению.' }]} />
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="mb-5">
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <SimpleFileDisplay 
              folder="Медицинская статистика/Аналитические материалы" 
              title="" 
            />
          </div>
        </div>
      </section>
    </>
  );
}

Analytics.layout = page => <LayoutFolderChlank  
h1="Аналитические материалы" 
parentRoute={route('medical.statistics')} 
parentName="Медицинская статистика"
heroBgColor="bg-gray-200"
buttonBgColor="bg-gray-200"
buttonHoverBgColor="hover:bg-gray-300">{page}</LayoutFolderChlank>;

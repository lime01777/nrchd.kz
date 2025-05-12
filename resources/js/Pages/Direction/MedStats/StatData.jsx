import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function StatData() {
  return (
    <>
      <Head title="Статистические данные" />
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="mb-5">
            <Link 
              href={route('medical.statistics')} 
              className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Вернуться на страницу статистики
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <SimpleFileDisplay 
              folder="Медицинская статистика/Статистические данные" 
              title="" 
            />
          </div>
        </div>
      </section>
    </>
  );
}

StatData.layout = page => <LayoutFolderChlank img="medicalstatistics" h1="Статистические данные" backgroundColor="bg-purple-500">{page}</LayoutFolderChlank>;

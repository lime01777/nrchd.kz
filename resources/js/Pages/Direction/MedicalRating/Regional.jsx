import { Head } from '@inertiajs/react';
import React from 'react';
import { Link } from '@inertiajs/react';
import FolderChlank from '@/Components/FolderChlank';

export default function Regional() {
  return (
    <>
      <Head title="Рейтинг медицинских организаций по профилю в разрезе регионов" />
      
      <div className="container mx-auto px-5 py-8">
        <Link 
          href={route('medical.rating')} 
          className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-red-600 transition-all"
        >
          ← Назад к рейтингам
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Рейтинг медицинских организаций по профилю в разрезе регионов за 2021-2022 г.</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            Данный рейтинг представляет собой комплексную оценку деятельности медицинских организаций 
            Республики Казахстан по различным профилям в разрезе регионов за период 2021-2022 гг.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Критерии оценки:</h2>
            <ul className="list-disc pl-6">
              <li>Доступность медицинской помощи</li>
              <li>Качество оказания медицинских услуг</li>
              <li>Удовлетворенность пациентов</li>
              <li>Квалификация медицинского персонала</li>
              <li>Материально-техническое оснащение</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full md:w-1/2 lg:w-1/3">
              <div className="h-full bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Рейтинг стационаров</h3>
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать PDF
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="p-2 w-full md:w-1/2 lg:w-1/3">
              <div className="h-full bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Рейтинг поликлиник</h3>
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать PDF
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="p-2 w-full md:w-1/2 lg:w-1/3">
              <div className="h-full bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Рейтинг скорой помощи</h3>
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать PDF
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

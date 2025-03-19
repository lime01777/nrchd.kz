import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Research() {
  return (
    <>
      <Head title="Программа и методология научно-медицинских исследований" />
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Программа и методология научно-медицинских исследований – это комплексный подход к организации 
              и проведению научных исследований в области медицины. Наш департамент разрабатывает и внедряет 
              современные методологические подходы, соответствующие международным стандартам.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Мы обеспечиваем методологическую поддержку исследователей на всех этапах научной работы: 
              от формулирования гипотезы и разработки дизайна исследования до анализа результатов и 
              подготовки публикаций.
            </p>
          </div>
        </div>
      </section>

      {/* Методические рекомендации */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Методические рекомендации" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Методические рекомендации по организации и проведению научных исследований" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="15.01.2023"
              />
              <FileAccordChlank 
                description="Руководство по статистическому анализу медицинских данных" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="10.02.2023"
              />
              <FileAccordChlank 
                description="Правила оформления научных публикаций" 
                filetype="pdf" 
                img="pdf" 
                filesize="450 Кб"
                date="05.03.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Программы исследований */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Программы исследований" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Приоритетные направления научных исследований на 2023-2025 годы" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="20.12.2022"
              />
              <FileAccordChlank 
                description="Программа развития медицинской науки до 2030 года" 
                filetype="pdf" 
                img="pdf" 
                filesize="2.1 Мб"
                date="15.11.2022"
              />
              <FileAccordChlank 
                description="Стратегия научно-инновационного развития здравоохранения" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.8 Мб"
                date="10.10.2022"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Кнопка возврата */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="flex justify-center">
            <Link 
              href={route('medical.science')} 
              className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3"
            >
              <svg 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2"
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Вернуться к медицинской науке
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

Research.layout = page => <LayoutDirection img="science" h1="Программа и методология научно-медицинских исследований">{page}</LayoutDirection>

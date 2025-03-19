import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Clinical() {
  return (
    <>
      <Head title="Клинические исследования" />

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

      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Клинические исследования – важнейший этап в разработке и внедрении новых методов лечения, 
              диагностики и профилактики заболеваний. Наш департамент координирует проведение клинических 
              исследований в соответствии с международными стандартами качества и этическими принципами.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Мы обеспечиваем методологическую и организационную поддержку исследователей, проводим 
              экспертизу протоколов клинических исследований и осуществляем мониторинг их проведения.
            </p>
          </div>
        </div>
      </section>

      {/* Нормативные документы */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Нормативные документы" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Правила проведения клинических исследований в Республике Казахстан" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="10.01.2023"
              />
              <FileAccordChlank 
                description="Требования к оформлению протоколов клинических исследований" 
                filetype="pdf" 
                img="pdf" 
                filesize="980 Кб"
                date="15.02.2023"
              />
              <FileAccordChlank 
                description="Этические принципы проведения клинических исследований" 
                filetype="pdf" 
                img="pdf" 
                filesize="750 Кб"
                date="20.03.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Текущие исследования */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Текущие исследования" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Реестр клинических исследований, проводимых в РК (2023)" 
                filetype="xls" 
                img="xls" 
                filesize="2.3 Мб"
                date="01.06.2023"
              />
              <FileAccordChlank 
                description="Отчет о результатах клинических исследований за 2022 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="3.1 Мб"
                date="15.02.2023"
              />
              <FileAccordChlank 
                description="План клинических исследований на 2023-2024 годы" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="10.01.2023"
              />
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

Clinical.layout = page => <LayoutDirection img="medicalscience" h1="Клинические исследования">{page}</LayoutDirection>

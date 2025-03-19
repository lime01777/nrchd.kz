import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Council() {
  return (
    <>
      <Head title="Ученый совет" />
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Ученый совет – коллегиальный орган управления научной деятельностью, 
              осуществляющий планирование, координацию и оценку научно-исследовательской 
              работы в области здравоохранения.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              В состав Ученого совета входят ведущие ученые и специалисты в области 
              медицины и здравоохранения, представители научных организаций и 
              образовательных учреждений.
            </p>
          </div>
        </div>
      </section>

      {/* Состав ученого совета */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Состав ученого совета" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Положение об Ученом совете" 
                filetype="pdf" 
                img="pdf" 
                filesize="950 Кб"
                date="15.01.2023"
              />
              <FileAccordChlank 
                description="Состав Ученого совета на 2023 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="20.01.2023"
              />
              <FileAccordChlank 
                description="Регламент работы Ученого совета" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="25.01.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Заседания ученого совета */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Заседания ученого совета" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="План заседаний Ученого совета на 2023 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="750 Кб"
                date="10.01.2023"
              />
              <FileAccordChlank 
                description="Протоколы заседаний Ученого совета (2022)" 
                filetype="pdf" 
                img="pdf" 
                filesize="3.5 Мб"
                date="15.02.2023"
              />
              <FileAccordChlank 
                description="Решения Ученого совета (2022-2023)" 
                filetype="pdf" 
                img="pdf" 
                filesize="2.8 Мб"
                date="20.03.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Научные проекты */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Научные проекты" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Перечень научных проектов, одобренных Ученым советом" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="05.04.2023"
              />
              <FileAccordChlank 
                description="Отчеты о выполнении научных проектов" 
                filetype="pdf" 
                img="pdf" 
                filesize="4.2 Мб"
                date="10.05.2023"
              />
              <FileAccordChlank 
                description="Рекомендации Ученого совета по развитию научных исследований" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.8 Мб"
                date="15.06.2023"
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

Council.layout = page => <LayoutDirection img="science" h1="Ученый совет">{page}</LayoutDirection>

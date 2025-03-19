import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Regulations() {
  return (
    <>
      <Head title="Положение комиссии Формулярной комиссии" />
      
      {/* Кнопка возврата */}
      <section className="text-gray-600 body-font pb-8 bg-yellow-100">
        <div className="container px-5 mx-auto">
          <div className="flex justify-center">
            <Link 
              href={route('drug.policy')} 
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
              Вернуться к лекарственной политике
            </Link>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Положение о Формулярной комиссии Министерства здравоохранения Республики Казахстан 
              определяет правовой статус, порядок формирования, основные задачи, функции, права 
              и обязанности, а также организацию деятельности Формулярной комиссии.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Положение разработано в соответствии с Кодексом Республики Казахстан «О здоровье 
              народа и системе здравоохранения» и другими нормативными правовыми актами в области 
              здравоохранения и обращения лекарственных средств.
            </p>
          </div>
        </div>
      </section>

      {/* Нормативные документы */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Нормативные документы" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Положение о Формулярной комиссии МЗ РК" 
                filetype="pdf" 
                img="pdf" 
                filesize="520 Кб"
                date="05.01.2023"
              />
              <FileAccordChlank 
                description="Регламент работы Формулярной комиссии" 
                filetype="pdf" 
                img="pdf" 
                filesize="480 Кб"
                date="10.01.2023"
              />
              <FileAccordChlank 
                description="Порядок взаимодействия Формулярной комиссии с другими органами" 
                filetype="pdf" 
                img="pdf" 
                filesize="350 Кб"
                date="15.01.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Правила и процедуры */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Правила и процедуры" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Правила рассмотрения заявок на включение лекарственных средств в формуляр" 
                filetype="pdf" 
                img="pdf" 
                filesize="420 Кб"
                date="20.01.2023"
              />
              <FileAccordChlank 
                description="Процедура экспертной оценки лекарственных средств" 
                filetype="pdf" 
                img="pdf" 
                filesize="380 Кб"
                date="25.01.2023"
              />
              <FileAccordChlank 
                description="Критерии включения и исключения лекарственных средств из формуляра" 
                filetype="pdf" 
                img="pdf" 
                filesize="410 Кб"
                date="30.01.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Методические рекомендации */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Методические рекомендации" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Методические рекомендации по оценке безопасности лекарственных средств" 
                filetype="pdf" 
                img="pdf" 
                filesize="650 Кб"
                date="05.02.2023"
              />
              <FileAccordChlank 
                description="Методические рекомендации по оценке эффективности лекарственных средств" 
                filetype="pdf" 
                img="pdf" 
                filesize="680 Кб"
                date="10.02.2023"
              />
              <FileAccordChlank 
                description="Методические рекомендации по фармакоэкономическому анализу" 
                filetype="pdf" 
                img="pdf" 
                filesize="720 Кб"
                date="15.02.2023"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Regulations.layout = page => <LayoutDirection img="politica" h1="Положение комиссии Формулярной комиссии">{page}</LayoutDirection>

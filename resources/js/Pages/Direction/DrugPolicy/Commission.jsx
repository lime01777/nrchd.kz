import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Commission() {
  return (
    <>
      <Head title="Формулярная комиссия МЗ РК" />
      
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
              Формулярная комиссия Министерства здравоохранения Республики Казахстан является 
              консультативно-совещательным органом, созданным для формирования и обновления 
              Казахстанского национального лекарственного формуляра, а также для обеспечения 
              рационального использования лекарственных средств.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Комиссия осуществляет свою деятельность в соответствии с законодательством 
              Республики Казахстан в области здравоохранения и обращения лекарственных средств.
            </p>
          </div>
        </div>
      </section>

      {/* Состав комиссии */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Состав комиссии" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Состав Формулярной комиссии МЗ РК на 2023 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="450 Кб"
                date="10.01.2023"
              />
              <FileAccordChlank 
                description="Приказ о формировании Формулярной комиссии" 
                filetype="pdf" 
                img="pdf" 
                filesize="320 Кб"
                date="15.01.2023"
              />
              <FileAccordChlank 
                description="График заседаний Формулярной комиссии на 2023 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="280 Кб"
                date="20.01.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Протоколы заседаний */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Протоколы заседаний" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Протокол заседания Формулярной комиссии №1 от 15.02.2023" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="20.02.2023"
              />
              <FileAccordChlank 
                description="Протокол заседания Формулярной комиссии №2 от 15.04.2023" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.4 Мб"
                date="20.04.2023"
              />
              <FileAccordChlank 
                description="Протокол заседания Формулярной комиссии №3 от 15.06.2023" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.3 Мб"
                date="20.06.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Решения комиссии */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Решения комиссии" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Решение о включении препаратов в Казахстанский национальный лекарственный формуляр" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="30.06.2023"
              />
              <FileAccordChlank 
                description="Решение об исключении препаратов из Казахстанского национального лекарственного формуляра" 
                filetype="pdf" 
                img="pdf" 
                filesize="720 Кб"
                date="30.06.2023"
              />
              <FileAccordChlank 
                description="Рекомендации по рациональному использованию лекарственных средств" 
                filetype="pdf" 
                img="pdf" 
                filesize="950 Кб"
                date="15.07.2023"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Commission.layout = page => <LayoutDirection img="politica" h1="Формулярная комиссия МЗ РК">{page}</LayoutDirection>

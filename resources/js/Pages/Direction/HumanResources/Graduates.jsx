import { Head } from '@inertiajs/react';
import React from 'react';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Graduates() {
  return (
    <>
      <Head title="Выпускникам" />
      
      {/* Кнопка возврата */}
      <section className="text-gray-600 body-font bg-red-100 py-4">
        <div className="container px-5 mx-auto">
          <div className="flex justify-start">
            <Link 
              href={route('human.resources')} 
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
              Вернуться к кадровым ресурсам
            </Link>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Информация для выпускников медицинских вузов и колледжей о возможностях трудоустройства, 
              прохождения практики и стажировки, а также о программах поддержки молодых специалистов.
            </p>
          </div>
        </div>
      </section>

      {/* Документы для выпускников */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 lg:w-1/3 md:w-1/2">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Инструкция по размещению резюме для выпускников</h2>
                  <div className="flex items-center flex-wrap">
                    <a href="#" className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                      <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                      PDF, 24 КБ
                    </a>
                    <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                      27.03.2024
                    </span>
                    <button className="text-gray-400 inline-flex items-center leading-none text-sm">
                      Открыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 lg:w-1/3 md:w-1/2">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Закон «Об образовании»</h2>
                  <div className="flex items-center flex-wrap">
                    <a href="#" className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                      <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                      PDF, 24 КБ
                    </a>
                    <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                      27.03.2024
                    </span>
                    <button className="text-gray-400 inline-flex items-center leading-none text-sm">
                      Открыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 lg:w-1/3 md:w-1/2">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Правила распределения выпускников</h2>
                  <div className="flex items-center flex-wrap">
                    <a href="#" className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                      <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                      PDF, 24 КБ
                    </a>
                    <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                      27.03.2024
                    </span>
                    <button className="text-gray-400 inline-flex items-center leading-none text-sm">
                      Открыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 lg:w-1/3 md:w-1/2">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Образец ходатайства на русском</h2>
                  <div className="flex items-center flex-wrap">
                    <a href="#" className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                      <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                      DOC, 54 КБ
                    </a>
                    <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                      27.03.2024
                    </span>
                    <button className="text-gray-400 inline-flex items-center leading-none text-sm">
                      Открыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Вакансии для выпускников */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Вакансии для выпускников" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Список вакансий в организациях здравоохранения РК" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="15.03.2024"
              />
              <FileAccordChlank 
                description="Программа «Молодой специалист»" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="10.03.2024"
              />
              <FileAccordChlank 
                description="Меры социальной поддержки молодых специалистов" 
                filetype="pdf" 
                img="pdf" 
                filesize="720 Кб"
                date="05.03.2024"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Graduates.layout = page => <>{page}</>

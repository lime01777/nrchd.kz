import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Tech() {
  return (
    <>
      <Head title="Отраслевой центр технологических компетенций" />
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Отраслевой центр технологических компетенций – это структурное подразделение, 
              созданное для развития и внедрения инновационных технологий в здравоохранении. 
              Центр объединяет ведущих специалистов в области медицинских технологий, 
              информационных систем и биомедицинской инженерии.
            </p>
          </div>
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              Наша миссия – содействие технологическому развитию отрасли здравоохранения 
              через внедрение передовых технологий, обучение специалистов и поддержку 
              инновационных проектов.
            </p>
          </div>
        </div>
      </section>

      {/* Направления деятельности */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Направления деятельности</h2>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="h-full bg-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Цифровое здравоохранение</h3>
                <p className="leading-relaxed mb-3">
                  Разработка и внедрение цифровых решений для повышения эффективности 
                  системы здравоохранения.
                </p>
              </div>
            </div>
            
            <div className="p-4 md:w-1/3">
              <div className="h-full bg-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Медицинская робототехника</h3>
                <p className="leading-relaxed mb-3">
                  Исследования и разработки в области роботизированных систем для 
                  медицинских учреждений.
                </p>
              </div>
            </div>
            
            <div className="p-4 md:w-1/3">
              <div className="h-full bg-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Искусственный интеллект в медицине</h3>
                <p className="leading-relaxed mb-3">
                  Применение технологий искусственного интеллекта для диагностики 
                  и лечения заболеваний.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Документы центра */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Документы центра" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Положение об Отраслевом центре технологических компетенций" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.1 Мб"
                date="05.02.2023"
              />
              <FileAccordChlank 
                description="Стратегия развития центра на 2023-2027 годы" 
                filetype="pdf" 
                img="pdf" 
                filesize="2.3 Мб"
                date="10.01.2023"
              />
              <FileAccordChlank 
                description="Отчет о деятельности центра за 2022 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="3.5 Мб"
                date="20.02.2023"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Проекты центра */}
      <section className="text-gray-600 body-font pb-8 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Проекты центра" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Каталог инновационных проектов в здравоохранении" 
                filetype="pdf" 
                img="pdf" 
                filesize="4.2 Мб"
                date="15.03.2023"
              />
              <FileAccordChlank 
                description="Реестр технологических разработок центра" 
                filetype="xls" 
                img="xls" 
                filesize="1.8 Мб"
                date="01.04.2023"
              />
              <FileAccordChlank 
                description="Презентация проектов цифровой трансформации здравоохранения" 
                filetype="ppt" 
                img="pdf" 
                filesize="5.6 Мб"
                date="10.05.2023"
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

Tech.layout = page => <LayoutDirection img="medicalscience" h1="Отраслевой центр технологических компетенций">{page}</LayoutDirection>

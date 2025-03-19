import { Head } from '@inertiajs/react';
import React from 'react';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function MedicalWorkers() {
  return (
    <>
      <Head title="Медработникам" />
      
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
              Информация для медицинских работников о возможностях профессионального развития, 
              повышения квалификации, аттестации и сертификации, а также о правах и обязанностях 
              медицинских работников.
            </p>
          </div>
        </div>
      </section>

      {/* Профессиональное развитие */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Профессиональное развитие" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Программы повышения квалификации для медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="05.03.2024"
              />
              <FileAccordChlank 
                description="График проведения курсов повышения квалификации на 2024 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="10.02.2024"
              />
              <FileAccordChlank 
                description="Порядок зачисления на курсы повышения квалификации" 
                filetype="pdf" 
                img="pdf" 
                filesize="720 Кб"
                date="15.01.2024"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Аттестация и сертификация */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Аттестация и сертификация" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Правила проведения аттестации медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="980 Кб"
                date="20.01.2024"
              />
              <FileAccordChlank 
                description="График проведения аттестации на 2024 год" 
                filetype="pdf" 
                img="pdf" 
                filesize="650 Кб"
                date="25.01.2024"
              />
              <FileAccordChlank 
                description="Перечень документов для прохождения аттестации" 
                filetype="pdf" 
                img="pdf" 
                filesize="520 Кб"
                date="30.01.2024"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Права и обязанности */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Права и обязанности" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Права и обязанности медицинских работников согласно Кодексу РК «О здоровье народа»" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="05.02.2024"
              />
              <FileAccordChlank 
                description="Социальные гарантии для медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="10.02.2024"
              />
              <FileAccordChlank 
                description="Ответственность медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="780 Кб"
                date="15.02.2024"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Вакансии */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Вакансии" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Актуальные вакансии в организациях здравоохранения РК" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="01.03.2024"
              />
              <FileAccordChlank 
                description="Требования к кандидатам на замещение вакантных должностей" 
                filetype="pdf" 
                img="pdf" 
                filesize="720 Кб"
                date="05.03.2024"
              />
              <FileAccordChlank 
                description="Порядок подачи документов для участия в конкурсе на замещение вакантных должностей" 
                filetype="pdf" 
                img="pdf" 
                filesize="850 Кб"
                date="10.03.2024"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

MedicalWorkers.layout = page => <>{page}</>

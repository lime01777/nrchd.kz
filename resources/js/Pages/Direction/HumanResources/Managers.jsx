import { Head } from '@inertiajs/react';
import React from 'react';
import { Link } from '@inertiajs/react';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FileAccordTitle from '@/Components/FileAccordTitle';

export default function Managers() {
  return (
    <>
      <Head title="Руководителям" />
      
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
              Информация для руководителей медицинских организаций о нормативно-правовых актах, 
              регулирующих кадровые вопросы, методические рекомендации по управлению персоналом 
              и повышению эффективности работы медицинских организаций.
            </p>
          </div>
        </div>
      </section>

      {/* Нормативные документы */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Нормативные документы" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Кодекс Республики Казахстан «О здоровье народа и системе здравоохранения»" 
                filetype="pdf" 
                img="pdf" 
                filesize="2.5 Мб"
                date="10.01.2024"
              />
              <FileAccordChlank 
                description="Трудовой кодекс Республики Казахстан (извлечения)" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.8 Мб"
                date="15.01.2024"
              />
              <FileAccordChlank 
                description="Приказ МЗ РК «Об утверждении квалификационных требований к медицинским работникам»" 
                filetype="pdf" 
                img="pdf" 
                filesize="950 Кб"
                date="20.01.2024"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Методические рекомендации */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Методические рекомендации" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Методика расчета потребности в медицинских кадрах" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.2 Мб"
                date="05.02.2024"
              />
              <FileAccordChlank 
                description="Рекомендации по организации непрерывного профессионального развития медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.5 Мб"
                date="10.02.2024"
              />
              <FileAccordChlank 
                description="Методические рекомендации по оценке эффективности деятельности медицинских работников" 
                filetype="pdf" 
                img="pdf" 
                filesize="1.3 Мб"
                date="15.02.2024"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Формы документов */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <FileAccordTitle title="Формы документов" />
            <div className="flex flex-wrap -m-4 mt-4">
              <FileAccordChlank 
                description="Типовой трудовой договор с медицинским работником" 
                filetype="doc" 
                img="doc" 
                filesize="85 Кб"
                date="01.03.2024"
              />
              <FileAccordChlank 
                description="Форма должностной инструкции медицинского работника" 
                filetype="doc" 
                img="doc" 
                filesize="75 Кб"
                date="05.03.2024"
              />
              <FileAccordChlank 
                description="Форма отчета о кадровом обеспечении медицинской организации" 
                filetype="xls" 
                img="xls" 
                filesize="120 Кб"
                date="10.03.2024"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Managers.layout = page => <>{page}</>

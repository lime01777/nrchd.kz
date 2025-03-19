import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ImportantDoc from '@/Components/ImportantDoc';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FAQ from '@/Components/FAQ';

export default function HealthAccounts() {
  return (
    <>
    <Head title="Национальные счета здравоохранения"/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
            Национальные счета здравоохранения – статистическое данное, благодаря которому проводится регулярный, всесторонний и последовательный мониторинг финансовых потоков в системе здравоохранения страны. Это важный инструмент для объективного и рационального распределения ресурсов как для принятия решений, так и личного пользования граждан.
          </p>
        </div>
      </div>
    </section>

    {/* Блок с визуализацией макроэкономического исследования */}
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="bg-purple-100 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Визуализация макроэкономического исследования по стране</h2>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/2">
              <div className="h-full bg-white p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Отчет по макроэкономическим показателям</h3>
                <p className="leading-relaxed mb-3">Визуализация основных макроэкономических показателей здравоохранения Республики Казахстан</p>
                <a href="#" className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                  Открыть
                </a>
              </div>
            </div>
            <div className="p-4 md:w-1/2">
              <div className="h-full bg-white p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Дашборд по регионам</h3>
                <p className="leading-relaxed mb-3">Интерактивная визуализация показателей по регионам Республики Казахстан</p>
                <a href="#" className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                  Открыть
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Дашборды по регионам */}
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Дашборды по регионам</h2>
          <div className="flex flex-wrap -m-4">
            <FileAccordChlank 
              description="Расходы на здравоохранение по источникам финансирования" 
              filetype="pdf" 
              img="pdf" 
            />
            <FileAccordChlank 
              description="Распределение по типу оказания медицинской помощи" 
              filetype="pdf" 
              img="pdf" 
            />
            <FileAccordChlank 
              description="Расходы на здравоохранение по регионам РК" 
              filetype="xls" 
              img="xls" 
            />
          </div>
        </div>
      </div>
    </section>

    {/* Дашборды НСЗ за 2010-2022 год */}
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Дашборды НСЗ за 2010-2022 год</h2>
          <div className="flex flex-wrap -m-4">
            <FileAccordChlank 
              description="Макро показатели 2010-2022" 
              filetype="pdf" 
              img="pdf" 
            />
            <FileAccordChlank 
              description="Распределение по регионам" 
              filetype="pdf" 
              img="pdf" 
            />
            <FileAccordChlank 
              description="Частные расходы на ЛС 1991-2022" 
              filetype="xls" 
              img="xls" 
            />
            <FileAccordChlank 
              description="Расходы на ПМСП в 2010-2022" 
              filetype="pdf" 
              img="pdf" 
            />
            <FileAccordChlank 
              description="Расходы на профилактические программы РК 2010-2022" 
              filetype="pdf" 
              img="pdf" 
            />
          </div>
        </div>
      </div>
    </section>

    {/* Часто задаваемые вопросы */}
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
        <FAQ title="" />
      </div>
    </section>
    </>
  )
}

HealthAccounts.layout = page => <LayoutDirection img="account" h1="Национальные счета здравоохранения">{page}</LayoutDirection>

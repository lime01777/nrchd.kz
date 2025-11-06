import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import JobsChlank from '@/Components/JobsChlank';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function Vacancy() {

    const someDocuments = [
    {title: "Моделирование новой формулы дефицита", filetype: "XLS", img: 3},
    {title: "Обновленная методика определения дефицита КРЗ", filetype: "PDF", img: 2},
    ];
    const rulesJobs = [
    {title: "Среднесрочный прогноз потребности в медкадрах г. Астана", filetype: "XLS", img: 3},
    {title: "Методика прогнозирования", filetype: "PDF", img: 2},
    ];
    const massJobs = [
      {title: "Главный специалист управления стандартизации медицинской помощи", date: "18 марта 2024 года", needs: "Требуемый опыт работы: 3 года"},
      {title: "Главный специалист центра отраслевых технологических компетенций", date: "18 марта 2024 года", needs: "Требуемый опыт работы: 3 года"},
      {title: "Главный специалист Управления развития медицинской науки", date: "18 марта 2024 года", needs: "Требуемый опыт работы: 3 года"},
      {title: "Главный специалист управления оценки технологий здравоохранения", date: "18 марта 2024 года", needs: "Требуемый опыт работы: 3 года"},
      {title: "Главный специалист управления оценки технологий здравоохранения", date: "18 марта 2024 года", needs: "Требуемый опыт работы: 3 года"},

    ];

  return (
    <>
    <Head title="NNCRZ" />

    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
              Текст о том как хорошо работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ. Текст о том как хорошо
              работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ. Текст
              о том как хорошо работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ. Текст о том как хорошо
              работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ. Текст о том как хорошо работать в ННЦРЗ.
          </p>
        </div>
      </div>
    </section>

    <section className="text-gray-600 body-font">
      <div className="container px-5 mx-auto">
        <div className="grid grid-cols-3 gap-4">

          {massJobs.map((massjob, index) => (
          <JobsChlank key={index} title={massjob.title} date={massjob.date} needs={massjob.needs} />
          ))}
        </div>
      </div>
    </section>

    </>
  )
}

Vacancy.layout = (page) => <LayoutDirection img="humanresources" h1={t('vacancies', 'Вакансии')} >{page}</LayoutDirection>

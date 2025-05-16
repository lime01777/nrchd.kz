import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FolderChlank from '@/Components/FolderChlank';
import ImportantDoc from '@/Components/ImportantDoc';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import NameDoctor from '@/Components/NameDoctor';
import PdfViewer from '@/Components/PdfViewer';
import FAQ from '@/Components/FAQ'; 

export default function Training() {
  return (
    <>
    <Head title="Организация и проведение обучающих циклов по дополнительному и неформальному образованию ЦМОП"/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">Организация и проведение обучающих циклов по дополнительному и неформальному образованию</h1>
          <p className="tracking-wide leading-relaxed">
            Национальный научный центр развития здравоохранения постоянно внедряет лучшие мировые практики в протоколы
            лечения и профилактики заболеваний, что позволяет как развивать медицину, основанную на доказательствах
            (доказательную медицину), так совершенствовать формулярную систему.
          </p>
          <br />
          <p className="tracking-wide leading-relaxed">
            Политика Департамента в отрасли лекарственного обеспечения направлена на рациональное использование
            медикаментов для исключения негативных медицинских, социальных, а также экономических последствий для
            системы здравоохранения.
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <button className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
        rounded-xl p-3 transition-all duration-150 ease-in">
            Читать далее
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="11.5" y="5" width="1" height="14" />
              <rect x="5" y="11.5" width="14" height="1" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Часто задаваемые вопросы</h2>
            <FAQ 
                items={[
                    {
                        question: "Как записаться на обучающий цикл?",
                        answer: "Для получения информации, а также по вопросам организации и проведения обучения необходимо заполнить заявку на нашем сайте или обратиться по указанным контактам: 8 (7172) 648 950, 648 951 (вн.1028, 1151), +7 (707) 556-98-70, +7 (700) 900-13-34. После обработки заявки специалист свяжется с вами для подтверждения участия и предоставления дополнительной информации."
                    },
                    {
                        question: "Какие документы необходимы для участия в обучении?",
                        answer: "Для участия в обучении вам понадобятся: удостоверение личности, диплом о медицинском образовании (наличие высшего или среднего медицинского образования), копия трудовой книжки."
                    },
                    {
                        question: "Выдается ли свидетельство / сертификат после прохождения обучения?",
                        answer: "По результатам оказания услуг, успешно завершившим обучение, выдается свидетельство государственного образца о повышении квалификации через портал Е-лицензирование (свидетельство выдаются для специалистов, проходивших обучения по дополнительному образованию). Для специалистов, прошедших обучение по неформальному образованию, выдаются сертификаты установленного государственного образца."
                    },
                    {
                        question: "Можно ли пройти обучение дистанционно?",
                        answer: "Да, возможно, в случае если в учебной программе предусмотрен формат дистанционного обучения."
                    }
                ]}
            />
        </div>
    </section>
    </>
  );
}

Training.layout = page => <ServicesPageLayout title="Организация и проведение обучающих циклов по дополнительному и неформальному образованию" img="headcentre">{page}</ServicesPageLayout>

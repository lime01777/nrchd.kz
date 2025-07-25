import { Head } from '@inertiajs/react';
import React from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FAQ from '@/Components/FAQ'; 
import FilesAccord from '@/Components/FilesAccord';


export default function Training() {
  return (
    <>
    <Head title="Организация и проведение обучающих циклов по дополнительному и неформальному образованию ЦМОП" meta={[{ name: 'description', content: 'Обучающие циклы по дополнительному и неформальному образованию ЦМОП.' }]} />
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <h1 className="text-3xl font-semibold text-gray-900 mb-6 w-full">Организация и проведение обучающих циклов по дополнительному и неформальному образованию</h1>
          <p className="tracking-wide leading-relaxed">
            РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» Министерства здравоохранения РК (далее - ННЦРЗ) организовывает обучение курсов повышения квалификации и семинаров в сфере здравоохранения Республики Казахстан.
          </p>
          <br />
          <p className="tracking-wide leading-relaxed">
            Количество слушателей для офлайн обучения – не менее 20 человек, а для выездного обучения не менее 30.
          </p>
          <br />
          <p className="tracking-wide leading-relaxed">
            Проведение курсов планируется на постоянной основе. График проведения курсов на текущий период представлен в разделе документов ниже.
          </p>
          <br />
          <p className="tracking-wide leading-relaxed font-medium">
            По вопросам участия в мероприятиях обращаться по телефонам:<br />
            8 (7172) 648 950, 648 951 (вн.1106, 1028), +7 (707) 556-98-70, +7 (701) 682-07-31
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <a 
            href="https://nrchd.kz/files/%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%202024/1%20%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%20%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%20%D0%94%D0%9E%20%D0%B2%20%D0%9D%D0%9D%D0%A6%D0%A0%D0%97%20%D1%83%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%20.pdf"
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer text-black inline-flex items-center border-yellow-500 border-[1px] bg-yellow-50 hover:bg-yellow-100
              rounded-xl p-3 transition-all duration-150 ease-in">
            Правила организации образовательной деятельности
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
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

      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <FilesAccord
            folder="Услуги/Организация проведения учебных циклов"
            title="Организация и проведение учебных циклов по дополнительному и неформальному образованию"
            bgColor="bg-yellow-100"
            defaultOpen={true}
          />
        </div>
      </section>

    </>
  );
}

Training.layout = page => <ServicesPageLayout title="Организация и проведение обучающих циклов по дополнительному и неформальному образованию" img="headcentre">{page}</ServicesPageLayout>

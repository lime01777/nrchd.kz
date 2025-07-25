import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';

export default function AstanaDeclaration() {
  return (
    <>
      <Head title="Декларация Астаны - Стратегические инициативы" meta={[{ name: 'description', content: 'Декларация Астаны: ключевой международный документ по развитию здравоохранения.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">Декларация Астаны по первичной медико-санитарной помощи</h2>
            <p className="tracking-wide leading-relaxed mb-4">
              Декларация Астаны была принята на Глобальной конференции по первичной медико-санитарной помощи, 
              которая состоялась 25-26 октября 2018 года в Астане (ныне Нур-Султан), Казахстан. Конференция 
              была организована Всемирной организацией здравоохранения, ЮНИСЕФ и Правительством Казахстана.
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              Декларация подтверждает приверженность стран мира укреплению первичной медико-санитарной помощи 
              как основы устойчивой системы здравоохранения для достижения всеобщего охвата услугами здравоохранения 
              и связанных со здоровьем Целей устойчивого развития.
            </p>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Ключевые положения Декларации Астаны:</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
              <li>
                <strong>Всеобщий охват услугами здравоохранения</strong> - обеспечение доступа к качественным 
                медицинским услугам для всех людей, независимо от их социально-экономического положения.
              </li>
              <li>
                <strong>Укрепление первичной медико-санитарной помощи</strong> - развитие ПМСП как наиболее 
                эффективного и инклюзивного подхода к улучшению здоровья населения.
              </li>
              <li>
                <strong>Межсекторальное сотрудничество</strong> - признание того, что здоровье зависит от 
                множества факторов, выходящих за рамки сектора здравоохранения.
              </li>
              <li>
                <strong>Расширение прав и возможностей людей и сообществ</strong> - вовлечение людей и сообществ 
                в процессы, связанные с их здоровьем.
              </li>
              <li>
                <strong>Устойчивое финансирование</strong> - обеспечение адекватного финансирования первичной 
                медико-санитарной помощи.
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Реализация Декларации Астаны в Казахстане:</h3>
            <p className="tracking-wide leading-relaxed mb-4">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой активно участвует 
              в реализации положений Декларации Астаны в Казахстане. Центр разрабатывает методические рекомендации, 
              проводит исследования и мониторинг, оказывает экспертную поддержку в развитии первичной 
              медико-санитарной помощи в стране.
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              Основные направления работы Центра в рамках реализации Декларации Астаны включают:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 w-full">
              <li>Разработку и внедрение стандартов качества ПМСП</li>
              <li>Повышение квалификации медицинских работников первичного звена</li>
              <li>Развитие профилактических программ и укрепление общественного здоровья</li>
              <li>Внедрение цифровых технологий в ПМСП</li>
              <li>Мониторинг и оценку эффективности ПМСП</li>
            </ul>
          </div>
        </div>
      </section>
      
      <PageAccordions 
        sections={[
          {
            title: "Документы по Декларации Астаны",
            documents: [
              { 
                description: "Текст Декларации Астаны (на русском языке)", 
                filetype: "pdf", 
                img: 2, 
                filesize: "1.2 MB",
                date: "26.10.2018",
                url: "#"
              },
              { 
                description: "Руководство по реализации Декларации Астаны", 
                filetype: "pdf", 
                img: 2, 
                filesize: "2.5 MB",
                date: "15.03.2019",
                url: "#"
              },
              { 
                description: "Отчет о прогрессе в реализации Декларации Астаны в Казахстане", 
                filetype: "pdf", 
                img: 2, 
                filesize: "3.8 MB",
                date: "10.12.2023",
                url: "#"
              }
            ]
          },
          {
            title: "Методические материалы",
            documents: [
              { 
                description: "Методические рекомендации по развитию ПМСП", 
                filetype: "pdf", 
                img: 2, 
                filesize: "2.1 MB",
                date: "22.05.2023",
                url: "#"
              },
              { 
                description: "Индикаторы качества ПМСП", 
                filetype: "pdf", 
                img: 2, 
                filesize: "1.7 MB",
                date: "03.09.2023",
                url: "#"
              }
            ]
          }
        ]}
      />
    </>
  );
}

AstanaDeclaration.layout = page => <LayoutFolderChlank 
  h1="Декларация Астаны по первичной медико-санитарной помощи" 
  parentRoute={route('strategic.initiatives')} 
  parentName="Стратегические инициативы и международное сотрудничество"
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
>{page}</LayoutFolderChlank>;

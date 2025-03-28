import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import TabDocuments from '@/Components/TabDocuments';
import SliderImportantFile from '@/Components/SliderImportantFile';

export default function Initiatives() {
  return (
    <>
      <Head title="Инициативы | NNCRZ" />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой реализует ряд стратегических инициатив, 
              направленных на совершенствование системы здравоохранения Казахстана и достижение ключевых показателей здоровья населения.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Основные стратегические направления:</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Развитие человеческого капитала в сфере здравоохранения</li>
                <li>Совершенствование системы медицинского образования</li>
                <li>Цифровизация здравоохранения и телемедицинские технологии</li>
                <li>Повышение качества медицинской помощи</li>
                <li>Внедрение международных стандартов в здравоохранение</li>
                <li>Развитие медицинской науки и инноваций</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Текущие проекты:</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Дорожная карта развития здравоохранения</h4>
                <p className="text-gray-700">
                  Документ, определяющий ключевые направления развития здравоохранения Казахстана на период 2023-2026 гг.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Национальная программа цифровизации</h4>
                <p className="text-gray-700">
                  Комплекс мер по внедрению цифровых технологий в сферу здравоохранения.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Программа повышения квалификации</h4>
                <p className="text-gray-700">
                  Система непрерывного профессионального развития медицинских работников.
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            {/* Слайдер с важными документами */}
            <SliderImportantFile 
              folder="Стратегические инициативы и международное сотрудничество/Папка- Инициативы/Важный документ - Нац Доклад"
              title="Итоги работы системы здравоохранения Казахстана за 10 лет"
              description="Национальный доклад о развитии системы здравоохранения за 2012-2022 годы представляет собой подробный анализ достижений и вызовов в секторе здравоохранения Республики Казахстан. Документ содержит результаты реализации государственных программ, статистические данные и рекомендации по дальнейшему развитию отрасли."
            />
          </div>
          
          <div className="px-8 mb-12">
            <h2 className="text-xl font-semibold mb-4"></h2>
            
            {/* Использование TabDocuments с API для загрузки документов из реальной директории */}
            <TabDocuments 
              api={true}
              folder="Стратегические инициативы и международное сотрудничество/Папка- Инициативы" 
            />
            
            {/* Вариант со статическими данными (закомментирован)
            <TabDocuments 
              tabs={[
                {
                  title: "Нормативные документы",
                  years: [
                    {
                      year: "2023 год",
                      documents: [
                        {
                          title: 'Стратегический план развития ННЦРЗ на 2023-2027 гг.',
                          fileType: 'pdf',
                          fileSize: '2.4 MB',
                          date: '15.01.2023',
                          url: "/storage/documents/strategic_initiatives/normative/strategic_plan_2023.pdf"
                        },
                        {
                          title: 'Концепция развития стратегических инициатив',
                          fileType: 'pdf',
                          fileSize: '1.8 MB',
                          date: '20.03.2023',
                          url: "/storage/documents/strategic_initiatives/normative/concept_2023.pdf"
                        }
                      ]
                    },
                    {
                      year: "2022 год",
                      documents: [
                        {
                          title: 'Методические рекомендации по разработке инициатив',
                          fileType: 'pdf',
                          fileSize: '1.5 MB',
                          date: '10.05.2022',
                          url: "/storage/documents/strategic_initiatives/normative/recommendations_2022.pdf"
                        }
                      ]
                    }
                  ]
                },
                {
                  title: "Отчетные материалы",
                  years: [
                    {
                      year: "2023 год",
                      documents: [
                        {
                          title: 'Отчет о реализации стратегических инициатив за 2023 год',
                          fileType: 'pdf',
                          fileSize: '3.1 MB',
                          date: '25.12.2023',
                          url: "/storage/documents/strategic_initiatives/reports/report_2023.pdf"
                        },
                        {
                          title: 'Аналитическая справка по достижению целевых показателей',
                          fileType: 'pdf',
                          fileSize: '1.2 MB',
                          date: '20.12.2023',
                          url: "/storage/documents/strategic_initiatives/reports/analytics_2023.pdf"
                        }
                      ]
                    },
                    {
                      year: "2022 год",
                      documents: [
                        {
                          title: 'Отчет о реализации стратегических инициатив за 2022 год',
                          fileType: 'pdf',
                          fileSize: '2.8 MB',
                          date: '22.12.2022',
                          url: "/storage/documents/strategic_initiatives/reports/report_2022.pdf"
                        }
                      ]
                    }
                  ]
                }
              ]}
            />
            */}
          </div>
        </div>
      </section>
    </>
  );
}

Initiatives.layout = page => <LayoutFolderChlank 
  h1="Инициативы" 
  parentRoute={route('strategic.initiatives')}
  parentName="Стратегические инициативы и международное сотрудничество" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

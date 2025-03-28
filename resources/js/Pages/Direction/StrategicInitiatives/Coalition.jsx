import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function Coalition() {
  return (
    <>
      <Head title="Коалиция | NNCRZ" />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Коалиция по развитию здравоохранения – это объединение заинтересованных сторон, созданное 
              под эгидой Национального научного центра развития здравоохранения имени Салидат Каирбековой. 
              Коалиция объединяет представителей государственного и частного секторов здравоохранения, 
              научно-исследовательских и образовательных учреждений, профессиональных сообществ, 
              пациентских организаций и других заинтересованных сторон для совместного решения актуальных 
              проблем здравоохранения.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Цели коалиции:</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Создание платформы для диалога и сотрудничества между всеми участниками системы здравоохранения</li>
                <li>Консолидация усилий для решения приоритетных задач здравоохранения</li>
                <li>Продвижение прогрессивных идей и инноваций в сфере здравоохранения</li>
                <li>Выработка согласованных подходов к развитию системы здравоохранения</li>
                <li>Повышение эффективности использования ресурсов здравоохранения</li>
                <li>Защита и продвижение интересов пациентов и медицинских работников</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Участники коалиции:</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="text-lg font-semibold text-gray-800">Государственные органы и организации</h4>
                  <p className="text-gray-700">Министерство здравоохранения, управления здравоохранения регионов</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="text-lg font-semibold text-gray-800">Медицинские организации</h4>
                  <p className="text-gray-700">Республиканские научные центры, многопрофильные больницы, поликлиники</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="text-lg font-semibold text-gray-800">Научные и образовательные учреждения</h4>
                  <p className="text-gray-700">Медицинские университеты, научно-исследовательские институты</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="text-lg font-semibold text-gray-800">Профессиональные ассоциации</h4>
                  <p className="text-gray-700">Объединения врачей, медицинских сестер, фармацевтов</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="text-lg font-semibold text-gray-800">Пациентские организации</h4>
                  <p className="text-gray-700">Объединения пациентов с различными заболеваниями</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">Направления деятельности коалиции:</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Аналитическая деятельность</h4>
                  <p className="text-gray-700 mb-4">
                    Проведение исследований, анализ данных, мониторинг основных показателей системы здравоохранения, 
                    подготовка аналитических отчетов и рекомендаций.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Экспертное сопровождение</h4>
                  <p className="text-gray-700 mb-4">
                    Экспертиза нормативно-правовых актов, стратегических документов, национальных программ в сфере здравоохранения.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Образовательная деятельность</h4>
                  <p className="text-gray-700 mb-4">
                    Организация конференций, семинаров, вебинаров, мастер-классов для медицинских работников и других участников системы здравоохранения.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Информационно-коммуникационная работа</h4>
                  <p className="text-gray-700 mb-4">
                    Распространение информации о лучших практиках в здравоохранении, продвижение здорового образа жизни, 
                    повышение медицинской грамотности населения.
                  </p>
                </div>
              </div>
            </div>
            
            <FilesAccord
              title="Документы коалиции"
              items={[
                { title: 'Меморандум о создании Коалиции по развитию здравоохранения', description: 'PDF, 1.3 МБ' },
                { title: 'План работы Коалиции на 2024 год', description: 'PDF, 0.9 МБ' },
                { title: 'Протоколы заседаний Коалиции', description: 'PDF, 2.5 МБ' },
                { title: 'Список организаций-участников Коалиции', description: 'PDF, 0.7 МБ' }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

Coalition.layout = page => <LayoutFolderChlank 
  h1="Коалиция" 
  parentRoute={route('strategic.initiatives')}
  parentName="Стратегические инициативы и международное сотрудничество" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

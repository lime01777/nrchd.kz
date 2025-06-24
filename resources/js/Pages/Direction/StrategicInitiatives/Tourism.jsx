import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function Tourism() {
  return (
    <>
      <Head title="Медицинский туризм | NNCRZ" meta={[{ name: 'description', content: 'Медицинский туризм: направления, услуги и возможности в Казахстане.' }]} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Медицинский туризм является важным направлением развития системы здравоохранения Казахстана. 
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой координирует 
              комплекс мероприятий по продвижению Казахстана как привлекательного направления для 
              медицинского туризма и повышению качества медицинских услуг для иностранных пациентов.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Направления работы:</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Сертификация медицинских организаций для приема иностранных пациентов</li>
                <li>Обучение персонала для работы с пациентами из других стран</li>
                <li>Продвижение казахстанских медицинских услуг на международном рынке</li>
                <li>Совершенствование нормативно-правовой базы медицинского туризма</li>
                <li>Разработка стандартов обслуживания иностранных пациентов</li>
                <li>Мониторинг и анализ потоков медицинских туристов</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Преимущества медицинского туризма в Казахстане:</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Доступные цены</h4>
                <p className="text-gray-700">
                  Стоимость медицинских услуг в Казахстане значительно ниже, чем в странах Европы и США
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Современные технологии</h4>
                <p className="text-gray-700">
                  Ведущие клиники оснащены современным оборудованием и применяют передовые методики лечения
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Квалифицированные специалисты</h4>
                <p className="text-gray-700">
                  Врачи проходят обучение в ведущих медицинских центрах мира и регулярно повышают квалификацию
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">Популярные направления медицинского туризма:</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8 px-4">
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Кардиология</h4>
                <p className="text-gray-600">Диагностика и лечение сердечно-сосудистых заболеваний</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Ортопедия</h4>
                <p className="text-gray-600">Эндопротезирование суставов, спортивная травматология</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Репродуктивная медицина</h4>
                <p className="text-gray-600">ЭКО и другие методы лечения бесплодия</p>
              </div>
            </div>
            
            <FilesAccord
              title="Документы"
              items={[
                { title: 'Концепция развития медицинского туризма в Казахстане', description: 'PDF, 1.7 МБ' },
                { title: 'Правила оказания медицинских услуг иностранным гражданам', description: 'PDF, 0.9 МБ' },
                { title: 'Реестр клиник, сертифицированных для медицинского туризма', description: 'PDF, 1.2 МБ' }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

Tourism.layout = page => <LayoutFolderChlank 
  h1="Медицинский туризм" 
  parentRoute={route('strategic.initiatives')}
  parentName="Стратегические инициативы и международное сотрудничество" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function MedicalTourismDirections() {
  return (
    <>
      <Head title="Направления работы | Медицинский туризм | NNCRZ" meta={[{ name: 'description', content: 'Основные направления работы в сфере медицинского туризма в Казахстане.' }]} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой координирует 
              комплекс мероприятий по развитию медицинского туризма в Казахстане. Наша работа направлена 
              на создание привлекательных условий для иностранных пациентов и повышение качества 
              медицинских услуг.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Основные направления работы:</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Сертификация медицинских организаций для приема иностранных пациентов</li>
                <li>Обучение персонала для работы с пациентами из других стран</li>
                <li>Продвижение казахстанских медицинских услуг на международном рынке</li>
                <li>Совершенствование нормативно-правовой базы медицинского туризма</li>
                <li>Разработка стандартов обслуживания иностранных пациентов</li>
                <li>Мониторинг и анализ потоков медицинских туристов</li>
                <li>Создание информационных ресурсов для иностранных пациентов</li>
                <li>Координация взаимодействия между медицинскими организациями и туристическими компаниями</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Цели и задачи:</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Повышение качества услуг</h4>
                <p className="text-gray-700">
                  Внедрение международных стандартов качества медицинской помощи
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Развитие инфраструктуры</h4>
                <p className="text-gray-700">
                  Создание современной инфраструктуры для приема иностранных пациентов
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Международное сотрудничество</h4>
                <p className="text-gray-700">
                  Установление партнерских отношений с зарубежными медицинскими центрами
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">Ключевые показатели:</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8 px-4">
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-green-600 mb-2">50+</h4>
                <p className="text-gray-600">Сертифицированных клиник</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-green-600 mb-2">15+</h4>
                <p className="text-gray-600">Стран-партнеров</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-green-600 mb-2">1000+</h4>
                <p className="text-gray-600">Иностранных пациентов в год</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismDirections.layout = page => <LayoutFolderChlank 
  h1="Направления работы" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;

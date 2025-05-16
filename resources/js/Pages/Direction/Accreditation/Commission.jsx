import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';


export default function Commission() {
  return (
    <>
      <Head title="Аккредитационная комиссия" />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Аккредитационная комиссия</h2>
            
            <p className="text-gray-700 mb-4">
              Аккредитационная комиссия – коллегиальный орган по оценке соответствия организаций здравоохранения стандартам аккредитации. 
              Аккредитационная комиссия осуществляет свою деятельность на основании Приказа Министра здравоохранения Республики Казахстан от 21 декабря 2020 года № ҚР ДСМ-305/2020 «Об утверждении правил аккредитации в области здравоохранения».
            </p>
            
            <p className="text-gray-700 mb-4">
              Состав аккредитационной комиссии утверждается аккредитующим органом. В состав аккредитационной комиссии входят представители государственных органов и организаций, неправительственных общественных объединений и ассоциаций, специалисты в области науки и образования, прошедшие обучение по вопросам аккредитации в области здравоохранения.
            </p>

            <p className="text-gray-700 mb-4">
              Деятельность аккредитационной комиссии Национального научного центра развития здравоохранения направлена на обеспечение качества медицинских услуг путем объективной оценки медицинских организаций. Комиссия действует на принципах независимости, беспристрастности и профессионализма, используя современные стандарты и методологии, признанные на международном уровне.
            </p>

            <p className="text-gray-700 mb-6">
              В задачи комиссии входит проведение экспертизы соответствия медицинских организаций стандартам аккредитации, формирование рекомендаций по улучшению качества медицинских услуг, а также развитие культуры безопасности пациентов в организациях здравоохранения Республики Казахстан.
            </p>
            
            <h3 className="text-lg font-bold text-gray-800 mb-4">Состав аккредитационной комиссии ННЦРЗ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/1.png" alt="Фото Сарсембаев Канат Талгатович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Карибеков Темирлан Сибирьевич</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/2.png" alt="Фото Мукашева Айгуль Сагатовна" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Байжунусов Эрик Абенович</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/3.png" alt="Фото Нурманбетов Даулет Нурманбетович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Локшин Вячеслав Нотанович</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/4.png" alt="Фото Алиева Гульнара Танатовна" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Сексенбаев Бахытжан Дерибсалиевич</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-48 mb-3 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img src="/img/Commision/5.png" alt="Фото Нуралиев Марат Аманкулович" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-center font-medium text-gray-800">Шайхиев Саин Саинович</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Commission.layout = page => (
  <LayoutFolderChlank 
    bgColor="bg-white"
    heroBgColor="bg-yellow-100"
    buttonBgColor="bg-yellow-100"
    buttonHoverBgColor="hover:bg-yellow-200"
    h1="Аккредитационная комиссия" 
    parentRoute={route('medical.accreditation')} 
    parentName="Аккредитация"
  >
    {page}
  </LayoutFolderChlank>
);

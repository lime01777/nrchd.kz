import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function BioethicsComposition() {
  return (
    <>
      <Head title="Состав Центральной комиссии по биоэтике" />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Состав Центральной комиссии по биоэтике</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">
                  <strong>Приказом Министра здравоохранения Республики Казахстан №961 от 31 декабря 2024 года</strong> 
                  «О внесении изменения в приказ Министра здравоохранения Республики Казахстан от 20 декабря 2020 года №854/1 
                  «Об утверждении состава Центральной комиссии по биоэтике»» утвержден новый состав Центральной комиссии по биоэтике.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Председатель комиссии</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Ергалиев Куаныш Асылханович</strong> - доктор общественного здравоохранения, 
                  ассистент профессор практики Школа медицины АОО «Назарбаев Университет», 
                  Председатель Совета ассоциации менеджеров здравоохранения Казахстана
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Члены комиссии</h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Информация о составе комиссии будет размещена после официального утверждения.
                </p>
                <p className="text-gray-700">
                  Для получения актуальной информации о составе комиссии обращайтесь в рабочий орган 
                  Центральной комиссии по биоэтике.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Рабочий орган</h4>
                <p className="text-gray-700 mb-2">
                  <strong>«Национальный научный центр развития здравоохранения имени Салидат Каирбековой»</strong> 
                  Министерства здравоохранения Республики Казахстан
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Адрес:</strong> г. Астана, ул. Мангилик ел 20, блок С, 5 этаж, 507 кабинет
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Телефон:</strong> 87172648-950; 87172648-951 (внут 1109)
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:ckb-amu@yandex.kz" className="text-blue-600 hover:text-blue-800">ckb-amu@yandex.kz</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BioethicsComposition.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Состав Центральной комиссии по биоэтике" 
  parentRoute={route('bioethics')} 
  parentName="Центральная комиссия по биоэтике"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>

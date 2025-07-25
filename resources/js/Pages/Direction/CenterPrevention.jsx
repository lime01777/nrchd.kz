import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import TabsFileDisplay from '@/Components/TabsFileDisplay';

export default function CenterPrevention() {
  return (
    <>
      <Head title="Центр профилактики и укрепления здоровья" meta={[{ name: 'description', content: 'Центр профилактики и укрепления здоровья ННЦРЗ – разработка и внедрение программ, направленных на раннее выявление заболеваний и формирование здорового образа жизни населения.' }]} />

      {/* Hero и краткое описание */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify">
            <p className="tracking-wide leading-relaxed mb-4">
              Центр профилактики и укрепления здоровья ННЦРЗ разрабатывает и внедряет программы, направленные на&nbsp;раннее выявление заболеваний и формирование здоровых привычек населения.
            </p>
          </div>
        </div>
      </section>

      {/* Три колонки с направлениями работы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-4 pb-24 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Колонка 1 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">Профилактические программы</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col1.png" alt="Профилактические программы" className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Профилактические медицинские осмотры</li>
                <li>Скрининг целевых групп населения</li>
                <li>Профилактика НИЗ</li>
              </ul>
            </div>

            {/* Колонка 2 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">Формирование здорового образа жизни</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col2.png" alt="Формирование здорового образа жизни" className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Национальные программы по ЗОЖ</li>
                <li>Молодежные центры здоровья</li>
                <li>Культура здорового и рационального питания</li>
                <li>Меры по сокращению табакокурения и алкоголя</li>
                <li className="pt-2 font-semibold">Проекты:</li>
                <li className="ml-4 text-blue-600 underline"><a href="#">«Здоровые города и регионы»</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">«Саламатты мектеп/Школы, способствующие укреплению здоровья»</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">«Здоровье университеты»</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">«Здоровье рабочие места»</a></li>
              </ul>
            </div>

            {/* Колонка 3 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">Коммуникации и просвещение</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col3.png" alt="Коммуникации и просвещение" className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Мероприятия</li>
                <li>Видеоролики</li>
                <li>Информационно-разъяснительная работа</li>
                <li>Инфографика, публикации, подкасты</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Вкладки с материалами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
          <TabsFileDisplay
            tabs={[
              { label: 'Законадательство', folder: 'ЗОЖ/Законадательство' },
              { label: 'Подкасты', folder: 'ЗОЖ/Подкасты' },
              { label: 'Инструменты', folder: 'ЗОЖ/Инструменты' },
            ]}
            defaultIndex={0}
          />
        </div>
      </section>
    </>
  );
}

CenterPrevention.layout = (page) => <LayoutDirection img={'zozh'} h1={'Центр профилактики и укрепления здоровья'}>{page}</LayoutDirection>;

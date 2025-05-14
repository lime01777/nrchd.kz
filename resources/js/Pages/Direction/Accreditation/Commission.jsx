import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function Commission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedFileName('');
  };

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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Эксперты ННЦРЗ на 1 квартал 2025 г.</h2>
            
            <div className="mb-4">
              <p className="text-gray-700">Всего в реестре экспертов ННЦРЗ зарегистрировано 114 специалистов, прошедших соответствующую подготовку и аттестацию.</p>
            </div>
            
            <div className="overflow-hidden">
              <div className="bg-yellow-100 p-3 rounded-lg mb-4 flex justify-between">
                <span className="font-medium">Всего экспертов: 114</span>
                <button className="text-yellow-800 hover:text-yellow-900" onClick={() => window.print()}>Распечатать список</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">1.</span>
                  <span className="text-gray-700">Аманова Бота Сериккановна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">2.</span>
                  <span className="text-gray-700">Абдреимова Гульмира Икрамхановна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">3.</span>
                  <span className="text-gray-700">Абенова Кульзи Танашевна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">4.</span>
                  <span className="text-gray-700">Алкеева Раушан Оралбаевна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">5.</span>
                  <span className="text-gray-700">Амреева Лейла Мурановна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">6.</span>
                  <span className="text-gray-700">Аманбекова Мира Турекуловна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">7.</span>
                  <span className="text-gray-700">Амрина Гульнар Кажахметовна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">8.</span>
                  <span className="text-gray-700">Андосов Данияр Мухаметкаирович</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">9.</span>
                  <span className="text-gray-700">Акаева Нурсулу Каримовна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">10.</span>
                  <span className="text-gray-700">Асенова Ляззат Хасеновна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">11.</span>
                  <span className="text-gray-700">Артаева Асель Нуржановна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">12.</span>
                  <span className="text-gray-700">Алтаева Айгуль Саулетбековна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">13.</span>
                  <span className="text-gray-700">Айдарханова Меруерт Сапаргалиевна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">14.</span>
                  <span className="text-gray-700">Ахметов Ералы Есенгельдиевич</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">15.</span>
                  <span className="text-gray-700">Ахметова Замзагүл Амандыққызы</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">16.</span>
                  <span className="text-gray-700">Ахметова Халима Омиркуловна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">17.</span>
                  <span className="text-gray-700">Бейсембаева Кырмызы Нурбековна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">18.</span>
                  <span className="text-gray-700">Бекбосынова Гульнара Лентаевна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">19.</span>
                  <span className="text-gray-700">Баймурина Елена Сергеевна</span>
                </div>
                <div className="flex items-center border-b border-gray-100 py-2">
                  <span className="text-yellow-800 font-semibold mr-2 w-7">20.</span>
                  <span className="text-gray-700">Бримжанова Маржан Дихановна</span>
                </div>
              </div>
              
              {/* Бутоны "Показать все" и "Скрыть" для полного списка */}
              <div className="mt-6 text-center">
                <div className="inline-block py-2 px-6 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-medium rounded-full transition-colors cursor-pointer">
                  Показать всех экспертов (114)...
                </div>
                <p className="text-gray-500 mt-2 text-sm">Нажмите, чтобы увидеть полный список экспертов</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {isModalOpen && (
        <VideoModal
          videoUrl={selectedVideo}
          fileName={selectedFileName}
          onClose={closeVideoModal}
        />
      )}
    </>
  );
}

Commission.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  heroBgColor="bg-yellow-100"
  buttonBgColor="bg-yellow-100"
  buttonHoverBgColor="hover:bg-yellow-200"
  h1="Аккредитационная комиссия" 
  parentRoute={route('medical.accreditation')} 
  parentName="Аккредитация"
  breadcrumbs={[
    { name: 'Направления', route: 'directions' },
    { name: 'Аккредитация', route: 'medical.accreditation' },
    { name: 'Аккредитационная комиссия', route: 'accreditation.commission' },
  ]}
/>;

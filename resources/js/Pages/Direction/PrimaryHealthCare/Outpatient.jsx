import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';
import BannerCatalog from '@/Components/BannerCatalog';

export default function Outpatient() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title="Амбулаторная помощь" meta={[{ name: 'description', content: 'Амбулаторная медицинская помощь: услуги, направления, консультации.' }]} />
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
              Амбулаторная помощь — важнейшая часть системы первичной медико-санитарной помощи, направленная на оказание медицинской помощи 
              пациентам без круглосуточного медицинского наблюдения в условиях поликлиники, амбулатории или непосредственно на дому.
              <br></br><br></br>
              <strong>Основные компоненты амбулаторной помощи включают:</strong>
              <br></br>- Первичную медицинскую помощь, оказываемую врачами общей практики, терапевтами и педиатрами
              <br></br>- Специализированную амбулаторную помощь, оказываемую узкими специалистами
              <br></br>- Диагностические исследования и лабораторные анализы
              <br></br>- Диспансеризацию и профилактические осмотры
              <br></br>- Медицинскую реабилитацию
              <br></br>- Оказание неотложной помощи
              <br></br>- Патронаж и наблюдение за пациентами из групп риска
              <br></br><br></br>
              <strong>Задачи амбулаторной помощи:</strong>
              <br></br>- Своевременное выявление и лечение заболеваний на ранних стадиях
              <br></br>- Предотвращение госпитализаций через обеспечение качественного лечения на амбулаторном этапе
              <br></br>- Профилактика заболеваний и формирование здорового образа жизни
              <br></br>- Обеспечение непрерывности и преемственности медицинской помощи
              <br></br>- Диспансерное наблюдение пациентов с хроническими заболеваниями
              <br></br>- Восстановительное лечение и медицинская реабилитация
              <br></br><br></br>
              <strong>Перспективы развития амбулаторной помощи:</strong>
              <br></br>- Внедрение электронных систем записи на прием и ведения медицинской документации
              <br></br>- Развитие амбулаторной хирургии и стационарозамещающих технологий
              <br></br>- Расширение спектра медицинских услуг, оказываемых в амбулаторных условиях
              <br></br>- Внедрение телемедицинских технологий для консультаций и наблюдения за пациентами
              <br></br>- Усиление профилактической направленности через расширение программ скрининга
            </p>
          </div>
            
          <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowFullText(!showFullText)} 
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
              >
                  {showFullText ? 'Скрыть' : 'Читать далее'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                      <rect x="11.5" y="5" width="1" height="14" />
                      <rect x="5" y="11.5" width="14" height="1" />
                  </svg>
              </button>
          </div>
        </div>
    </section>
    <BannerCatalog />
    <PageAccordions />
    </>
  )
}

Outpatient.layout = (page) => <LayoutFolderChlank h1={'Амбулаторная помощь'}>{page}</LayoutFolderChlank>;

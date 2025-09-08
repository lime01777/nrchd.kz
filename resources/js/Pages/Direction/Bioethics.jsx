import { Head, usePage } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};


export default function Bioethics() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

  return (
    <>
      <Head title={tComponent('directions.bioethics', 'Центральная комиссия по биоэтике')} meta={[{ name: 'description', content: tComponent('bioethics.description', 'Центральная комиссия по биоэтике: экспертиза, сертификация и надзор в области биоэтики.') }]} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">
              {tComponent('bioethics.title', 'ЦЕНТРАЛЬНАЯ КОМИССИЯ ПО БИОЭТИКЕ ПРИ МИНИСТЕРСТВЕ ЗДРАВООХРАНЕНИЯ РК')}
            </h2>
            
            <p className="tracking-wide leading-relaxed mb-4">
              Центральная комиссия по биоэтике Министерства здравоохранения Республики Казахстан является независимым экспертным органом, проводящим биоэтическую экспертизу документов, связанных с проведением биомедицинских исследований, на этапе их планирования, в ходе выполнения и после завершения с целью обеспечения безопасности и защиты прав участников биомедицинских исследований.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              Центральная комиссия по биоэтике определяет стратегию и тактику биоэтического развития республики, разработку обоснованной биоэтической политики, проведения научных исследований в области здравоохранения и наук о человеке, координацию деятельности локальных комиссий по биоэтике, проведение их сертификации, участие в разработке документов по вопросам биоэтики.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              Центральная комиссия по биоэтике была создана в 2008 году при Министерства здравоохранения Республики Казахстан, и в 2017 году получила международное признание (full regocnition) Форумом этических комитетов стран юго-Восточной Азии под эгидой ВОЗ FERCAP/SIDCER и постоянное членство в организации.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              <strong>Председатель Центральной комиссии по биоэтике</strong> - Ергалиев Куаныш Асылханович, доктор общественного здравоохранения, ассистент профессор практики Школа медицины АОО «Назарбаев Университет», Председатель Совета ассоциации менеджеров здравоохранения Казахстана.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              Приказом Министра здравоохранения Республики Казахстан №961 от 31 декабря 2024 года «О внесении изменения в приказ Министра здравоохранения Республики Казахстан от 20 декабря 2020 года №854/1 «Об утверждении состава Центральной комиссии по биоэтике»» утвержден новый состав Центральной комиссии по биоэтике (<a href={route('bioethics.composition')} className="text-blue-600 hover:text-blue-800 underline">Состав Центральной комиссии по биоэтике</a>)
            </p>
            
                         <p className="tracking-wide leading-relaxed mb-4">
               <strong>Рабочим органом</strong> Центральной комиссии по биоэтике определен «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» Министерства здравоохранения Республики Казахстан.
             </p>
             
             <p className="tracking-wide leading-relaxed mb-4">
               <a 
                 href="https://adilet.zan.kz/rus/docs/V2000021512" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 underline"
               >
                 Положение о Центральной комиссии по биоэтике
               </a> (приказ Министра здравоохранения РК от 23 октября 2020 года № ҚР ДСМ-151/2020 «Об утверждении Положения по Центральной комиссии по биоэтике»)
             </p>
          </div>
          <div className='flex flex-wrap px-12 justify-center mb-4'>
          </div>
        </div>
      </section>

      {/* График заседаний */}
      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">График заседаний Центральной комиссии по биоэтике на 2025 год</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Январь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">24, 31</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Февраль</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 21</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Март</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 20</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Апрель</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">11, 25</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Май</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">9, 23</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Июнь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">6, 20</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Июль</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">4, 18</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Август</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">1, 15, 29</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Сентябрь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">12, 26</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Октябрь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">10, 24</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Ноябрь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 21</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Декабрь</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">5, 19</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Направления деятельности */}
      <section className="text-gray-600 body-font py-12">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap px-12">

            
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={tComponent('bioethics.expertise', 'Биоэтическая экспертиза')} 
                description="Проведение биоэтической экспертизы документов, связанных с проведением биомедицинских исследований"
                href={route('bioethics.expertise')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={tComponent('bioethics.certification', 'Сертификация')} 
                description="Сертификация локальных комиссий по биоэтике медицинских организаций"
                href={route('bioethics.certification')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={tComponent('bioethics.local_commissions', 'Локальные комиссии')} 
                description="Координация деятельности локальных комиссий по биоэтике"
                href={route('bioethics.local-commissions')}

              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={tComponent('bioethics.biobanks', 'Биобанки')} 
                description="Надзор за деятельностью биобанков и биоколлекций"
                href={route('bioethics.biobanks')}

              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={tComponent('bioethics.composition', 'Состав комиссии')} 
                description="Информация о составе Центральной комиссии по биоэтике"
                href={route('bioethics.composition')}

              />
            
          </div>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap px-12">
            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Контактная информация</h3>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Адрес</h4>
                    <p className="text-gray-600">010000, Республика Казахстан, г. Астана, ул. Мангилек Ел, 20</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Телефон</h4>
                    <p className="text-gray-600">+7 (7172) 648-951 (внутренний 1000)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Email</h4>
                    <p className="text-gray-600">bioethics@nrchd.kz</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">График работы</h4>
                    <p className="text-gray-600">Пн - Пт, с 9:00 до 18:00</p>
                    <p className="text-gray-600">Перерыв с 13:00 до 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Bioethics.layout = (page) => <LayoutDirection img="bioethics" h1={t('directions.bioethics', 'Центральная комиссия по биоэтике')}>{page}</LayoutDirection>;

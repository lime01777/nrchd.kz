import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function Bioethics() {
  return (
    <>
      <Head title="Центральная комиссия по биоэтике" meta={[{ name: 'description', content: 'Центральная комиссия по биоэтике: экспертиза, сертификация и надзор в области биоэтики.' }]} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">
              ЦЕНТРАЛЬНАЯ КОМИССИЯ ПО БИОЭТИКЕ ПРИ МИНИСТЕРСТВЕ ЗДРАВООХРАНЕНИЯ РК
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
                    <div className="text-sm text-gray-600">2, 23</div>
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
                    <div className="text-sm text-gray-600">11</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">Август</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">8, 22</div>
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
                    <div className="text-sm text-gray-600">12, 26</div>
                    <div className="text-xs text-gray-500">Пятница</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-600 text-center">
                <p><strong>Примечание:</strong> Все заседания проводятся по пятницам в рабочем органе Центральной комиссии по биоэтике.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Основные направления */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap">
            <FolderChlank 
              h1="БИОЭТИЧЕСКАЯ ЭКСПЕРТИЗА" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.expertise')}
            />
            <FolderChlank 
              h1="СЕРТИФИКАЦИЯ ЛОКАЛЬНЫХ КОМИССИЙ ПО БИОЭТИКЕ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.certification')}
            />
            <FolderChlank 
              h1="БИОБАНКИ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.biobanks')}
            />
            <FolderChlank 
              h1="ПЕРЕЧЕНЬ ЛОКАЛЬНЫХ ЭТИЧЕСКИХ КОМИССИЙ" 
              color="bg-blue-200" 
              colorsec="bg-blue-300" 
              href={route('bioethics.local-commissions')}
            />
          </div>
        </div>
      </section>

             {/* Контакты */}
       <section className="text-gray-600 body-font pb-8">
         <div className="container px-5 mx-auto">
           <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold text-gray-800 mb-3">Контакты:</h3>
             <p className="text-gray-700 mb-2">
               <strong>Адрес:</strong> г. Астана, ул. Мангилик ел 20, блок С, 5 этаж, 507 кабинет
             </p>
             <p className="text-gray-700 mb-2">
               <strong>Телефон:</strong> 87172648-950; 87172648-951 (внут 1109)
             </p>
             <p className="text-gray-700">
               <strong>Электронная почта:</strong> <a href="mailto:ckb-amu@yandex.kz" className="text-blue-600 hover:text-blue-800">ckb-amu@yandex.kz</a>
             </p>
           </div>
         </div>
       </section>
    </>
  )
}

Bioethics.layout = page => <LayoutDirection img="medicalscience" h1="Центральная комиссия по биоэтике" useVideo={false}>{page}</LayoutDirection>

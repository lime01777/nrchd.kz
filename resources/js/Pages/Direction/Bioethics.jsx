import { Head, usePage } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function Bioethics() {


  return (
    <>
      <Head title={t('directionsPages.bioethics.title', 'Центральная комиссия по биоэтике')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">
              {t('directionsPages.bioethics.mainTitle')}
            </h2>
            
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.bioethics.intro1')}
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.bioethics.intro2')}
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.bioethics.intro3')}
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              <strong>{t('directionsPages.bioethics.chairman')}</strong> - {t('directionsPages.bioethics.chairmanInfo')}
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.bioethics.orderPrefix')}<a href={route('bioethics.composition')} className="text-blue-600 hover:text-blue-800 underline">{t('directionsPages.bioethics.compositionLink')}</a>).
            </p>
            
                         <p className="tracking-wide leading-relaxed mb-4">
               <strong>{t('directionsPages.bioethics.workingBody')}</strong> {t('directionsPages.bioethics.workingBodyInfo')}
             </p>
             
             <p className="tracking-wide leading-relaxed mb-4">
               <a 
                 href="https://adilet.zan.kz/rus/docs/V2000021512" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 underline"
               >
                 {t('directionsPages.bioethics.regulationLink')}
               </a> {t('directionsPages.bioethics.regulationInfo')}
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
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">{t('directionsPages.bioethics.meetingScheduleTitle')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.january')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">24, 31</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.february')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 21</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.march')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 20</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.april')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">11, 25</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.may')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">9, 23</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.june')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">6, 20</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.july')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">4, 18</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.august')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">1, 15, 29</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.september')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">12, 26</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.october')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">10, 24</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.november')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">7, 21</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">{t('directionsPages.bioethics.months.december')}</h4>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">5, 26</div>
                    <div className="text-xs text-gray-500">{t('directionsPages.bioethics.months.friday')}</div>
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
                title={t('directionsPages.bioethics.subfolders.sop.title')} 
                description={t('directionsPages.bioethics.subfolders.sop.description')}
                href={route('bioethics.expertise')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={t('directionsPages.bioethics.subfolders.certification.title')} 
                description={t('directionsPages.bioethics.subfolders.certification.description')}
                href={route('bioethics.certification')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={t('directionsPages.bioethics.subfolders.localCommissions.title')} 
                description={t('directionsPages.bioethics.subfolders.localCommissions.description')}
                href={route('bioethics.local_commissions')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={t('directionsPages.bioethics.subfolders.biobanks.title')} 
                description={t('directionsPages.bioethics.subfolders.biobanks.description')}
                href={route('bioethics.biobanks')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={t('directionsPages.bioethics.subfolders.npa.title')} 
                description={t('directionsPages.bioethics.subfolders.npa.description')}
                href={route('bioethics.npa')}
              />
              
              <FolderChlank 
                color="bg-gray-200"
                colorsec="bg-gray-300"
                title={t('directionsPages.bioethics.subfolders.documents.title')} 
                description={t('directionsPages.bioethics.subfolders.documents.description')}
                href={route('bioethics.documents')}
              />
            
          </div>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap px-12">
            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('directionsPages.bioethics.contactInfo')}</h3>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">{t('directionsPages.bioethics.address')}</h4>
                    <p className="text-gray-600">{t('directionsPages.bioethics.addressInfo')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">{t('directionsPages.bioethics.phone')}</h4>
                    <p className="text-gray-600">{t('directionsPages.bioethics.phoneInfo')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">{t('directionsPages.bioethics.email')}</h4>
                    <p className="text-gray-600">{t('directionsPages.bioethics.emailInfo')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">{t('directionsPages.bioethics.workingHours')}</h4>
                    <p className="text-gray-600">{t('directionsPages.bioethics.workingHoursInfo1')}</p>
                    <p className="text-gray-600">{t('directionsPages.bioethics.workingHoursInfo2')}</p>
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

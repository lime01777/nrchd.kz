import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import TabsFileDisplay from '@/Components/TabsFileDisplay';
import YouthHealthCentersMap from '@/Components/YouthHealthCentersMap';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function CenterPrevention() {

  return (
    <>
      <Head title={t('directionsPages.centerPrevention.title', 'Центр профилактики и укрепления здоровья')} />

      {/* Hero и краткое описание */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify">
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.centerPrevention.intro')}
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
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{t('directionsPages.centerPrevention.column1Title')}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col1.png" alt={t('directionsPages.centerPrevention.column1Title')} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{t('directionsPages.centerPrevention.column1Item1')}</li>
                <li>{t('directionsPages.centerPrevention.column1Item2')}</li>
                <li>{t('directionsPages.centerPrevention.column1Item3')}</li>
              </ul>
            </div>

            {/* Колонка 2 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{t('directionsPages.centerPrevention.column2Title')}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col2.png" alt={t('directionsPages.centerPrevention.column2Title')} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{t('directionsPages.centerPrevention.column2Item1')}</li>
                <li>{t('directionsPages.centerPrevention.column2Item2')}</li>
                <li>{t('directionsPages.centerPrevention.column2Item3')}</li>
                <li>{t('directionsPages.centerPrevention.column2Item4')}</li>
                <li className="pt-2 font-semibold">{t('directionsPages.centerPrevention.column2ProjectsTitle')}</li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{t('directionsPages.centerPrevention.column2Project1')}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{t('directionsPages.centerPrevention.column2Project2')}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{t('directionsPages.centerPrevention.column2Project3')}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{t('directionsPages.centerPrevention.column2Project4')}</a></li>
              </ul>
            </div>

            {/* Колонка 3 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{t('directionsPages.centerPrevention.column3Title')}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col3.png" alt={t('directionsPages.centerPrevention.column3Title')} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{t('directionsPages.centerPrevention.column3Item1')}</li>
                <li>{t('directionsPages.centerPrevention.column3Item2')}</li>
                <li>{t('directionsPages.centerPrevention.column3Item3')}</li>
                <li>{t('directionsPages.centerPrevention.column3Item4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Вкладки с материалами */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pb-16 mx-auto">
          <TabsFileDisplay
            tabs={[
              { label: t('directionsPages.centerPrevention.tab1Label'), folder: t('directionsPages.centerPrevention.tab1Folder') },
              { label: t('directionsPages.centerPrevention.tab2Label'), folder: t('directionsPages.centerPrevention.tab2Folder') },
              { label: t('directionsPages.centerPrevention.tab3Label'), folder: t('directionsPages.centerPrevention.tab3Folder') },
            ]}
            defaultIndex={0}
          />
        </div>
      </section>

      {/* Карта молодежных центров здоровья */}
      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('directionsPages.centerPrevention.youthCentersTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('directionsPages.centerPrevention.youthCentersDescription')}
            </p>
          </div>
          <YouthHealthCentersMap />
        </div>
      </section>
    </>
  );
}

CenterPrevention.layout = (page) => <LayoutDirection img="zozh" h1={t('directions.center_prevention', 'Центр профилактики и укрепления здоровья')}>{page}</LayoutDirection>;

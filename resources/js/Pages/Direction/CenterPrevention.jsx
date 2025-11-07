import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import TabsFileDisplay from '@/Components/TabsFileDisplay';
import YouthHealthCentersMap from '@/Components/YouthHealthCentersMap';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function CenterPrevention() {
  // Состояния для переводов (для реактивного обновления)
  const [pageTitle, setPageTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [column1Title, setColumn1Title] = useState('');
  const [column1Item1, setColumn1Item1] = useState('');
  const [column1Item2, setColumn1Item2] = useState('');
  const [column1Item3, setColumn1Item3] = useState('');
  const [column2Title, setColumn2Title] = useState('');
  const [column2Item1, setColumn2Item1] = useState('');
  const [column2Item2, setColumn2Item2] = useState('');
  const [column2Item3, setColumn2Item3] = useState('');
  const [column2Item4, setColumn2Item4] = useState('');
  const [column2ProjectsTitle, setColumn2ProjectsTitle] = useState('');
  const [column2Project1, setColumn2Project1] = useState('');
  const [column2Project2, setColumn2Project2] = useState('');
  const [column2Project3, setColumn2Project3] = useState('');
  const [column2Project4, setColumn2Project4] = useState('');
  const [column3Title, setColumn3Title] = useState('');
  const [column3Item1, setColumn3Item1] = useState('');
  const [column3Item2, setColumn3Item2] = useState('');
  const [column3Item3, setColumn3Item3] = useState('');
  const [column3Item4, setColumn3Item4] = useState('');
  const [tab1Label, setTab1Label] = useState('');
  const [tab1Folder, setTab1Folder] = useState('');
  const [tab2Label, setTab2Label] = useState('');
  const [tab2Folder, setTab2Folder] = useState('');
  const [tab3Label, setTab3Label] = useState('');
  const [tab3Folder, setTab3Folder] = useState('');
  const [youthCentersTitle, setYouthCentersTitle] = useState('');
  const [youthCentersDescription, setYouthCentersDescription] = useState('');
  const [h1Title, setH1Title] = useState('');

  // Обновление переводов при смене языка
  useEffect(() => {
    const updateTranslations = () => {
      setPageTitle(t('directionsPages.centerPrevention.title', 'Центр профилактики и укрепления здоровья'));
      setIntro(t('directionsPages.centerPrevention.intro'));
      setColumn1Title(t('directionsPages.centerPrevention.column1Title'));
      setColumn1Item1(t('directionsPages.centerPrevention.column1Item1'));
      setColumn1Item2(t('directionsPages.centerPrevention.column1Item2'));
      setColumn1Item3(t('directionsPages.centerPrevention.column1Item3'));
      setColumn2Title(t('directionsPages.centerPrevention.column2Title'));
      setColumn2Item1(t('directionsPages.centerPrevention.column2Item1'));
      setColumn2Item2(t('directionsPages.centerPrevention.column2Item2'));
      setColumn2Item3(t('directionsPages.centerPrevention.column2Item3'));
      setColumn2Item4(t('directionsPages.centerPrevention.column2Item4'));
      setColumn2ProjectsTitle(t('directionsPages.centerPrevention.column2ProjectsTitle'));
      setColumn2Project1(t('directionsPages.centerPrevention.column2Project1'));
      setColumn2Project2(t('directionsPages.centerPrevention.column2Project2'));
      setColumn2Project3(t('directionsPages.centerPrevention.column2Project3'));
      setColumn2Project4(t('directionsPages.centerPrevention.column2Project4'));
      setColumn3Title(t('directionsPages.centerPrevention.column3Title'));
      setColumn3Item1(t('directionsPages.centerPrevention.column3Item1'));
      setColumn3Item2(t('directionsPages.centerPrevention.column3Item2'));
      setColumn3Item3(t('directionsPages.centerPrevention.column3Item3'));
      setColumn3Item4(t('directionsPages.centerPrevention.column3Item4'));
      setTab1Label(t('directionsPages.centerPrevention.tab1Label'));
      setTab1Folder(t('directionsPages.centerPrevention.tab1Folder'));
      setTab2Label(t('directionsPages.centerPrevention.tab2Label'));
      setTab2Folder(t('directionsPages.centerPrevention.tab2Folder'));
      setTab3Label(t('directionsPages.centerPrevention.tab3Label'));
      setTab3Folder(t('directionsPages.centerPrevention.tab3Folder'));
      setYouthCentersTitle(t('directionsPages.centerPrevention.youthCentersTitle'));
      setYouthCentersDescription(t('directionsPages.centerPrevention.youthCentersDescription'));
      setH1Title(t('directions.center_prevention', 'Центр профилактики и укрепления здоровья'));
    };

    updateTranslations();
    window.addEventListener('languageChanged', updateTranslations);

    return () => {
      window.removeEventListener('languageChanged', updateTranslations);
    };
  }, []);

  return (
    <>
      <Head title={pageTitle} />

      {/* Hero и краткое описание */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify">
            <p className="tracking-wide leading-relaxed mb-4">
              {intro}
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
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{column1Title}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col1.png" alt={column1Title} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{column1Item1}</li>
                <li>{column1Item2}</li>
                <li>{column1Item3}</li>
              </ul>
            </div>

            {/* Колонка 2 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{column2Title}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col2.png" alt={column2Title} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{column2Item1}</li>
                <li>{column2Item2}</li>
                <li>{column2Item3}</li>
                <li>{column2Item4}</li>
                <li className="pt-2 font-semibold">{column2ProjectsTitle}</li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{column2Project1}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{column2Project2}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{column2Project3}</a></li>
                <li className="ml-4 text-blue-600 underline"><a href="#">{column2Project4}</a></li>
              </ul>
            </div>

            {/* Колонка 3 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{column3Title}</h2>
              <div className="flex justify-center mt-4 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col3.png" alt={column3Title} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{column3Item1}</li>
                <li>{column3Item2}</li>
                <li>{column3Item3}</li>
                <li>{column3Item4}</li>
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
              { label: tab1Label, folder: tab1Folder },
              { label: tab2Label, folder: tab2Folder },
              { label: tab3Label, folder: tab3Folder },
            ]}
            defaultIndex={0}
          />
        </div>
      </section>

      {/* Карта молодежных центров здоровья */}
      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{youthCentersTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {youthCentersDescription}
            </p>
          </div>
          <YouthHealthCentersMap />
        </div>
      </section>
    </>
  );
}

CenterPrevention.layout = (page) => {
  // Используем функцию для получения текущего перевода h1
  const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
  return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};

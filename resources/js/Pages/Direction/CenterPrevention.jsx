import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import TabsFileDisplay from '@/Components/TabsFileDisplay';
import KazakhstanInteractiveMap from '@/Components/KazakhstanInteractiveMap';
import YouthHealthDashboard from '@/Components/Sections/YouthHealthDashboard';
import VolunteerForm from '@/Components/Sections/VolunteerForm';
import FileAccordTitle from '@/Components/FileAccordTitle';
import Modal from '@/Components/UI/Modal';
import translationService from '@/Services/TranslationService';
import FolderChlank from '@/Components/FolderChlank';

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
  const [infographicsTitle, setInfographicsTitle] = useState('');
  const [videosTitle, setVideosTitle] = useState('');
  const [openInfographics, setOpenInfographics] = useState(false);
  const [openVideos, setOpenVideos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab1Label, setTab1Label] = useState('');
  const [tab1Folder, setTab1Folder] = useState('');
  const [tab2Label, setTab2Label] = useState('');
  const [tab2Folder, setTab2Folder] = useState('');
  const [tab3Label, setTab3Label] = useState('');
  const [tab3Folder, setTab3Folder] = useState('');
  const [youthCentersTitle, setYouthCentersTitle] = useState('');
  const [youthCentersDescription, setYouthCentersDescription] = useState('');
  const [h1Title, setH1Title] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguage()); // Added as per edit

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
      setInfographicsTitle(t('directionsPages.centerPrevention.infographicsTitle', 'Инфографики'));
      setVideosTitle(t('directionsPages.centerPrevention.videosTitle', 'Видеоролики'));
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
    const handleLanguageChange = (e) => { // Modified as per edit
      setCurrentLanguage(e.detail.language);
      updateTranslations(); // Ensure other states are also updated
    };
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Данные для аккордеонов (можно загружать из API или использовать статические)
  const [infographicsItems, setInfographicsItems] = useState([]);
  const [videosItems, setVideosItems] = useState([]);

  // Функция для открытия модального окна
  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // Функции для действий в модальном окне
  const downloadFile = (url, name) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head title={t('directionsPages.centerPrevention.title', 'Центр профилактики')} />

      <section className="py-20 bg-white">
        <div className="container px-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Колонка 1 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
                {t('directionsPages.centerPrevention.column1Title', 'Профилактические программы')}
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column1Item1', 'Профилактические медицинские осмотры')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column1Item2', 'Скрининги целевых групп населения')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column1Item3', 'Профилактика НИЗ')}
                </li>
              </ul>
            </div>

            {/* Колонка 2 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-600 pl-4">
                {t('directionsPages.centerPrevention.column2Title', 'Формирование ЗОЖ')}
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column2Item1', 'Национальные программы здорового образа жизни')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column2Item2', 'Молодежные центры здоровья')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column2Item3', 'Культура здорового и рационального питания')}
                </li>
              </ul>
            </div>

            {/* Колонка 3 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">
                {t('directionsPages.centerPrevention.column3Title', 'Коммуникации')}
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column3Item1', 'Мероприятия')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column3Item2', 'Видеоролики')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  {t('directionsPages.centerPrevention.column3Item3', 'Информационно-разъяснительная работа')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 py-20">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap">
            <FolderChlank
              color="bg-emerald-200"
              colorsec="bg-emerald-300"
              title={tab1Label}
              description={tab1Folder}
              href={route('direction.center_prevention.legislation')}
            />
            <FolderChlank
              color="bg-emerald-200"
              colorsec="bg-emerald-300"
              title={tab2Label}
              description={tab2Folder}
              href={route('direction.center_prevention.podcasts')}
            />
            <FolderChlank
              color="bg-emerald-200"
              colorsec="bg-emerald-300"
              title={tab3Label}
              description={tab3Folder}
              href={route('direction.center_prevention.tools')}
            />
            <FolderChlank
              color="bg-blue-200"
              colorsec="bg-blue-300"
              title="Research Hub"
              description="Единая научная база"
              href={route('research_hub.index')}
            />
            <FolderChlank
              color="bg-purple-200"
              colorsec="bg-purple-300"
              title="Отчеты по ЗОЖ"
              description="Аналитические отчеты"
              href={route('direction.center_prevention.zozh_reports')}
            />
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container px-5 mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t('directionsPages.centerPrevention.youthCentersTitle', 'Молодежные центры здоровья')}</h2>
            <p className="text-xl text-gray-600">
              {t('directionsPages.centerPrevention.youthCentersMapSubtitle', 'Интерактивная карта молодежных центров здоровья в разрезе регионов.')}
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <KazakhstanInteractiveMap />
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('directionsPages.centerPrevention.youthCentersResultsTitle', 'Результаты деятельности МЦЗ')}</h2>
            <YouthHealthDashboard />
          </div>
        </div>
      </section>

      <VolunteerForm />
    </>
  );
}

CenterPrevention.layout = (page) => {
  // Используем функцию для получения текущего перевода h1
  const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
  return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};

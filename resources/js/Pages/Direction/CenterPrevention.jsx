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
    window.addEventListener('languageChanged', updateTranslations);

    return () => {
      window.removeEventListener('languageChanged', updateTranslations);
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

      {/* Три папки с направлениями работы */}
      <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
          <div className='flex flex-wrap'>
            <FolderChlank
              title="Профилактические программы"
              href={route('direction.center_prevention.prevention_programs')}
              color="bg-blue-200"
              colorsec="bg-blue-300"
            />
            <FolderChlank
              title="Формирование ЗОЖ"
              href={route('direction.center_prevention.healthy_lifestyle')}
              color="bg-green-200"
              colorsec="bg-green-300"
            />
            <FolderChlank
              title="Коммуникации"
              href={route('direction.center_prevention.communications')}
              color="bg-purple-200"
              colorsec="bg-purple-300"
            />
            <FolderChlank
              title="Инфографики"
              href={route('direction.center_prevention.communications')}
              color="bg-purple-200"
              colorsec="bg-purple-300"
            />
            <FolderChlank
              title="Видеоролики"
              href={route('direction.center_prevention.communications')}
              color="bg-purple-200"
              colorsec="bg-purple-300"
            />
          </div>
        </div>
      </section>

      {/* Интерактивная карта показателей */}
      <section className="text-gray-600 body-font py-12 bg-white">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Результаты деятельности МЦЗ</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Интерактивная карта молодежных центров здоровья в разрезе регионов.
            </p>
          </div>
          <KazakhstanInteractiveMap />

          {/* Дашборд с отчетами */}
          <YouthHealthDashboard />

          {/* Форма для волонтеров */}
          <VolunteerForm />
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

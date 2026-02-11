import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import TabsFileDisplay from '@/Components/TabsFileDisplay';
import YouthHealthCentersMap from '@/Components/YouthHealthCentersMap';
import FileAccordTitle from '@/Components/FileAccordTitle';
import Modal from '@/Components/UI/Modal';
import translationService from '@/Services/TranslationService';

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

      {/* Три колонки с направлениями работы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-4 pb-24 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Колонка 1 */}
            <div>
              <h2 className="bg-blue-50 text-center font-semibold py-3 rounded-t-lg">{column1Title}</h2>
              <div className="mt-4 mb-4">
                <div className="w-full aspect-square rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
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
              <div className="mt-4 mb-4">
                <div className="w-full aspect-square rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
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
              <div className="mt-4 mb-4">
                <div className="w-full aspect-square rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white">
                  <img src="/img/CenterPrevention/col3.png" alt={column3Title} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul className="list-disc list-inside mt-4 space-y-2 mb-4">
                <li>{column3Item1}</li>
                <li>{column3Item2}</li>
                <li>{column3Item3}</li>
                <li>{column3Item4}</li>
              </ul>

              {/* Аккордеон Инфографики */}
              <div className="mt-4 bg-blue-50 rounded-lg overflow-hidden">
                <FileAccordTitle
                  title={infographicsTitle}
                  isOpen={openInfographics}
                  toggleOpen={() => setOpenInfographics(!openInfographics)}
                />
                {openInfographics && (
                  <div className="p-4">
                    <ul className="space-y-2">
                      {/* Пример ссылок - можно загружать из API */}
                      <li>
                        <button
                          onClick={() => openModal({
                            type: 'infographic',
                            title: 'Инфографика 1',
                            kaz: {
                              pdfUrl: '/path/to/infographic1-kaz.pdf',
                              printUrl: '/path/to/infographic1-print-kaz.pdf',
                              socialUrl: '/path/to/infographic1-social-kaz.jpg',
                              imageUrl: '/path/to/infographic1-kaz.jpg'
                            },
                            rus: {
                              pdfUrl: '/path/to/infographic1-rus.pdf',
                              printUrl: '/path/to/infographic1-print-rus.pdf',
                              socialUrl: '/path/to/infographic1-social-rus.jpg',
                              imageUrl: '/path/to/infographic1-rus.jpg'
                            }
                          })}
                          className="text-blue-600 hover:text-blue-800 underline text-left"
                        >
                          Инфографика 1
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => openModal({
                            type: 'infographic',
                            title: 'Инфографика 2',
                            kaz: {
                              pdfUrl: '/path/to/infographic2-kaz.pdf',
                              printUrl: '/path/to/infographic2-print-kaz.pdf',
                              socialUrl: '/path/to/infographic2-social-kaz.jpg',
                              imageUrl: '/path/to/infographic2-kaz.jpg'
                            },
                            rus: {
                              pdfUrl: '/path/to/infographic2-rus.pdf',
                              printUrl: '/path/to/infographic2-print-rus.pdf',
                              socialUrl: '/path/to/infographic2-social-rus.jpg',
                              imageUrl: '/path/to/infographic2-rus.jpg'
                            }
                          })}
                          className="text-blue-600 hover:text-blue-800 underline text-left"
                        >
                          Инфографика 2
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Аккордеон Видеоролики */}
              <div className="mt-4 bg-blue-50 rounded-lg overflow-hidden">
                <FileAccordTitle
                  title={videosTitle}
                  isOpen={openVideos}
                  toggleOpen={() => setOpenVideos(!openVideos)}
                />
                {openVideos && (
                  <div className="p-4">
                    <ul className="space-y-2">
                      {/* Пример ссылок - можно загружать из API */}
                      <li>
                        <button
                          onClick={() => openModal({
                            type: 'video',
                            title: 'Видеоролик 1',
                            kaz: {
                              socialUrl: '/path/to/video1-social-kaz.mp4',
                              originalUrl: '/path/to/video1-original-kaz.mp4'
                            },
                            rus: {
                              socialUrl: '/path/to/video1-social-rus.mp4',
                              originalUrl: '/path/to/video1-original-rus.mp4'
                            }
                          })}
                          className="text-blue-600 hover:text-blue-800 underline text-left"
                        >
                          Видеоролик 1
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => openModal({
                            type: 'video',
                            title: 'Видеоролик 2',
                            kaz: {
                              socialUrl: '/path/to/video2-social-kaz.mp4',
                              originalUrl: '/path/to/video2-original-kaz.mp4'
                            },
                            rus: {
                              socialUrl: '/path/to/video2-social-rus.mp4',
                              originalUrl: '/path/to/video2-original-rus.mp4'
                            }
                          })}
                          className="text-blue-600 hover:text-blue-800 underline text-left"
                        >
                          Видеоролик 2
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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

      {/* Модальное окно с опциями */}
      <Modal show={modalOpen} onClose={closeModal} maxWidth="2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900" data-translate>
              {selectedItem?.title || 'Выберите действие'}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <div className="text-center font-bold text-gray-700">QAZ</div>
              <div className="text-center font-bold text-gray-700">RUS</div>
            </div>

            {selectedItem?.type === 'infographic' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Открыть PDF */}
                <button
                  onClick={() => window.open(selectedItem.kaz?.pdfUrl, '_blank')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Открыть PDF</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                <button
                  onClick={() => window.open(selectedItem.rus?.pdfUrl, '_blank')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Открыть PDF</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>

                {/* Скачать для печати */}
                <button
                  onClick={() => downloadFile(selectedItem.kaz?.printUrl, selectedItem.title + '_kaz_print')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать для печати</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={() => downloadFile(selectedItem.rus?.printUrl, selectedItem.title + '_rus_print')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать для печати</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>

                {/* Для соц сетей */}
                <button
                  onClick={() => downloadFile(selectedItem.kaz?.socialUrl, selectedItem.title + '_kaz_social')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Для соц сетей</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button
                  onClick={() => downloadFile(selectedItem.rus?.socialUrl, selectedItem.title + '_rus_social')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Для соц сетей</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Скачать изображение */}
                <button
                  onClick={() => downloadFile(selectedItem.kaz?.imageUrl, selectedItem.title + '_kaz_image')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать изображение</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => downloadFile(selectedItem.rus?.imageUrl, selectedItem.title + '_rus_image')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать изображение</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}

            {selectedItem?.type === 'video' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Для соц сетей */}
                <button
                  onClick={() => downloadFile(selectedItem.kaz?.socialUrl, selectedItem.title + '_kaz_social')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Для соц сетей</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button
                  onClick={() => downloadFile(selectedItem.rus?.socialUrl, selectedItem.title + '_rus_social')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Для соц сетей</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Скачать оригинал */}
                <button
                  onClick={() => downloadFile(selectedItem.kaz?.originalUrl, selectedItem.title + '_kaz_original')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать оригинал</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => downloadFile(selectedItem.rus?.originalUrl, selectedItem.title + '_rus_original')}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Скачать оригинал</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

CenterPrevention.layout = (page) => {
  // Используем функцию для получения текущего перевода h1
  const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
  return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};

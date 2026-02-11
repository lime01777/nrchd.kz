import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import AIServiceCatalog from '@/Components/AIServiceCatalog';
import translationService from '@/Services/TranslationService';
import HealthTechnologyRegistry from '@/Components/HealthTechnologyRegistry';
import FilesAccord from '@/Components/FilesAccord';
import axios from 'axios';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
  return translationService.t(key, fallback);
};


export default function ElectronicHealth({ registryData = [], aiServices = [] }) {

  const [showFullText, setShowFullText] = useState(false);
  const [accordionSections, setAccordionSections] = useState([]);
  const [loadingAccordion, setLoadingAccordion] = useState(true);

  useEffect(() => {
    const fetchAccordionData = async () => {
      try {
        const folders = [
          {
            titleKey: 'directionsPages.electronicHealth.subfolders.standards.title',
            folderKey: 'directionsPages.electronicHealthSubpages.standards.folder'
          },
          {
            titleKey: 'directionsPages.electronicHealth.subfolders.regulations.title',
            folderKey: 'directionsPages.electronicHealthSubpages.regulations.folder'
          },
          {
            titleKey: 'directionsPages.electronicHealth.subfolders.mkb11.title',
            folderKey: 'directionsPages.electronicHealthSubpages.mkb11.folder'
          }
        ];

        const promises = folders.map(async (item) => {
          const folderPath = translationService.t(item.folderKey);
          const title = translationService.t(item.titleKey);

          // Если путь к папке не найден, возвращаем пустой список
          if (!folderPath || folderPath === item.folderKey) return { title, documents: [] };

          const params = new URLSearchParams();
          params.append('folder', folderPath.replace(/\\/g, '/'));

          try {
            const response = await axios.get(`/api/files?${params.toString()}`);
            let files = [];

            if (response.data) {
              if (response.data.files) {
                files = response.data.files;
              } else if (Array.isArray(response.data)) {
                // Если API возвращает массив секций (как для FilesAccord), объединяем все файлы
                response.data.forEach(section => {
                  if (section.files) files = [...files, ...section.files];
                  if (section.documents) files = [...files, ...section.documents];
                });
              }
            }
            return { title, documents: files };
          } catch (err) {
            console.error(`Error fetching files for ${title}:`, err);
            return { title, documents: [] };
          }
        });

        const sections = await Promise.all(promises);
        setAccordionSections(sections);
        setLoadingAccordion(false);
      } catch (error) {
        console.error("Error in accordion fetch:", error);
        setLoadingAccordion(false);
      }
    };

    fetchAccordionData();
  }, []);

  return (
    <>
      <Head title={t('directionsPages.electronicHealth.title', 'Цифровое здравоохранение')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <div className="tracking-wide leading-relaxed">
              <p className="mb-4">
                {t('directionsPages.electronicHealth.intro')}
              </p>

              <p className="mb-4">
                <strong>{t('directionsPages.electronicHealth.mainTasks')}</strong>
              </p>
              <ul className='list-disc list-inside px-4 mb-4'>
                <li>{t('directionsPages.electronicHealth.task1')}</li>
                <li>{t('directionsPages.electronicHealth.task2')}</li>
                <li>{t('directionsPages.electronicHealth.task3')}</li>
                <li>{t('directionsPages.electronicHealth.task4')}</li>
                <li>{t('directionsPages.electronicHealth.task5')}</li>
              </ul>

              <p className="mb-4">
                {t('directionsPages.electronicHealth.departments')}
              </p>
              <ul className='list-disc list-inside px-4 mb-4'>
                <li>{t('directionsPages.electronicHealth.dept1')}</li>
                <li>{t('directionsPages.electronicHealth.dept2')}</li>
              </ul>

              {showFullText && (
                <>
                  <p className="mb-4">
                    <strong>{t('directionsPages.electronicHealth.dept1Functions')}</strong>
                  </p>
                  <ul className='list-disc list-inside px-4 mb-4'>
                    <li>{t('directionsPages.electronicHealth.dept1Task1')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task2')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task3')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task4')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task5')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task6')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task7')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task8')}</li>
                    <li>{t('directionsPages.electronicHealth.dept1Task9')}</li>
                  </ul>

                  <p className="mb-4">
                    <strong>{t('directionsPages.electronicHealth.dept2Functions')}</strong>
                  </p>
                  <ul className='list-disc list-inside px-4 mb-4'>
                    <li>{t('directionsPages.electronicHealth.dept2Task1')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task2')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task3')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task4')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task5')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task6')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task7')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task8')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task9')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task10')}</li>
                    <li>{t('directionsPages.electronicHealth.dept2Task11')}</li>
                  </ul>

                  <p className="mb-4">
                    <strong>{t('directionsPages.electronicHealth.workPlan2024')}</strong>
                  </p>
                  <p className="mb-4">
                    {t('directionsPages.electronicHealth.workPlan2024Text')}
                  </p>
                  <ul className='list-disc list-inside px-4 mb-4'>
                    <li>{t('directionsPages.electronicHealth.standard1')}</li>
                    <li>{t('directionsPages.electronicHealth.standard2')}</li>
                    <li>{t('directionsPages.electronicHealth.standard3')}</li>
                    <li>{t('directionsPages.electronicHealth.standard4')}</li>
                  </ul>

                  <p className="mb-4">
                    <strong>{t('directionsPages.electronicHealth.mkb11Work')}</strong>
                  </p>
                  <ul className='list-disc list-inside px-4 mb-4'>
                    <li>{t('directionsPages.electronicHealth.mkb11Task1')}</li>
                    <li>{t('directionsPages.electronicHealth.mkb11Task2')}</li>
                    <li>{t('directionsPages.electronicHealth.mkb11Task3')}</li>
                    <li>{t('directionsPages.electronicHealth.mkb11Task4')}</li>
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105"
            >
              {showFullText ? t('directionsPages.electronicHealth.hide') : t('directionsPages.electronicHealth.readMore')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`ml-2 transform transition-transform duration-300 ${showFullText ? 'rotate-45' : ''}`}
              >
                {showFullText ? (
                  <path d="M19 13H5v-2h14v2z" />
                ) : (
                  <>
                    <rect x="11.5" y="5" width="1" height="14" />
                    <rect x="5" y="11.5" width="14" height="1" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="text-gray-600 body-font pb-12">
        <div className="container px-5 mx-auto">
          {loadingAccordion ? (
            <div className="text-center py-4">{t('loading', 'Загрузка...')}</div>
          ) : (
            <FilesAccord sections={accordionSections} bgColor="bg-fuchsia-100" />
          )}
        </div>
      </section>

      <AIServiceCatalog services={aiServices} registryData={registryData} />

      <HealthTechnologyRegistry registryData={registryData} />

    </>
  );
}

ElectronicHealth.layout = (page) => <LayoutDirection img="electronichealth" h1={t('directions.electronic_health', 'Цифровое здравоохранение')}>{page}</LayoutDirection>;

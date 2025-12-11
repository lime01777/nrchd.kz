import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/services/TranslationService';

export default function OtzReports({ years = [], selectedYear: initialYear = '' }) {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  // Состояние фильтров
  const [selectedYear, setSelectedYear] = useState(initialYear || '');
  const [searchName, setSearchName] = useState('');

  // Формируем путь к папке с отчетами
  const getFolderPath = () => {
    if (!selectedYear) {
      return '';
    }
    // Путь к папке с отчетами ОТЗ для выбранного года
    return `Оценка технологии здравоохранения/Папка — Отчеты ОМТ/${selectedYear}`;
  };

  // Обработка изменения года
  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Сбрасываем поиск при смене года
    setSearchName('');
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedYear('');
    setSearchName('');
  };

  const folderPath = getFolderPath();

  return (
    <>
      <Head 
        title={t('directionsPages.healthRateSubpages.otzReports.title', 'ОТЗ отчеты')} 
      />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('directionsPages.healthRateSubpages.otzReports.mainTitle', 'Отчеты ОТЗ')}
              </h3>
              
              <p className="text-gray-700 mb-4">
                {t('directionsPages.healthRateSubpages.otzReports.intro', 'Выберите год для просмотра отчетов ОТЗ')}
              </p>

              {/* Фильтры */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  {t('directionsPages.healthRateSubpages.otzReports.filtersTitle', 'Фильтры')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Фильтр по году */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('directionsPages.healthRateSubpages.otzReports.yearLabel', 'Год')}
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">
                        {t('directionsPages.healthRateSubpages.otzReports.selectYear', 'Выберите год')}
                      </option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Фильтр по наименованию (поиск) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('directionsPages.healthRateSubpages.otzReports.nameLabel', 'Наименование')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('directionsPages.healthRateSubpages.otzReports.namePlaceholder', 'Поиск по названию файла...')}
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Кнопка сброса */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      {t('directionsPages.healthRateSubpages.otzReports.resetButton', 'Сбросить')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Информационное сообщение, если год не выбран */}
              {!selectedYear && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
                  <p className="text-blue-800">
                    {t('directionsPages.healthRateSubpages.otzReports.selectYearMessage', 'Пожалуйста, выберите год для просмотра отчетов')}
                  </p>
                </div>
              )}

              {/* Отображение файлов через SimpleFileDisplay */}
              {selectedYear && folderPath && (
                <div className="mt-6">
                  <SimpleFileDisplay 
                    folder={folderPath}
                    title={t('directionsPages.healthRateSubpages.otzReports.filesTitle', `Отчеты за ${selectedYear} год`)}
                    searchTerm={searchName}
                    bgColor="bg-fuchsia-50"
                    singleColumn={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

OtzReports.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.healthRateSubpages.otzReports.h1', 'Отчеты ОТЗ')} 
  parentRoute={route('health.rate')} 
  parentName={translationService.t('directionsPages.healthRateSubpages.otzReports.parentName', 'Оценка технологий здравоохранения')}
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
  buttonBorderColor="border-fuchsia-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.breadcrumbDirections', 'Направления'), route: 'directions' },
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.breadcrumbHealthRate', 'Оценка технологий здравоохранения'), route: 'health.rate' },
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.h1', 'Отчеты ОТЗ'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

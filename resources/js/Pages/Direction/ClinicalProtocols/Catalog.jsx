import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/services/TranslationService';
import { DEFAULT_MEDICINE_CATEGORIES, DEFAULT_MKB_OPTIONS } from '@/data/clinicalFilters';

export default function ClinicalProtocolsCatalog() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  console.log('Catalog component rendering...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedMkb, setSelectedMkb] = useState('');
  const [selectedType, setSelectedType] = useState('protocols');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [mkbOptions, setMkbOptions] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState(0);
  
  useEffect(() => {
    console.log('Catalog component mounted');
    fetchFilters();
    return () => {
      console.log('Catalog component unmounted');
    };
  }, []);

  const fetchFilters = () => {
    setLoading(true);
    axios.get('/api/clinical-protocols/filters')
      .then(({ data }) => {
        setMedicineOptions(data.medicine_categories || []);
        setMkbOptions(data.mkb_categories || []);
      })
      .catch(() => {
        setMedicineOptions(DEFAULT_MEDICINE_CATEGORIES);
        setMkbOptions(DEFAULT_MKB_OPTIONS);
      })
      .finally(() => setLoading(false));
  };

  const medicineSections = [
    { value: '', label: t('directionsPages.clinicalProtocolsSubpages.catalog.allSections') },
    ...medicineOptions.map((name) => ({ value: name, label: name })),
  ];

  const mkbCategories = [
    { value: '', label: t('directionsPages.clinicalProtocolsSubpages.catalog.allMkbCategories') },
    ...mkbOptions.map((option) => ({
      value: option.code || option,
      label: option.label || option,
    })),
  ];

  // Типы документов
  const documentTypes = [
    { value: 'protocols', label: t('directionsPages.clinicalProtocolsSubpages.catalog.types.protocols') },
    { value: 'guidelines', label: t('directionsPages.clinicalProtocolsSubpages.catalog.types.guidelines') },
    { value: 'archive', label: t('directionsPages.clinicalProtocolsSubpages.catalog.types.archive') }
  ];

  // Обработчики событий
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMedicineChange = (e) => {
    setSelectedMedicine(e.target.value);
  };

  const handleMkbChange = (e) => {
    setSelectedMkb(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMedicine('');
    setSelectedMkb('');
    setSelectedType('protocols');
    setError(null);
  };

  const handleDownloadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Формируем параметры для запроса
      const params = new URLSearchParams();
      const folderPath = getFolderPath();
      
      if (folderPath) {
        params.append('folder', folderPath);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (selectedMedicine) {
        params.append('medicine', selectedMedicine);
      }
      if (selectedMkb) {
        params.append('mkb', selectedMkb);
      }
      if (selectedType) {
        params.append('type', selectedType);
      }
      
      // Создаем URL для скачивания
      const downloadUrl = `/api/clinical-protocols/download-archive?${params.toString()}`;
      
      // Открываем ссылку в новом окне для скачивания
      window.location.href = downloadUrl;
      
    } catch (err) {
      console.error('Ошибка при скачивании архива:', err);
      setError('Не удалось скачать архив. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Формирование поискового запроса
  const getSearchQuery = () => searchTerm.trim();

  // Определение пути к папке на основе типа документа
  const getFolderPath = () => {
    let path = '';
    switch (selectedType) {
      case 'protocols':
        path = 'Клинические протоколы/Поток клинические протоколы';
        break;
      case 'guidelines':
        path = 'Клинические протоколы/Клинические руководства МЗ РК';
        break;
      case 'archive':
        path = 'Клинические протоколы/Архив клинических протоколов МЗ РК';
        break;
    }
    console.log('getFolderPath called:', { selectedType, path });
    return path;
  };

  return (
    <>
      <Head title={t('directionsPages.clinicalProtocolsSubpages.catalog.title', 'Каталог')} />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Фильтры и поиск */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.clinicalProtocolsSubpages.catalog.searchLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t('directionsPages.clinicalProtocolsSubpages.catalog.searchPlaceholder')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Тип документа */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.clinicalProtocolsSubpages.catalog.typeLabel')}</label>
                    <select
                      id="type"
                      name="type"
                      value={selectedType}
                      onChange={handleTypeChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Раздел медицины */}
                  <div>
                    <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.clinicalProtocolsSubpages.catalog.medicineSectionLabel')}</label>
                    <select
                      id="medicine"
                      name="medicine"
                      value={selectedMedicine}
                      onChange={handleMedicineChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {medicineSections.map((section) => (
                        <option key={section.value} value={section.value}>{section.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Категория МКБ */}
                  <div>
                    <label htmlFor="mkb" className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.clinicalProtocolsSubpages.catalog.mkbCategoryLabel')}</label>
                    <select
                      id="mkb"
                      name="mkb"
                      value={selectedMkb}
                      onChange={handleMkbChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {mkbCategories.map((mkb) => (
                        <option key={mkb.value} value={mkb.value}>{mkb.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
              
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('directionsPages.clinicalProtocolsSubpages.catalog.resetFiltersButton')}
                </button>
                <button
                  onClick={handleDownloadAll}
                  disabled={loading || filteredProtocols === 0}
                  className="px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('directionsPages.clinicalProtocolsSubpages.catalog.downloadAllButton', 'Скачать все протоколы')}
                </button>
              </div>
            </div>
            
            {/* Сообщение об ошибке */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">{t('directionsPages.clinicalProtocolsSubpages.catalog.errorTitle')}</strong>
                <span className="block sm:inline"> {error}</span>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3" 
                  onClick={() => setError(null)}
                >
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>{t('directionsPages.clinicalProtocolsSubpages.catalog.closeButton')}</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Список клинических протоколов */}
            <SimpleFileDisplay
              folder={getFolderPath()}
              bgColor='bg-white'
              useClinicalProtocols={true}
              searchTerm={getSearchQuery()}
              medicine={selectedMedicine}
              mkb={selectedMkb}
              onFilesLoaded={(count) => setFilteredProtocols(count)}
              onError={(errorMessage) => setError(errorMessage)}
            />
          </div>
        </div>
      </section>
    </>
  );
}

ClinicalProtocolsCatalog.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.clinicalProtocolsSubpages.catalog.h1')} 
  parentRoute="/clinical-protocols" 
  parentName={translationService.t('directionsPages.clinicalProtocolsSubpages.catalog.parentName')}
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.clinicalProtocolsSubpages.catalog.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.clinicalProtocolsSubpages.catalog.breadcrumbClinicalProtocols'), route: 'clinical.protocols' },
    { name: translationService.t('directionsPages.clinicalProtocolsSubpages.catalog.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;
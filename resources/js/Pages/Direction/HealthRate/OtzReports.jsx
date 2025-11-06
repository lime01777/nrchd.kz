import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import OtzApplicationCard from '@/Components/OtzApplicationCard';
import OtzApplicationModal from '@/Components/OtzApplicationModal';
import translationService from '@/services/TranslationService';

export default function OtzReports({ applications: initialApplications, categories, stages }) {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const [applications, setApplications] = useState(initialApplications || []);
  const [loading, setLoading] = useState(false);
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stage: ''
  });

  // Отладочная информация
  console.log('OtzReports props:', { initialApplications, categories, stages });
  console.log('Applications state:', applications);
  console.log('Parent route:', route('health.rate'));
  console.log('Current route:', route('health.rate.otz.reports'));

  // Фильтрация заявок на клиенте
  const filteredApplications = applications.filter(application => {
    const matchesSearch = !filters.search || 
      application.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.application_id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || application.category === filters.category;
    const matchesStage = !filters.stage || application.current_stage === filters.stage;
    
    return matchesSearch && matchesCategory && matchesStage;
  });

  // Обработка фильтров
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      stage: ''
    });
  };

  // Открытие модального окна
  const openModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  // useEffect больше не нужен, так как фильтрация происходит автоматически
  // при изменении состояния filters

  return (
    <>
      <Head 
        title={t('directionsPages.healthRateSubpages.otzReports.title', 'ОТЗ отчеты')} 
      />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.healthRateSubpages.otzReports.mainTitle')}</h3>
              
              <p className="text-gray-700 mb-4">
                {t('directionsPages.healthRateSubpages.otzReports.intro')}
              </p>

              {/* Фильтры */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">{t('directionsPages.healthRateSubpages.otzReports.filtersTitle')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.healthRateSubpages.otzReports.searchLabel')}</label>
                    <input
                      type="text"
                      placeholder={t('directionsPages.healthRateSubpages.otzReports.searchPlaceholder')}
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.healthRateSubpages.otzReports.categoryLabel')}</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">{t('directionsPages.healthRateSubpages.otzReports.allCategories')}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('directionsPages.healthRateSubpages.otzReports.stageLabel')}</label>
                    <select
                      value={filters.stage}
                      onChange={(e) => handleFilterChange('stage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">{t('directionsPages.healthRateSubpages.otzReports.allStages')}</option>
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      {t('directionsPages.healthRateSubpages.otzReports.resetButton')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Отладочная информация */}
              <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">{t('directionsPages.healthRateSubpages.otzReports.debugInfoTitle')}</h4>
                <p>{t('directionsPages.healthRateSubpages.otzReports.totalApplications')} {applications.length}</p>
                <p>{t('directionsPages.healthRateSubpages.otzReports.filteredApplications')} {filteredApplications.length}</p>
                <p>{t('directionsPages.healthRateSubpages.otzReports.categories')} {categories ? categories.join(', ') : t('directionsPages.healthRateSubpages.otzReports.notLoaded')}</p>
                <p>{t('directionsPages.healthRateSubpages.otzReports.stages')} {stages ? stages.join(', ') : t('directionsPages.healthRateSubpages.otzReports.notLoaded')}</p>
              </div>

              {/* Карточки заявок */}
              {filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {filteredApplications.map((application) => (
                    <OtzApplicationCard
                      key={application.id}
                      application={application}
                      onClick={() => openModal(application)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {applications.length > 0 ? t('directionsPages.healthRateSubpages.otzReports.noApplicationsFiltered') : t('directionsPages.healthRateSubpages.otzReports.noApplicationsFound')}
                  </p>
                  {applications.length === 0 && (
                    <div className="mt-4 text-sm text-gray-400">
                      <p>{t('directionsPages.healthRateSubpages.otzReports.checkTitle')}</p>
                      <ul className="list-disc list-inside">
                        <li>{t('directionsPages.healthRateSubpages.otzReports.checkDatabase')}</li>
                        <li>{t('directionsPages.healthRateSubpages.otzReports.checkController')}</li>
                        <li>{t('directionsPages.healthRateSubpages.otzReports.checkInertia')}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно с детальной информацией */}
      {showModal && selectedApplication && (
        <OtzApplicationModal
          application={selectedApplication}
          stages={stages}
          onClose={closeModal}
        />
      )}
    </>
  );
}

OtzReports.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.healthRateSubpages.otzReports.h1')} 
  parentRoute={route('health.rate')} 
  parentName={translationService.t('directionsPages.healthRateSubpages.otzReports.parentName')}
  heroBgColor="bg-fuchsia-100"
  buttonBgColor="bg-fuchsia-100"
  buttonHoverBgColor="hover:bg-fuchsia-200"
  buttonBorderColor="border-fuchsia-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.breadcrumbHealthRate'), route: 'health.rate' },
    { name: translationService.t('directionsPages.healthRateSubpages.otzReports.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;

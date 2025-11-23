import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/services/TranslationService';
import DocumentsDashboard from '@/Components/DocumentsDashboard';

// Универсальная функция перевода с запасным текстом
const t = (key, fallback = '') => translationService.t(key, fallback);

export default function Documents() {
  return (
    <>
      <Head title={t('directionsPages.healthAccountsSubpages.documents.title', 'Документы')} />

      {/* Контейнер для интерактивной доски */}
      <div className="container px-5 mx-auto py-8">
        {/* Интерактивная доска с фильтрами, графиками и документами */}
        <DocumentsDashboard
          folder={t('directionsPages.healthAccountsSubpages.documents.folder', 'Национальные счета/Документы')}
          title={t('directionsPages.healthAccountsSubpages.documents.title', 'Отчётность по Национальным счетам здравоохранения')}
        />
      </div>
    </>
  );
}

Documents.layout = (page) => (
  <LayoutFolderChlank
    h1={t('directionsPages.healthAccountsSubpages.documents.h1', 'Документы')}
    parentRoute={route('health.accounts')}
    parentName={t('directionsPages.healthAccountsSubpages.documents.parentName', 'Национальные счета здравоохранения')}
    bgColor="bg-white"
    heroBgColor="bg-gray-200"
    buttonBgColor="bg-gray-200"
    buttonHoverBgColor="hover:bg-gray-300"
    buttonBorderColor="border-gray-300"
  >
    {page}
  </LayoutFolderChlank>
);


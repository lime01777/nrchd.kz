import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/services/TranslationService';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

// Универсальная функция перевода с запасным текстом
const t = (key, fallback = '') => translationService.t(key, fallback);

export default function Documents() {
  return (
    <>
      <Head title={t('directionsPages.healthAccountsSubpages.documents.title', 'Документы')} />


      {/* Основной блок с актуальными документами */}
      <SimpleFileDisplay
        folder={t('directionsPages.healthAccountsSubpages.documents.folder', 'Национальные счета/Документы')}
        title={t('directionsPages.healthAccountsSubpages.documents.title', 'Документы Национальных счетов здравоохранения')}
        bgColor="bg-gray-100"
      />
    </>
  );
}

Documents.layout = (page) => (
  <LayoutFolderChlank
    h1={t('directionsPages.healthAccountsSubpages.documents.h1', 'Документы Национальных счетов здравоохранения')}
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


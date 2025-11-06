import { Head, usePage } from "@inertiajs/react";
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function MedicalScience() {
  return (
    <>
              <Head title={t('directionsPages.medicalScience.title', 'Медицинская наука')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
            {t('directionsPages.medicalScience.intro1')}
            </p>
            <p className="tracking-wide leading-relaxed">
            {t('directionsPages.medicalScience.intro2')}
            </p>
            <p className="tracking-wide leading-relaxed">
            {t('directionsPages.medicalScience.intro3')}
            </p>
            <p className="tracking-wide leading-relaxed">
            {t('directionsPages.medicalScience.intro4')}
            </p>
            <p className="tracking-wide leading-relaxed">
            {t('directionsPages.medicalScience.intro5')}
            </p>
          </div>
          <div className='flex flex-wrap px-12 justify-center mb-4'>
          </div>
        </div>
      </section>

      {/* Основные направления */}
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap">
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.medicalScience.subfolders.research.title')} 
              description={t('directionsPages.medicalScience.subfolders.research.description')}
              href={route('medical.science.research')}
            />
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.medicalScience.subfolders.clinical.title')} 
              description={t('directionsPages.medicalScience.subfolders.clinical.description')}
              href={route('medical.science.clinical')}
            />
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title={t('directionsPages.medicalScience.subfolders.council.title')} 
              description={t('directionsPages.medicalScience.subfolders.council.description')}
              href={route('medical.science.council')}
            />
          </div>
        </div>
      </section>

      {/* Локальная комиссия по биоэтике */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <FilesAccord 
                folder={t('directionsPages.medicalScience.localBioethicsCommissionFolder')}
                title={t('directionsPages.medicalScience.localBioethicsCommissionTitle')}
                bgColor="bg-gray-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder={t('directionsPages.medicalScience.medicalExpertiseFolder')}
                title={t('directionsPages.medicalScience.medicalExpertiseTitle')}
                bgColor="bg-gray-200"
                defaultOpen={true}
            />
                        <FilesAccord 
                folder={t('directionsPages.medicalScience.ratingFolder')}
                title={t('directionsPages.medicalScience.ratingTitle')}
                bgColor="bg-gray-200"
                defaultOpen={true}
            />
        </div>
    </section>
    </>
  )
}

MedicalScience.layout = page => <LayoutDirection img="medicalscience" h1={t('directions.medical_science', 'Медицинская наука')} useVideo={false}>{page}</LayoutDirection>

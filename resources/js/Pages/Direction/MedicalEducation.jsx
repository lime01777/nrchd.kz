import { Head, usePage } from "@inertiajs/react";
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import BannerCatalog from "@/Components/BannerCatalog";
import PageAccordions from "@/Components/PageAccordions";
import FilesAccord from "@/Components/FilesAccord";
import FolderChlank from "@/Components/FolderChlank";

import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function MedicalEducation() {

  const [showFullText, setShowFullText] = useState(false);

  return (
    <>
    <Head title={t('directionsPages.medicalEducation.title')} />
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {t('directionsPages.medicalEducation.title')}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('directionsPages.medicalEducation.subtitle')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('directionsPages.medicalEducation.intro')}
          </p>

          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              {t('directionsPages.medicalEducation.trainingIntro')}
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span>{t('directionsPages.medicalEducation.universities')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span>{t('directionsPages.medicalEducation.faculties')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span>{t('directionsPages.medicalEducation.centers')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('directionsPages.medicalEducation.levelsTitle')}</h3>
            
            <div className="overflow-hidden border border-green-100 rounded-lg mb-6">
              {/* Базовое и интегрированное образование */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                <div className="bg-green-50 p-5">
                  <h4 className="font-semibold mb-2 text-green-800">{t('directionsPages.medicalEducation.basicEducation')}</h4>
                  <p className="text-gray-700">{t('directionsPages.medicalEducation.basicDuration')}</p>
                </div>
                <div className="bg-green-50 p-5">
                  <h4 className="font-semibold mb-2 text-green-800">{t('directionsPages.medicalEducation.integratedEducation')}</h4>
                  <p className="text-gray-700">{t('directionsPages.medicalEducation.integratedDuration')}</p>
                </div>
              </div>
              
              {/* Послевузовское образование */}
              <div className="bg-green-50 p-5 border-t border-green-100">
                <h4 className="font-semibold mb-2 text-green-800">{t('directionsPages.medicalEducation.postgraduateEducation')}</h4>
                <ul className="list-none space-y-1 text-gray-700">
                  <li>• {t('directionsPages.medicalEducation.residency')}</li>
                  <li>• {t('directionsPages.medicalEducation.profileMaster')}</li>
                  <li>• {t('directionsPages.medicalEducation.scientificMaster')}</li>
                  <li>• {t('directionsPages.medicalEducation.phd')}</li>
                </ul>
              </div>
              
              {/* Дополнительное медицинское образование */}
              <div className="bg-green-50 p-5 border-t border-green-100">
                <h4 className="font-semibold mb-2 text-green-800">{t('directionsPages.medicalEducation.additionalEducation')}</h4>
                <p className="text-gray-700">{t('directionsPages.medicalEducation.additionalText')}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('directionsPages.medicalEducation.priorityDirections')}</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">1.</span>
                <p className="text-gray-700">{t('directionsPages.medicalEducation.priority1')}</p>
              </div>
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">2.</span>
                <p className="text-gray-700">{t('directionsPages.medicalEducation.priority2')}</p>
              </div>
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">3.</span>
                <p className="text-gray-700">{t('directionsPages.medicalEducation.priority3')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.medicalEducation.subfolders.rating.title')} 
                    description={t('directionsPages.medicalEducation.subfolders.rating.description')}
                    href={route('direction.medical.education.rating')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.medicalEducation.subfolders.documents.title')} 
                    description={t('directionsPages.medicalEducation.subfolders.documents.description')}
                    href={route('direction.medical.education.documents')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.medicalEducation.subfolders.gosoTup.title')} 
                    description={t('directionsPages.medicalEducation.subfolders.gosoTup.description')}
                    href={route('direction.medical.education.goso_tup')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.medicalEducation.subfolders.recommendations.title')} 
                    description={t('directionsPages.medicalEducation.subfolders.recommendations.description')}
                    href={route('direction.medical.education.recommendations')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

MedicalEducation.layout = (page) => <LayoutDirection img="medicaleducation" h1={t('directions.medical_education', 'Медицинское образование')}>{page}</LayoutDirection>;

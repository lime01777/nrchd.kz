import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function HumanResources() {

  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title={t('directionsPages.humanResources.title')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
          <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
            {t('directionsPages.humanResources.intro')}
          </p>
          
          <div className="w-full overflow-hidden transition-all duration-500 ease-in-out mt-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">{t('directionsPages.humanResources.mainGoals')}</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.mainGoalsText')}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>{t('directionsPages.humanResources.goal1')}</li>
              <li>{t('directionsPages.humanResources.goal2')}</li>
              <li>{t('directionsPages.humanResources.goal3')}</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.mainGoalsEnd')}
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3">{t('directionsPages.humanResources.personnelFormation')}</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.personnelFormationText')}
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3 mt-6">{t('directionsPages.humanResources.expertTeamActivity')}</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.expertTeamActivityText')}
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2">{t('directionsPages.humanResources.analyticalResearch')}</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.analyticalResearchIntro')}
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>{t('directionsPages.humanResources.analyticalItem1')}</li>
              <li>{t('directionsPages.humanResources.analyticalItem2')}</li>
              <li>{t('directionsPages.humanResources.analyticalItem3')}</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.analyticalEnd')}
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2">{t('directionsPages.humanResources.deficitAnalysis')}</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.deficitAnalysisIntro')}
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>{t('directionsPages.humanResources.deficitItem1')}</li>
              <li>{t('directionsPages.humanResources.deficitItem2')}</li>
              <li>{t('directionsPages.humanResources.deficitItem3')}</li>
              <li>{t('directionsPages.humanResources.deficitItem4')}</li>
              <li>{t('directionsPages.humanResources.deficitItem5')}</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.deficitEnd')}
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2">{t('directionsPages.humanResources.planning')}</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.planningIntro')}
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li>{t('directionsPages.humanResources.planningItem1')}</li>
              <li>{t('directionsPages.humanResources.planningItem2')}</li>
              <li>{t('directionsPages.humanResources.planningItem3')}</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.planningEnd')}
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3">{t('directionsPages.humanResources.mainDirectionsTitle')}</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>{t('directionsPages.humanResources.mainDirection1')}</li>
              <li>{t('directionsPages.humanResources.mainDirection2')}</li>
              <li>{t('directionsPages.humanResources.mainDirection3')}</li>
              <li>{t('directionsPages.humanResources.mainDirection4')}</li>
              <li>{t('directionsPages.humanResources.mainDirection5')}</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
              {t('directionsPages.humanResources.mainDirectionsEnd')}
            </p>
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
                    title={t('directionsPages.humanResources.subfolders.medicalWorkers.title')} 
                    description={t('directionsPages.humanResources.subfolders.medicalWorkers.description')}
                    href={route('human.resources.medical.workers')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.humanResources.subfolders.managers.title')} 
                    description={t('directionsPages.humanResources.subfolders.managers.description')}
                    href={route('human.resources.managers')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title={t('directionsPages.humanResources.subfolders.graduates.title')} 
                    description={t('directionsPages.humanResources.subfolders.graduates.description')}
                    href={route('human.resources.graduates')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

HumanResources.layout = (page) => <LayoutDirection img="humanresources" h1={t('directions.human_resources', 'Кадровые ресурсы')}>{page}</LayoutDirection>;
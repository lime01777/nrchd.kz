import { Head } from '@inertiajs/react';
import React from 'react';
import { Link } from '@inertiajs/react';
import FolderChlank from '@/Components/FolderChlank';
import translationService from '@/services/TranslationService';

export default function Quality() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medicalRatingSubpages.quality.title', 'Качество')} />
      
      <div className="container mx-auto px-5 py-8">
        <Link 
          href={route('medical.rating')} 
          className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-red-600 transition-all"
        >
          {t('directionsPages.medicalRatingSubpages.quality.backButton')}
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">{t('directionsPages.medicalRatingSubpages.quality.mainTitle')}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            {t('directionsPages.medicalRatingSubpages.quality.intro')}
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">{t('directionsPages.medicalRatingSubpages.quality.criteriaTitle')}</h2>
            <ul className="list-disc pl-6">
              <li>{t('directionsPages.medicalRatingSubpages.quality.criteria1')}</li>
              <li>{t('directionsPages.medicalRatingSubpages.quality.criteria2')}</li>
              <li>{t('directionsPages.medicalRatingSubpages.quality.criteria3')}</li>
              <li>{t('directionsPages.medicalRatingSubpages.quality.criteria4')}</li>
              <li>{t('directionsPages.medicalRatingSubpages.quality.criteria5')}</li>
            </ul>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('directionsPages.medicalRatingSubpages.quality.tableHeaderRank')}
                  </th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('directionsPages.medicalRatingSubpages.quality.tableHeaderOrganization')}
                  </th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('directionsPages.medicalRatingSubpages.quality.tableHeaderRegion')}
                  </th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('directionsPages.medicalRatingSubpages.quality.tableHeaderScore')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-200">1</td>
                  <td className="px-4 py-2 border-b border-gray-200">Национальный научный кардиохирургический центр</td>
                  <td className="px-4 py-2 border-b border-gray-200">г. Астана</td>
                  <td className="px-4 py-2 border-b border-gray-200">95.8</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">2</td>
                  <td className="px-4 py-2 border-b border-gray-200">Национальный научный онкологический центр</td>
                  <td className="px-4 py-2 border-b border-gray-200">г. Астана</td>
                  <td className="px-4 py-2 border-b border-gray-200">94.3</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-200">3</td>
                  <td className="px-4 py-2 border-b border-gray-200">Городская клиническая больница №7</td>
                  <td className="px-4 py-2 border-b border-gray-200">г. Алматы</td>
                  <td className="px-4 py-2 border-b border-gray-200">92.7</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">4</td>
                  <td className="px-4 py-2 border-b border-gray-200">Областная клиническая больница</td>
                  <td className="px-4 py-2 border-b border-gray-200">г. Караганда</td>
                  <td className="px-4 py-2 border-b border-gray-200">91.5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-200">5</td>
                  <td className="px-4 py-2 border-b border-gray-200">Многопрофильная городская больница №2</td>
                  <td className="px-4 py-2 border-b border-gray-200">г. Шымкент</td>
                  <td className="px-4 py-2 border-b border-gray-200">90.2</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <a 
              href="#" 
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('directionsPages.medicalRatingSubpages.quality.downloadButton')}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

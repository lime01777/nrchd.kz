import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import PageAccordions from "@/Components/PageAccordions";
import axios from 'axios';
import translationService from '@/services/TranslationService';

export default function QualityCommission() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const [showFullText, setShowFullText] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Загрузка файлов из API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const baseUrl = window.location.origin;
        const params = new URLSearchParams();
        
        const normalizedFolder = "Объединенная комиссия по качеству медицинских услуг".replace(/\\/g, '/');
        params.append('folder', normalizedFolder);
        
        const response = await axios.get(`${baseUrl}/api/files?${params.toString()}`);
        
        let filesData = [];
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach(section => {
            if (section.files) {
              filesData = [...filesData, ...section.files];
            }
            if (section.documents) {
              filesData = [...filesData, ...section.documents];
            }
          });
        } else if (response.data && response.data.files) {
          filesData = response.data.files;
        }
        
        setAllFiles(filesData);
        setTotalDocuments(filesData.length);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Ошибка при загрузке файлов');
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Фильтрация файлов по поисковому запросу
  const getFilteredFiles = () => {
    if (!searchTerm || searchTerm.trim() === '') {
      return allFiles;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return allFiles.filter(file => {
      const fileName = (file.name || '').toLowerCase();
      const fileDescription = (file.description || '').toLowerCase();
      return fileName.includes(normalizedSearchTerm) || fileDescription.includes(normalizedSearchTerm);
    });
  };

  // Получение иконки файла по расширению
  const getFileTypeIcon = (fileName) => {
    if (!fileName) return "2"; // По умолчанию PDF
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return "2";
      case 'xls':
      case 'xlsx': return "3";
      case 'txt': return "4";
      case 'ppt':
      case 'pptx': return "5";
      case 'doc':
      case 'docx': return "1";
      case 'mp4':
      case 'avi':
      case 'mov': return "6";
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return "7";
      default: return "2"; // По умолчанию PDF
    }
  };

  const getFileTypeShort = (fileName) => {
    if (!fileName) return '';
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? extension.toUpperCase() : '';
  };


  
  return (
    <>
    <Head title={t('directionsPages.qualityCommission.title', 'Объединенная комиссия по качеству медицинских услуг')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        <strong>{t('directionsPages.qualityCommission.mainTitle')}</strong>
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.qualityCommission.intro1')}
                    </p>
                    <p className="mb-4">
                        {t('directionsPages.qualityCommission.intro2')}
                    </p>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                {t('directionsPages.qualityCommission.additionalInfo1')}
                            </p>
                            <p className="mb-4">
                                <strong>{t('directionsPages.qualityCommission.functionsTitle')}</strong>
                            </p>
                            <ul className="list-disc list-inside px-4 mb-4">
                                <li>{t('directionsPages.qualityCommission.function1')}</li>
                                <li>{t('directionsPages.qualityCommission.function2')}</li>
                                <li>{t('directionsPages.qualityCommission.function3')}</li>
                                <li>{t('directionsPages.qualityCommission.function4')}</li>
                                <li>{t('directionsPages.qualityCommission.function5')}</li>
                                <li>{t('directionsPages.qualityCommission.function6')}</li>
                            </ul>
                            <p className="mb-4">
                                <strong>{t('directionsPages.qualityCommission.compositionTitle')}</strong>
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.qualityCommission.compositionInfo')}
                            </p>
                            <p className="mb-4">
                                <strong>{t('directionsPages.qualityCommission.resultsTitle')}</strong>
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.qualityCommission.resultsInfo')}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setShowFullText(!showFullText)} 
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-150 ease-in hover:bg-gray-100"
                >
                    {showFullText ? t('directionsPages.qualityCommission.hide') : t('directionsPages.qualityCommission.readMore')}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-2"
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
    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Поле поиска и фильтры */}
            <div className="mb-6">
                <div className="mb-4">
                    {/* Поле поиска - полная ширина */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('directionsPages.qualityCommission.searchPlaceholder')}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Отображение количества найденных документов */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {getFilteredFiles().length > 0 && (
                            <span>{t('directionsPages.qualityCommission.foundDocuments')} <strong className="text-gray-800">{getFilteredFiles().length}</strong> {t('directionsPages.qualityCommission.documentsCount')}</span>
                        )}
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            {t('directionsPages.qualityCommission.resetFilters')}
                        </button>
                    )}
                </div>
            </div>
            
            {/* Отображение файлов с сортировкой */}
            {loading ? (
                <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">{t('directionsPages.qualityCommission.loadingFiles')}</p>
                </div>
            ) : error ? (
                <div className="py-8 text-center text-red-500">
                    {t('directionsPages.qualityCommission.loadingError')}
                </div>
            ) : (
                <div className="py-6 bg-white">
                    {getFilteredFiles().length === 0 ? (
                        <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
                            {t('directionsPages.qualityCommission.noDocuments')}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getFilteredFiles().map((file, index) => {
                                const fileName = file.name || '';
                                const fileDescription = file.description || file.name || 'Файл';
                                const fileType = getFileTypeShort(fileName);
                                const iconType = getFileTypeIcon(fileName);
                                
                                return (
                                    <div className="w-full" key={index}>
                                        <div className="flex flex-col h-[250px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                                            <div className="flex-grow overflow-hidden">
                                                <h2 className="font-medium leading-normal text-gray-800 line-clamp-4 mb-3">{fileDescription}</h2>
                                                
                                                {/* Метки для файлов */}
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {file.medicine && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            {t('directionsPages.qualityCommission.sectionLabel')} {file.medicine}
                                                        </span>
                                                    )}
                                                    {file.mkb && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                            {t('directionsPages.qualityCommission.mkbLabel')} {file.mkb}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex mt-auto justify-between items-center">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => window.open(file.url, '_blank')}
                                                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                                                        <span>{t('directionsPages.qualityCommission.openButton')}</span>
                                                    </button>
                                                    <a
                                                        href={file.url}
                                                        download
                                                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                                                        <span>{t('directionsPages.qualityCommission.downloadButton')}</span>
                                                    </a>
                                                </div>
                                                <div className="flex flex-col text-sm">
                                                    <div className="flex flex-row items-center">
                                                        <img src={`/img/FileType/${iconType}.png`} alt="" className="w-4 h-4" />
                                                        <p className="ml-1 uppercase text-xs text-gray-600">{fileType}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    </section>
    <PageAccordions bgColor="bg-blue-100" />
    </>
  )
}

QualityCommission.layout = (page) => <LayoutDirection img={'humanresources'} h1={translationService.t('directionsPages.qualityCommission.title', 'Объединенная комиссия по качеству медицинских услуг')}>{page}</LayoutDirection>

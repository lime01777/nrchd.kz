import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import PageAccordions from "@/Components/PageAccordions";
import axios from 'axios';

export default function QualityCommission() {
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
    <Head title="Объединенная комиссия по качеству медицинских услуг" meta={[{ name: 'description', content: 'Информация о деятельности Объединенной комиссии по качеству медицинских услуг Республики Казахстан.' }]} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        <strong>Объединенная комиссия по качеству медицинских услуг</strong>
                    </p>
                    <p className="mb-4">
                        Объединенная комиссия по качеству медицинских услуг (ОКК) является консультативно-совещательным 
                        органом при уполномоченном органе в области здравоохранения Республики Казахстан. Комиссия 
                        занимается оценкой и мониторингом качества медицинских услуг, рассматривает результаты оценки 
                        технологий здравоохранения и принимает решения по их внедрению в систему здравоохранения.
                    </p>
                    <p className="mb-4">
                        В полномочия Объединенной комиссии входит рассмотрение и утверждение клинических протоколов, 
                        стандартов оказания медицинской помощи, а также принятие решений о возможности включения 
                        новых технологий и лекарственных средств в систему финансирования в рамках ГОБМП и ОСМС.
                    </p>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                Комиссия проводит регулярные заседания для рассмотрения вопросов качества медицинской помощи, 
                                анализирует результаты оценки технологий здравоохранения и разрабатывает рекомендации по 
                                улучшению системы здравоохранения Республики Казахстан.
                            </p>
                            <p className="mb-4">
                                <strong>Основные функции Объединенной комиссии:</strong>
                            </p>
                            <ul className="list-disc list-inside px-4 mb-4">
                                <li>Рассмотрение и утверждение клинических протоколов диагностики и лечения</li>
                                <li>Оценка качества медицинских услуг и стандартов оказания медицинской помощи</li>
                                <li>Принятие решений о включении новых технологий в систему финансирования</li>
                                <li>Мониторинг эффективности внедренных медицинских технологий</li>
                                <li>Разработка рекомендаций по улучшению качества медицинской помощи</li>
                                <li>Координация деятельности по обеспечению качества медицинских услуг</li>
                            </ul>
                            <p className="mb-4">
                                <strong>Состав комиссии:</strong>
                            </p>
                            <p className="mb-4">
                                В состав Объединенной комиссии входят ведущие специалисты в области здравоохранения, 
                                представители медицинских организаций, научных учреждений и общественных организаций. 
                                Комиссия работает на принципах коллегиальности, независимости и объективности.
                            </p>
                            <p className="mb-4">
                                <strong>Результаты работы:</strong>
                            </p>
                            <p className="mb-4">
                                Деятельность комиссии направлена на повышение качества медицинской помощи, 
                                обеспечение доступности современных медицинских технологий для населения и 
                                эффективное использование ресурсов системы здравоохранения Республики Казахстан.
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
                    {showFullText ? 'Свернуть' : 'Читать далее'}
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
                            placeholder="Поиск по названию файла..."
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
                            <span>Всего найдено: <strong className="text-gray-800">{getFilteredFiles().length}</strong> документов</span>
                        )}
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Сбросить фильтры
                        </button>
                    )}
                </div>
            </div>
            
            {/* Отображение файлов с сортировкой */}
            {loading ? (
                <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Загрузка файлов...</p>
                </div>
            ) : error ? (
                <div className="py-8 text-center text-red-500">
                    {error}
                </div>
            ) : (
                <div className="py-6 bg-white">
                    {getFilteredFiles().length === 0 ? (
                        <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
                            Нет доступных документов
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
                                                            Раздел: {file.medicine}
                                                        </span>
                                                    )}
                                                    {file.mkb && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                            МКБ: {file.mkb}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex mt-auto justify-between items-center">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => window.open(file.url, '_blank')}
                                                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                                                        <span>Открыть</span>
                                                    </button>
                                                    <a
                                                        href={file.url}
                                                        download
                                                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                                                        <span>Скачать</span>
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

QualityCommission.layout = (page) => <LayoutDirection img={'humanresources'} h1={'Объединенная комиссия по качеству медицинских услуг'}>{page}</LayoutDirection>

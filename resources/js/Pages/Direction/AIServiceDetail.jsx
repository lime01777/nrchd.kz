import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import Header from '@/Components/Sections/Header';
import Footer from '@/Components/Sections/Footer';
import translationService from '@/Services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

/**
 * Детальная страница ИИ сервиса
 */
export default function AIServiceDetail({ service, slug }) {
  const [activeTab, setActiveTab] = useState('brief'); // brief, purpose, validation, warnings, documentation
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Если сервис не найден (для будущей интеграции с API)
  if (!service) {
    return (
      <Layout>
        <Head title="Сервис не найден" />
        <div className="container mx-auto px-5 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Сервис не найден</h2>
            <Link 
              href={route('electronic.health')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Вернуться к перечню
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const statusConfig = {
    'active': {
      text: 'Активен',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    'pending': {
      text: 'Ожидается',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const status = service.status || 'pending';
  const config = statusConfig[status] || statusConfig.pending;

  // Получаем массивы для отображения
  const pathologyArray = Array.isArray(service.pathology) ? service.pathology : (service.pathology ? [service.pathology] : []);
  const modalityArray = Array.isArray(service.modality) ? service.modality : (service.modality ? [service.modality] : []);
  const areaArray = Array.isArray(service.area) ? service.area : (service.area ? [service.area] : []);

  // Генерируем краткое описание для hero блока
  const getShortDescription = () => {
    if (service.description) {
      return service.description;
    }
    
    const parts = [];
    if (modalityArray.length > 0) {
      parts.push(`Сервис для анализа ${modalityArray.join(', ')}`);
    }
    if (areaArray.length > 0) {
      parts.push(`области ${areaArray.join(', ')}`);
    }
    if (pathologyArray.length > 0 && pathologyArray.length <= 2) {
      parts.push(`для выявления ${pathologyArray.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'ИИ сервис для медицинской диагностики';
  };

  // Получаем документы сервиса
  const documents = service.documents || [];

  // Функция для получения расширения файла
  const getFileExtension = (fileName) => {
    return fileName ? fileName.split('.').pop().toLowerCase() : '';
  };

  // Функция для определения типа файла
  const getFileType = (fileName) => {
    const ext = getFileExtension(fileName);
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const pdfTypes = ['pdf'];
    const docTypes = ['doc', 'docx'];
    const excelTypes = ['xls', 'xlsx'];
    
    if (imageTypes.includes(ext)) return 'image';
    if (pdfTypes.includes(ext)) return 'pdf';
    if (docTypes.includes(ext)) return 'document';
    if (excelTypes.includes(ext)) return 'spreadsheet';
    return 'other';
  };

  // Функция для открытия документа в модальном окне
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  // Функция для скачивания документа
  const handleDownloadDocument = (doc) => {
    const url = doc.url || doc.file_path || doc.path;
    if (!url) return;
    
    // Если это полный URL, используем его напрямую
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
      return;
    }
    
    // Иначе формируем URL для скачивания
    const downloadUrl = url.startsWith('/') ? url : `/storage/${url}`;
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = doc.name || doc.file_name || 'document';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  // Функция для рендеринга содержимого документа в модальном окне
  const renderDocumentContent = () => {
    if (!selectedDocument) return null;
    
    const url = selectedDocument.url || selectedDocument.file_path || selectedDocument.path;
    const fullUrl = url?.startsWith('http') ? url : (url?.startsWith('/') ? url : `/storage/${url}`);
    const fileType = getFileType(selectedDocument.name || selectedDocument.file_name || '');
    
    switch (fileType) {
      case 'image':
        return (
          <img 
            src={fullUrl} 
            alt={selectedDocument.name || selectedDocument.file_name || 'Документ'}
            className="max-w-full max-h-[80vh] mx-auto"
          />
        );
      case 'pdf':
        return (
          <iframe
            src={fullUrl}
            className="w-full h-full min-h-[80vh]"
            title={selectedDocument.name || selectedDocument.file_name || 'PDF документ'}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg mb-2">Предпросмотр недоступен для данного типа файла</p>
            <p className="text-sm">Пожалуйста, скачайте файл для просмотра</p>
            <button
              onClick={() => handleDownloadDocument(selectedDocument)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Скачать документ
            </button>
          </div>
        );
    }
  };

  return (
    <Layout>
      <Head title={`${service.name || 'ИИ Сервис'} - ${t('directions.electronic_health', 'Цифровое здравоохранение')}`} />
      
      {/* Hero блок с изображением на фоне и информационным блоком слева */}
      <div className="relative w-full min-h-[500px] mb-8" style={{ marginTop: '96px' }}>
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: service.image ? `url(${service.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Затемнение для лучшей читаемости */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Контент hero блока */}
        <div className="relative z-10 container mx-auto px-5 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Информационный блок слева - 40% */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 w-full lg:w-[40%]">
              {/* Название сервиса и статус */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {service.name || 'Без названия'}
                </h1>
                {/* Статус рядом с названием */}
                <div className="flex items-center gap-2">
                  <div className={`${status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {config.icon}
                  </div>
                  <span className={`text-sm font-medium ${status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {config.text}
                  </span>
                </div>
              </div>

              {/* Метаинформация */}
              <div className="space-y-3">
                {/* Патологии */}
                {pathologyArray.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Патология</div>
                    <div className="flex flex-wrap gap-2">
                      {pathologyArray.map((path, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded"
                        >
                          {String(path)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Блок с видео/изображением справа - 60% */}
            <div className="w-full lg:w-[60%]">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                {/* Блок видео или изображения - на весь блок */}
                <div className="w-full aspect-video bg-gray-100 overflow-hidden relative">
                  {service.videoUrl ? (
                    <iframe
                      className="w-full h-full"
                      src={service.videoUrl}
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                      title="Видео сервиса"
                    ></iframe>
                  ) : service.image ? (
                    <>
                      <img 
                        src={service.image} 
                        alt={service.name || 'Изображение сервиса'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="image-placeholder w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 pb-8">

        {/* Вкладки */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('brief')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'brief'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Краткая информация
              </button>
              <button
                onClick={() => setActiveTab('purpose')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'purpose'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Назначение и указания по применению
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'validation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Валидация и производительность
              </button>
              <button
                onClick={() => setActiveTab('warnings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'warnings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Предупреждения
              </button>
              {service.publications && service.publications.length > 0 && (
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'publications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Публикации
                </button>
              )}
              <button
                onClick={() => setActiveTab('documentation')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'documentation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Документация
              </button>
            </nav>
          </div>

          {/* Содержимое вкладок */}
          <div className="p-6">
            {/* Краткая информация */}
            {activeTab === 'brief' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Описание сервиса</h3>
                  <div className="text-gray-700 leading-relaxed">
                    {service.briefInfo ? (
                      <div className="prose max-w-none">
                        {service.briefInfo.split('\n').map((paragraph, idx) => {
                          if (paragraph.trim() === '') return <br key={idx} />;
                          // Проверяем, является ли строка заголовком категории (ЛЕГКИЕ, ЛИМФАТИЧЕСКИЕ УЗЛЫ и т.д.)
                          if (paragraph.match(/^(ЛЕГКИЕ|ЛИМФАТИЧЕСКИЕ УЗЛЫ|СРЕДОСТЕНИЕ|БРЮШНАЯ ПОЛОСТЬ|КОСТНЫЕ СТРУКТУРЫ|Функциональность модуля включает|В результате работы сервис представляет|Сервис был разработан|Лицензионные права)/)) {
                            return <p key={idx} className="font-semibold text-gray-900 mt-4 mb-2">{paragraph}</p>;
                          }
                          // Проверяем, является ли строка пунктом списка (начинается с цифры и скобки или с дефиса)
                          if (paragraph.match(/^(\d+\)|-\s)/)) {
                            return <p key={idx} className="mb-1 ml-4">{paragraph}</p>;
                          }
                          return <p key={idx} className="mb-3">{paragraph}</p>;
                        })}
                      </div>
                    ) : (
                      <p>{service.description || 'Описание сервиса будет добавлено позже.'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Назначение и указания по применению */}
            {activeTab === 'purpose' && (
              <div className="space-y-6">
                {service.advantages && service.advantages.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                      Информация о плюсах использования Сервиса:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      {service.advantages.map((advantage, idx) => (
                        <li key={idx}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.targetPopulation && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                      Целевая популяция и область применения:
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{service.targetPopulation}</p>
                  </div>
                )}

                {pathologyArray && pathologyArray.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                      Патологии, с которыми работает сервис:
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {pathologyArray.join(', ')}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                    Назначение Сервиса:
                  </h4>
                  {service.purpose && service.purpose.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      {service.purpose.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">Информация будет добавлена позже.</p>
                  )}
                </div>

                {service.calibrationRequired && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                      Необходимость предварительной калибровки Сервиса:
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{service.calibrationRequired}</p>
                  </div>
                )}

                {service.decisionSupport && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800" style={{ fontWeight: 600, fontSize: '22px', color: '#001C45' }}>
                      Система поддержки принятия врачебного решения:
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{service.decisionSupport}</p>
                  </div>
                )}
              </div>
            )}

            {/* Валидация и производительность */}
            {activeTab === 'validation' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Оценка безопасности и эффективности</h3>
                
                {service.validationTable ? (() => {
                  // Определяем количество колонок на основе первой строки данных
                  const firstRow = service.validationTable.rows && service.validationTable.rows[0];
                  if (!firstRow) return <p className="text-gray-700">Данные валидации будут добавлены позже.</p>;
                  
                  // Проверяем, есть ли расширенная таблица с множественными патологиями
                  const hasExtendedTable = firstRow.providerValue2 !== undefined || firstRow.standardValue2 !== undefined;
                  
                  if (hasExtendedTable) {
                    // Расширенная таблица с множественными патологиями
                    // Подсчитываем количество патологий
                    let pathologyCount = 0;
                    for (let i = 1; i <= 20; i++) {
                      if (firstRow[`providerValue${i}`] !== undefined || firstRow[`standardValue${i}`] !== undefined || firstRow[`prospectiveValue${i}`] !== undefined) {
                        pathologyCount = i;
                      } else {
                        break;
                      }
                    }
                    
                    // Определяем, есть ли проспективная валидация для какой-либо патологии
                    const hasProspective = service.validationTable.rows && service.validationTable.rows.some(row => {
                      for (let i = 1; i <= pathologyCount; i++) {
                        if (row[`prospectiveValue${i}`] !== undefined && row[`prospectiveValue${i}`] !== '') {
                          return true;
                        }
                      }
                      return false;
                    });
                    
                    // Создаем массив заголовков колонок
                    const headers = [];
                    for (let i = 1; i <= pathologyCount; i++) {
                      if (firstRow[`providerValue${i}`] !== undefined || firstRow[`standardValue${i}`] !== undefined || firstRow[`prospectiveValue${i}`] !== undefined) {
                        headers.push({
                          provider: service.validationTable.providerLabel || 'Валидация поставщика сервиса',
                          standard: service.validationTable.standardLabel || 'Валидация на эталонном наборе данных',
                          prospective: service.validationTable.prospectiveLabel || 'Проспективная валидация НПКЦ',
                          index: i,
                          hasProspective: hasProspective && (firstRow[`prospectiveValue${i}`] !== undefined && firstRow[`prospectiveValue${i}`] !== '')
                        });
                      }
                    }
                    
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                Параметр
                              </th>
                              {headers.map((header, idx) => (
                                <React.Fragment key={idx}>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                    {header.provider}
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                    {header.standard}
                                  </th>
                                  {header.hasProspective && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                      {header.prospective}
                                    </th>
                                  )}
                                </React.Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {service.validationTable.rows && service.validationTable.rows.map((row, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300 font-medium">
                                  {row.parameter}
                                </td>
                                {headers.map((header, hIdx) => (
                                  <React.Fragment key={hIdx}>
                                    <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                      {row[`providerValue${header.index}`] || ''}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                      {row[`standardValue${header.index}`] || ''}
                                    </td>
                                    {header.hasProspective && (
                                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                        {row[`prospectiveValue${header.index}`] || ''}
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  } else {
                    // Простая таблица с двумя колонками
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                Параметр
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                {service.validationTable.providerLabel || 'Валидация поставщика сервиса'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                                {service.validationTable.standardLabel || 'Валидация на эталонном наборе данных'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {service.validationTable.rows && service.validationTable.rows.map((row, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300 font-medium">
                                  {row.parameter}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                  {row.providerValue || ''}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                  {row.standardValue || ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                })() : (
                  <p className="text-gray-700">Данные валидации будут добавлены позже.</p>
                )}

                {service.effectiveness && (
                  <div className="mt-4">
                    <p className="text-gray-700">{service.effectiveness}</p>
                  </div>
                )}
              </div>
            )}

            {/* Предупреждения */}
            {activeTab === 'warnings' && (
              <div className="space-y-6">
                {/* Информация о рисках */}
                {service.risks && service.risks.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Информация о рисках применения Сервиса:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {service.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ограничения использования */}
                {service.limitations && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Ограничения использования Сервиса:</h4>
                    {service.limitations.demographic && service.limitations.demographic.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-gray-700">Демографические:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {service.limitations.demographic.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.limitations.personal && service.limitations.personal.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-gray-700">Персональные:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {service.limitations.personal.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.limitations.technical && service.limitations.technical.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-gray-700">Технические:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {service.limitations.technical.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.limitations.additional && service.limitations.additional.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-gray-700">Дополнительные ограничения алгоритмов, анализирующих отдельные семиотические признаки:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {service.limitations.additional.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Причины прекращения использования */}
                {service.discontinuationReasons && service.discontinuationReasons.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Причины, требующие прекращения использования Сервиса:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {service.discontinuationReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Случаи приостановки использования */}
                {service.suspensionCases && service.suspensionCases.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Случаи, при которых рекомендуется приостановка использования сервиса и консультация с разработчиками:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {service.suspensionCases.map((case_item, idx) => (
                        <li key={idx}>{case_item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Публикации */}
            {activeTab === 'publications' && service.publications && service.publications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Публикации</h3>
                <div className="space-y-3">
                  {service.publications.map((pub, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-gray-700 leading-relaxed">{pub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Документация */}
            {activeTab === 'documentation' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Документация</h3>
                {documents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Название документа
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Тип файла
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Размер
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc, idx) => {
                          const fileName = doc.name || doc.file_name || 'Документ';
                          const fileType = getFileType(fileName);
                          const fileExtension = getFileExtension(fileName).toUpperCase();
                          const fileSize = doc.size || doc.file_size || '-';
                          
                          return (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                                {fileName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {fileExtension || 'ФАЙЛ'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">
                                {fileSize}
                              </td>
                              <td className="px-4 py-3 text-sm border border-gray-300">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewDocument(doc)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Просмотр
                                  </button>
                                  <button
                                    onClick={() => handleDownloadDocument(doc)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Скачать
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Документация будет добавлена позже.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Видео-материалы (если есть) */}
        {service.videos && service.videos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Видео-материалы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.videos.map((video, idx) => (
                <div key={idx} className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={video.url}
                    title={video.title || `Видео ${idx + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Модальное окно для просмотра документа */}
      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Фон модального окна */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            {/* Центрирование модального окна */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Модальное окно */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              {/* Заголовок модального окна */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedDocument.name || selectedDocument.file_name || 'Документ'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Содержимое модального окна */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[80vh] overflow-y-auto">
                {renderDocumentContent()}
              </div>

              {/* Футер модального окна */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Скачать
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}


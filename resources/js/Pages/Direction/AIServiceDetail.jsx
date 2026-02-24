import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import Header from '@/Components/Sections/Header';
import Footer from '@/Components/Sections/Footer';
import translationService from '@/Services/TranslationService';
import AIPerformanceChart from '@/Components/AIPerformanceChart';

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

                {/* График производительности в Hero блоке */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <AIPerformanceChart
                    metrics={service.metrics || {}}
                    title="Эффективность ИИ"
                  />
                </div>
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
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'brief'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Краткая информация
              </button>
              <button
                onClick={() => setActiveTab('purpose')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'purpose'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Назначение и указания по применению
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'validation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Валидация и производительность
              </button>
              <button
                onClick={() => setActiveTab('warnings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'warnings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Предупреждения
              </button>
              {service.publications && service.publications.length > 0 && (
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'publications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Публикации
                </button>
              )}
              <button
                onClick={() => setActiveTab('documentation')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documentation'
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
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <AIPerformanceChart
                      metrics={service.metrics || {}}
                      title="Метрики валидации"
                    />
                    <div className="mt-4 text-xs text-gray-500 text-center italic">
                      * Данные получены в ходе клинических испытаний и технической валидации
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Оценка безопасности и эффективности</h3>

                    {service.validationTable ? (() => {
                      if (service.validationTable.headers) {
                        const headers = service.validationTable.headers;
                        return (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th rowSpan="2" className="px-4 py-3 text-left font-bold text-gray-700 uppercase border border-gray-300">Параметр</th>
                                  {headers.map((h, i) => (
                                    <th key={i} colSpan={h.hasProspective ? 3 : 2} className="px-4 py-2 text-center font-bold text-gray-800 uppercase border border-gray-300 bg-gray-100">{h.title}</th>
                                  ))}
                                </tr>
                                <tr>
                                  {headers.map((h, i) => (
                                    <React.Fragment key={i}>
                                      <th className="px-4 py-2 text-center text-xs border border-gray-300">{h.provider}</th>
                                      <th className="px-4 py-2 text-center text-xs border border-gray-300">{h.standard}</th>
                                      {h.hasProspective && <th className="px-4 py-2 text-center text-xs border border-gray-300">{h.prospective}</th>}
                                    </React.Fragment>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {service.validationTable.rows?.map((row, i) => (
                                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 font-medium border border-gray-300">{row.parameter}</td>
                                    {headers.map((h, hi) => (
                                      <React.Fragment key={hi}>
                                        <td className="px-4 py-2 text-center border border-gray-300">{row[`providerValue${h.index}`] || '-'}</td>
                                        <td className="px-4 py-2 text-center border border-gray-300">{row[`standardValue${h.index}`] || '-'}</td>
                                        {h.hasProspective && <td className="px-4 py-2 text-center border border-gray-300">{row[`prospectiveValue${h.index}`] || '-'}</td>}
                                      </React.Fragment>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      } else {
                        return (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                              <thead className="bg-gray-50 uppercase text-xs">
                                <tr>
                                  <th className="px-4 py-3 text-left border border-gray-300">Параметр</th>
                                  <th className="px-4 py-3 text-left border border-gray-300">{service.validationTable.providerLabel || 'Разработчик'}</th>
                                  <th className="px-4 py-3 text-left border border-gray-300">{service.validationTable.standardLabel || 'Референт'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {service.validationTable.rows?.map((row, i) => (
                                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 font-medium border border-gray-300">{row.parameter}</td>
                                    <td className="px-4 py-2 border border-gray-300">{row.providerValue || ''}</td>
                                    <td className="px-4 py-2 border border-gray-300">{row.standardValue || ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                    })() : (
                      <p className="text-gray-700 italic">Данные валидации будут добавлены позже.</p>
                    )}

                    {service.effectiveness && (
                      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-gray-800 leading-relaxed shadow-sm">
                        <div className="flex items-start gap-4">
                          <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>{service.effectiveness}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Предупреждения */}
            {activeTab === 'warnings' && (
              <div className="space-y-8">
                {service.risks && service.risks.length > 0 && (
                  <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h4 className="text-lg font-bold mb-4 text-red-900 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Информация о рисках:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-red-800">
                      {service.risks.map((risk, idx) => <li key={idx}>{risk}</li>)}
                    </ul>
                  </div>
                )}

                {service.limitations && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Ограничения использования:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {['demographic', 'personal', 'technical'].map((cat) => (
                        service.limitations[cat] && service.limitations[cat].length > 0 && (
                          <div key={cat}>
                            <h5 className="font-bold text-gray-700 mb-3 uppercase text-xs tracking-wider">
                              {cat === 'demographic' ? 'Демографические' : cat === 'personal' ? 'Персональные' : 'Технические'}
                            </h5>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                              {service.limitations[cat].map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {(service.discontinuationReasons || service.suspensionCases) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {service.discontinuationReasons && (
                      <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                        <h4 className="font-bold text-orange-900 mb-4">Причины прекращения использования:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-orange-800">
                          {service.discontinuationReasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                    {service.suspensionCases && (
                      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                        <h4 className="font-bold text-yellow-900 mb-4">Случаи приостановки:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
                          {service.suspensionCases.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Публикации */}
            {activeTab === 'publications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">Научные публикации</h3>
                <div className="grid gap-4">
                  {service.publications?.map((pub, idx) => (
                    <div key={idx} className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                      <p className="text-gray-700 leading-relaxed italic">"{pub}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Документация */}
            {activeTab === 'documentation' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Документация</h3>
                {documents.length > 0 ? (
                  <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Название</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Тип</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Размер</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {documents.map((doc, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.name || doc.file_name}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                                {getFileExtension(doc.name || doc.file_name)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{doc.size || '-'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleViewDocument(doc)} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider">Просмотр</button>
                                <button onClick={() => handleDownloadDocument(doc)} className="text-green-600 hover:text-green-800 text-xs font-bold uppercase tracking-wider">Скачать</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 italic">Документация отсутствует или находится в процессе загрузки.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Видео-материалы */}
        {service.videos && service.videos.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
              Видео-материалы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.videos.map((video, idx) => (
                <div key={idx} className="bg-gray-100 rounded-xl overflow-hidden shadow-inner aspect-video">
                  <iframe className="w-full h-full" src={video.url} title={video.title || `Video ${idx + 1}`} frameBorder="0" allowFullScreen />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно просмотра документов */}
      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800 truncate pr-8">{selectedDocument.name || selectedDocument.file_name}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-grow bg-gray-200 overflow-auto flex items-center justify-center">
              {renderDocumentContent()}
            </div>
            <div className="p-4 border-t bg-white flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Закрыть</button>
              <button onClick={() => handleDownloadDocument(selectedDocument)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">Скачать оригинал</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

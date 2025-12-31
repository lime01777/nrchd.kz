import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

/**
 * Детальная страница ИИ сервиса
 */
export default function AIServiceDetail({ service, slug }) {
  const [activeTab, setActiveTab] = useState('brief'); // brief, purpose, validation, warnings

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
              Вернуться к каталогу
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

  return (
    <Layout>
      <Head title={`${service.name || 'ИИ Сервис'} - ${t('directions.electronic_health', 'Цифровое здравоохранение')}`} />
      
      <div className="container mx-auto px-5 py-8 pt-24">

        {/* Изображение сервиса (если есть) */}
        {service.image && (
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden border border-gray-200">
            <div className="w-full h-96 bg-gray-100 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name || 'Изображение сервиса'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Блок под фото */}
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    ИИ Сервис для медицинской диагностики
                  </div>
                  <div className="text-xs text-blue-500">
                    {service.name || 'Сервис искусственного интеллекта'}
                  </div>
                </div>
                {service.company && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Разработчик</div>
                    <div className="text-sm text-gray-700 font-medium">{service.company}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Заголовок и статус */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.name || 'Без названия'}</h1>
              
              {/* Метаинформация - как отдельные блоки */}
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Патологии */}
                {pathologyArray.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {pathologyArray.map((path, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded"
                      >
                        {String(path)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Модальность */}
                {modalityArray.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {modalityArray.map((mod, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded"
                      >
                        {String(mod)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Область */}
                {areaArray.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {areaArray.map((ar, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded"
                      >
                        {String(ar)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Статус и компания справа */}
            <div className="flex flex-col items-start md:items-end gap-4">
              <div className={`${config.bgColor} ${config.textColor} px-4 py-2 rounded-lg flex items-center gap-2`}>
                {config.icon}
                <span className="font-medium">{config.text}</span>
              </div>
              
              {service.company && (
                <div className="text-left md:text-right">
                  <div className="text-sm text-gray-600 mb-1">{service.company}</div>
                </div>
              )}
            </div>
          </div>
        </div>

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

        {/* Кнопка возврата */}
        <div className="mt-6">
          <Link
            href={route('electronic.health')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    </Layout>
  );
}


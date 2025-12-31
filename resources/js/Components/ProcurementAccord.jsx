import React, { useState, useEffect } from 'react';
import FileAccordTitle from './FileAccordTitle';
import ProcurementCard from './ProcurementCard';
import axios from 'axios';

/**
 * Специальный компонент для секции "Закупки"
 * Отображает данные из госзакупок в виде раскрывающегося списка с карточками
 */
export default function ProcurementAccord({ bgColor = 'bg-green-100', title = '', defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Обработчик клика на заголовок
   * Раскрывает/скрывает список закупок
   */
  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    // Загружаем данные при первом открытии
    if (!isOpen && !hasLoaded) {
      fetchProcurements();
    }
  };

  /**
   * Получает данные о закупках через бэкенд API
   */
  const fetchProcurements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = window.location.origin;
      const response = await axios.get(`${baseUrl}/api/procurements`);
      
      if (response.data.procurements) {
        setProcurements(response.data.procurements);
      } else {
        setProcurements([]);
      }
      setHasLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке данных о закупках:', err);
      setError('Не удалось загрузить данные о закупках. Пожалуйста, попробуйте позже.');
      setLoading(false);
      setProcurements([]);
      setHasLoaded(true);
    }
  };

  // Загружаем данные при монтировании, если defaultOpen = true
  useEffect(() => {
    if (defaultOpen && !hasLoaded) {
      fetchProcurements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  // URL для открытия в новой вкладке
  const procurementUrl = 'https://goszakup.gov.kz/ru/registry/plan?filter%5Bcustomer%5D=110340017483';

  return (
    <div className={`rounded-lg overflow-hidden ${bgColor}`}>
      <FileAccordTitle
        title={title}
        isOpen={isOpen}
        toggleOpen={handleToggle}
      />
      
      {isOpen && (
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600"></div>
              <span className="ml-4 text-gray-600" data-translate>Загрузка данных...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm mb-2" data-translate>{error}</p>
              <a
                href={procurementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Открыть на сайте goszakup.gov.kz →
              </a>
            </div>
          )}

          {!loading && !error && procurements.length > 0 && (
            <>
              {/* Ссылка для открытия в новой вкладке */}
              <div className="mb-4 flex justify-end">
                <a
                  href={procurementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span data-translate>Открыть на сайте goszakup.gov.kz</span>
                </a>
              </div>

              {/* Сетка с карточками закупок */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {procurements.map((procurement, index) => (
                  <ProcurementCard key={index} procurement={procurement} />
                ))}
              </div>
            </>
          )}

          {!loading && !error && procurements.length === 0 && hasLoaded && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-3" data-translate>
                Данные о закупках не найдены
              </p>
              <a
                href={procurementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Открыть на сайте goszakup.gov.kz →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


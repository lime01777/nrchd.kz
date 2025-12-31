import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';

/**
 * Компонент модального окна для отображения данных из госзакупок
 * Получает данные через бэкенд API и отображает их в виде карточек
 */
export default function ProcurementModal({ show, onClose }) {
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL для получения планов закупок центра (ID заказчика: 110340017483)
  const procurementUrl = 'https://goszakup.gov.kz/ru/registry/plan?filter%5Bcustomer%5D=110340017483';

  useEffect(() => {
    if (show) {
      // Загружаем данные при открытии модального окна
      fetchProcurements();
    }
  }, [show]);

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
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке данных о закупках:', err);
      setError('Не удалось загрузить данные о закупках. Пожалуйста, попробуйте позже.');
      setLoading(false);
      setProcurements([]);
    }
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      maxWidth="7xl"
    >
      <div className="p-6">
        {/* Заголовок модального окна */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900" data-translate>
            Реестр планов государственных закупок
          </h2>
          <div className="flex items-center gap-4">
            {/* Ссылка для открытия в новой вкладке */}
            <a
              href={procurementUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              title="Открыть в новой вкладке"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span data-translate>Открыть в новой вкладке</span>
            </a>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Содержимое модального окна */}
        <div className="relative w-full">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
              <span className="ml-4 text-gray-600" data-translate>Загрузка данных...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800" data-translate>{error}</p>
              <p className="text-sm text-red-600 mt-2" data-translate>
                Вы можете открыть страницу закупок напрямую по ссылке выше
              </p>
            </div>
          )}

          {/* Отображение карточек с данными о закупках */}
          {!loading && !error && procurements.length > 0 && (
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {procurements.map((procurement, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                      {procurement.name || 'Без названия'}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {procurement.customer && (
                        <p>
                          <span className="font-medium text-gray-700">Заказчик:</span>{' '}
                          <span className="text-gray-600">{procurement.customer}</span>
                        </p>
                      )}
                      {procurement.method && (
                        <p>
                          <span className="font-medium text-gray-700">Способ закупки:</span>{' '}
                          <span className="text-gray-600">{procurement.method}</span>
                        </p>
                      )}
                      {procurement.amount && (
                        <p>
                          <span className="font-medium text-gray-700">Сумма:</span>{' '}
                          <span className="text-gray-600 font-semibold">{procurement.amount}</span>
                        </p>
                      )}
                      {procurement.status && (
                        <p>
                          <span className="font-medium text-gray-700">Статус:</span>{' '}
                          <span className="text-gray-600">{procurement.status}</span>
                        </p>
                      )}
                      {procurement.date && (
                        <p>
                          <span className="font-medium text-gray-700">Срок закупки:</span>{' '}
                          <span className="text-gray-600">{procurement.date}</span>
                        </p>
                      )}
                    </div>
                    {procurement.link && (
                      <a
                        href={procurement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        <span>Подробнее</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Если данных нет */}
          {!loading && !error && procurements.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4" data-translate>
                Данные о закупках не найдены
              </p>
              <a
                href={procurementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Открыть на сайте goszakup.gov.kz
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}


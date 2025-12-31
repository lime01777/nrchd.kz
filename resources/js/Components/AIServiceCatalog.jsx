import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import SearchInput from './SearchInput';

/**
 * Компонент каталога ИИ сервисов
 * Отображает карточки сервисов с фильтрацией по модальности, области и патологии
 * Сервисы организованы по папкам (группировка по модальности)
 */
export default function AIServiceCatalog({ services = [] }) {
  // Состояния для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPathology, setSelectedPathology] = useState('');
  
  // Состояние для открытых/закрытых папок (по модальности)
  const [expandedFolders, setExpandedFolders] = useState(() => {
    // По умолчанию все папки открыты
    const allModalities = services.flatMap(s => {
      const mod = s.modality || [];
      return Array.isArray(mod) ? mod : [mod];
    });
    const unique = [...new Set(allModalities.map(m => String(m)))];
    return unique.reduce((acc, mod) => {
      acc[mod] = true;
      return acc;
    }, {});
  });

  // Уникальные значения для фильтров из данных сервисов
  const modalities = useMemo(() => {
    const allModalities = services.flatMap(s => {
      const mod = s.modality || [];
      return Array.isArray(mod) ? mod : [mod];
    });
    const unique = [...new Set(allModalities.map(m => String(m)))];
    return unique.filter(Boolean).sort();
  }, [services]);

  const areas = useMemo(() => {
    const allAreas = services.flatMap(s => {
      const area = s.area || [];
      return Array.isArray(area) ? area : [area];
    });
    const unique = [...new Set(allAreas.map(a => String(a)))];
    return unique.filter(Boolean).sort();
  }, [services]);

  const pathologies = useMemo(() => {
    const allPathologies = services.flatMap(s => {
      const path = s.pathology || [];
      return Array.isArray(path) ? path : [path];
    });
    const unique = [...new Set(allPathologies.map(p => String(p)))];
    return unique.filter(Boolean).sort();
  }, [services]);

  // Фильтрация сервисов
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Поиск по названию и патологии
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const serviceName = (service.name || '').toLowerCase();
        const pathologyArray = Array.isArray(service.pathology) ? service.pathology : [];
        const matchesSearch = 
          serviceName.includes(searchLower) ||
          pathologyArray.some(p => String(p).toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Фильтр по модальности
      if (selectedModality) {
        const modalityArray = Array.isArray(service.modality) ? service.modality : [];
        if (!modalityArray.some(m => String(m) === selectedModality)) {
          return false;
        }
      }

      // Фильтр по области
      if (selectedArea) {
        const areaArray = Array.isArray(service.area) ? service.area : [];
        if (!areaArray.some(a => String(a) === selectedArea)) {
          return false;
        }
      }

      // Фильтр по патологии
      if (selectedPathology) {
        const pathologyArray = Array.isArray(service.pathology) ? service.pathology : [];
        if (!pathologyArray.some(p => String(p) === selectedPathology)) {
          return false;
        }
      }

      return true;
    });
  }, [services, searchTerm, selectedModality, selectedArea, selectedPathology]);

  // Очистка всех фильтров
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModality('');
    setSelectedArea('');
    setSelectedPathology('');
  };

  // Группировка сервисов по модальности
  const servicesByModality = useMemo(() => {
    const grouped = {};
    
    filteredServices.forEach(service => {
      const modalityArray = Array.isArray(service.modality) ? service.modality : (service.modality ? [service.modality] : []);
      modalityArray.forEach(mod => {
        const modKey = String(mod);
        if (!grouped[modKey]) {
          grouped[modKey] = [];
        }
        // Избегаем дубликатов
        if (!grouped[modKey].find(s => s.id === service.id)) {
          grouped[modKey].push(service);
        }
      });
    });
    
    return grouped;
  }, [filteredServices]);

  // Получаем список модальностей для отображения папок
  const modalityFolders = useMemo(() => {
    return Object.keys(servicesByModality).sort();
  }, [servicesByModality]);

  // Переключение состояния папки (открыта/закрыта)
  const toggleFolder = (modality) => {
    setExpandedFolders(prev => ({
      ...prev,
      [modality]: !prev[modality]
    }));
  };

  // Развернуть/свернуть все папки
  const toggleAllFolders = () => {
    const allExpanded = Object.values(expandedFolders).every(v => v);
    const newState = {};
    modalityFolders.forEach(mod => {
      newState[mod] = !allExpanded;
    });
    setExpandedFolders(newState);
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-5">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Каталог ИИ сервисов</h2>

        {/* Поиск */}
        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Найти..."
          />
        </div>

        {/* Фильтры */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className="text-gray-700 font-medium">Фильтры:</span>
            
            {/* Фильтр по модальности */}
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите модальность:</option>
                {modalities.map(modality => (
                  <option key={modality} value={modality}>{modality}</option>
                ))}
              </select>
            </div>

            {/* Фильтр по области */}
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите область:</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Фильтр по патологии */}
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedPathology}
                onChange={(e) => setSelectedPathology(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите патологию:</option>
                {pathologies.map(pathology => (
                  <option key={pathology} value={pathology}>{pathology}</option>
                ))}
              </select>
            </div>

            {/* Кнопка очистки фильтров */}
            {(selectedModality || selectedArea || selectedPathology || searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Очистить фильтры
              </button>
            )}
          </div>

          {/* Информация о количестве результатов */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Найдено сервисов: {filteredServices.length} из {services.length}
            </div>
            {modalityFolders.length > 0 && (
              <button
                onClick={toggleAllFolders}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {Object.values(expandedFolders).every(v => v) ? 'Свернуть все' : 'Развернуть все'}
              </button>
            )}
          </div>
        </div>

        {/* Каталог по папкам (группировка по модальности) */}
        {modalityFolders.length > 0 ? (
          <div className="space-y-4">
            {modalityFolders.map(modality => {
              const servicesInFolder = servicesByModality[modality] || [];
              const isExpanded = expandedFolders[modality] === true;
              
              return (
                <ModalityFolder
                  key={modality}
                  modality={modality}
                  services={servicesInFolder}
                  isExpanded={isExpanded}
                  onToggle={() => toggleFolder(modality)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Сервисы не найдены. Попробуйте изменить параметры фильтрации.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Компонент карточки сервиса
 */
function ServiceCard({ service }) {
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

  // Генерируем slug для ссылки (можно использовать ID или создать slug из названия)
  const serviceSlug = service.slug || (service.name ? service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '') : `service-${service.id}`);
  const detailUrl = route('ai.service.detail', { slug: serviceSlug });

  return (
    <Link href={detailUrl} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Статус бейдж */}
        <div className={`${config.bgColor} ${config.textColor} px-4 py-2 flex items-center justify-between`}>
          <span className="text-sm font-medium">{config.text}</span>
          {config.icon}
        </div>

        {/* Изображение сервиса (если есть) */}
        {service.image && (
          <div className="w-full h-48 bg-gray-100 overflow-hidden">
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
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}

        {/* Блок под фото (информационный блок) */}
        {service.image && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="text-xs text-blue-600 font-medium">
              ИИ Сервис для медицинской диагностики
            </div>
          </div>
        )}

        {/* Контент карточки */}
        <div className="p-4 flex-grow">
        {/* Название сервиса */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2">
          {service.name || 'Без названия'}
        </h3>

        {/* Патологии */}
        {(() => {
          const pathologyArray = Array.isArray(service.pathology) ? service.pathology : (service.pathology ? [service.pathology] : []);
          return pathologyArray.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Патология:</div>
              <div className="flex flex-wrap gap-1">
                {pathologyArray.map((path, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {String(path)}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Модальность */}
        {(() => {
          const modalityArray = Array.isArray(service.modality) ? service.modality : (service.modality ? [service.modality] : []);
          return modalityArray.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Модальность:</div>
              <div className="flex flex-wrap gap-1">
                {modalityArray.map((mod, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded"
                  >
                    {String(mod)}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Область */}
        {(() => {
          const areaArray = Array.isArray(service.area) ? service.area : (service.area ? [service.area] : []);
          return areaArray.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Область:</div>
              <div className="flex flex-wrap gap-1">
                {areaArray.map((ar, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {String(ar)}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Компания-разработчик */}
        {service.company && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Разработчик:</div>
            <div className="text-sm text-gray-700 font-medium">{service.company}</div>
          </div>
        )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Компонент папки модальности
 * Отображает группу сервисов, сгруппированных по модальности
 */
function ModalityFolder({ modality, services, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Заголовок папки */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          {/* Иконка папки */}
          <svg 
            className={`w-6 h-6 text-blue-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          {/* Название модальности */}
          <h3 className="text-xl font-bold text-gray-800">
            {modality}
          </h3>
          
          {/* Количество сервисов */}
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
            {services.length}
          </span>
        </div>
        
        {/* Иконка развернуть/свернуть */}
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Содержимое папки (карточки сервисов) */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


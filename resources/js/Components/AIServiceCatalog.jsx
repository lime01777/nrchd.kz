import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import SearchInput from '@/Components/Forms/SearchInput';

/**
 * Компонент перечня ИИ сервисов
 * Отображает карточки сервисов с фильтрацией по модальности, области и патологии
 * Все сервисы отображаются в едином окне без аккордеона
 */
// Справочники для маппинга данных из реестра
const dictTypes = {
  digital: 'Цифровая',
  ai_software: 'ИИ/ПО',
  medical_device: 'Медицинское изделие',
  biomedical: 'Клеточная/биомедицинская',
  drug: 'Лекарственная',
  organizational: 'Организационная',
  combined: 'Комбинированная'
};

const dictDirections = {
  ai: 'ИИ',
  telemedicine: 'Телемедицина',
  teleradiology: 'Телерадиология',
  oncology: 'Онкология',
  diagnostics: 'Диагностика',
  lab: 'Лаборатория',
  rehab: 'Реабилитация',
  biotech: 'Биотехнологии',
  cardiology: 'Кардиология',
  ophthalmology: 'Офтальмология'
};

export default function AIServiceCatalog({ services = [], registryData = [] }) {
  // Объединяем сервисы и данные из реестра
  const allServices = useMemo(() => {
    const mappedRegistry = registryData.map(item => {
      // Маппинг направлений (area)
      const rawDirections = item.directions || [];
      const codeDirections = Array.isArray(rawDirections) ? rawDirections : [rawDirections];
      const mappedArea = codeDirections.map(d => dictDirections[d] || d);

      // Маппинг типа (modality)
      const rawType = item.type;
      const mappedModality = rawType ? [dictTypes[rawType] || rawType] : [];

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        company: item.developer || item.initiator,
        // Статусы реестра: implementation, scaling -> active, остальные -> pending
        status: ['implementation', 'scaling'].includes(item.status) ? 'active' : 'pending',
        image: item.logo_url || item.logoUrl,
        regNumber: item.registry_code || item.registryCode,
        // Маппинг категорий
        area: mappedArea,
        modality: mappedModality,
        pathology: [], // В реестре пока нет отдельного поля для патологий
        slug: item.registry_code || `registry-${item.id}`,
        // Сохраняем оригинальный объект для доступа к специфичным полям
        original: item
      };
    });

    return [...services, ...mappedRegistry];
  }, [services, registryData]);

  // Состояния для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPathology, setSelectedPathology] = useState('');

  // Уникальные значения для фильтров из данных сервисов
  const modalities = useMemo(() => {
    const allModalities = allServices.flatMap(s => {
      const mod = s.modality || [];
      return Array.isArray(mod) ? mod : [mod];
    });
    const unique = [...new Set(allModalities.map(m => String(m)))];
    return unique.filter(Boolean).sort();
  }, [allServices]);

  const areas = useMemo(() => {
    const allAreas = allServices.flatMap(s => {
      const area = s.area || [];
      return Array.isArray(area) ? area : [area];
    });
    const unique = [...new Set(allAreas.map(a => String(a)))];
    return unique.filter(Boolean).sort();
  }, [allServices]);

  const pathologies = useMemo(() => {
    const allPathologies = allServices.flatMap(s => {
      const path = s.pathology || [];
      return Array.isArray(path) ? path : [path];
    });
    const unique = [...new Set(allPathologies.map(p => String(p)))];
    return unique.filter(Boolean).sort();
  }, [allServices]);

  // Фильтрация сервисов
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
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
  }, [allServices, searchTerm, selectedModality, selectedArea, selectedPathology]);

  // Очистка всех фильтров
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModality('');
    setSelectedArea('');
    setSelectedPathology('');
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-5">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Перечень технологий здравоохранения</h2>

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
          <div className="text-sm text-gray-600">
            Найдено сервисов: {filteredServices.length} из {allServices.length}
          </div>
        </div>

        {/* Перечень сервисов - все в едином окне */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} />
            ))}
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

  // Генерируем URL для ссылки
  let detailUrl;
  // Проверяем, является ли это записью из реестра (у неё есть поле original)
  if (service.original) {
    detailUrl = route('electronic.health.registry.detail', { id: service.id });
  } else {
    // Для обычных сервисов используем slug
    const serviceSlug = service.slug || (service.name ? service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '') : `service-${service.id}`);
    detailUrl = route('ai.service.detail', { slug: serviceSlug });
  }

  // Генерируем краткое описание на основе патологии и области, если его нет
  const getDescription = () => {
    if (service.description) {
      return service.description;
    }

    const pathologyArray = Array.isArray(service.pathology) ? service.pathology : (service.pathology ? [service.pathology] : []);
    const areaArray = Array.isArray(service.area) ? service.area : (service.area ? [service.area] : []);
    const modalityArray = Array.isArray(service.modality) ? service.modality : (service.modality ? [service.modality] : []);

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

  // Функция для получения тематического изображения, если основное отсутствует
  const getThematicImage = () => {
    if (service.image) return service.image;

    const name = (service.name || '').toLowerCase();
    const desc = (service.description || '').toLowerCase();
    const text = `${name} ${desc}`;

    if (text.includes('кт') || text.includes('ct')) return '/img/ai/ct_scan.png';
    if (text.includes('мрт') || text.includes('mri')) return '/img/ai/mri_brain.png';
    if (text.includes('ммг') || text.includes('маммограф')) return '/img/ai/mammography.png';
    if (text.includes('рг') || text.includes('рентген') || text.includes('x-ray')) return '/img/ai/xray.png';

    return '/img/ai/general.png';
  };

  const displayImage = getThematicImage();
  const isPlaceholder = !service.image;

  return (
    <Link href={detailUrl} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Блок изображения - всегда отображается */}
        <div className="w-full h-48 bg-gray-100 overflow-hidden relative flex items-center justify-center">
          <img
            src={displayImage}
            alt={service.name || 'Изображение сервиса'}
            className={`w-full h-full ${isPlaceholder ? 'object-cover' : 'object-contain p-4'}`}
            onError={(e) => {
              e.target.src = '/img/ai/general.png';
              e.target.className = 'w-full h-full object-cover';
            }}
          />
          {isPlaceholder && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          )}
        </div>

        {/* Контент карточки */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            {/* Название сервиса - максимум 2 строки */}
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight">
              {service.name || 'Без названия'}
            </h3>
            {/* Номер реестра */}
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 whitespace-nowrap mt-1">
              № {service.regNumber || (1298700000 + service.id)}
            </span>
          </div>

          {/* Краткое описание под заголовком - максимум 4 строки */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-4 flex-grow">
            {getDescription()}
          </p>

          {/* Компания-разработчик и статус */}
          <div className="mt-auto pt-3 border-t border-gray-200">
            {service.company && (
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1">Разработчик:</div>
                  <div className="text-sm text-gray-700 font-medium line-clamp-1">{service.company}</div>
                </div>
                {/* Статус с галочкой - напротив разработчика */}
                <div className="flex items-center gap-2">
                  <div className={`${status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {config.icon}
                  </div>
                  <span className={`text-sm font-medium ${status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {config.text}
                  </span>
                </div>
              </div>
            )}
            {!service.company && (
              /* Статус с галочкой - если нет разработчика */
              <div className="flex items-center gap-2">
                <div className={`${status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {config.icon}
                </div>
                <span className={`text-sm font-medium ${status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                  {config.text}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}



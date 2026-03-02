import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Annotation } from "react-simple-maps";
import kazakhstanTopo from '@/data/kazakhstan.json';

/**
 * Маппинг: английское название региона (из TopoJSON) -> русское название
 */
const REGION_NAME_MAP = {
    'Aqmola': 'Акмолинская область',
    'Aqtöbe': 'Актюбинская область',
    'Almaty': 'Алматинская область',
    'Atyrau': 'Атырауская область',
    'East Kazakhstan': 'Восточно-Казахстанская область',
    'Zhambyl': 'Жамбылская область',
    'West Kazakhstan': 'Западно-Казахстанская область',
    'Qaraghandy': 'Карагандинская область',
    'Qostanay': 'Костанайская область',
    'Qyzylorda': 'Кызылординская область',
    'Mangghystau': 'Мангистауская область',
    'Pavlodar': 'Павлодарская область',
    'North Kazakhstan': 'Северо-Казахстанская область',
    'South Kazakhstan': 'Туркестанская область',
    'Almaty City': 'город Алматы',
    'Astana': 'город Астана',
};

/**
 * Обратный маппинг: русское -> английское (TopoJSON)
 */
const REVERSE_REGION_MAP = {};
Object.entries(REGION_NAME_MAP).forEach(([eng, rus]) => {
    REVERSE_REGION_MAP[rus] = eng;
});

/**
 * Дополнительные алиасы для частичных совпадений (БД может хранить по-разному)
 */
const REGION_ALIASES = {
    'Астана': 'Astana',
    'Алматы': 'Almaty City',
    'г. Алматы': 'Almaty City',
    'г. Астана': 'Astana',
    'г.Алматы': 'Almaty City',
    'г.Астана': 'Astana',
    'Шымкент': 'South Kazakhstan',
    'г. Шымкент': 'South Kazakhstan',
    'Туркестан': 'South Kazakhstan',
    'Нур-Султан': 'Astana',
    'Караганда': 'Qaraghandy',
    'Актобе': 'Aqtöbe',
    'Актюбинск': 'Aqtöbe',
    'Костанай': 'Qostanay',
    'Кызылорда': 'Qyzylorda',
    'Атырау': 'Atyrau',
    'Павлодар': 'Pavlodar',
    'Мангистау': 'Mangghystau',
    'Актау': 'Mangghystau',
    'Республиканский': null,
};

/**
 * Палитра цветов для тепловой карты (от светлого к тёмному)
 */
const HEAT_COLORS = [
    '#EFF6FF', // 0 — нет данных
    '#DBEAFE', // 1
    '#BFDBFE', // 2
    '#93C5FD', // 3
    '#60A5FA', // 4
    '#3B82F6', // 5
    '#2563EB', // 6+
];

/**
 * Словарь статусов для отображения бейджей
 */
const dictStatus = {
    project: { label: 'Проект', color: '#f3f4f6', textColor: '#374151' },
    pilot: { label: 'Пилот', color: '#dbeafe', textColor: '#1e40af' },
    implementation: { label: 'Внедрение', color: '#dcfce7', textColor: '#166534' },
    scaling: { label: 'Масштаб.', color: '#f3e8ff', textColor: '#7c3aed' },
    suspended: { label: 'Приостан.', color: '#fef9c3', textColor: '#854d0e' },
    archive: { label: 'Архив', color: '#fee2e2', textColor: '#991b1b' },
};

/**
 * Определяет английский ключ региона по русской строке из БД
 */
function resolveRegionKey(regionStr) {
    if (!regionStr || regionStr === '-') return null;
    const trimmed = regionStr.trim();

    if (REVERSE_REGION_MAP[trimmed]) return REVERSE_REGION_MAP[trimmed];
    if (REGION_ALIASES[trimmed] !== undefined) return REGION_ALIASES[trimmed];

    // Частичное совпадение
    for (const [rus, eng] of Object.entries(REVERSE_REGION_MAP)) {
        if (rus.toLowerCase().includes(trimmed.toLowerCase()) ||
            trimmed.toLowerCase().includes(rus.toLowerCase())) {
            return eng;
        }
    }
    for (const [alias, eng] of Object.entries(REGION_ALIASES)) {
        if (alias.toLowerCase().includes(trimmed.toLowerCase()) ||
            trimmed.toLowerCase().includes(alias.toLowerCase())) {
            return eng;
        }
    }

    return null;
}

/**
 * Компонент информативной карты Казахстана для дашборда KPI
 * Показывает карту с тепловой раскраской + полный список всех технологий по регионам
 * Чисто информативный — без интерактивного выбора региона
 *
 * @param {Array} registryData — массив записей реестра технологий из БД
 */
const RegistryKazakhstanMap = ({ registryData = [] }) => {

    /**
     * Агрегация данных по регионам
     */
    const regionStats = useMemo(() => {
        const stats = {};

        registryData.forEach(item => {
            const regionStr = item.region || item.Region || '';
            if (!regionStr || regionStr === '-') return;

            const regions = regionStr.split(',').map(s => s.trim()).filter(Boolean);

            regions.forEach(r => {
                const geoKey = resolveRegionKey(r);
                if (!geoKey) return;

                if (!stats[geoKey]) {
                    stats[geoKey] = { count: 0, technologies: [] };
                }

                stats[geoKey].count++;
                stats[geoKey].technologies.push(item);
            });
        });

        return stats;
    }, [registryData]);

    /**
     * Максимум технологий в одном регионе (для шкалы)
     */
    const maxCount = useMemo(() => {
        const counts = Object.values(regionStats).map(s => s.count);
        return Math.max(...counts, 1);
    }, [regionStats]);

    /**
     * Общее число уникальных технологий
     */
    const totalTechnologies = registryData.length;

    /**
     * Количество регионов с хотя бы одной технологией
     */
    const activeRegionsCount = Object.keys(regionStats).length;

    /**
     * Цвет региона на карте по кол-ву технологий
     */
    const getRegionColor = (geoName) => {
        const data = regionStats[geoName];
        if (!data || data.count === 0) return HEAT_COLORS[0];

        const ratio = data.count / maxCount;
        const index = Math.min(Math.floor(ratio * (HEAT_COLORS.length - 1)) + 1, HEAT_COLORS.length - 1);
        return HEAT_COLORS[index];
    };

    /**
     * Все регионы, отсортированные по кол-ву технологий (убывание)
     */
    const sortedRegions = useMemo(() => {
        return Object.entries(regionStats)
            .sort((a, b) => b[1].count - a[1].count);
    }, [regionStats]);

    /**
     * Тултип — контролируется через state (чисто для hover-подсказки)
     */
    const [tooltipContent, setTooltipContent] = React.useState("");

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Заголовок */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        География внедрения технологий
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Тепловая карта покрытия регионов • Всего {totalTechnologies} технологий в {activeRegionsCount} регионах
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Карта */}
                <div className="w-full lg:w-2/3 h-[420px] relative bg-gradient-to-br from-slate-50 to-blue-50/30">
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 2200, center: [68, 48] }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ZoomableGroup zoom={1} maxZoom={4} center={[68, 48]}>
                            <Geographies geography={kazakhstanTopo}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const geoName = geo.properties.name || geo.properties.NAME_1;
                                        const data = regionStats[geoName];
                                        const count = data?.count || 0;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                    const russianName = REGION_NAME_MAP[geoName] || geoName;
                                                    setTooltipContent(
                                                        `${russianName}: ${count} ${count === 1 ? 'технология' : count < 5 ? 'технологии' : 'технологий'}`
                                                    );
                                                }}
                                                onMouseLeave={() => setTooltipContent("")}
                                                style={{
                                                    default: {
                                                        fill: getRegionColor(geoName),
                                                        stroke: '#94a3b8',
                                                        strokeWidth: 0.5,
                                                        outline: "none",
                                                        transition: "all 0.3s ease",
                                                    },
                                                    hover: {
                                                        fill: count > 0 ? '#60a5fa' : '#e2e8f0',
                                                        stroke: '#64748b',
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                        cursor: "default",
                                                    },
                                                    pressed: {
                                                        fill: getRegionColor(geoName),
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Тултип при наведении */}
                    {tooltipContent && (
                        <div className="absolute bottom-4 left-4 bg-gray-900/85 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg pointer-events-none shadow-lg">
                            {tooltipContent}
                        </div>
                    )}

                    {/* Легенда тепловой карты */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200">
                        <div className="text-[10px] text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                            Кол-во технологий
                        </div>
                        <div className="flex items-center gap-0.5">
                            {HEAT_COLORS.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-5 h-3 first:rounded-l last:rounded-r"
                                    style={{ backgroundColor: color, border: '1px solid #e5e7eb' }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                            <span>0</span>
                            <span>{maxCount}</span>
                        </div>
                    </div>
                </div>

                {/* Правая панель — ВСЕ регионы со ВСЕМИ технологиями */}
                <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col" style={{ maxHeight: '420px' }}>
                    {/* Общий заголовок */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 flex-shrink-0">
                        <h4 className="text-sm font-bold text-white">Все регионы</h4>
                        <p className="text-xs text-blue-200 mt-0.5">
                            {activeRegionsCount > 0
                                ? `${activeRegionsCount} ${activeRegionsCount === 1 ? 'регион' : activeRegionsCount < 5 ? 'региона' : 'регионов'} с технологиями`
                                : 'Нет данных по регионам'
                            }
                        </p>
                    </div>

                    {/* Прокручиваемый список */}
                    <div className="overflow-y-auto flex-grow">
                        {sortedRegions.length > 0 ? (
                            sortedRegions.map(([geoKey, data]) => {
                                const russianName = REGION_NAME_MAP[geoKey] || geoKey;
                                return (
                                    <div key={geoKey} className="border-b border-gray-100 last:border-b-0">
                                        {/* Заголовок региона */}
                                        <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: getRegionColor(geoKey) }}
                                                />
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    {russianName}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {data.count}
                                            </span>
                                        </div>

                                        {/* Технологии данного региона */}
                                        <ul className="divide-y divide-gray-50">
                                            {data.technologies.map((tech, idx) => (
                                                <li key={tech.id || `${geoKey}-${idx}`} className="px-4 py-2 hover:bg-blue-50/50 transition-colors">
                                                    <div className="flex items-center gap-2.5">
                                                        {/* Лого/иконка */}
                                                        {(tech.logo_url || tech.logoUrl) ? (
                                                            <img
                                                                src={tech.logo_url || tech.logoUrl}
                                                                alt=""
                                                                className="w-7 h-7 rounded object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-blue-600 text-[10px] font-bold">
                                                                    {(tech.name || '?')[0]}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-grow min-w-0">
                                                            <p className="text-xs font-medium text-gray-800 leading-snug truncate">
                                                                {tech.name}
                                                            </p>
                                                            <span
                                                                className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5"
                                                                style={{
                                                                    backgroundColor: dictStatus[tech.status]?.color || '#f3f4f6',
                                                                    color: dictStatus[tech.status]?.textColor || '#374151',
                                                                }}
                                                            >
                                                                {dictStatus[tech.status]?.label || tech.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center h-full p-6">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🗺️</div>
                                    <p className="text-sm text-gray-400">
                                        Нет данных по регионам
                                    </p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        Добавьте регион в карточку технологии
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryKazakhstanMap;

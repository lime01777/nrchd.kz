import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { youthHealthCenters } from '@/Components/YouthHealthCentersMap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import kazakhstanTopo from '@/data/kazakhstan.json';

// Dummy data structure matching the user request ("report where everything is broken down strictly by regions")
// Based on the image: 
// - Staffing (штатная численность)
// - Completeness (укомплектованность)
// - Certified (обученных и сертифицированных)
// - Services provided (оказанных услуг)
// - Target group coverage (Целевая группа ... Охват)
// - Services structure (bar chart)

const REGION_DATA = {
    // Default fallback data template
    default: {
        staff: 0,
        completeness: 0,
        certified: 0,
        services: 0,
        coverage: 0,
        servicesDetails: [
            { label: 'Терапевт', value: 30 },
            { label: 'Педиатр', value: 25 },
            { label: 'Психолог', value: 20 },
            { label: 'Гинеколог', value: 15 },
            { label: 'Уролог', value: 10 },
        ]
    }
};

// Имена регионов из TopoJSON (точные! — получены из geo.properties.name)
const regionNames = [
    "East Kazakhstan", "Almaty", "Zhambyl", "South Kazakhstan", "Mangghystau",
    "Qyzylorda", "Aqtöbe", "North Kazakhstan", "Qostanay", "Pavlodar",
    "West Kazakhstan", "Atyrau", "Aqmola", "Qaraghandy", "Almaty City", "Astana"
];

// Helper to get random stats
const getRandomStats = () => ({
    staff: Math.floor(Math.random() * 500) + 100,
    completeness: (Math.random() * 30 + 60).toFixed(1),
    certified: (Math.random() * 40 + 40).toFixed(1),
    services: Math.floor(Math.random() * 500000) + 100000,
    coverage: (Math.random() * 20 + 10).toFixed(1),
    servicesDetails: [
        { label: 'Психолог', value: Math.floor(Math.random() * 40) + 10 },
        { label: 'Гинеколог', value: Math.floor(Math.random() * 30) + 5 },
        { label: 'Уролог', value: Math.floor(Math.random() * 20) + 5 },
        { label: 'Терапевт', value: Math.floor(Math.random() * 30) + 10 },
        { label: 'Педиатр', value: Math.floor(Math.random() * 25) + 5 },
    ].sort((a, b) => b.value - a.value)
});

// Populate REGION_DATA
regionNames.forEach(name => {
    REGION_DATA[name] = getRandomStats();
});

// Маппинг: точное имя из TopoJSON (geo.properties.name) -> русское название из youthHealthCenters
// Старый TopoJSON не содержит новых областей (Абай, Жетысу, Улытау, Туркестан),
// поэтому некоторые области объединены в одном полигоне (South Kazakhstan = Туркестан + Шымкент)
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
    // South Kazakhstan в старом TopoJSON = Туркестанская обл. + г. Шымкент
    'South Kazakhstan': 'Туркестанская область / город Шымкент',
    'Almaty City': 'город Алматы',
    'Astana': 'город Астана',
};

const KazakhstanInteractiveMap = ({ onRegionSelect }) => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [tooltipContent, setTooltipContent] = useState("");

    // Identify the correct object key in topojson
    // We assume standard "kazakhstan" but we will check on load if needed
    // Typically react-simple-maps handles this via the `geography` prop which can take the whole JSON object

    // For now, let's assume the region property name is "name" or "NAME_1"

    const handleRegionClick = (geo) => {
        // Получаем английское название из TopoJSON
        const geoName = geo.properties.name || geo.properties.NAME_1 || geo.properties.name_en;
        // Переводим в русское название по маппингу
        const regionName = REGION_NAME_MAP[geoName] || geoName;

        if (selectedRegion?.name === regionName) {
            // Сброс выделения при повторном клике
            setSelectedRegion(null);
            return;
        }

        // Ищем данные REGION_DATA по английскому ключу (geoName)
        let data = REGION_DATA[geoName] || REGION_DATA.default;

        setSelectedRegion({
            name: regionName,   // Русское название — для фильтрации МЦЗ
            geoName: geoName,   // Английское — для справки
            data: data
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Map Section */}
                <div className="w-full lg:w-2/3 h-[500px] relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                    <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-md text-sm font-medium text-gray-600">
                        Интерактивная карта (выберите регион)
                    </div>

                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 2200, // Zoom level - adjust based on actual map bounding box
                            center: [68, 48] // Approximate center of Kazakhstan
                        }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ZoomableGroup zoom={1} maxZoom={4} center={[68, 48]}>
                            <Geographies geography={kazakhstanTopo}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const geoName = geo.properties.name || geo.properties.NAME_1;
                                        // Подсвечиваем, если geoName совпадает с выбранным регионом
                                        const isSelected = selectedRegion?.geoName === geoName;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onClick={() => handleRegionClick(geo)}
                                                onMouseEnter={() => {
                                                    setTooltipContent(REGION_NAME_MAP[geoName] || geoName);
                                                }}
                                                onMouseLeave={() => {
                                                    setTooltipContent("");
                                                }}
                                                style={{
                                                    default: {
                                                        fill: isSelected ? "#3B82F6" : "#CBD5E1", // Blue if selected, Slate-300 default
                                                        stroke: "#FFF",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                        transition: "all 0.3s ease"
                                                    },
                                                    hover: {
                                                        fill: isSelected ? "#2563EB" : "#94A3B8", // Darker blue / Gray on hover
                                                        stroke: "#FFF",
                                                        strokeWidth: 1,
                                                        outline: "none",
                                                        cursor: "pointer",
                                                        transform: "scale(1.005)" // Subtle zoom effect
                                                    },
                                                    pressed: {
                                                        fill: "#1D4ED8",
                                                        outline: "none"
                                                    }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                            {/* Маркеры центров убраны — список отображается в правой панели */}

                        </ZoomableGroup>
                    </ComposableMap>

                    {tooltipContent && (
                        <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none">
                            {tooltipContent}
                        </div>
                    )}
                </div>

                {/* Info Panel Section — список МЦЗ */}
                <div className="w-full lg:w-1/3 flex flex-col" style={{ maxHeight: '500px' }}>

                    {/* Заголовок панели */}
                    <div className="bg-blue-50 rounded-t-xl px-4 py-3 border-b border-blue-100 flex items-center justify-between flex-shrink-0">
                        <div>
                            <h3 className="text-base font-bold text-blue-900">
                                {selectedRegion
                                    ? selectedRegion.name
                                    : 'Все МЦЗ Казахстана'}
                            </h3>
                            <p className="text-xs text-blue-500 mt-0.5">
                                {selectedRegion
                                    ? (() => {
                                        const count = youthHealthCenters.filter(c => c.region === selectedRegion.name).length;
                                        return `${count} центр${count === 1 ? '' : count < 5 ? 'а' : 'ов'} в регионе`;
                                    })()
                                    : `Всего ${youthHealthCenters.length} центров`}
                            </p>
                        </div>
                        {/* Кнопка сброса фильтра */}
                        {selectedRegion && (
                            <button
                                onClick={() => setSelectedRegion(null)}
                                className="text-xs text-blue-600 border border-blue-300 rounded-md px-2 py-1 hover:bg-blue-100 transition-colors flex-shrink-0"
                            >
                                Все регионы
                            </button>
                        )}
                    </div>

                    {/* Прокручиваемый список центров */}
                    <div className="overflow-y-auto flex-grow bg-white border border-t-0 border-gray-200 rounded-b-xl">
                        {/* Группировка по регионам */}
                        {(() => {

                            // Если регион выбран — показываем только его центры
                            if (selectedRegion) {
                                // South Kazakhstan в TopoJSON = Туркестанская обл. + г. Шымкент
                                const isSouthKaz = selectedRegion.geoName === 'South Kazakhstan';
                                const centers = isSouthKaz
                                    ? youthHealthCenters.filter(c =>
                                        c.region === 'Туркестанская область' || c.region === 'город Шымкент'
                                    )
                                    : youthHealthCenters.filter(c => c.region === selectedRegion.name);

                                if (centers.length === 0) {
                                    return (
                                        <div className="p-6 text-center text-gray-400 text-sm">
                                            Центры МЦЗ в данном регионе не найдены
                                        </div>
                                    );
                                }

                                // Если South Kazakhstan — группируем по подрегионам
                                if (isSouthKaz) {
                                    const grouped = centers.reduce((acc, c) => {
                                        if (!acc[c.region]) acc[c.region] = [];
                                        acc[c.region].push(c);
                                        return acc;
                                    }, {});
                                    return Object.entries(grouped).map(([region, grpCenters]) => (
                                        <div key={region}>
                                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{region}</span>
                                                <span className="ml-2 text-xs text-gray-400">({grpCenters.length})</span>
                                            </div>
                                            <ul className="divide-y divide-gray-100">
                                                {grpCenters.map((c) => (
                                                    <li key={c.id} className="px-4 py-3 hover:bg-blue-50 transition-colors">
                                                        <p className="text-sm font-semibold text-gray-800 leading-snug">{c.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{c.org}</p>
                                                        <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                                                            <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                            {c.address}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ));
                                }

                                return (
                                    <ul className="divide-y divide-gray-100">
                                        {centers.map((c) => (
                                            <li key={c.id} className="px-4 py-3 hover:bg-blue-50 transition-colors">
                                                {/* Название центра */}
                                                <p className="text-sm font-semibold text-gray-800 leading-snug">{c.name}</p>
                                                {/* Организация */}
                                                <p className="text-xs text-gray-500 mt-0.5">{c.org}</p>
                                                {/* Адрес */}
                                                <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                                                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {c.address}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }


                            // Иначе — показываем все центры, сгруппированные по регионам
                            const grouped = youthHealthCenters.reduce((acc, c) => {
                                if (!acc[c.region]) acc[c.region] = [];
                                acc[c.region].push(c);
                                return acc;
                            }, {});

                            return Object.entries(grouped).map(([region, centers]) => (
                                <div key={region}>
                                    {/* Заголовок региона */}
                                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{region}</span>
                                        <span className="ml-2 text-xs text-gray-400">({centers.length})</span>
                                    </div>
                                    <ul className="divide-y divide-gray-100">
                                        {centers.map((c) => (
                                            <li key={c.id} className="px-4 py-3 hover:bg-blue-50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    // Находим английский ключ по русскому названию региона
                                                    const geoKey = Object.entries(REGION_NAME_MAP).find(([, ru]) => ru === c.region)?.[0];
                                                    setSelectedRegion({
                                                        name: c.region,
                                                        geoName: geoKey || c.region,
                                                        data: REGION_DATA[geoKey] || REGION_DATA.default
                                                    });
                                                }}
                                            >
                                                {/* Название центра */}
                                                <p className="text-sm font-semibold text-gray-800 leading-snug">{c.name}</p>
                                                {/* Организация */}
                                                <p className="text-xs text-gray-500 mt-0.5">{c.org}</p>
                                                {/* Адрес */}
                                                <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                                                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {c.address}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default KazakhstanInteractiveMap;

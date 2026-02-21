import React, { useState } from 'react';
import { youthHealthCenters } from '@/Components/YouthHealthCentersMap';
import translationService from '@/Services/TranslationService';

const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

export default function YouthHealthCentersList() {
    const [activeRegion, setActiveRegion] = useState('Все');
    const [showAllCenters, setShowAllCenters] = useState(false);

    const allRegionsText = t('directionsPages.centerPrevention.youthCentersMap.allRegions', 'Все');
    const regions = [allRegionsText, ...[...new Set(youthHealthCenters.map(center => center.region))].sort()];

    const filteredCenters = activeRegion === allRegionsText || activeRegion === 'Все'
        ? youthHealthCenters
        : youthHealthCenters.filter(center => center.region === activeRegion);

    const displayedCenters = (activeRegion === allRegionsText || activeRegion === 'Все') && !showAllCenters
        ? filteredCenters.slice(0, 15)
        : filteredCenters;

    return (
        <div className="mt-8">
            <div className="bg-blue-50 p-6 mb-8 rounded-xl shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {t('directionsPages.centerPrevention.youthCentersMap.centersListTitle', 'Список молодежных центров здоровья')}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {activeRegion === allRegionsText || activeRegion === 'Все'
                                ? t('directionsPages.centerPrevention.youthCentersMap.allRegionsInKazakhstan', 'По всем регионам Казахстана')
                                : `${t('directionsPages.centerPrevention.youthCentersMap.inRegion', 'в регионе')} ${activeRegion}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            {t('directionsPages.centerPrevention.youthCentersMap.selectRegion', 'Выберите регион:')}
                        </label>
                        <select
                            value={activeRegion}
                            onChange={(e) => {
                                setActiveRegion(e.target.value);
                                setShowAllCenters(false);
                            }}
                            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t('directionsPages.centerPrevention.youthCentersMap.tableName', 'Название')}
                            </th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t('directionsPages.centerPrevention.youthCentersMap.tableOrganization', 'Организация')}
                            </th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t('directionsPages.centerPrevention.youthCentersMap.tableAddress', 'Адрес')}
                            </th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t('directionsPages.centerPrevention.youthCentersMap.tableRegion', 'Регион')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {displayedCenters.map((center, index) => (
                            <tr key={center.id} className="hover:bg-blue-50/30 transition-colors duration-150">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{center.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{center.org}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{center.address}</td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {center.region}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(activeRegion === allRegionsText || activeRegion === 'Все') && filteredCenters.length > 15 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAllCenters(!showAllCenters)}
                        className="px-8 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm inline-flex items-center gap-2"
                    >
                        {showAllCenters
                            ? t('directionsPages.centerPrevention.youthCentersMap.hide', 'Скрыть')
                            : `${t('directionsPages.centerPrevention.youthCentersMap.showAll', 'Показать все')} (${filteredCenters.length})`}
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${showAllCenters ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

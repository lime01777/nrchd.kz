import React from 'react';

/**
 * Компонент блока "Пилотные площадки"
 * Отображает список медицинских организаций, участвующих в пилотировании
 */
export default function PilotSites({ pilotSites = [], onFilterBySite }) {
    const handleViewTechnologies = (siteId, siteName) => {
        // Если есть callback для фильтрации реестра
        if (onFilterBySite) {
            onFilterBySite(siteId, siteName);
        } else {
            // Иначе просто переходим к реестру
            const registryTab = document.querySelector('[role="tab"][aria-label*="Реестр"]');
            if (registryTab) {
                registryTab.click();
            }
        }
    };

    // Подсчет количества технологий на площадке
    const getTechnologiesCount = (site) => {
        if (site.technologies_count !== undefined) {
            return site.technologies_count;
        }
        if (site.technologies) {
            // Если technologies - это строка, считаем количество через запятую
            return site.technologies.split(',').length;
        }
        return 0;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Пилотные площадки
            </h3>

            {pilotSites.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                    Пилотные площадки пока не добавлены
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pilotSites.map((site) => {
                        const techCount = getTechnologiesCount(site);
                        return (
                            <div
                                key={site.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                            >
                                <h4 className="font-semibold text-gray-800 mb-2">
                                    {site.name}
                                </h4>
                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                    {(site.city || site.region) && (
                                        <div>
                                            <strong>Город/регион:</strong>{' '}
                                            {[site.city, site.region].filter(Boolean).join(', ')}
                                        </div>
                                    )}
                                    {site.profile && (
                                        <div>
                                            <strong>Профиль:</strong> {site.profile}
                                        </div>
                                    )}
                                    {site.role && (
                                        <div>
                                            <strong>Роль:</strong> {site.role}
                                        </div>
                                    )}
                                </div>
                                {site.description && (
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                                        {site.description}
                                    </p>
                                )}
                                {site.technologies && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                            Направления пилотов:
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {site.technologies}
                                        </p>
                                    </div>
                                )}
                                {techCount > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <button
                                            onClick={() => handleViewTechnologies(site.id, site.name)}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                        >
                                            Посмотреть технологии на площадке ({techCount})
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


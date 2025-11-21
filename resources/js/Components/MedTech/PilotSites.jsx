import React from 'react';

/**
 * Компонент блока "Пилотные площадки"
 * Отображает список медицинских организаций, участвующих в пилотировании
 */
export default function PilotSites({ pilotSites = [] }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Пилотные площадки
            </h3>

            {pilotSites.length === 0 ? (
                <p className="text-gray-500 italic">
                    Пилотные площадки пока не добавлены
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pilotSites.map((site) => (
                        <div
                            key={site.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                            <h4 className="font-semibold text-gray-800 mb-2">
                                {site.name}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                                {site.city && (
                                    <div>
                                        <strong>Город:</strong> {site.city}
                                    </div>
                                )}
                                {site.region && (
                                    <div>
                                        <strong>Регион:</strong> {site.region}
                                    </div>
                                )}
                                {site.profile && (
                                    <div>
                                        <strong>Профиль:</strong> {site.profile}
                                    </div>
                                )}
                            </div>
                            {site.description && (
                                <p className="text-sm text-gray-700 mb-2">
                                    {site.description}
                                </p>
                            )}
                            {site.technologies && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-500 mb-1">
                                        Технологии/направления:
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {site.technologies}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


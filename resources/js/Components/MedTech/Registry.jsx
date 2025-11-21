import React, { useState, useMemo } from 'react';

/**
 * Компонент блока "Реестр технологий здравоохранения"
 * Отображает таблицу с возможностью сортировки и поиска
 */
export default function Registry({ registry = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTRL, setFilterTRL] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedItem, setSelectedItem] = useState(null);

    // Фильтрация и сортировка
    const filteredRegistry = useMemo(() => {
        let filtered = [...registry];

        // Поиск по названию
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Фильтр по TRL
        if (filterTRL) {
            filtered = filtered.filter((item) => item.trl === parseInt(filterTRL));
        }

        // Фильтр по статусу
        if (filterStatus) {
            filtered = filtered.filter((item) => item.status === filterStatus);
        }

        // Фильтр по области применения
        if (filterArea) {
            filtered = filtered.filter((item) => item.application_area === filterArea);
        }

        // Сортировка
        filtered.sort((a, b) => {
            let aVal = a[sortField] || '';
            let bVal = b[sortField] || '';

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [registry, searchTerm, filterTRL, filterStatus, filterArea, sortField, sortDirection]);

    // Получение уникальных значений для фильтров
    const uniqueTRLs = useMemo(() => {
        return [...new Set(registry.map((item) => item.trl).filter(Boolean))].sort();
    }, [registry]);

    const uniqueStatuses = useMemo(() => {
        return [...new Set(registry.map((item) => item.status).filter(Boolean))];
    }, [registry]);

    const uniqueAreas = useMemo(() => {
        return [...new Set(registry.map((item) => item.application_area).filter(Boolean))];
    }, [registry]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Реестр технологий здравоохранения
            </h3>

            {/* Фильтры и поиск */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Поиск по названию
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Введите название..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            TRL
                        </label>
                        <select
                            value={filterTRL}
                            onChange={(e) => setFilterTRL(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            {uniqueTRLs.map((trl) => (
                                <option key={trl} value={trl}>
                                    {trl}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Статус
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Область применения
                        </label>
                        <select
                            value={filterArea}
                            onChange={(e) => setFilterArea(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            {uniqueAreas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Таблица */}
            {filteredRegistry.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                    Технологии не найдены
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('name')}
                                >
                                    Название{' '}
                                    {sortField === 'name' && (
                                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Тип
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Область применения
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('trl')}
                                >
                                    TRL{' '}
                                    {sortField === 'trl' && (
                                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Статус
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Разработчик
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRegistry.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {item.type || '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {item.application_area || '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {item.trl || '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                            {item.status || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {item.developer || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно с деталями */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-semibold text-gray-800">
                                {selectedItem.name}
                            </h4>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            {selectedItem.description && (
                                <div>
                                    <strong>Описание:</strong>
                                    <p className="text-gray-700 mt-1">{selectedItem.description}</p>
                                </div>
                            )}
                            {selectedItem.full_description && (
                                <div>
                                    <strong>Полное описание:</strong>
                                    <p className="text-gray-700 mt-1">{selectedItem.full_description}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Тип:</strong> {selectedItem.type || '-'}
                                </div>
                                <div>
                                    <strong>TRL:</strong> {selectedItem.trl || '-'}
                                </div>
                                <div>
                                    <strong>Статус:</strong> {selectedItem.status || '-'}
                                </div>
                                <div>
                                    <strong>Область применения:</strong> {selectedItem.application_area || '-'}
                                </div>
                            </div>
                            {selectedItem.developer && (
                                <div>
                                    <strong>Разработчик:</strong> {selectedItem.developer}
                                </div>
                            )}
                            {selectedItem.pilot_sites && (
                                <div>
                                    <strong>Пилотные площадки:</strong>
                                    <p className="text-gray-700 mt-1">{selectedItem.pilot_sites}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


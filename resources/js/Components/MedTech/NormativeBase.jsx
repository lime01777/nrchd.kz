import React, { useState, useMemo } from 'react';

/**
 * Компонент блока "Нормативная база платформы MedTech"
 * Отображает таблицу нормативных и методических документов с фильтрацией
 */
export default function NormativeBase({ documents = [] }) {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [showAll, setShowAll] = useState(false);

    // Получаем уникальные типы документов для фильтра
    const uniqueTypes = useMemo(() => {
        return [...new Set(documents.map(doc => doc.type).filter(Boolean))];
    }, [documents]);

    // Фильтрация документов
    const filteredDocuments = useMemo(() => {
        let filtered = [...documents];
        
        if (filterType) {
            filtered = filtered.filter(doc => doc.type === filterType);
        }
        
        // Если не показывать все, ограничиваем до 10
        if (!showAll && filtered.length > 10) {
            filtered = filtered.slice(0, 10);
        }
        
        return filtered;
    }, [documents, filterType, showAll]);

    // Получаем год из даты создания или используем текущий год
    const getYear = (doc) => {
        if (doc.year) return doc.year;
        if (doc.created_at) {
            return new Date(doc.created_at).getFullYear();
        }
        return new Date().getFullYear();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Нормативная база платформы MedTech
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    Официальные документы, регулирующие медицинские технологии и их внедрение
                </p>
            </div>

            {documents.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                    Документы пока не добавлены
                </p>
            ) : (
                <>
                    {/* Фильтр по типу */}
                    <div className="flex items-center gap-4 mb-4">
                        <label className="text-sm font-medium text-gray-700">
                            Фильтр по типу:
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все типы</option>
                            {uniqueTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Таблица документов */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Тип документа
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Название
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Краткое описание
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Год
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Файл
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDocuments.map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {doc.type && (
                                                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                    {doc.type}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedDoc(doc)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                                            >
                                                {doc.title}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {doc.description || '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {getYear(doc)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {doc.file_url ? (
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    Скачать PDF
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Кнопка "Показать все документы" */}
                    {!showAll && documents.length > 10 && (
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowAll(true)}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Показать все документы
                            </button>
                        </div>
                    )}

                    {/* Модальное окно с деталями документа */}
                    {selectedDoc && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedDoc(null)}
                        >
                            <div
                                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        {selectedDoc.type && (
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mb-2">
                                                {selectedDoc.type}
                                            </span>
                                        )}
                                        <h4 className="text-xl font-semibold text-gray-800 mt-2">
                                            {selectedDoc.title}
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDoc(null)}
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
                                    {selectedDoc.description && (
                                        <div>
                                            <strong className="text-gray-700">Описание:</strong>
                                            <p className="text-gray-600 mt-1 leading-relaxed">
                                                {selectedDoc.description}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div>
                                            <strong>Год:</strong> {getYear(selectedDoc)}
                                        </div>
                                        {selectedDoc.file_url && (
                                            <a
                                                href={selectedDoc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                Скачать PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


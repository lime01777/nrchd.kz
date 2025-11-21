import React from 'react';

/**
 * Компонент блока "Нормативная база"
 * Отображает список нормативных и методических документов
 */
export default function NormativeBase({ documents = [] }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Нормативная база
            </h3>

            {documents.length === 0 ? (
                <p className="text-gray-500 italic">
                    Документы пока не добавлены
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="mb-2">
                                {doc.type && (
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                        {doc.type}
                                    </span>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                                {doc.title}
                            </h4>
                            {doc.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {doc.description}
                                </p>
                            )}
                            {doc.file_url && (
                                <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
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
                                    Скачать
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


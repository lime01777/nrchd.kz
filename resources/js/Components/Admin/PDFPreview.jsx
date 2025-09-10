import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function PDFPreview({ document, onClose }) {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                    {/* Заголовок */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            {document.name}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-1 p-4">
                        <div className="w-full h-full min-h-[600px] border border-gray-300 rounded-lg overflow-hidden">
                            <iframe
                                src={`${document.url}#toolbar=1&navpanes=1&scrollbar=1`}
                                className="w-full h-full"
                                title={document.name}
                            />
                        </div>
                    </div>

                    {/* Информация о файле */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                                <span>Размер: {(document.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span>•</span>
                                <span>Изменен: {new Date(document.modified).toLocaleString()}</span>
                            </div>
                            <a
                                href={document.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Открыть в новой вкладке
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

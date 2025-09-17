import React from 'react';
import { XMarkIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function FilePreview({ document, onClose }) {
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (extension) => {
        switch (extension.toLowerCase()) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📋';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            default:
                return '📄';
        }
    };

    const canPreview = (extension) => {
        const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
        return previewableTypes.includes(extension.toLowerCase());
    };

    const renderPreview = () => {
        const extension = document.extension?.toLowerCase();
        
        if (extension === 'pdf') {
            return (
                <iframe
                    src={`${document.url}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full"
                    title={document.name}
                />
            );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <img
                    src={document.url}
                    alt={document.name}
                    className="w-full h-full object-contain"
                />
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <DocumentIcon className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Предпросмотр недоступен</p>
                    <p className="text-sm">Файл типа .{extension} не может быть предпросмотрен</p>
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                    {/* Заголовок */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getFileIcon(document.extension)}</span>
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                {document.name}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 p-4">
                        <div className="w-full h-full min-h-[600px] border border-gray-300 rounded-lg overflow-hidden">
                            {renderPreview()}
                        </div>
                    </div>

                    {/* Информация о файле */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                                <span>Размер: {formatFileSize(document.size)}</span>
                                <span>•</span>
                                <span>Изменен: {new Date(document.modified).toLocaleString()}</span>
                                {document.year && (
                                    <>
                                        <span>•</span>
                                        <span>Год: {document.year}</span>
                                    </>
                                )}
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
                        {(document.medicine || document.mkb) && (
                            <div className="flex items-center space-x-4 text-xs text-blue-600 mt-2">
                                {document.medicine && (
                                    <span className="bg-blue-100 px-2 py-1 rounded">
                                        {document.medicine}
                                    </span>
                                )}
                                {document.mkb && (
                                    <span className="bg-green-100 px-2 py-1 rounded">
                                        МКБ: {document.mkb}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

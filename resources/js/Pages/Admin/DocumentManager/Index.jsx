import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DocumentBrowser from '@/Components/Admin/DocumentBrowser';
import FilePreview from '@/Components/Admin/PDFPreview';

export default function DocumentManagerIndex({ user, allowedFolders }) {
    const [currentFolder, setCurrentFolder] = useState('Клинические протоколы');
    const [documents, setDocuments] = useState([]);
    const [directories, setDirectories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [filters, setFilters] = useState({});

    // Загружаем документы при изменении папки или фильтров
    useEffect(() => {
        loadDocuments(currentFolder, filters);
    }, [currentFolder, filters]);

    const loadDocuments = async (folder, currentFilters = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            // Строим URL с параметрами фильтрации
            const params = new URLSearchParams();
            params.append('folder', folder);
            
            if (currentFilters.search) params.append('search', currentFilters.search);
            if (currentFilters.medicine) params.append('medicine', currentFilters.medicine);
            if (currentFilters.mkb) params.append('mkb', currentFilters.mkb);
            if (currentFilters.year) params.append('year', currentFilters.year);
            if (currentFilters.category) params.append('category', currentFilters.category);
            
            const response = await fetch(`/admin/document-manager/documents?${params.toString()}`);
            const data = await response.json();
            
            if (response.ok) {
                setDocuments(data.documents || []);
                setDirectories(data.directories || []);
            } else {
                setError(data.error || 'Ошибка при загрузке документов');
            }
        } catch (err) {
            setError('Ошибка сети при загрузке документов');
        } finally {
            setLoading(false);
        }
    };

    const handleFolderChange = (folder) => {
        setCurrentFolder(folder);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleDocumentSelect = (document) => {
        const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
        if (previewableTypes.includes(document.extension?.toLowerCase())) {
            setSelectedDocument(document);
            setShowPreview(true);
        }
    };

    const handleRename = async (item, newName) => {
        try {
            const response = await fetch('/admin/document-manager/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    currentPath: item.path,
                    newName: newName,
                    type: item.type
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Перезагружаем документы
                loadDocuments(currentFolder);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (err) {
            return { success: false, message: 'Ошибка сети' };
        }
    };

    const handleMove = async (item, newPath) => {
        try {
            const response = await fetch('/admin/document-manager/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    currentPath: item.path,
                    newPath: newPath,
                    type: item.type
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Перезагружаем документы
                loadDocuments(currentFolder);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (err) {
            return { success: false, message: 'Ошибка сети' };
        }
    };

    const handleDelete = async (item) => {
        if (!confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
            return { success: false, message: 'Отменено пользователем' };
        }

        try {
            const response = await fetch('/admin/document-manager/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    path: item.path,
                    type: item.type
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Перезагружаем документы
                loadDocuments(currentFolder);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (err) {
            return { success: false, message: 'Ошибка сети' };
        }
    };

    return (
        <>
            <Head title="Управление документами" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Управление документами
                                </h1>
                                <div className="text-sm text-gray-600">
                                    Пользователь: {user.name} ({user.email})
                                </div>
                            </div>

                            {/* Навигация по папкам */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {allowedFolders.map((folder) => (
                                        <button
                                            key={folder}
                                            onClick={() => handleFolderChange(folder)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                currentFolder === folder
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {folder}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Сообщение об ошибке */}
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                    <strong className="font-bold">Ошибка!</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            )}

                            {/* Браузер документов */}
                            <DocumentBrowser
                                documents={documents}
                                directories={directories}
                                currentPath={currentFolder}
                                loading={loading}
                                onDocumentSelect={handleDocumentSelect}
                                onRename={handleRename}
                                onMove={handleMove}
                                onDelete={handleDelete}
                                onFolderChange={handleFolderChange}
                                onFiltersChange={handleFiltersChange}
                                filters={filters}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно предпросмотра файлов */}
            {showPreview && selectedDocument && (
                <FilePreview
                    document={selectedDocument}
                    onClose={() => {
                        setShowPreview(false);
                        setSelectedDocument(null);
                    }}
                />
            )}
        </>
    );
}

DocumentManagerIndex.layout = page => <AdminLayout>{page}</AdminLayout>;

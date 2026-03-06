import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DocumentBrowser from '@/Components/Admin/DocumentBrowser';
import FilePreview from '@/Components/Admin/PDFPreview';

export default function DocumentManagerIndex({ user, allowedFolders, canEdit }) {
    const defaultFolder = allowedFolders.length > 0 ? allowedFolders[0] : 'Клинические протоколы';
    const [currentFolder, setCurrentFolder] = useState(defaultFolder);
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

            const response = await fetch(`/admin/documents/list?${params.toString()}`);
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
            const response = await fetch('/admin/documents/rename', {
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
            const response = await fetch('/admin/documents/move', {
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

    const handleBulkMove = async (items, newPath) => {
        try {
            const response = await fetch('/admin/documents/bulk-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    items: items,
                    newPath: newPath
                })
            });

            const data = await response.json();

            if (response.ok || response.status === 207) {
                // Перезагружаем документы
                loadDocuments(currentFolder);
                return { success: true, message: data.message || data.error };
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
            const response = await fetch('/admin/documents/delete', {
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

    const handleCreateFolder = async (folderName) => {
        try {
            const response = await fetch('/admin/documents/create-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    currentPath: currentFolder,
                    folderName: folderName
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

    const handleUploadFile = async (files) => {
        try {
            const formData = new FormData();
            formData.append('currentPath', currentFolder);

            // Если передан массив файлов (например, из Drag & Drop)
            Array.from(files).forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await fetch('/admin/documents/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    // Важно: Content-Type не ставим, fetch сам установит multipart/form-data и границы
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Перезагружаем документы
                loadDocuments(currentFolder);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error || 'Ошибка при загрузке' };
            }
        } catch (err) {
            return { success: false, message: 'Ошибка сети при загрузке' };
        }
    };

    return (
        <>
            <Head title="Менеджер файлов" />

            <div className="py-8 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Файловый менеджер (Документы)
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Управление файлами для: {user.name} ({user.email})
                            </p>
                        </div>
                    </div>

                    {/* Navigation tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto custom-scrollbar">
                            {allowedFolders.map((folder) => (
                                <button
                                    key={folder}
                                    onClick={() => handleFolderChange(folder)}
                                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${currentFolder === folder
                                        ? 'border-blue-500 text-blue-700 bg-white'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
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
                        onRename={canEdit ? handleRename : undefined}
                        onMove={canEdit ? handleMove : undefined}
                        onBulkMove={canEdit ? handleBulkMove : undefined}
                        onDelete={canEdit ? handleDelete : undefined}
                        onFolderChange={handleFolderChange}
                        onCreateFolder={canEdit ? handleCreateFolder : undefined}
                        onUploadFile={canEdit ? handleUploadFile : undefined}
                        allowedFolders={allowedFolders}
                        onFiltersChange={handleFiltersChange}
                        filters={filters}
                    />
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

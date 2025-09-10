import React, { useState } from 'react';
import { 
    DocumentIcon, 
    FolderIcon, 
    PencilIcon, 
    TrashIcon, 
    ArrowRightIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function DocumentBrowser({ 
    documents, 
    directories, 
    currentPath, 
    loading, 
    onDocumentSelect, 
    onRename, 
    onMove, 
    onDelete,
    onFolderChange 
}) {
    const [editingItem, setEditingItem] = useState(null);
    const [newName, setNewName] = useState('');
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [moveTarget, setMoveTarget] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const handleRename = (item) => {
        setEditingItem(item);
        setNewName(item.name);
    };

    const handleRenameSubmit = async () => {
        if (!newName.trim()) return;
        
        const result = await onRename(editingItem, newName.trim());
        
        if (result.success) {
            setEditingItem(null);
            setNewName('');
        } else {
            alert(result.message);
        }
    };

    const handleMove = (item) => {
        setSelectedItem(item);
        setShowMoveModal(true);
    };

    const handleMoveSubmit = async () => {
        if (!moveTarget.trim()) return;
        
        const newPath = moveTarget.trim();
        const result = await onMove(selectedItem, newPath);
        
        if (result.success) {
            setShowMoveModal(false);
            setSelectedItem(null);
            setMoveTarget('');
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (item) => {
        const result = await onDelete(item);
        if (!result.success) {
            alert(result.message);
        }
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Загрузка...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Текущий путь */}
            <div className="flex items-center text-sm text-gray-600">
                <span>Текущая папка:</span>
                <span className="ml-2 font-medium text-gray-900">{currentPath}</span>
            </div>

            {/* Папки */}
            {directories.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Папки</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {directories.map((dir) => (
                            <div
                                key={dir.path}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                                onClick={() => onFolderChange(currentPath + '/' + dir.name)}
                            >
                                <FolderIcon className="h-8 w-8 text-blue-500 mr-3" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {dir.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Изменен: {new Date(dir.modified).toLocaleDateString()}
                                    </p>
                                </div>
                                <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Документы */}
            {documents.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Документы</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <li key={doc.path} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <span className="text-2xl mr-3">
                                                {getFileIcon(doc.extension)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                {editingItem?.path === doc.path ? (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit()}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={handleRenameSubmit}
                                                            className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingItem(null)}
                                                            className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {doc.name}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>{formatFileSize(doc.size)}</span>
                                                    <span>•</span>
                                                    <span>Изменен: {new Date(doc.modified).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {doc.extension === 'pdf' && (
                                                <button
                                                    onClick={() => onDocumentSelect(doc)}
                                                    className="p-2 text-gray-400 hover:text-blue-600"
                                                    title="Предпросмотр"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRename(doc)}
                                                className="p-2 text-gray-400 hover:text-yellow-600"
                                                title="Переименовать"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMove(doc)}
                                                className="p-2 text-gray-400 hover:text-blue-600"
                                                title="Переместить"
                                            >
                                                <ArrowRightIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                                title="Удалить"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Пустое состояние */}
            {documents.length === 0 && directories.length === 0 && (
                <div className="text-center py-12">
                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Нет документов</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        В этой папке пока нет документов или папок.
                    </p>
                </div>
            )}

            {/* Модальное окно перемещения */}
            {showMoveModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Переместить "{selectedItem?.name}"
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Новый путь:
                                </label>
                                <input
                                    type="text"
                                    value={moveTarget}
                                    onChange={(e) => setMoveTarget(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Например: Клинические протоколы/Новая папка/файл.pdf"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowMoveModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleMoveSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Переместить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

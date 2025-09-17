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
    onFolderChange,
    onFiltersChange,
    filters = {}
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

    // Разделы медицины
    const medicineSections = [
        { value: '', label: 'Все разделы медицины' },
        { value: 'cardiology', label: 'Кардиология' },
        { value: 'neurology', label: 'Неврология' },
        { value: 'oncology', label: 'Онкология' },
        { value: 'pediatrics', label: 'Педиатрия' },
        { value: 'surgery', label: 'Хирургия' },
        { value: 'gastroenterology', label: 'Гастроэнтерология' },
        { value: 'pulmonology', label: 'Пульмонология' },
        { value: 'endocrinology', label: 'Эндокринология' },
        { value: 'urology', label: 'Урология' },
        { value: 'ophthalmology', label: 'Офтальмология' },
        { value: 'otolaryngology', label: 'Оториноларингология' },
        { value: 'dermatology', label: 'Дерматология' },
        { value: 'infectious', label: 'Инфекционные болезни' },
        { value: 'psychiatry', label: 'Психиатрия' },
        { value: 'rheumatology', label: 'Ревматология' },
        { value: 'traumatology', label: 'Травматология и ортопедия' }
    ];

    // Категории МКБ
    const mkbCategories = [
        { value: '', label: 'Все категории МКБ' },
        { value: 'A00-B99', label: 'A00-B99 Инфекционные и паразитарные болезни' },
        { value: 'C00-D48', label: 'C00-D48 Новообразования' },
        { value: 'D50-D89', label: 'D50-D89 Болезни крови и кроветворных органов' },
        { value: 'E00-E90', label: 'E00-E90 Болезни эндокринной системы' },
        { value: 'F01-F99', label: 'F01-F99 Психические расстройства' },
        { value: 'G00-G99', label: 'G00-G99 Болезни нервной системы' },
        { value: 'H00-H59', label: 'H00-H59 Болезни глаза' },
        { value: 'H60-H95', label: 'H60-H95 Болезни уха' },
        { value: 'I00-I99', label: 'I00-I99 Болезни системы кровообращения' },
        { value: 'J00-J99', label: 'J00-J99 Болезни органов дыхания' },
        { value: 'K00-K93', label: 'K00-K93 Болезни органов пищеварения' },
        { value: 'L00-L99', label: 'L00-L99 Болезни кожи' },
        { value: 'M00-M99', label: 'M00-M99 Болезни костно-мышечной системы' },
        { value: 'N00-N99', label: 'N00-N99 Болезни мочеполовой системы' },
        { value: 'O00-O99', label: 'O00-O99 Беременность, роды и послеродовой период' },
        { value: 'P00-P96', label: 'P00-P96 Отдельные состояния, возникающие в перинатальном периоде' },
        { value: 'Q00-Q99', label: 'Q00-Q99 Врожденные аномалии' },
        { value: 'R00-R99', label: 'R00-R99 Симптомы, признаки и отклонения от нормы' },
        { value: 'S00-T98', label: 'S00-T98 Травмы, отравления и другие последствия воздействия внешних причин' },
        { value: 'U00-U99', label: 'U00-U99 Коды для особых целей' },
        { value: 'V01-Y98', label: 'V01-Y98 Внешние причины заболеваемости и смертности' },
        { value: 'Z00-Z99', label: 'Z00-Z99 Факторы, влияющие на состояние здоровья' }
    ];

    // Годы (последние 10 лет)
    const currentYear = new Date().getFullYear();
    const years = [
        { value: '', label: 'Все годы' },
        ...Array.from({ length: 10 }, (_, i) => ({
            value: (currentYear - i).toString(),
            label: (currentYear - i).toString()
        }))
    ];

    const handleFilterChange = (filterType, value) => {
        if (onFiltersChange) {
            onFiltersChange({
                ...filters,
                [filterType]: value
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Текущий путь */}
            <div className="flex items-center text-sm text-gray-600">
                <span>Текущая папка:</span>
                <span className="ml-2 font-medium text-gray-900">{currentPath}</span>
            </div>

            {/* Фильтры */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Фильтры</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Поиск */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
                        <input
                            type="text"
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Поиск по названию"
                        />
                    </div>

                    {/* Раздел медицины */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Раздел медицины</label>
                        <select
                            value={filters.medicine || ''}
                            onChange={(e) => handleFilterChange('medicine', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {medicineSections.map((section) => (
                                <option key={section.value} value={section.value}>{section.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Категория МКБ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Категория МКБ</label>
                        <select
                            value={filters.mkb || ''}
                            onChange={(e) => handleFilterChange('mkb', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {mkbCategories.map((mkb) => (
                                <option key={mkb.value} value={mkb.value}>{mkb.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Год */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Год</label>
                        <select
                            value={filters.year || ''}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {years.map((year) => (
                                <option key={year.value} value={year.value}>{year.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Кнопка сброса фильтров */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onFiltersChange && onFiltersChange({})}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Сбросить фильтры
                    </button>
                </div>
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
                                                    {doc.year && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Год: {doc.year}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {(doc.medicine || doc.mkb) && (
                                                    <div className="flex items-center space-x-4 text-xs text-blue-600 mt-1">
                                                        {doc.medicine && (
                                                            <span className="bg-blue-100 px-2 py-1 rounded">
                                                                {doc.medicine}
                                                            </span>
                                                        )}
                                                        {doc.mkb && (
                                                            <span className="bg-green-100 px-2 py-1 rounded">
                                                                МКБ: {doc.mkb}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(doc.extension?.toLowerCase()) && (
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

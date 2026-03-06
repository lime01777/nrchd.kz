import React, { useState } from 'react';
import {
    DocumentIcon,
    FolderIcon,
    PencilIcon,
    TrashIcon,
    ArrowRightIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import FolderTreePicker from '@/Components/Admin/FolderTreePicker';

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
    onCreateFolder,
    onBulkMove,
    allowedFolders = [],
    onFiltersChange,
    filters = {}
}) {
    const [editingItem, setEditingItem] = useState(null);
    const [newName, setNewName] = useState('');
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [showBulkMoveModal, setShowBulkMoveModal] = useState(false);
    const [bulkMoveTarget, setBulkMoveTarget] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [moveTarget, setMoveTarget] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    // Множественный выбор: храним path и type
    const [selectedItems, setSelectedItems] = useState([]);

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

    const handleCreateFolderSubmit = async () => {
        if (!newFolderName.trim() || !onCreateFolder) return;

        const result = await onCreateFolder(newFolderName.trim());
        if (result.success) {
            setShowCreateFolderModal(false);
            setNewFolderName('');
        } else {
            alert(result.message);
        }
    };

    const isRootFolder = allowedFolders.includes(currentPath);

    const handleGoBack = () => {
        if (isRootFolder) return;
        const parts = currentPath.split('/');
        parts.pop();
        const parentPath = parts.join('/');
        onFolderChange(parentPath || '');
    };

    // ---- Множественный выбор ----
    const isSelected = (path) => selectedItems.some(i => i.path === path);

    const toggleItem = (path, type) => {
        setSelectedItems(prev =>
            isSelected(path) ? prev.filter(i => i.path !== path) : [...prev, { path, type }]
        );
    };

    const toggleAll = () => {
        const allItems = [
            ...directories.map(d => ({ path: d.path, type: 'directory' })),
            ...documents.map(d => ({ path: d.path, type: 'file' }))
        ];
        if (selectedItems.length === allItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(allItems);
        }
    };

    const allSelected = (directories.length + documents.length) > 0 &&
        selectedItems.length === (directories.length + documents.length);

    const handleBulkMoveSubmit = async (targetPath) => {
        if (!targetPath || !onBulkMove) return;

        // item.path — это путь относительно currentPath (или просто имя файла).
        // Нужно собрать полный путь от корня storage, добавляя currentPath как префикс.
        const itemsWithFullPaths = selectedItems.map(item => ({
            ...item,
            // Если path уже содержит '/', значит он относительно currentPath (подпапка)
            // Если нет — это файл в корне текущей папки
            path: item.path.includes(currentPath)
                ? item.path                              // уже полный
                : currentPath + '/' + item.path         // добавляем текущий путь
        }));

        const result = await onBulkMove(itemsWithFullPaths, targetPath);
        if (result.success) {
            setShowBulkMoveModal(false);
            setSelectedItems([]);
        }
        alert(result.message);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (extension) => {
        switch (extension?.toLowerCase()) {
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

    const getStatusBadge = (status) => {
        if (!status) return null;
        const map = {
            'Ознакомление': 'bg-blue-100 text-blue-800 border-blue-200',
            'Заседание': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Доработка': 'bg-orange-100 text-orange-800 border-orange-200',
            'Одобрен': 'bg-green-100 text-green-800 border-green-200',
            'На публикацию': 'bg-purple-100 text-purple-800 border-purple-200',
        };
        const c = map[status] || 'bg-gray-100 text-gray-800 border-gray-200';
        return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${c} ml-2 whitespace-nowrap`}>{status}</span>;
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
            {/* Текущий путь (Breadcrumbs) и Управление */}
            <div className="flex items-center justify-between bg-white border border-slate-200 shadow-sm rounded-lg px-4 py-3">
                <div className="flex items-center text-sm text-slate-600">
                    {!isRootFolder && (
                        <button
                            onClick={handleGoBack}
                            className="mr-3 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Назад"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <span className="font-medium mr-2 text-slate-400 border-r border-slate-200 pr-3">Путь</span>
                    <span className="font-bold text-slate-800 ml-1">{currentPath}</span>
                </div>

                {/* Панель массовых действий */}
                {selectedItems.length > 0 && (
                    <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                className="h-4 w-4 rounded text-indigo-600"
                            />
                            <span className="text-sm font-bold text-indigo-700">
                                Выбрано: {selectedItems.length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {onBulkMove && (
                                <button
                                    onClick={() => setShowBulkMoveModal(true)}
                                    className="flex items-center text-sm font-bold bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <ArrowRightIcon className="w-4 h-4 mr-1.5" />
                                    Переместить
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedItems([])}
                                className="text-sm font-bold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                )}
                {onCreateFolder && (
                    <button
                        onClick={() => setShowCreateFolderModal(true)}
                        className="flex items-center text-sm font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                        <FolderIcon className="w-4 h-4 mr-1.5" />
                        Новая папка
                    </button>
                )}
            </div>

            {/* Фильтры */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фильтр документов
                    </h3>
                    <button
                        onClick={() => onFiltersChange && onFiltersChange({})}
                        className="text-xs font-bold px-3 py-1.5 bg-slate-200 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-300 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        Сбросить всё
                    </button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* Поиск */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название</label>
                        <input
                            type="text"
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                            placeholder="Поиск файла..."
                        />
                    </div>

                    {/* Раздел медицины */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Раздел медицины</label>
                        <select
                            value={filters.medicine || ''}
                            onChange={(e) => handleFilterChange('medicine', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                        >
                            {medicineSections.map((section) => (
                                <option key={section.value} value={section.value}>{section.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Категория МКБ */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">МКБ-10</label>
                        <select
                            value={filters.mkb || ''}
                            onChange={(e) => handleFilterChange('mkb', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                        >
                            {mkbCategories.map((mkb) => (
                                <option key={mkb.value} value={mkb.value}>{mkb.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Год */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Год выпуска</label>
                        <select
                            value={filters.year || ''}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                        >
                            {years.map((year) => (
                                <option key={year.value} value={year.value}>{year.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Папки */}
            {directories.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Дочерние папки</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {directories.map((dir) => (
                            <div
                                key={dir.path}
                                className={`relative flex items-center p-4 bg-white border shadow-sm rounded-xl hover:shadow-md transition-all group active:scale-95 cursor-pointer ${isSelected(dir.path)
                                    ? 'border-indigo-400 bg-indigo-50'
                                    : 'border-slate-200 hover:border-indigo-300'
                                    }`}
                                onClick={() => onFolderChange(currentPath + '/' + dir.name)}
                            >
                                {/* Чекбокс выбора */}
                                <div
                                    className="absolute top-2 left-2 z-10"
                                    onClick={(e) => { e.stopPropagation(); toggleItem(dir.path, 'directory'); }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected(dir.path)}
                                        onChange={() => { }}
                                        className="h-4 w-4 rounded text-indigo-600 cursor-pointer"
                                    />
                                </div>
                                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors mr-4 shadow-sm ml-5">
                                    <FolderIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                {dir.name}
                                            </p>
                                            {dir.okk_status && getStatusBadge(dir.okk_status)}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(dir.modified).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {dir.okk_status === 'Заседание' && dir.okk_project_id && (
                                        <Link
                                            href={`/admin/okk-projects/${dir.okk_project_id}/vote`}
                                            className="mt-3 block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors opacity-90 hover:opacity-100"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Начать голосование
                                        </Link>
                                    )}
                                </div>
                                <div className="flex flex-col items-center space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    {onRename && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRename(dir); }}
                                            className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 rounded-md shadow-sm transition-colors"
                                            title="Переименовать"
                                        >
                                            <PencilIcon className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {onMove && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMove(dir); }}
                                            className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-md shadow-sm transition-colors"
                                            title="Переместить"
                                        >
                                            <ArrowRightIcon className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(dir); }}
                                            className="p-1.5 bg-white border border-rose-100 text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-md shadow-sm transition-colors"
                                            title="Удалить"
                                        >
                                            <TrashIcon className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Документы */}
            {documents.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4 px-1">Файлы ({documents.length})</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <ul className="divide-y divide-slate-100">
                            {documents.map((doc) => (
                                <li key={doc.path} className={`px-5 py-4 hover:bg-slate-50 transition-colors group ${isSelected(doc.path) ? 'bg-indigo-50' : ''
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-1 min-w-0 pr-4">
                                            {/* Чекбокс */}
                                            <div
                                                className="flex-shrink-0 mr-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(doc.path)}
                                                    onChange={() => toggleItem(doc.path, 'file')}
                                                    className="h-4 w-4 rounded text-indigo-600 cursor-pointer"
                                                />
                                            </div>
                                            <div className="text-2xl mr-4 flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg shadow-sm border border-slate-200/60">
                                                {getFileIcon(doc.extension)}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                {editingItem?.path === doc.path ? (
                                                    <div className="flex items-center space-x-2 -ml-1">
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            className="flex-1 px-3 py-1.5 border-2 border-indigo-400 rounded-md text-sm font-bold shadow-sm focus:ring-0 focus:border-indigo-500 w-full"
                                                            onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit()}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={handleRenameSubmit}
                                                            className="px-3 py-2 bg-emerald-500 text-white rounded-md text-xs font-bold shadow-sm hover:bg-emerald-600 hover:shadow transition-all"
                                                        >
                                                            ОК
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingItem(null)}
                                                            className="px-3 py-2 bg-slate-500 text-white rounded-md text-xs font-bold shadow-sm hover:bg-slate-600 hover:shadow transition-all"
                                                        >
                                                            Отмена
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-800 block truncate" title={doc.name}>
                                                        {doc.name}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap items-center text-[11px] font-medium text-slate-500 mt-1.5 gap-2">
                                                    <div className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200/60 shadow-sm">{formatFileSize(doc.size)}</div>
                                                    <div className="flex items-center text-slate-400">
                                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {new Date(doc.modified).toLocaleDateString()}
                                                    </div>
                                                    {doc.year && (
                                                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">{doc.year} год</span>
                                                    )}
                                                </div>

                                                {(doc.medicine || doc.mkb) && (
                                                    <div className="flex items-center space-x-2 text-xs font-bold mt-2">
                                                        {doc.medicine && (
                                                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100 shadow-sm">
                                                                {doc.medicine}
                                                            </span>
                                                        )}
                                                        {doc.mkb && (
                                                            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100 shadow-sm">
                                                                {doc.mkb}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(doc.extension?.toLowerCase()) && (
                                                <button
                                                    onClick={() => onDocumentSelect(doc)}
                                                    className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg shadow-sm transition-colors"
                                                    title="Предпросмотр"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            {/* Кнопка скачать — доступна для всех файлов */}
                                            <a
                                                href={doc.url}
                                                download={doc.name}
                                                className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg shadow-sm transition-colors"
                                                title="Скачать"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                            {onRename && (
                                                <button
                                                    onClick={() => handleRename(doc)}
                                                    className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 rounded-lg shadow-sm transition-colors"
                                                    title="Переименовать"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => handleDelete(doc)}
                                                    className="p-2 bg-white border border-rose-100 text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-lg shadow-sm transition-colors"
                                                    title="Удалить"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
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
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative mx-auto border border-slate-200 w-full max-w-md shadow-2xl rounded-2xl bg-white p-6">
                        <div className="mb-5">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                Переместить файл
                            </h3>
                            <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 break-all shadow-inner">
                                {selectedItem?.name}
                            </p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Новый путь (папка)
                            </label>
                            <input
                                type="text"
                                value={moveTarget}
                                onChange={(e) => setMoveTarget(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                placeholder="Путь/Для/Файла"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowMoveModal(false)}
                                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-colors active:scale-95"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleMoveSubmit}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors active:scale-95"
                            >
                                Переместить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно создания папки */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative mx-auto border border-slate-200 w-full max-w-md shadow-2xl rounded-2xl bg-white p-6">
                        <div className="mb-5">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                Создать новую папку
                            </h3>
                            <p className="text-sm text-slate-500">
                                В текущей папке: <span className="font-bold">{currentPath}</span>
                            </p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Название папки
                            </label>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                placeholder="Новая папка"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolderSubmit()}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCreateFolderModal(false);
                                    setNewFolderName('');
                                }}
                                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-colors active:scale-95"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleCreateFolderSubmit}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors active:scale-95"
                                disabled={!newFolderName.trim()}
                            >
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Дерево папок для массового перемещения */}
            {showBulkMoveModal && (
                <FolderTreePicker
                    onConfirm={(path) => handleBulkMoveSubmit(path)}
                    onClose={() => setShowBulkMoveModal(false)}
                />
            )}
        </div>
    );
}

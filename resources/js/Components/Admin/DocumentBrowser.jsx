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
            {/* Текущий путь (Breadcrumbs) */}
            <div className="flex items-center text-sm bg-white border border-slate-200 shadow-sm rounded-lg px-4 py-3 text-slate-600">
                <span className="font-medium mr-2 text-slate-400 border-r border-slate-200 pr-3">Путь</span>
                <span className="font-bold text-slate-800 ml-1">{currentPath}</span>
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
                                className="flex items-center p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group active:scale-95"
                                onClick={() => onFolderChange(currentPath + '/' + dir.name)}
                            >
                                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors mr-4 shadow-sm">
                                    <FolderIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                        {dir.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(dir.modified).toLocaleDateString()}
                                    </p>
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
                                <li key={doc.path} className="px-5 py-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-1 min-w-0 pr-4">
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
                                            <button
                                                onClick={() => handleRename(doc)}
                                                className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 rounded-lg shadow-sm transition-colors"
                                                title="Переименовать"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMove(doc)}
                                                className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-lg shadow-sm transition-colors"
                                                title="Переместить"
                                            >
                                                <ArrowRightIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="p-2 bg-white border border-rose-100 text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-lg shadow-sm transition-colors"
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
        </div>
    );
}

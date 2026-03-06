import React, { useState, useEffect } from 'react';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

/**
 * Рекурсивный узел дерева папок
 */
function TreeNode({ node, selectedPath, onSelect, depth = 0 }) {
    const [open, setOpen] = useState(depth < 1);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedPath === node.path;

    return (
        <div>
            <div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer select-none group transition-colors ${isSelected
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                style={{ paddingLeft: `${8 + depth * 18}px` }}
                onClick={() => onSelect(node.path)}
            >
                {/* Кнопка для раскрытия/скрытия вложенных папок */}
                <span
                    className="w-4 h-4 flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) setOpen(!open);
                    }}
                >
                    {hasChildren ? (
                        open
                            ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                            : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                        <span className="w-3.5 h-3.5 block" />
                    )}
                </span>

                {/* Иконка папки */}
                {open && hasChildren
                    ? <FolderOpenIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    : <FolderIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                }

                {/* Название папки */}
                <span className="text-sm font-medium truncate">{node.name}</span>
            </div>

            {/* Дочерние узлы */}
            {open && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.path}
                            node={child}
                            selectedPath={selectedPath}
                            onSelect={onSelect}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Модальное окно выбора папки в виде дерева (как в Проводнике Windows)
 */
export default function FolderTreePicker({ onConfirm, onClose }) {
    const [tree, setTree] = useState([]);
    const [selectedPath, setSelectedPath] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загружаем дерево папок с сервера
        fetch('/admin/documents/folder-tree')
            .then((res) => res.json())
            .then((data) => {
                setTree(data.tree || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить дерево папок');
                setLoading(false);
            });
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
                {/* Шапка */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Выберите папку</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Нажмите на папку для выбора, стрелка ▶ — раскрыть</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Дерево папок */}
                <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            <span className="ml-2 text-slate-500 text-sm">Загрузка...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 text-sm text-center py-6">{error}</div>
                    )}
                    {!loading && !error && tree.map((node) => (
                        <TreeNode
                            key={node.path}
                            node={node}
                            selectedPath={selectedPath}
                            onSelect={setSelectedPath}
                        />
                    ))}
                </div>

                {/* Выбранная папка и кнопки */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    {selectedPath ? (
                        <p className="text-xs text-slate-500 mb-3 font-mono bg-white border border-slate-200 rounded-lg px-3 py-1.5 truncate">
                            {selectedPath}
                        </p>
                    ) : (
                        <p className="text-xs text-slate-400 mb-3 italic">Папка не выбрана</p>
                    )}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={() => selectedPath && onConfirm(selectedPath)}
                            disabled={!selectedPath}
                            className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Переместить сюда
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

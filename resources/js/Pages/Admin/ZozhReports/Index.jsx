import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function ZozhReportsIndex() {
    const initialPath = 'zozh_reports';
    const [path, setPath] = useState(initialPath);
    const [items, setItems] = useState([]);
    const [parent, setParent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const fetchList = (p = '') => {
        setLoading(true);
        setError(null);
        axios.get('/admin/storage/list', { params: { path: p } })
            .then(res => {
                setItems(res.data.items);
                setPath(res.data.current);
                setParent(res.data.parent);
            })
            .catch(e => setError(e.response?.data?.error || e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchList(initialPath);
    }, []);

    const handleOpenFolder = (folderPath) => {
        fetchList(folderPath);
    };

    const handleGoUp = () => {
        if (parent !== null && parent.startsWith(initialPath)) {
            fetchList(parent);
        } else if (path !== initialPath) {
            fetchList(initialPath);
        }
    };

    const handleDelete = (item) => {
        if (window.confirm(`Удалить ${item.type === 'folder' ? 'папку' : 'файл'}: ${item.name}?`)) {
            axios.delete('/admin/storage/delete', { params: { path: item.path } })
                .then(() => fetchList(path))
                .catch(e => alert('Ошибка удаления: ' + (e.response?.data?.error || e.message)));
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        axios.post('/admin/storage/upload', formData)
            .then(() => fetchList(path))
            .catch(e => alert('Ошибка загрузки: ' + (e.response?.data?.error || e.message)));
    };

    const handleCreateFolder = () => {
        const folderName = window.prompt('Введите имя новой папки:');
        if (!folderName) return;
        axios.post('/admin/storage/create-folder', { path, name: folderName })
            .then(() => fetchList(path))
            .catch(e => alert('Ошибка создания папки: ' + (e.response?.data?.error || e.message)));
    };

    const handlePreview = (item) => {
        if (item.type === 'file') {
            setPreview({
                type: item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : item.name.match(/\.pdf$/i) ? 'pdf' : 'other',
                url: item.url,
                name: item.name,
            });
        }
    };

    const closePreview = () => setPreview(null);

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Отчеты по ЗОЖ: Загрузка документов</h2>
            </div>
            <div className="mb-4 flex items-center space-x-2">
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={handleGoUp}
                    disabled={path === initialPath}
                >
                    ⬆️ Вверх
                </button>
                <span className="text-gray-500">/{path}</span>
                <div className="ml-auto flex items-center space-x-2">
                    <button
                        onClick={handleCreateFolder}
                        className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
                    >
                        + Создать папку
                    </button>
                    <label className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                        + Загрузить файл
                        <input type="file" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {preview && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg p-6 max-w-2xl w-full relative">
                        <button onClick={closePreview} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl">×</button>
                        <div className="mb-2 font-semibold">Предпросмотр: {preview.name}</div>
                        {preview.type === 'image' && (
                            <img src={preview.url} alt={preview.name} className="max-w-full max-h-[70vh] mx-auto" />
                        )}
                        {preview.type === 'pdf' && (
                            <iframe src={preview.url} title={preview.name} className="w-full h-[70vh]" />
                        )}
                        {preview.type === 'other' && (
                            <div className="text-gray-500">Нет предпросмотра для этого типа файла.</div>
                        )}
                    </div>
                </div>
            )}

            {error && <div className="text-red-500 mb-4">Ошибка: {error}</div>}

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Имя</th>
                                <th className="text-left py-2">Тип</th>
                                <th className="text-left py-2">Размер</th>
                                <th className="text-left py-2">Изменён</th>
                                <th className="text-left py-2">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && (
                                <tr><td colSpan={5} className="text-center text-gray-400 py-8">Пусто</td></tr>
                            )}
                            {items.map(item => (
                                <tr key={item.path} className="border-b hover:bg-gray-50/50">
                                    <td className="py-2">
                                        {item.type === 'folder' ? (
                                            <button className="text-blue-600 hover:underline flex items-center gap-2" onClick={() => handleOpenFolder(item.path)}>
                                                📁 {item.name}
                                            </button>
                                        ) : (
                                            <span className="cursor-pointer flex items-center gap-2" onClick={() => handlePreview(item)}>
                                                📄 {item.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2">{item.type === 'folder' ? 'Папка' : 'Файл'}</td>
                                    <td className="py-2">{item.type === 'file' ? (item.size / 1024).toFixed(1) + ' KB' : ''}</td>
                                    <td className="py-2">{item.type === 'file' ? new Date(item.modified * 1000).toLocaleString() : ''}</td>
                                    <td className="py-2 space-x-2">
                                        {item.type === 'file' && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline mr-2">Скачать</a>
                                        )}
                                        <button onClick={() => handleDelete(item)} className="text-red-600 hover:underline">Удалить</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

ZozhReportsIndex.layout = page => <AdminLayout title="Отчеты по ЗОЖ">{page}</AdminLayout>;

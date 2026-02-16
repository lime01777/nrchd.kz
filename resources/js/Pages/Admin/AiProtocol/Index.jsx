import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ analyses }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        indication: '',
    });

    const [isAnalyzing, setIsAnalyzing] = useState(null);

    // Auto-refresh if any analysis is processing
    useEffect(() => {
        const hasProcessing = analyses.some(a => a.status === 'processing');
        if (hasProcessing) {
            const interval = setInterval(() => {
                router.reload({ only: ['analyses'] });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [analyses]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ai-protocols.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleAnalyze = (id) => {
        setIsAnalyzing(id);
        router.post(route('admin.ai-protocols.analyze', id), {}, {
            onFinish: () => setIsAnalyzing(null),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this analysis?')) {
            router.delete(route('admin.ai-protocols.destroy', id));
        }
    };

    return (
        <AdminLayout title="Клинические протоколы ИИ">
            <Head title="Клинические протоколы ИИ" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.error}</span>
                        </div>
                    )}

                    {/* Upload Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <h2 className="text-lg font-semibold mb-4">Загрузить новый протокол</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Файл протокола (DOCX, PDF)</label>
                                <input
                                    type="file"
                                    onChange={e => setData('file', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                {errors.file && <div className="text-red-500 text-sm mt-1">{errors.file}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Показание (Indication)</label>
                                <input
                                    type="text"
                                    value={data.indication}
                                    onChange={e => setData('indication', e.target.value)}
                                    placeholder="Например: Сахарный диабет 2 типа"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                {errors.indication && <div className="text-red-500 text-sm mt-1">{errors.indication}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {processing ? 'Загрузка...' : 'Загрузить и создать задачу'}
                            </button>
                        </form>
                    </div>

                    {/* Analyses List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Список анализов</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Файл</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Показание</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analyses.map((analysis) => (
                                            <tr key={analysis.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysis.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{analysis.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysis.indication}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                                ${analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                        analysis.status === 'error' ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'}`}>
                                                                {analysis.status}
                                                            </span>
                                                            {analysis.status === 'processing' && <span className="ml-2 text-xs text-gray-400 animate-pulse">Running...</span>}
                                                        </div>
                                                        {analysis.status === 'processing' && (
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 max-w-[140px]">
                                                                <div
                                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                                                    style={{ width: `${analysis.progress || 0}%` }}
                                                                ></div>
                                                                <span className="text-xs text-gray-500 mt-1 block">{analysis.progress || 0}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {analysis.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleAnalyze(analysis.id)}
                                                            disabled={isAnalyzing === analysis.id}
                                                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                                        >
                                                            {isAnalyzing === analysis.id ? 'Starting...' : 'Execute Analysis'}
                                                        </button>
                                                    )}

                                                    {analysis.status === 'completed' && (
                                                        <>
                                                            <a
                                                                href={route('admin.ai-protocols.download', { id: analysis.id, type: 'xlsx' })}
                                                                className="text-green-600 hover:text-green-900 mr-2"
                                                            >
                                                                Download XLSX
                                                            </a>
                                                            <a
                                                                href={route('admin.ai-protocols.download', { id: analysis.id, type: 'docx' })}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Download DOCX
                                                            </a>
                                                        </>
                                                    )}

                                                    {analysis.status === 'error' && (
                                                        <button
                                                            onClick={() => alert(analysis.log)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Show Log
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(analysis.id)}
                                                        className="text-red-600 hover:text-red-900 ml-4"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {analyses.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Нет записей</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

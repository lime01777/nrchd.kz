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
        if (confirm('Вы уверены, что хотите удалить этот анализ?')) {
            router.delete(route('admin.ai-protocols.destroy', id));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200">Выполнено</span>;
            case 'processing': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-100 text-amber-800 shadow-sm border border-amber-200 animate-pulse">В процессе</span>;
            case 'error': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-rose-100 text-rose-800 shadow-sm border border-rose-200">Ошибка</span>;
            default: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-slate-100 text-slate-800 shadow-sm border border-slate-200">В ожидании</span>;
        }
    };

    const getDescription = (analysis) => {
        if (analysis.status === 'completed') {
            return <div className="text-emerald-600 w-full text-xs font-medium">✅ Анализ завершен успешно. Сформирован отчет.</div>;
        } else if (analysis.status === 'processing') {
            return <div className="text-amber-600 w-full text-xs font-medium truncate">⏳ ИИ анализирует документ... ({analysis.progress || 0}%)</div>;
        } else if (analysis.status === 'error') {
            return <div className="text-rose-600 w-full text-xs font-medium truncate max-w-xs" title={analysis.log || 'Внутренняя ошибка'}>❌ Ошибка: {analysis.log ? analysis.log.substring(0, 60) + '...' : 'Сбой процесса'}</div>;
        } else {
            return <div className="text-slate-500 w-full text-xs font-medium">📋 Готов к запуску ИИ...</div>;
        }
    };

    return (
        <AdminLayout title="Клинические протоколы ИИ">
            <Head title="Клинические протоколы ИИ" />

            <div className="py-8 min-h-screen">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Рабочая станция ИИ</h1>
                            <p className="mt-2 text-sm text-slate-500 font-medium">Загружайте клинические протоколы и генерируйте отчеты с помощью ИИ.</p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {flash?.success && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl shadow-sm transform transition-all mx-2">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3"><p className="text-sm text-emerald-700 font-medium">{flash.success}</p></div>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-sm transform transition-all mx-2">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3"><p className="text-sm text-rose-700 font-medium">{flash.error}</p></div>
                            </div>
                        </div>
                    )}

                    {/* Upload Card */}
                    <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden transition-all mx-2">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                Подготовить новую задачу ИИ
                            </h2>
                        </div>
                        <div className="p-6 bg-white">
                            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:items-start w-full">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Файл протокола (DOCX, PDF)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={e => setData('file', e.target.files[0])}
                                            className="block w-full text-sm text-slate-600
                                                file:mr-4 file:py-2.5 file:px-4
                                                file:rounded-2xl file:border-0
                                                file:text-sm file:font-bold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100 transition-colors
                                                border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    {errors.file && <div className="text-rose-500 text-xs mt-1.5 font-bold">{errors.file}</div>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Нозология / Показание</label>
                                    <input
                                        type="text"
                                        value={data.indication}
                                        onChange={e => setData('indication', e.target.value)}
                                        placeholder="Пример: Сахарный диабет 2 типа"
                                        className="block w-full rounded-2xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2.5 font-medium placeholder-slate-400"
                                    />
                                    {errors.indication && <div className="text-rose-500 text-xs mt-1.5 font-bold">{errors.indication}</div>}
                                </div>
                                <div>
                                    <label className="hidden md:block text-sm font-semibold text-white mb-2">_</label>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center whitespace-nowrap"
                                    >
                                        {processing ? (
                                            <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Обработка...</>
                                        ) : 'Загрузить в систему'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden mx-2">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                Реестр клинических протоколов
                            </h2>
                            <span className="bg-white text-indigo-800 border border-indigo-200 shadow-sm text-xs font-bold px-3 py-1 rounded-full">{analyses.length} задач</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-[#f8fafc]">
                                    <tr>
                                        <th scope="col" className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Документ / Показание</th>
                                        <th scope="col" className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ответственный</th>
                                        <th scope="col" className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Хронология</th>
                                        <th scope="col" className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/6">Статус / Прогресс</th>
                                        <th scope="col" className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Описание работ</th>
                                        <th scope="col" className="px-5 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {analyses.map((analysis) => (
                                        <tr key={analysis.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-4 min-w-[250px]">
                                                <div className="flex items-start">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-bold text-slate-900 leading-tight block truncate md:whitespace-normal max-w-xs">{analysis.name}</div>
                                                        <div className="text-xs font-medium text-slate-500 mt-1">{analysis.indication}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/60 shadow-sm rounded-2xl px-3 py-1.5 inline-flex items-center">
                                                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                    {analysis.user ? analysis.user.name : 'Система'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex flex-col space-y-2 text-[11px] font-medium">
                                                    <div className="flex items-center text-slate-600 border border-slate-100 bg-slate-50 px-2 py-0.5 rounded" title="Время загрузки">
                                                        <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                        {formatDate(analysis.created_at)}
                                                    </div>
                                                    {(analysis.status === 'completed' || analysis.status === 'error') && (
                                                        <div className="flex items-center text-slate-600 border border-emerald-50 bg-emerald-50/30 px-2 py-0.5 rounded" title="Статус обновлен">
                                                            <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            {formatDate(analysis.updated_at)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap min-w-[150px]">
                                                <div className="flex flex-col">
                                                    <div className="mb-2">{getStatusBadge(analysis.status)}</div>
                                                    {analysis.status === 'processing' && (
                                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-1 shadow-inner overflow-hidden border border-slate-300">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 relative"
                                                                style={{ width: `${Math.max(5, analysis.progress || 0)}%` }}
                                                            >
                                                                <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm leading-tight inline-block w-full">
                                                    {getDescription(analysis)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end items-center space-x-2.5">
                                                    {analysis.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleAnalyze(analysis.id)}
                                                            disabled={isAnalyzing === analysis.id}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-2xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:shadow active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            {isAnalyzing === analysis.id ? 'Запуск...' : 'Запустить ИИ'}
                                                        </button>
                                                    )}

                                                    {analysis.status === 'completed' && (
                                                        <div className="flex space-x-2">
                                                            <a
                                                                href={route('admin.ai-protocols.download', { id: analysis.id, type: 'docx' })}
                                                                className="inline-flex items-center p-2 border border-blue-200 rounded-2xl text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm transition-all shadow-sm active:scale-95"
                                                                title="Скачать DOCX"
                                                            >
                                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14.5,18H9.5L7.2,7.3L9.6,7L10.7,13.4L11.8,7.3L13.8,7.3L15.3,13.4L16.4,7.3L18.6,7.5L16.3,18H14.5M20.2,2H3.8C2.8,2 2,2.8 2,3.8V20.2C2,21.2 2.8,22 3.8,22H20.2C21.2,22 22,21.2 22,20.2V3.8C22,2.8 21.2,2 20.2,2Z" /></svg>
                                                            </a>
                                                            <a
                                                                href={route('admin.ai-protocols.download', { id: analysis.id, type: 'xlsx' })}
                                                                className="inline-flex items-center p-2 border border-emerald-200 rounded-2xl text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-sm transition-all shadow-sm active:scale-95"
                                                                title="Скачать XLSX"
                                                            >
                                                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L6.09 8.89H4.34L6.27 12L4.28 15.28H6ZM20 5H9V7H14.5Q14.91 7 15.21 7.29 15.5 7.59 15.5 8V9H20V5ZM15.5 10H14.5Q14.5 10.21 14.35 10.35 14.21 10.5 14 10.5H9V13.5H14Q14.21 13.5 14.35 13.65 14.5 13.79 14.5 14V15H15.5V10ZM20 19V15H15.5V16Q15.5 16.41 15.21 16.71 14.91 17 14.5 17H9V19H20ZM20 13.5V10H17V13.5H20Z" /></svg>
                                                            </a>
                                                        </div>
                                                    )}

                                                    {analysis.status === 'error' && (
                                                        <button
                                                            onClick={() => alert(`Лог ошибки:\n\n${analysis.log || 'Неизвестная ошибка'}`)}
                                                            className="inline-flex items-center p-2 border border-rose-200 rounded-2xl text-rose-600 bg-white hover:bg-rose-50 hover:border-rose-300 transition-all font-bold text-xs shadow-sm hover:shadow active:scale-95"
                                                            title="Показать ошибку"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(analysis.id)}
                                                        className="inline-flex items-center p-2 border border-transparent rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm hover:shadow active:scale-95"
                                                        title="Удалить задачу"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {analyses.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center bg-white rounded-b-lg">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200 shadow-inner">
                                                        <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    </div>
                                                    <p className="text-base font-bold text-slate-700">Нет загруженных протоколов</p>
                                                    <p className="text-sm mt-1 text-slate-500 font-medium">Загрузите новый клинический протокол для начала работы.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}

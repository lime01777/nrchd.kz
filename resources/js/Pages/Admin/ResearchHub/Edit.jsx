import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ research }) {
    const { data, setData, put, processing, errors } = useForm({
        title: research.title || '',
        slug: research.slug || '',
        description: research.description || '',
        sample: research.sample || '',
        geography: research.geography || '',
        period: research.period || '',
        methodology: research.methodology || '',
        citation_rules: research.citation_rules || '',
        is_active: research.is_active ?? true,
        sort_order: research.sort_order || 0,

        indicators: research.indicators || [],
        dashboards: research.dashboards || [],
        files: research.files || [],
        infographics: research.infographics || [],
    });

    const [activeTab, setActiveTab] = useState('main');

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.research-hub.update', research.id));
    };

    const addIndicator = () => setData('indicators', [...data.indicators, { name: '', definition: '', sort_order: 0 }]);
    const removeIndicator = (index) => {
        const newArr = [...data.indicators];
        newArr.splice(index, 1);
        setData('indicators', newArr);
    };

    const addDashboard = () => setData('dashboards', [...data.dashboards, { title: '', embed_url: '', type: 'trend', description: '', sort_order: 0 }]);
    const removeDashboard = (index) => {
        const newArr = [...data.dashboards];
        newArr.splice(index, 1);
        setData('dashboards', newArr);
    };

    const addFile = () => setData('files', [...data.files, { title: '', category: 'other', file_path: '', file_type: '', sort_order: 0 }]);
    const removeFile = (index) => {
        const newArr = [...data.files];
        newArr.splice(index, 1);
        setData('files', newArr);
    };

    const addInfographic = () => setData('infographics', [...data.infographics, { title: '', image_path: '', pdf_path: '', attributes: null, is_active: true, sort_order: 0 }]);
    const removeInfographic = (index) => {
        const newArr = [...data.infographics];
        newArr.splice(index, 1);
        setData('infographics', newArr);
    };

    return (
        <AdminLayout title={`Редактирование: ${research.title}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Редактирование исследования: {research.title}</h1>
                <Link
                    href={route('admin.research-hub.index')}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                >
                    &larr; Назад к списку
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('main')}
                            className={`${activeTab === 'main' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Основная информация
                        </button>
                        <button
                            onClick={() => setActiveTab('indicators')}
                            className={`${activeTab === 'indicators' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Показатели ({data.indicators.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('dashboards')}
                            className={`${activeTab === 'dashboards' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Дашборды ({data.dashboards.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`${activeTab === 'files' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Файлы ({data.files.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('infographics')}
                            className={`${activeTab === 'infographics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Инфографика ({data.infographics.length})
                        </button>
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
                    {activeTab === 'main' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Название (Title)</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Слаг URL (Slug)</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание (Description)</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Выборка (Sample)</label>
                                    <textarea
                                        value={data.sample}
                                        onChange={e => setData('sample', e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Методология (Methodology)</label>
                                    <textarea
                                        value={data.methodology}
                                        onChange={e => setData('methodology', e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">География (Geography)</label>
                                    <input
                                        type="text"
                                        value={data.geography}
                                        onChange={e => setData('geography', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Период (Period)</label>
                                    <input
                                        type="text"
                                        value={data.period}
                                        onChange={e => setData('period', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Правила цитирования (Citation Rules)</label>
                                    <textarea
                                        value={data.citation_rules}
                                        onChange={e => setData('citation_rules', e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Порядок сортировки (Sort Order)</label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={e => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Активно (Отображать на сайте)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ПОКАЗАТЕЛИ */}
                    {activeTab === 'indicators' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <button type="button" onClick={addIndicator} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                                    + Добавить показатель
                                </button>
                            </div>

                            {data.indicators.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Нет показателей.</p>
                            ) : (
                                data.indicators.map((ind, idx) => (
                                    <div key={idx} className="border border-gray-200 p-4 rounded-md relative bg-gray-50">
                                        <button type="button" onClick={() => removeIndicator(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✖</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Название показателя</label>
                                                <input
                                                    type="text"
                                                    value={ind.name}
                                                    onChange={e => {
                                                        const newArr = [...data.indicators];
                                                        newArr[idx].name = e.target.value;
                                                        setData('indicators', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Сортировка</label>
                                                <input
                                                    type="number"
                                                    value={ind.sort_order}
                                                    onChange={e => {
                                                        const newArr = [...data.indicators];
                                                        newArr[idx].sort_order = parseInt(e.target.value) || 0;
                                                        setData('indicators', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Определение</label>
                                                <textarea
                                                    value={ind.definition || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.indicators];
                                                        newArr[idx].definition = e.target.value;
                                                        setData('indicators', newArr);
                                                    }}
                                                    rows={2}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ДАШБОРДЫ */}
                    {activeTab === 'dashboards' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <button type="button" onClick={addDashboard} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                                    + Добавить дашборд
                                </button>
                            </div>

                            {data.dashboards.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Нет дашбордов.</p>
                            ) : (
                                data.dashboards.map((dash, idx) => (
                                    <div key={idx} className="border border-gray-200 p-4 rounded-md relative bg-gray-50">
                                        <button type="button" onClick={() => removeDashboard(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✖</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Заголовок</label>
                                                <input
                                                    type="text"
                                                    value={dash.title}
                                                    onChange={e => {
                                                        const newArr = [...data.dashboards];
                                                        newArr[idx].title = e.target.value;
                                                        setData('dashboards', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Тип (trend, map, comparison)</label>
                                                <select
                                                    value={dash.type}
                                                    onChange={e => {
                                                        const newArr = [...data.dashboards];
                                                        newArr[idx].type = e.target.value;
                                                        setData('dashboards', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="trend">Тренды (Trend)</option>
                                                    <option value="map">Карта (Map)</option>
                                                    <option value="comparison">Сравнение (Comparison)</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">URL встраивания (Iframe embed URL)</label>
                                                <input
                                                    type="text"
                                                    value={dash.embed_url || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.dashboards];
                                                        newArr[idx].embed_url = e.target.value;
                                                        setData('dashboards', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Описание / Заметка</label>
                                                <input
                                                    type="text"
                                                    value={dash.description || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.dashboards];
                                                        newArr[idx].description = e.target.value;
                                                        setData('dashboards', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ФАЙЛЫ */}
                    {activeTab === 'files' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <button type="button" onClick={addFile} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                                    + Добавить файл
                                </button>
                            </div>

                            {data.files.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Нет файлов.</p>
                            ) : (
                                data.files.map((file, idx) => (
                                    <div key={idx} className="border border-gray-200 p-4 rounded-md relative bg-gray-50">
                                        <button type="button" onClick={() => removeFile(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✖</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Заголовок / Имя</label>
                                                <input
                                                    type="text"
                                                    value={file.title}
                                                    onChange={e => {
                                                        const newArr = [...data.files];
                                                        newArr[idx].title = e.target.value;
                                                        setData('files', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Категория</label>
                                                <select
                                                    value={file.category}
                                                    onChange={e => {
                                                        const newArr = [...data.files];
                                                        newArr[idx].category = e.target.value;
                                                        setData('files', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="report">Отчет (report)</option>
                                                    <option value="exec_summary">Резюме (exec_summary)</option>
                                                    <option value="questionnaire">Анкета (questionnaire)</option>
                                                    <option value="codebook">Codebook (codebook)</option>
                                                    <option value="export">Экспорт (export)</option>
                                                    <option value="other">Другое (other)</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Путь к файлу (URL или путь из storage)</label>
                                                <input
                                                    type="text"
                                                    value={file.file_path || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.files];
                                                        newArr[idx].file_path = e.target.value;
                                                        setData('files', newArr);
                                                    }}
                                                    placeholder="/storage/zozh_reports/example.pdf"
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Тип файла (pdf, docx, csv)</label>
                                                <input
                                                    type="text"
                                                    value={file.file_type || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.files];
                                                        newArr[idx].file_type = e.target.value;
                                                        setData('files', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ИНФОГРАФИКА */}
                    {activeTab === 'infographics' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <button type="button" onClick={addInfographic} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                                    + Добавить инфографику
                                </button>
                            </div>

                            {data.infographics.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Нет инфографики.</p>
                            ) : (
                                data.infographics.map((info, idx) => (
                                    <div key={idx} className="border border-gray-200 p-4 rounded-md relative bg-gray-50">
                                        <button type="button" onClick={() => removeInfographic(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✖</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Заголовок</label>
                                                <input
                                                    type="text"
                                                    value={info.title}
                                                    onChange={e => {
                                                        const newArr = [...data.infographics];
                                                        newArr[idx].title = e.target.value;
                                                        setData('infographics', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Отображать</label>
                                                <select
                                                    value={info.is_active ? "1" : "0"}
                                                    onChange={e => {
                                                        const newArr = [...data.infographics];
                                                        newArr[idx].is_active = e.target.value === "1";
                                                        setData('infographics', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="1">Да</option>
                                                    <option value="0">Нет</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Путь к изображению (если есть)</label>
                                                <input
                                                    type="text"
                                                    value={info.image_path || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.infographics];
                                                        newArr[idx].image_path = e.target.value;
                                                        setData('infographics', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Путь к PDF (для скачивания)</label>
                                                <input
                                                    type="text"
                                                    value={info.pdf_path || ''}
                                                    onChange={e => {
                                                        const newArr = [...data.infographics];
                                                        newArr[idx].pdf_path = e.target.value;
                                                        setData('infographics', newArr);
                                                    }}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Атрибуты (JSON текст: бренд, период и т.д.)</label>
                                                <textarea
                                                    value={typeof info.attributes === 'object' && info.attributes !== null ? JSON.stringify(info.attributes) : (info.attributes || '')}
                                                    onChange={e => {
                                                        const newArr = [...data.infographics];
                                                        // Просто храним как строку в форме, сервер разберется или сохранит как строку/json
                                                        newArr[idx].attributes = e.target.value;
                                                        setData('infographics', newArr);
                                                    }}
                                                    placeholder='{"brand": "NNCRZ", "period": "2024"}'
                                                    rows={2}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

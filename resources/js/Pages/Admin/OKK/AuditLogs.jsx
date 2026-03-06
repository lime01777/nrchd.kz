import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';

export default function AuditLogsIndex() {
    const { logs, filters = {} } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const paginationLinks = logs?.links || [];

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.okk-logs.index'), { search: searchQuery }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearchQuery('');
        router.get(route('admin.okk-logs.index'), {}, { preserveState: true, replace: true });
    };

    const ActionBadge = ({ action }) => {
        const colors = {
            'login': 'bg-green-100 text-green-800',
            'logout': 'bg-red-100 text-red-800',
            'view_document': 'bg-blue-100 text-blue-800',
            'view_folder': 'bg-indigo-100 text-indigo-800',
        };
        const labels = {
            'login': 'Вход',
            'logout': 'Выход',
            'view_document': 'Просмотр файла',
            'view_folder': 'Просмотр папки',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[action] || 'bg-gray-100 text-gray-800'}`}>
                {labels[action] || action || 'Неизвестно'}
            </span>
        );
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h} ч ${m} мин`;
        if (m > 0) return `${m} мин ${s} сек`;
        return `${s} сек`;
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Журнал активности (Комитет ОКК)</h2>
            </div>

            <form onSubmit={handleFilter} className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Поиск по ФИО, IP..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-2"
                        >
                            Фильтровать
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm focus:outline-none focus:ring-2"
                        >
                            Сбросить
                        </button>
                        <a
                            href="#"
                            className="px-5 py-2.5 flex items-center bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-all shadow-sm focus:outline-none focus:ring-2"
                            onClick={(e) => { e.preventDefault(); alert('Экспорт будет реализован позже'); }}
                        >
                            Выгрузить Excel
                        </a>
                    </div>
                </div>
            </form>

            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden border border-gray-100/50 rounded-2xl">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудник</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действие</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Объект / Длительность</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP адрес</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                {(logs?.data || []).map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 cursor-default">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {log.user_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ActionBadge action={log.action} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={log.entity_path}>
                                            {log.action === 'logout' && (
                                                <span className="text-gray-600 font-medium">Сессия: {formatDuration(log.duration_seconds)}</span>
                                            )}
                                            {log.entity_path && (
                                                <span>{log.entity_path}</span>
                                            )}
                                            {!log.entity_path && log.action !== 'logout' && '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs whitespace-nowrap">
                                            {log.ip_address || '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {log.created_at}
                                        </td>
                                    </tr>
                                ))}
                                {logs?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            Логов не найдено
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {paginationLinks.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex items-center space-x-2 border border-gray-100 bg-white/50 backdrop-blur-md px-3 py-2 rounded-2xl shadow-sm">
                        {paginationLinks.map((link, index) => {
                            const key = link.url ?? `page-${index}`;
                            if (!link.url) {
                                return (
                                    <span
                                        key={key}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${link.active
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 shadow-sm border border-transparent'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </nav>
                </div>
            )}
        </>
    );
}

AuditLogsIndex.layout = (page) => <AdminLayout title="Журнал активности (ОКК)">{page}</AdminLayout>;

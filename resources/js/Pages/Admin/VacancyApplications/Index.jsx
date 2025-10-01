import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function VacancyApplicationsIndex({ applications, vacancies, stats, filters }) {
    const { flash = {} } = usePage().props;
    const [localFilters, setLocalFilters] = useState(filters);

    // Функция применения фильтров
    const applyFilters = () => {
        router.get(route('admin.vacancy-applications.index'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Сброс фильтров
    const resetFilters = () => {
        const emptyFilters = { status: 'all', vacancy_id: '', search: '' };
        setLocalFilters(emptyFilters);
        router.get(route('admin.vacancy-applications.index'), emptyFilters);
    };

    // Получить цвет бейджа статуса
    const getStatusBadgeColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            purple: 'bg-purple-100 text-purple-800',
            red: 'bg-red-100 text-red-800',
            green: 'bg-green-100 text-green-800',
            gray: 'bg-gray-100 text-gray-800',
        };
        return colors[color] || colors.gray;
    };

    return (
        <>
            <Head title="Заявки на вакансии" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Статистика */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <div className="text-sm text-gray-600">Всего</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="bg-blue-50 overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <div className="text-sm text-blue-600">Новые</div>
                            <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
                        </div>
                        <div className="bg-yellow-50 overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <div className="text-sm text-yellow-600">Просмотрены</div>
                            <div className="text-2xl font-bold text-yellow-900">{stats.reviewed}</div>
                        </div>
                        <div className="bg-purple-50 overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <div className="text-sm text-purple-600">Связались</div>
                            <div className="text-2xl font-bold text-purple-900">{stats.contacted}</div>
                        </div>
                        <div className="bg-green-50 overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <div className="text-sm text-green-600">Приняты</div>
                            <div className="text-2xl font-bold text-green-900">{stats.hired}</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Заявки на вакансии</h2>
                            </div>
                            
                            {/* Flash сообщения */}
                            {flash && flash.success && (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                                    {flash.success}
                                </div>
                            )}
                            
                            {/* Фильтры */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Поиск
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Имя, email, телефон..."
                                        className="w-full px-4 py-2 border rounded-md"
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                                        onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Вакансия
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-md"
                                        value={localFilters.vacancy_id}
                                        onChange={(e) => setLocalFilters({...localFilters, vacancy_id: e.target.value})}
                                    >
                                        <option value="">Все вакансии</option>
                                        {vacancies.map((vacancy) => (
                                            <option key={vacancy.id} value={vacancy.id}>
                                                {vacancy.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Статус
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-md"
                                        value={localFilters.status}
                                        onChange={(e) => setLocalFilters({...localFilters, status: e.target.value})}
                                    >
                                        <option value="all">Все статусы</option>
                                        <option value="new">Новые</option>
                                        <option value="reviewed">Просмотрены</option>
                                        <option value="contacted">Связались</option>
                                        <option value="rejected">Отклонены</option>
                                        <option value="hired">Приняты</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        &nbsp;
                                    </label>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={applyFilters}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Применить
                                        </button>
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            Сбросить
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Таблица заявок */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">ID</th>
                                            <th className="py-3 px-4 border-b text-left">Кандидат</th>
                                            <th className="py-3 px-4 border-b text-left">Контакты</th>
                                            <th className="py-3 px-4 border-b text-left">Вакансия</th>
                                            <th className="py-3 px-4 border-b text-left">Статус</th>
                                            <th className="py-3 px-4 border-b text-left">Дата подачи</th>
                                            <th className="py-3 px-4 border-b text-left">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.data.length > 0 ? (
                                            applications.data.map((application) => (
                                                <tr key={application.id} className="hover:bg-gray-50">
                                                    <td className="py-3 px-4 border-b">{application.id}</td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="font-medium text-gray-900">
                                                            {application.name}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="text-sm text-gray-600">
                                                            <div>{application.email}</div>
                                                            <div>{application.phone}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="text-sm">{application.vacancy.title}</div>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            getStatusBadgeColor(application.status_color)
                                                        }`}>
                                                            {application.status_label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                                        {application.created_at}
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <Link
                                                            href={route('admin.vacancy-applications.show', application.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Подробнее
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                                    Заявок не найдено
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {applications.links && applications.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {applications.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 border rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                disabled={!link.url}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

VacancyApplicationsIndex.layout = page => <AdminLayout children={page} />;



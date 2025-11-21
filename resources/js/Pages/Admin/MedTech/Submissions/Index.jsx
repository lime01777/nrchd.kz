import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function SubmissionsIndex({ submissions }) {
    const [statusFilter, setStatusFilter] = useState('');

    const handleFilter = () => {
        router.get(route('admin.medtech.submissions'), {
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            reviewed: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            new: 'Новая',
            reviewed: 'На рассмотрении',
            approved: 'Одобрена',
            rejected: 'Отклонена',
        };
        return labels[status] || status;
    };

    return (
        <AdminLayout title="Заявки на подачу технологий">
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.index')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к платформе MedTech
                        </Link>
                    </div>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Заявки на подачу технологий</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Просмотр и управление заявками на подачу технологий
                        </p>
                    </div>

                    {/* Фильтры */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Статус
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Все статусы</option>
                                    <option value="new">Новая</option>
                                    <option value="reviewed">На рассмотрении</option>
                                    <option value="approved">Одобрена</option>
                                    <option value="rejected">Отклонена</option>
                                </select>
                            </div>
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Применить
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Организация</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Контактное лицо</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Технология</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {submissions.data && submissions.data.length > 0 ? (
                                        submissions.data.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {submission.organization}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {submission.contact_name}
                                                    <div className="text-xs text-gray-400">{submission.contact_email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {submission.technology_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {submission.type || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {submission.trl || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(submission.status)}`}>
                                                        {getStatusLabel(submission.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(submission.created_at).toLocaleDateString('ru-RU')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('admin.medtech.submissions.show', submission.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Просмотр
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                                Заявки пока не поступали
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {submissions.links && submissions.links.length > 3 && (
                        <div className="mt-4 flex justify-center">
                            <nav className="flex space-x-2">
                                {submissions.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-md ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


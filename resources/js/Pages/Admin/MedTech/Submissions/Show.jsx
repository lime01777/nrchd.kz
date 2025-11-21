import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SubmissionShow({ submission }) {
    const { data, setData, patch, processing } = useForm({
        status: submission.status,
        admin_notes: submission.admin_notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.medtech.submissions.update-status', submission.id));
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
        <AdminLayout title="Просмотр заявки">
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.submissions')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к списку заявок
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold text-gray-900">Заявка #{submission.id}</h1>
                            <span className={`px-3 py-1 text-sm rounded ${getStatusColor(submission.status)}`}>
                                {getStatusLabel(submission.status)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Организация</h3>
                                <p className="text-gray-900">{submission.organization}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Контактное лицо</h3>
                                <p className="text-gray-900">{submission.contact_name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                                <p className="text-gray-900">{submission.contact_email}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Телефон</h3>
                                <p className="text-gray-900">{submission.contact_phone || 'Не указан'}</p>
                            </div>

                            {submission.technology_name && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Название технологии</h3>
                                    <p className="text-gray-900">{submission.technology_name}</p>
                                </div>
                            )}

                            {submission.type && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Тип технологии</h3>
                                    <p className="text-gray-900">{submission.type}</p>
                                </div>
                            )}

                            {submission.trl && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">TRL</h3>
                                    <p className="text-gray-900">{submission.trl}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Дата подачи</h3>
                                <p className="text-gray-900">
                                    {new Date(submission.created_at).toLocaleString('ru-RU')}
                                </p>
                            </div>
                        </div>

                        {submission.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Описание технологии</h3>
                                <p className="text-gray-900 whitespace-pre-wrap">{submission.description}</p>
                            </div>
                        )}

                        {submission.pilot_sites && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Предлагаемые пилотные площадки</h3>
                                <p className="text-gray-900 whitespace-pre-wrap">{submission.pilot_sites}</p>
                            </div>
                        )}

                        {submission.attachment_path && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Прикрепленный файл</h3>
                                <a
                                    href={submission.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Скачать файл
                                </a>
                            </div>
                        )}

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Управление заявкой</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="status" value="Изменить статус" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="new">Новая</option>
                                        <option value="reviewed">На рассмотрении</option>
                                        <option value="approved">Одобрена</option>
                                        <option value="rejected">Отклонена</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="admin_notes" value="Заметки администратора" />
                                    <textarea
                                        id="admin_notes"
                                        value={data.admin_notes}
                                        onChange={(e) => setData('admin_notes', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        placeholder="Внутренние заметки по заявке"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? 'Сохранение...' : 'Сохранить изменения'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


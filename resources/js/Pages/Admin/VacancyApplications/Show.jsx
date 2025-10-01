import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function VacancyApplicationShow({ application }) {
    const { flash = {} } = usePage().props;
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    
    const { data, setData, patch, processing } = useForm({
        status: application.status,
        notes: application.notes || '',
    });

    // Обновить статус
    const updateStatus = (newStatus) => {
        router.patch(
            route('admin.vacancy-applications.update-status', application.id),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setData('status', newStatus);
                },
            }
        );
    };

    // Сохранить заметки
    const saveNotes = () => {
        router.patch(
            route('admin.vacancy-applications.update-notes', application.id),
            { notes: data.notes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditingNotes(false);
                },
            }
        );
    };

    // Удалить заявку
    const deleteApplication = () => {
        if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
            router.delete(route('admin.vacancy-applications.destroy', application.id));
        }
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
            <Head title={`Заявка от ${application.name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.vacancy-applications.index')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Назад к списку заявок
                        </Link>
                    </div>

                    {/* Flash сообщения */}
                    {flash && flash.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Основная информация */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Информация о кандидате */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Информация о кандидате
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Имя:</div>
                                            <div className="col-span-2 text-sm text-gray-900">{application.name}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Email:</div>
                                            <div className="col-span-2 text-sm text-gray-900">
                                                <a href={`mailto:${application.email}`} className="text-blue-600 hover:text-blue-800">
                                                    {application.email}
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Телефон:</div>
                                            <div className="col-span-2 text-sm text-gray-900">
                                                <a href={`tel:${application.phone}`} className="text-blue-600 hover:text-blue-800">
                                                    {application.phone}
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Дата подачи:</div>
                                            <div className="col-span-2 text-sm text-gray-900">{application.created_at}</div>
                                        </div>
                                        
                                        {application.reviewed_at && (
                                            <div className="grid grid-cols-3">
                                                <div className="text-sm font-medium text-gray-500">Просмотрена:</div>
                                                <div className="col-span-2 text-sm text-gray-900">{application.reviewed_at}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Информация о вакансии */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Вакансия
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Название:</div>
                                            <div className="col-span-2 text-sm text-gray-900">{application.vacancy.title}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Департамент:</div>
                                            <div className="col-span-2 text-sm text-gray-900">{application.vacancy.department}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500">Город:</div>
                                            <div className="col-span-2 text-sm text-gray-900">{application.vacancy.city}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3">
                                            <div className="text-sm font-medium text-gray-500"></div>
                                            <div className="col-span-2">
                                                <Link
                                                    href={route('vacancy.show', application.vacancy.slug)}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Посмотреть вакансию →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Сопроводительное письмо */}
                            {application.cover_letter && (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Сопроводительное письмо
                                        </h3>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
                                    </div>
                                </div>
                            )}

                            {/* Резюме */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Резюме
                                    </h3>
                                    <a
                                        href={application.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Скачать резюме
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Боковая панель */}
                        <div className="space-y-6">
                            {/* Статус */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Статус
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            getStatusBadgeColor(application.status_color)
                                        }`}>
                                            {application.status_label}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => updateStatus('new')}
                                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                                            disabled={processing}
                                        >
                                            Новая
                                        </button>
                                        <button
                                            onClick={() => updateStatus('reviewed')}
                                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                                            disabled={processing}
                                        >
                                            Просмотрена
                                        </button>
                                        <button
                                            onClick={() => updateStatus('contacted')}
                                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                                            disabled={processing}
                                        >
                                            Связались
                                        </button>
                                        <button
                                            onClick={() => updateStatus('rejected')}
                                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                                            disabled={processing}
                                        >
                                            Отклонена
                                        </button>
                                        <button
                                            onClick={() => updateStatus('hired')}
                                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                                            disabled={processing}
                                        >
                                            Принят
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Заметки HR */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Заметки HR
                                    </h3>
                                    
                                    {isEditingNotes ? (
                                        <div>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={6}
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                placeholder="Добавьте заметки..."
                                            />
                                            <div className="mt-2 flex space-x-2">
                                                <button
                                                    onClick={saveNotes}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                    disabled={processing}
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setData('notes', application.notes || '');
                                                        setIsEditingNotes(false);
                                                    }}
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            {application.notes ? (
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                                                    {application.notes}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic mb-3">
                                                    Заметок нет
                                                </p>
                                            )}
                                            <button
                                                onClick={() => setIsEditingNotes(true)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Редактировать
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Действия */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Действия
                                    </h3>
                                    
                                    <button
                                        onClick={deleteApplication}
                                        className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        Удалить заявку
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

VacancyApplicationShow.layout = page => <AdminLayout children={page} />;



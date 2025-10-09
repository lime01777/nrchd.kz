import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ContactApplicationShow({ application, users, statuses }) {
    const { flash = {} } = usePage().props;
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    
    const { data, setData, processing } = useForm({
        status: application.status,
        admin_notes: application.admin_notes || '',
        assigned_to: application.assigned_user?.id || '',
    });

    // Обновить статус
    const updateStatus = (newStatus) => {
        router.patch(
            route('admin.contact-applications.update-status', application.id),
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
            route('admin.contact-applications.update-notes', application.id),
            { admin_notes: data.admin_notes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditingNotes(false);
                },
            }
        );
    };

    // Назначить пользователя
    const assignUser = (userId) => {
        router.patch(
            route('admin.contact-applications.assign', application.id),
            { assigned_to: userId || null },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setData('assigned_to', userId);
                },
            }
        );
    };

    // Удалить заявку
    const deleteApplication = () => {
        if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
            router.delete(route('admin.contact-applications.destroy', application.id));
        }
    };

    // Получить цвет бейджа статуса
    const getStatusBadgeColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
            gray: 'bg-gray-100 text-gray-800',
        };
        return colors[color] || colors.gray;
    };

    // Получить цвет для категории (направления/формы)
    const getCategoryColor = (category) => {
        const colors = {
            general: '#6366f1',           // Индиго - Общие вопросы
            tech_competence: '#8b5cf6',   // Фиолетовый - Техническая компетенция
            medical_tourism: '#10b981',   // Зеленый - Медицинский туризм
            medical_accreditation: '#f59e0b', // Оранжевый - Медицинская аккредитация
            health_rate: '#3b82f6',       // Синий - ОТЗ
            clinics: '#ec4899',           // Розовый - Клиники
            other: '#6b7280',             // Серый - Другое
        };
        return colors[category] || colors.other;
    };

    return (
        <>
            <Head title={`Заявка от ${application.name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href={route('admin.contact-applications.index')}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Назад к списку заявок
                        </Link>
                        
                        {/* Бейдж направления */}
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">Направление:</div>
                            <span className="inline-block text-sm font-semibold px-4 py-2 rounded-lg" style={{
                                backgroundColor: getCategoryColor(application.category) + '20',
                                color: getCategoryColor(application.category),
                                border: `2px solid ${getCategoryColor(application.category)}`
                            }}>
                                {application.category_label}
                            </span>
                        </div>
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
                            {/* Информация о заявителе */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4" style={{borderLeftColor: getCategoryColor(application.category)}}>
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Информация о заявителе
                                        </h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            getStatusBadgeColor(application.status_color)
                                        }`}>
                                            {application.status_label}
                                        </span>
                                    </div>
                                    
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

                                        {application.organization && (
                                            <div className="grid grid-cols-3">
                                                <div className="text-sm font-medium text-gray-500">Организация:</div>
                                                <div className="col-span-2 text-sm text-gray-900">{application.organization}</div>
                                            </div>
                                        )}

                                        {application.project_name && (
                                            <div className="grid grid-cols-3">
                                                <div className="text-sm font-medium text-gray-500">Проект:</div>
                                                <div className="col-span-2 text-sm text-gray-900">{application.project_name}</div>
                                            </div>
                                        )}
                                        
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

                            {/* Тема (если есть) */}
                            {application.subject && (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Тема
                                        </h3>
                                        <p className="text-sm text-gray-900">{application.subject}</p>
                                    </div>
                                </div>
                            )}

                            {/* Сообщение */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Сообщение
                                    </h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.message}</p>
                                </div>
                            </div>

                            {/* Вложение */}
                            {application.attachment_path && (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Вложение
                                        </h3>
                                        <a
                                            href={application.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Скачать вложение
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Боковая панель */}
                        <div className="space-y-6">
                            {/* Управление статусом */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Изменить статус
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <button
                                                key={key}
                                                onClick={() => updateStatus(key)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded ${
                                                    application.status === key
                                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                                disabled={processing}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Назначение пользователю */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Назначить ответственного
                                    </h3>
                                    
                                    <select
                                        value={data.assigned_to}
                                        onChange={(e) => assignUser(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        disabled={processing}
                                    >
                                        <option value="">Не назначена</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>

                                    {application.assigned_user && (
                                        <div className="mt-3 text-sm text-gray-600">
                                            Текущий ответственный: <span className="font-medium">{application.assigned_user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Заметки администратора */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Заметки администратора
                                    </h3>
                                    
                                    {isEditingNotes ? (
                                        <div>
                                            <textarea
                                                value={data.admin_notes}
                                                onChange={(e) => setData('admin_notes', e.target.value)}
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
                                                        setData('admin_notes', application.admin_notes || '');
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
                                            {application.admin_notes ? (
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                                                    {application.admin_notes}
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

ContactApplicationShow.layout = page => <AdminLayout children={page} />;


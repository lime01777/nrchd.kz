import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { route } from '@/ziggy-helper';

export default function ClinicsIndex({ clinics }) {
    const { flash = {} } = usePage().props;

    const handleDelete = (clinic) => {
        if (confirm(`Вы уверены, что хотите удалить клинику "${clinic.name_ru}"?`)) {
            router.delete(route('admin.clinics.destroy', clinic.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Управление клиниками" />
            
            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Клиники Казахстана
                                </h2>
                                <Link
                                    href={route('admin.clinics.create')}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                                >
                                    + Добавить
                                </Link>
                            </div>
                            
                            {/* Flash сообщения */}
                            {flash && flash.success && (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-3 rounded text-sm">
                                    {flash.success}
                                </div>
                            )}
                            
                            {/* Таблица клиник */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Название
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Город
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Статус
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Мед. туризм
                                            </th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {clinics.data && clinics.data.length > 0 ? (
                                            clinics.data.map((clinic) => (
                                                <tr key={clinic.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                            {clinic.name_ru}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {clinic.city_ru || '—'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => {
                                                                router.patch(route('admin.clinics.toggle-published', clinic.id), {}, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => {
                                                                        // Обновление состояния произойдет автоматически через Inertia
                                                                    }
                                                                });
                                                            }}
                                                            className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full cursor-pointer transition-colors ${
                                                                clinic.is_published 
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                            title={clinic.is_published ? 'Нажмите, чтобы скрыть' : 'Нажмите, чтобы опубликовать'}
                                                        >
                                                            {clinic.is_published ? '✓ Опубликована' : '○ Черновик'}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                                            clinic.is_medical_tourism 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {clinic.is_medical_tourism ? 'Да' : 'Нет'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-medium">
                                                        <Link
                                                            href={route('admin.clinics.edit', clinic.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Редактировать
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(clinic)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500 text-sm">
                                                    Клиники не найдены
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Пагинация */}
                            {clinics.links && clinics.links.length > 3 && (
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {clinics.prev_page_url && (
                                            <Link
                                                href={clinics.prev_page_url}
                                                className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Назад
                                            </Link>
                                        )}
                                        {clinics.next_page_url && (
                                            <Link
                                                href={clinics.next_page_url}
                                                className="ml-2 relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Вперед
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs text-gray-700">
                                                Показано <span className="font-medium">{clinics.from || 0}</span> - <span className="font-medium">{clinics.to || 0}</span> из <span className="font-medium">{clinics.total || 0}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {clinics.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-2.5 py-1.5 border text-xs font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ClinicsIndex.layout = page => <AdminLayout title="Клиники">{page}</AdminLayout>;


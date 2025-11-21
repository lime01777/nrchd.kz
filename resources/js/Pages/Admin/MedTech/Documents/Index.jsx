import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function DocumentsIndex({ documents }) {
    const handleDelete = (document) => {
        if (confirm(`Удалить документ "${document.title}"?`)) {
            router.delete(route('admin.medtech.documents.destroy', document.id));
        }
    };

    return (
        <AdminLayout title="Нормативная база MedTech">
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Нормативная база</h1>
                        <Link
                            href={route('admin.medtech.documents.create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Добавить документ
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {documents.data.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                            {doc.description && (
                                                <div className="text-sm text-gray-500 line-clamp-1">{doc.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded ${doc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {doc.is_active ? 'Активен' : 'Неактивен'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                href={route('admin.medtech.documents.edit', doc.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Редактировать
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {documents.links && documents.links.length > 3 && (
                        <div className="mt-4 flex justify-center">
                            <nav className="flex space-x-2">
                                {documents.links.map((link, index) => (
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


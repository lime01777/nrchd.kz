import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ comments }) {
    const { post, delete: destroy } = useForm();

    const handleApprove = (id) => {
        if (confirm('Одобрить этот комментарий?')) {
            post(route('admin.comments.approve', id));
        }
    };

    const handleUnapprove = (id) => {
        if (confirm('Снять этот комментарий с публикации?')) {
            post(route('admin.comments.unapprove', id));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            destroy(route('admin.comments.destroy', id));
        }
    };

    return (
        <AdminLayout title="Управление комментариями">
            <Head title="Комментарии" />

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {comments.data.length > 0 ? comments.data.map((comment) => (
                        <li key={comment.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            {comment.name} ({comment.email})
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            К новости: <span className="font-semibold text-gray-700">{comment.news?.title || 'Удалена'}</span>
                                        </p>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {comment.is_approved ? 'Опубликован' : 'На модерации'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-700 italic">
                                            "{comment.content}"
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    {!comment.is_approved ? (
                                        <button
                                            onClick={() => handleApprove(comment.id)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Одобрить
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUnapprove(comment.id)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            Снять с публикации
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </li>
                    )) : (
                        <li className="px-4 py-8 text-center text-gray-500">Комментариев пока нет</li>
                    )}
                </ul>
            </div>

            {comments.links && comments.links.length > 3 && (
                <div className="mt-4 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {comments.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } ${i === 0 ? 'rounded-l-md' : ''} ${i === comments.links.length - 1 ? 'rounded-r-md' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AdminLayout>
    );
}

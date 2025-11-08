import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

/**
 * Страница списка новостей в админке
 */
export default function Index({ news, filters, section }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const currentType = section?.type || 'news';

    /**
     * Применение фильтров
     */
    const applyFilters = () => {
        router.get(route('admin.news.index', { type: currentType }), {
            search: searchTerm,
            status: statusFilter,
            published_from: filters?.published_from,
            published_to: filters?.published_to,
            type: currentType,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Сброс фильтров
     */
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(route('admin.news.index', { type: currentType }), {
            type: currentType,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Удаление новости
     */
    const handleDelete = (newsItem) => {
        if (confirm(`Вы уверены, что хотите удалить новость "${newsItem.title}"?`)) {
            router.delete(route('admin.news.destroy', { news: newsItem.id, type: currentType }), {
                preserveScroll: true,
            });
        }
    };

    /**
     * Переключение статуса
     */
    const handleToggleStatus = (newsItem) => {
        router.patch(route('admin.news.toggle', { news: newsItem.id, type: currentType }), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={section?.title}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Заголовок */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{section?.title || 'Новости'}</h1>
                            {section?.subtitle && (
                                <p className="mt-1 text-sm text-gray-500">{section.subtitle}</p>
                            )}
                        </div>
                        <Link
                            href={route('admin.news.create', { type: currentType })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {section?.createLabel || 'Создать новость'}
                        </Link>
                    </div>

                    {/* Фильтры */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Поиск */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Поиск
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Поиск по заголовку..."
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Фильтр по статусу */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Статус
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Все</option>
                                    <option value="draft">Черновик</option>
                                    <option value="published">Опубликовано</option>
                                </select>
                            </div>

                            {/* Кнопки */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Применить
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Таблица новостей */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Миниатюра
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Заголовок
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Статус
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Дата публикации
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Создано
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {news.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.cover_thumb_url ? (
                                                <img
                                                    src={item.cover_thumb_url}
                                                    alt={item.cover_image_alt || item.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                            <div className="text-sm text-gray-500">{item.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    item.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.published_at_formatted || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.created_at_formatted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.news.edit', { news: item.id, type: currentType })}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Редактировать
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(item)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    {item.status === 'published' ? 'В черновик' : 'Опубликовать'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Пагинация */}
                        {news.links && news.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {news.links[0].url && (
                                            <Link
                                                href={news.links[0].url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Предыдущая
                                            </Link>
                                        )}
                                        {news.links[news.links.length - 1].url && (
                                            <Link
                                                href={news.links[news.links.length - 1].url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Следующая
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Показано <span className="font-medium">{news.from}</span> до{' '}
                                                <span className="font-medium">{news.to}</span> из{' '}
                                                <span className="font-medium">{news.total}</span> результатов
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {news.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

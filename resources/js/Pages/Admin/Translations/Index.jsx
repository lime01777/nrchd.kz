import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BsTranslate } from "react-icons/bs";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TranslationsIndex({ translations, groups, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedGroup, setSelectedGroup] = useState(filters.group || '');

    const { get, delete: destroy, processing } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.translations.index', {
            search: searchTerm,
            group: selectedGroup
        }));
    };

    const handleAutoTranslateGroup = () => {
        if (selectedGroup && confirm('Автоматически перевести все тексты в группе "' + selectedGroup + '"?')) {
            get(route('admin.translations.auto-translate-group', {
                group: selectedGroup
            }));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Вы уверены, что хотите удалить этот перевод?')) {
            destroy(route('admin.translations.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Управление переводами" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Управление переводами</h1>
                                <div className="flex gap-2">
                                    <Link 
                                        href={route('admin.translations.create')} 
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Создать перевод
                                    </Link>
                                    {selectedGroup && (
                                        <button
                                            onClick={handleAutoTranslateGroup}
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <BsTranslate className="mr-2" />
                                            Автоперевод группы
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Поиск по переводам..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:w-1/4">
                                        <select
                                            value={selectedGroup}
                                            onChange={(e) => setSelectedGroup(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Все группы</option>
                                            {groups.map((group, index) => (
                                                <option key={index} value={group}>
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Поиск
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Ключ
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Группа
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                RU
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                EN
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                KK
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {translations.data.length > 0 ? (
                                            translations.data.map((translation) => (
                                                <tr key={translation.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {translation.key}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {translation.group}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">
                                                        {translation.ru}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">
                                                        {translation.en || (
                                                            <span className="text-red-500 italic">отсутствует</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">
                                                        {translation.kk || (
                                                            <span className="text-red-500 italic">отсутствует</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <Link
                                                                href={route('admin.translations.edit', translation.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <FaEdit size={18} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(translation.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FaTrash size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                                    Переводы не найдены
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {translations.data.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={translations.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Simple Pagination component
function Pagination({ links }) {
    return (
        <div className="flex items-center justify-center mt-4">
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <div
                            key={i}
                            className="px-4 py-2 mx-1 text-gray-500 bg-white rounded-md"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={`px-4 py-2 mx-1 rounded-md ${
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'text-blue-600 bg-white hover:bg-blue-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

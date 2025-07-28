import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function VacanciesIndex({ vacancies }) {
    // Безопасное извлечение flash сообщений с проверкой на undefined
    const { flash = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    
    // Функция для фильтрации вакансий по поиску
    const filteredVacancies = vacancies.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <>
            <Head title="Управление вакансиями" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Вакансии</h2>
                                <Link
                                    href={route('vacancies.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Добавить вакансию
                                </Link>
                            </div>
                            
                            {/* Flash сообщения */}
                            {flash && flash.message && (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                                    {flash.message}
                                </div>
                            )}
                            
                            {/* Строка поиска */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Поиск вакансий..."
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            {/* Таблица вакансий */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">ID</th>
                                            <th className="py-3 px-4 border-b text-left">Название</th>
                                            <th className="py-3 px-4 border-b text-left">Департамент</th>
                                            <th className="py-3 px-4 border-b text-left">Город</th>
                                            <th className="py-3 px-4 border-b text-left">Статус</th>
                                            <th className="py-3 px-4 border-b text-left">Дата публикации</th>
                                            <th className="py-3 px-4 border-b text-left">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredVacancies.length > 0 ? (
                                            filteredVacancies.map((vacancy) => (
                                                <tr key={vacancy.id}>
                                                    <td className="py-3 px-4 border-b">{vacancy.id}</td>
                                                    <td className="py-3 px-4 border-b">{vacancy.title}</td>
                                                    <td className="py-3 px-4 border-b">{vacancy.department}</td>
                                                    <td className="py-3 px-4 border-b">{vacancy.city}</td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            vacancy.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {vacancy.status === 'published' ? 'Опубликовано' : 'Черновик'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">{formatDate(vacancy.published_at)}</td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('vacancies.edit', vacancy.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Редактировать
                                                            </Link>
                                                            
                                                            <Link
                                                                href={route('vacancy.show', vacancy.slug)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                target="_blank"
                                                            >
                                                                Просмотр
                                                            </Link>
                                                            
                                                            <Link
                                                                href={route('vacancies.destroy', vacancy.id)}
                                                                method="delete"
                                                                as="button"
                                                                type="button"
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={(e) => {
                                                                    if (!confirm('Вы уверены, что хотите удалить эту вакансию?')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                Удалить
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="py-3 px-4 border-b text-center text-gray-500">
                                                    {searchTerm ? 'Вакансии не найдены' : 'Нет доступных вакансий'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

VacanciesIndex.layout = page => <AdminLayout title="Управление вакансиями">{page}</AdminLayout>;

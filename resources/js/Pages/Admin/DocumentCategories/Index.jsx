import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, categories }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Категории документов</h2>}
    >
      <Head title="Категории документов" meta={[{ name: 'description', content: 'Админ-панель: Категории документов.' }]} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">Категории документов</h1>
                <Link 
                  href={route('admin.document-categories.create')} 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Добавить категорию
                </Link>
              </div>

              {categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="w-full h-16 border-b border-gray-200 bg-gray-50">
                        <th className="text-left pl-4">ID</th>
                        <th className="text-left">Название</th>
                        <th className="text-left">ID аккордеона</th>
                        <th className="text-left">Страница</th>
                        <th className="text-left">Порядок</th>
                        <th className="text-left">Статус</th>
                        <th className="text-left">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id} className="h-16 border-b border-gray-200 hover:bg-gray-50">
                          <td className="pl-4">{category.id}</td>
                          <td>{category.title}</td>
                          <td>{category.accordion_id}</td>
                          <td>{category.page || '-'}</td>
                          <td>{category.order}</td>
                          <td>
                            <span className={`px-2 py-1 rounded text-xs ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {category.is_active ? 'Активно' : 'Неактивно'}
                            </span>
                          </td>
                          <td className="flex space-x-2">
                            <Link 
                              href={route('admin.document-categories.edit', category.id)} 
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Изменить
                            </Link>
                            <Link 
                              href={route('admin.document-categories.destroy', category.id)} 
                              method="delete" 
                              as="button" 
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={(e) => {
                                if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Удалить
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Нет доступных категорий документов</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

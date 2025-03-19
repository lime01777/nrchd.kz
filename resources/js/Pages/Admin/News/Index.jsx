import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, usePage, router } from '@inertiajs/react';

export default function NewsIndex() {
  const { news, filters, flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  
  // Фильтрация новостей по поисковому запросу
  const filteredNews = searchQuery 
    ? news.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  // Функция для определения цвета статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'Опубликовано':
        return 'bg-green-100 text-green-800';
      case 'Черновик':
        return 'bg-gray-100 text-gray-800';
      case 'Запланировано':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Функция для удаления новости
  const handleDelete = (id) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      router.delete(route('admin.news.destroy', id));
    }
  };

  return (
    <>
      {flash && flash.success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Управление новостями</h2>
        <Link
          href={route('admin.news.create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить новость
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск новостей..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredNews.length > 0 ? (
            filteredNews.map((newsItem) => (
              <li key={newsItem.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{newsItem.title}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(newsItem.status)}`}>
                        {newsItem.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {newsItem.category}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>
                        {newsItem.publish_date || newsItem.publishDate || 'Не опубликовано'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <Link
                      href={route('admin.news.edit', newsItem.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Изменить
                    </Link>
                    <Link
                      href={route('news.show', newsItem.slug)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Просмотр
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => handleDelete(newsItem.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              Новости не найдены
            </li>
          )}
        </ul>
      </div>

      {/* Пагинация */}
      <div className="mt-6">
        <nav className="flex items-center justify-between">
          <div className="flex-1 flex justify-between">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
            >
              Предыдущая
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
            >
              Следующая
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

NewsIndex.layout = page => <AdminLayout title="Управление новостями">{page}</AdminLayout>;

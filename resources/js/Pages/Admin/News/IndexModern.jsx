import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import StatusBadge from '@/Components/Admin/News/StatusBadge';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function IndexModern({ news, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || '');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
  const [showFilters, setShowFilters] = useState(false);

  // Обработка поиска
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.news'), {
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter
    }, {
      preserveState: true,
      replace: true
    });
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    router.get(route('admin.news'), {}, {
      preserveState: true,
      replace: true
    });
  };

  // Удаление новости
  const handleDelete = (id) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      router.delete(route('admin.news.destroy', id));
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получение уникальных категорий
  const getUniqueCategories = () => {
    const categories = new Set();
    news.data.forEach(item => {
      if (Array.isArray(item.category)) {
        item.category.forEach(cat => categories.add(cat));
      } else if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  };

  // Подсчет медиа файлов
  const getMediaCount = (item) => {
    if (Array.isArray(item.images)) {
      return item.images.length;
    }
    return 0;
  };

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Новости</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Управление новостями и публикациями
                </p>
              </div>
              <Link
                href={route('admin.news.create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Создать новость
              </Link>
            </div>
          </div>

          {/* Фильтры и поиск */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Основная строка поиска */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Поиск по заголовку или содержимому..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FunnelIcon className="w-4 h-4 mr-2" />
                  Фильтры
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Найти
                </button>
              </div>

              {/* Дополнительные фильтры */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Статус
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Все статусы</option>
                      <option value="Черновик">Черновик</option>
                      <option value="Опубликовано">Опубликовано</option>
                      <option value="Запланировано">Запланировано</option>
                      <option value="Архив">Архив</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Категория
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Все категории</option>
                      {getUniqueCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Список новостей */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {news.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Новости не найдены</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters?.search || filters?.status || filters?.category 
                    ? 'Попробуйте изменить фильтры.' 
                    : 'Начните с создания первой новости.'
                  }
                </p>
                {!filters?.search && !filters?.status && !filters?.category && (
                  <div className="mt-6">
                    <Link
                      href={route('admin.news.create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Создать новость
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {news.data.map((item) => (
                  <li key={item.id} className="hover:bg-gray-50 transition-colors">
                    <div className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Заголовок и статус */}
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2 ml-4">
                              <StatusBadge status={item.status} />
                            </div>
                          </div>

                          {/* Содержимое */}
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Нет содержимого'}
                          </p>

                          {/* Метаинформация */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                            
                            {item.publish_date && (
                              <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span>Публикация: {formatDate(item.publish_date)}</span>
                              </div>
                            )}

                            {getMediaCount(item) > 0 && (
                              <div className="flex items-center">
                                <PhotoIcon className="w-4 h-4 mr-1" />
                                <span>{getMediaCount(item)} медиа</span>
                              </div>
                            )}

                            {Array.isArray(item.category) && item.category.length > 0 && (
                              <div className="flex items-center">
                                <TagIcon className="w-4 h-4 mr-1" />
                                <span>{item.category.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Действия */}
                        <div className="ml-4 flex items-center space-x-2">
                          <Link
                            href={`/news/${item.slug}`}
                            target="_blank"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            title="Просмотреть"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <Link
                            href={route('admin.news.edit', item.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            title="Редактировать"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                            title="Удалить"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Пагинация */}
          {news.data.length > 0 && news.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано {news.from} - {news.to} из {news.total} результатов
              </div>
              <div className="flex space-x-2">
                {news.prev_page_url && (
                  <Link
                    href={news.prev_page_url}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Назад
                  </Link>
                )}
                {news.next_page_url && (
                  <Link
                    href={news.next_page_url}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Вперед
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

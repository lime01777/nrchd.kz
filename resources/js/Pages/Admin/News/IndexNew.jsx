import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import StatusBadge from '@/Components/Admin/News/StatusBadge';

export default function NewsIndexNew({ news, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || '');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNews, setSelectedNews] = useState([]);

  // Обработка поиска
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.news.index'), {
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
    router.get(route('admin.news.index'), {}, {
      preserveState: true,
      replace: true
    });
  };

  // Удаление новости
  const handleDelete = (id) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      router.delete(route('admin.news.destroy', id), {
        onSuccess: () => {
          setSelectedNews(selectedNews.filter(newsId => newsId !== id));
        }
      });
    }
  };

  // Массовое удаление
  const handleBulkDelete = () => {
    if (selectedNews.length === 0) return;
    
    if (confirm(`Вы уверены, что хотите удалить ${selectedNews.length} новостей?`)) {
      router.post(route('admin.news.bulk'), {
        action: 'delete',
        ids: selectedNews
      }, {
        onSuccess: () => {
          setSelectedNews([]);
        }
      });
    }
  };

  // Выбор всех новостей
  const toggleSelectAll = () => {
    if (selectedNews.length === news.data.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(news.data.map(item => item.id));
    }
  };

  // Переключение выбора отдельной новости
  const toggleSelectNews = (id) => {
    if (selectedNews.includes(id)) {
      setSelectedNews(selectedNews.filter(newsId => newsId !== id));
    } else {
      setSelectedNews([...selectedNews, id]);
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
    if (!item.images) return 0;
    const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
    return images.length;
  };

  // Получение превью изображения
  const getPreviewImage = (item) => {
    if (item.main_image) return item.main_image;
    if (item.image) return item.image;
    if (!item.images) return null;
    
    try {
      const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
      if (images.length > 0) {
        const firstImage = images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.path;
      }
    } catch (e) {
      console.error('Error parsing images:', e, item.images);
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок и кнопка создания */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Управление новостями</h1>
                <p className="mt-2 text-blue-100">
                  Всего новостей: {news.total}
                </p>
              </div>
              <Link
                href={route('admin.news.create', 'news')}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-2xl shadow-lg text-sm font-bold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Создать новость
              </Link>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="mb-6 bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Поиск */}
              <div className="flex-1 min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Поиск
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск по заголовку или содержимому..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Фильтр по статусу */}
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Все статусы</option>
                  <option value="published">Опубликовано</option>
                  <option value="draft">Черновик</option>
                  <option value="scheduled">Запланировано</option>
                  <option value="archived">Архив</option>
                </select>
              </div>

              {/* Фильтр по категории */}
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Все категории</option>
                  {getUniqueCategories().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Кнопки */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-medium"
                >
                  Применить
                </button>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50/50 transition"
                >
                  Сбросить
                </button>
              </div>
            </div>

            {/* Массовые действия */}
            {selectedNews.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    Выбрано: {selectedNews.length} новостей
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition text-sm font-medium"
                  >
                    🗑 Удалить выбранные
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Список новостей */}
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 overflow-hidden">
            {news.data.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Новостей нет</h3>
                <p className="mt-1 text-sm text-gray-500">Создайте первую новость</p>
                <div className="mt-6">
                    <Link
                      href={route('admin.news.create', 'news')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Создать новость
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedNews.length === news.data.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Превью
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Новость
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Категории
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {news.data.map((item) => {
                        const previewImage = getPreviewImage(item);
                        const mediaCount = getMediaCount(item);
                        
                        return (
                          <tr 
                            key={item.id} 
                            className={`hover:bg-gray-50/50 transition ${selectedNews.includes(item.id) ? 'bg-blue-50' : ''}`}
                          >
                            {/* Чекбокс */}
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedNews.includes(item.id)}
                                onChange={() => toggleSelectNews(item.id)}
                                className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                              />
                            </td>

                            {/* Превью изображения */}
                            <td className="px-6 py-4">
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt={item.title}
                                  className="h-16 w-24 object-cover rounded-2xl shadow-sm"
                                />
                              ) : (
                                <div className="h-16 w-24 bg-gray-200 rounded-2xl flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </td>

                            {/* Информация о новости */}
                            <td className="px-6 py-4">
                              <div className="max-w-md">
                                <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                  Slug: <span className="font-mono">{item.slug}</span>
                                </div>
                                {mediaCount > 0 && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {mediaCount} медиа
                                  </div>
                                )}
                                {item.views > 0 && (
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {item.views} просмотров
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Категории */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {Array.isArray(item.category) ? (
                                  item.category.map((cat, index) => (
                                    <span 
                                      key={index} 
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-xl text-xs font-medium"
                                    >
                                      {cat}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-xl text-xs font-medium">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Статус */}
                            <td className="px-6 py-4">
                              <StatusBadge status={item.status} />
                            </td>

                            {/* Дата */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(item.publish_date || item.created_at)}
                              </div>
                            </td>

                            {/* Действия */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center gap-2">
                                {item.slug && (
                                  <a
                                    href={route('news.show', item.slug)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-900 transition"
                                    title="Просмотреть"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </a>
                                )}
                                <Link
                                  href={route('admin.news.edit', item.id)}
                                  className="text-indigo-600 hover:text-indigo-900 transition"
                                  title="Редактировать"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-600 hover:text-red-900 transition"
                                  title="Удалить"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Пагинация */}
                {news.last_page > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {news.prev_page_url && (
                        <Link
                          href={news.prev_page_url}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50/50"
                        >
                          Назад
                        </Link>
                      )}
                      {news.next_page_url && (
                        <Link
                          href={news.next_page_url}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50/50"
                        >
                          Вперед
                        </Link>
                      )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Показано с{' '}
                          <span className="font-medium">{news.from}</span>
                          {' '}по{' '}
                          <span className="font-medium">{news.to}</span>
                          {' '}из{' '}
                          <span className="font-medium">{news.total}</span>
                          {' '}новостей
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                          {news.links.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url || '#'}
                              preserveScroll
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                link.active
                                  ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50/50'
                              } ${index === 0 ? 'rounded-l-md' : ''} ${
                                index === news.links.length - 1 ? 'rounded-r-md' : ''
                              }`}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


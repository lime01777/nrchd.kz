import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, usePage, router } from '@inertiajs/react';
import Select from 'react-select';

export default function NewsIndex() {
  const { news, filters, flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Собираем уникальные категории из новостей
  const allCategories = Array.from(new Set(news.flatMap(n => Array.isArray(n.category) ? n.category : [n.category]).filter(Boolean)));
  const categoryOptions = [{ value: '', label: 'Все категории' }, ...allCategories.map(cat => ({ value: cat, label: cat }))];
  const [selectedCategory, setSelectedCategory] = useState('');

  // Фильтрация новостей по поисковому запросу и категории
  const filteredNews = news.filter(item => {
    const matchesSearch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || (Array.isArray(item.category) ? item.category.includes(selectedCategory) : item.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

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

  // Массовые действия
  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !confirm('Вы уверены, что хотите удалить выбранные новости?')) return;
    router.post(route('admin.news.bulk'), { ids: selectedIds, action }, {
      onSuccess: () => {
        setSelectedIds([]);
        setSelectAll(false);
      }
    });
  };

  // Обработка чекбоксов
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filteredNews.map((n) => n.id));
      setSelectAll(true);
    }
  };

  return (
    <>
      {flash && flash.success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      {/* Кнопки массовых действий */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="form-checkbox h-5 w-5 text-blue-600 mr-2"
        />
        <span className="mr-4 text-sm">Выделить все</span>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          onClick={() => handleBulkAction('publish')}
          disabled={selectedIds.length === 0}
        >
          Опубликовать
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          onClick={() => handleBulkAction('draft')}
          disabled={selectedIds.length === 0}
        >
          В черновик
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          onClick={() => handleBulkAction('delete')}
          disabled={selectedIds.length === 0}
        >
          Удалить
        </button>
        {selectedIds.length > 0 && (
          <span className="ml-4 text-sm text-gray-500">Выбрано: {selectedIds.length}</span>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-1/2">
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
        <div className="w-full sm:w-1/3 min-w-[180px]">
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === selectedCategory) || categoryOptions[0]}
            onChange={opt => setSelectedCategory(opt.value)}
            classNamePrefix="react-select"
            placeholder="Категория..."
            isSearchable={false}
            styles={{
              control: (base) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: '#cbd5e1', boxShadow: 'none' }),
              option: (base, state) => ({ ...base, background: state.isFocused ? '#f3f4f6' : 'white', color: '#1e293b' })
            }}
          />
        </div>
      </div>

      {/* Карточки новостей */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNews.length > 0 ? (
          filteredNews.map((newsItem) => (
            <div key={newsItem.id} className={`bg-white shadow rounded-lg flex flex-col relative border ${selectedIds.includes(newsItem.id) ? 'border-blue-500' : 'border-transparent'}`}>
              <input
                type="checkbox"
                checked={selectedIds.includes(newsItem.id)}
                onChange={() => handleCheckboxChange(newsItem.id)}
                className="absolute top-2 left-2 z-10 h-4 w-4 text-blue-600 form-checkbox bg-white border-gray-300 rounded shadow"
                style={{ boxShadow: '0 1px 4px #cbd5e1' }}
              />
              {newsItem.image && (
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
              )}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 pl-6">{newsItem.category}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(newsItem.status)}`}>
                    {newsItem.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-blue-700 mb-1 truncate" title={newsItem.title}>{newsItem.title}</h3>
                <div className="text-xs text-gray-400 mb-2">{newsItem.publish_date || newsItem.publishDate || 'Не опубликовано'}</div>
                <div className="mt-auto flex flex-wrap gap-2">
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
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Новости не найдены
          </div>
        )}
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

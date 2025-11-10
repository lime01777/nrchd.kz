import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ applications, filters, categories, stages }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [selectedStage, setSelectedStage] = useState(filters.stage || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

  const handleFilter = () => {
    router.get(route('admin.admin.otz-applications.index'), {
      search: searchTerm,
      category: selectedCategory,
      stage: selectedStage,
      status: selectedStatus,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStage('');
    setSelectedStatus('');
    router.get(route('admin.admin.otz-applications.index'), {}, {
      preserveState: true,
      replace: true,
    });
  };

  const getCategoryColor = (category) => {
    return category === 'Комплексная' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getStageColor = (stage) => {
    const stageColors = {
      'Подача заявки': 'text-blue-600',
      'Проверка документов': 'text-blue-600',
      'Проведение ОТЗ': 'text-blue-600',
      'Рассмотрение комиссиями': 'text-orange-600',
      'Бюджетное одобрение': 'text-orange-600',
      'Формирование тарифов': 'text-green-600'
    };
    return stageColors[stage] || 'text-gray-600';
  };

  return (
    <AdminLayout>
      <Head title="Управление заявками ОТЗ" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {/* Заголовок */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Управление заявками ОТЗ</h2>
                <Link
                  href={route('admin.admin.otz-applications.create')}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Создать заявку
                </Link>
              </div>

              {/* Фильтры */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Фильтры</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
                    <input
                      type="text"
                      placeholder="Поиск по названию или ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">Все категории</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Этап</label>
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">Все этапы</option>
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="">Все статусы</option>
                      <option value="active">Активные</option>
                      <option value="inactive">Неактивные</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={handleFilter}
                      className="flex-1 px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors"
                    >
                      Применить
                    </button>
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              </div>

              {/* Таблица заявок */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID заявки
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Текущий этап
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ответственное лицо
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.data.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {application.application_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(application.category)}`}>
                            {application.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getStageColor(application.current_stage)}`}>
                            {application.current_stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.responsible_person || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            application.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {application.is_active ? 'Активна' : 'Неактивна'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={route('admin.admin.otz-applications.show', application.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Просмотр
                            </Link>
                            <Link
                              href={route('admin.admin.otz-applications.edit', application.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Редактировать
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
                                  router.delete(route('admin.admin.otz-applications.destroy', application.id));
                                }
                              }}
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
              </div>

              {/* Пагинация */}
              {applications.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {applications.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          link.active
                            ? 'bg-fuchsia-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}

              {/* Статистика */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{applications.total}</div>
                  <div className="text-sm text-blue-600">Всего заявок</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.data.filter(app => app.is_active).length}
                  </div>
                  <div className="text-sm text-green-600">Активных заявок</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {applications.data.filter(app => app.category === 'Комплексная').length}
                  </div>
                  <div className="text-sm text-purple-600">Комплексных заявок</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {applications.data.filter(app => app.current_stage === 'Проведение ОТЗ').length}
                  </div>
                  <div className="text-sm text-orange-600">В процессе ОТЗ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

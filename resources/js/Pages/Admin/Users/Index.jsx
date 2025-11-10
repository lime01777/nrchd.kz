import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';

export default function UsersIndex() {
  const { users, filters = {}, availableRoles = {}, flash = {} } = usePage().props;
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [pendingUserId, setPendingUserId] = useState(null);

  const roleOptions = Object.entries(availableRoles);
  const paginationLinks = users?.links || [];

  const handleSearch = (event) => {
    event.preventDefault();
    router.get(route('admin.admin.users'), { search: searchQuery }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    router.get(route('admin.admin.users'), {}, { preserveState: true, replace: true });
  };

  const handleRoleChange = (userId, newRole) => {
    setPendingUserId(userId);
    router.patch(route('admin.admin.users.update-role', userId), { role: newRole }, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => setPendingUserId(null),
    });
  };

  const handleDelete = (user) => {
    if (!confirm(`Удалить пользователя ${user.name}?`)) {
      return;
    }
    setPendingUserId(user.id);
    router.delete(route('admin.admin.users.destroy', user.id), {
      preserveScroll: true,
      onFinish: () => setPendingUserId(null),
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Управление пользователями</h2>
        <Link
          href={route('admin.admin.users.create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить пользователя
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
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
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Сбросить
            </button>
          </div>
        </div>
      </form>

      {flash?.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {flash.error}
        </div>
      )}
      {flash?.success && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {flash.success}
        </div>
      )}

      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Доступ к админке
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(users?.data || []).map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                        disabled={pendingUserId === user.id}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {roleOptions.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.has_admin_access ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {user.has_admin_access ? 'Есть доступ' : 'Нет доступа'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={route('admin.admin.users.edit', user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Изменить
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          disabled={pendingUserId === user.id}
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
        </div>
      </div>

      {paginationLinks.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            {paginationLinks.map((link, index) => {
              const key = link.url ?? `page-${index}`;
              const commonClasses = 'px-3 py-2 text-sm font-medium rounded-md';

              if (!link.url) {
                return (
                  <span
                    key={key}
                    className={`${commonClasses} bg-white text-gray-400 border border-gray-200 cursor-not-allowed`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              }

              return (
                <Link
                  key={key}
                  href={link.url}
                  className={`${commonClasses} ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

UsersIndex.layout = (page) => <AdminLayout title="Управление пользователями">{page}</AdminLayout>;

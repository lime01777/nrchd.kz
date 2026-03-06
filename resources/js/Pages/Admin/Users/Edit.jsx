import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function UserEdit({ user = null, availableRoles = {}, availablePermissions = {}, availableDocumentFolders = [] }) {
  const isEditing = !!user;

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    password_confirmation: '',
    permissions: user?.permissions || [],
    document_folders: user?.document_folders || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route('admin.users.update', user.id));
    } else {
      post(route('admin.users.store'));
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Редактирование пользователя' : 'Добавление пользователя'}
        </h2>
        <Link
          href={route('admin.users')}
          className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50/50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </Link>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden rounded-2xl border border-gray-100/50">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              {/* Имя пользователя */}
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Имя пользователя
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded-xl"
                    required
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded-xl"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Роль */}
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Роль
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded-xl"
                    required
                  >
                    {Object.entries(availableRoles).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Пароль */}
              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {isEditing ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded-xl"
                    required={!isEditing}
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Подтверждение пароля */}
              <div className="sm:col-span-3">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Подтверждение пароля
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded-xl"
                    required={!isEditing}
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                )}
              </div>

              {/* Права доступа (чекбоксы) */}
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Права доступа к разделам</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(availablePermissions).map(([value, label]) => (
                    <div key={value} className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={`permission-${value}`}
                          name="permissions[]"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          checked={data.permissions.includes(value)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setData('permissions', [...data.permissions, value]);
                            } else {
                              setData('permissions', data.permissions.filter(p => p !== value));
                            }
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`permission-${value}`} className="font-medium text-gray-700">
                          {label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="mt-2 text-sm text-red-600">{errors.permissions}</p>
                )}
              </div>

              {/* Права на папки документов */}
              {(data.permissions.includes('documents') || data.role === 'admin' || data.role === 'document_manager') && availableDocumentFolders.length > 0 && (
                <div className="sm:col-span-6 mt-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-md font-bold leading-6 text-blue-900">Доступ к папкам документов</h3>
                    {data.role === 'admin' && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                        Админ имеет доступ ко всем папкам
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableDocumentFolders.map((folder) => (
                      <div key={folder} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={`folder-${folder}`}
                            name="document_folders[]"
                            type="checkbox"
                            className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                            checked={data.document_folders.includes(folder) || data.role === 'admin'}
                            disabled={data.role === 'admin'}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                setData('document_folders', [...data.document_folders, folder]);
                              } else {
                                setData('document_folders', data.document_folders.filter(f => f !== folder));
                              }
                            }}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`folder-${folder}`} className="font-medium text-blue-900">
                            {folder}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50/50 text-right sm:px-6">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {processing ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Добавить пользователя'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

UserEdit.layout = page => <AdminLayout title={page.props.user ? 'Редактирование пользователя' : 'Добавление пользователя'}>{page}</AdminLayout>;

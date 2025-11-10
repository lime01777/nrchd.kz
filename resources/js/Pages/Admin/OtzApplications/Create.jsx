import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories, stages }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    category: '',
    current_stage: '',
    description: '',
    responsible_person: '',
    phone: '',
    email: '',
    stage_start_date: '',
    stage_end_date: '',
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.admin.otz-applications.store'));
  };

  return (
    <AdminLayout>
      <Head title="Создание заявки ОТЗ" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {/* Заголовок */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Создание заявки ОТЗ</h2>
                <Link
                  href={route('admin.admin.otz-applications.index')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Назад к списку
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Основная информация */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название проекта *
                      </label>
                      <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Введите название проекта"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Категория *
                      </label>
                      <select
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Текущий этап *
                      </label>
                      <select
                        value={data.current_stage}
                        onChange={(e) => setData('current_stage', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.current_stage ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Выберите этап</option>
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                      {errors.current_stage && (
                        <p className="mt-1 text-sm text-red-600">{errors.current_stage}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Статус
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={data.is_active}
                          onChange={(e) => setData('is_active', e.target.checked)}
                          className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Активная заявка</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание проекта
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Введите описание проекта"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Контактная информация */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Контактная информация</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ответственное лицо
                      </label>
                      <input
                        type="text"
                        value={data.responsible_person}
                        onChange={(e) => setData('responsible_person', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.responsible_person ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ФИО ответственного лица"
                      />
                      {errors.responsible_person && (
                        <p className="mt-1 text-sm text-red-600">{errors.responsible_person}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+7 (XXX) XXX-XX-XX"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Сроки этапа */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Сроки текущего этапа</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата начала этапа
                      </label>
                      <input
                        type="date"
                        value={data.stage_start_date}
                        onChange={(e) => setData('stage_start_date', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.stage_start_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.stage_start_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.stage_start_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата окончания этапа
                      </label>
                      <input
                        type="date"
                        value={data.stage_end_date}
                        onChange={(e) => setData('stage_end_date', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${
                          errors.stage_end_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.stage_end_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.stage_end_date}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end space-x-4">
                  <Link
                    href={route('admin.admin.otz-applications.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors disabled:opacity-50"
                  >
                    {processing ? 'Создание...' : 'Создать заявку'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

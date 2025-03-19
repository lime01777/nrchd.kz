import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function DocumentEdit({ document = null }) {
  const isEditing = !!document;
  
  const { data, setData, post, put, processing, errors } = useForm({
    title: document?.title || '',
    category: document?.category || '',
    description: document?.description || '',
    file: null,
    currentFile: document?.file || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route('admin.documents.update', document.id));
    } else {
      post(route('admin.documents.store'));
    }
  };

  // Категории документов
  const categories = [
    { id: 'medical-education', name: 'Медицинское образование' },
    { id: 'human-resources', name: 'Кадровые ресурсы' },
    { id: 'drug-policy', name: 'Лекарственная политика' },
    { id: 'medical-science', name: 'Медицинская наука' },
    { id: 'medical-rating', name: 'Рейтинг медицинских организаций' },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Редактирование документа' : 'Добавление документа'}
        </h2>
        <Link
          href={route('admin.documents')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              {/* Название документа */}
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Название документа
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Категория */}
              <div className="sm:col-span-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Категория
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Описание */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Описание
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Файл */}
              <div className="sm:col-span-6">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Файл
                </label>
                <div className="mt-1">
                  {isEditing && data.currentFile && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Текущий файл: {data.currentFile}</p>
                    </div>
                  )}
                  <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Загрузить файл</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={(e) => setData('file', e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">или перетащите сюда</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX, XLSX до 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {processing ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Добавить документ'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

DocumentEdit.layout = page => <AdminLayout title={page.props.document ? 'Редактирование документа' : 'Добавление документа'}>{page}</AdminLayout>;

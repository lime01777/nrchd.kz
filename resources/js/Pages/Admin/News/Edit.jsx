import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function NewsEdit({ news = null }) {
  const isEditing = !!news;
  
  const { data, setData, post, put, processing, errors } = useForm({
    title: news?.title || '',
    slug: news?.slug || '',
    category: news?.category || '',
    content: news?.content || '',
    image: null,
    status: news?.status || 'Черновик',
    publishDate: news?.publishDate || new Date().toISOString().substr(0, 10),
  });

  // Автоматическое создание slug из заголовка
  useEffect(() => {
    if (!isEditing && data.title) {
      const slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setData('slug', slug);
    }
  }, [data.title, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route('admin.news.update', news.id));
    } else {
      post(route('admin.news.store'));
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Редактирование новости' : 'Создание новости'}
        </h2>
        <Link
          href={route('admin.news')}
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
              {/* Заголовок */}
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Заголовок
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

              {/* Slug */}
              <div className="sm:col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                {errors.slug && (
                  <p className="mt-2 text-sm text-red-600">{errors.slug}</p>
                )}
              </div>

              {/* Категория */}
              <div className="sm:col-span-3">
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
                    <option value="Общие">Общие</option>
                    <option value="Аккредитация">Аккредитация</option>
                    <option value="Обучение">Обучение</option>
                    <option value="Конференции">Конференции</option>
                    <option value="Методические материалы">Методические материалы</option>
                    <option value="Исследования">Исследования</option>
                    <option value="Анонсы">Анонсы</option>
                  </select>
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Статус */}
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Статус
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="Черновик">Черновик</option>
                    <option value="Опубликовано">Опубликовано</option>
                    <option value="Запланировано">Запланировано</option>
                  </select>
                </div>
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              {/* Дата публикации */}
              <div className="sm:col-span-3">
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                  Дата публикации
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="publishDate"
                    id="publishDate"
                    value={data.publishDate}
                    onChange={(e) => setData('publishDate', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                {errors.publishDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.publishDate}</p>
                )}
              </div>

              {/* Изображение */}
              <div className="sm:col-span-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Изображение
                </label>
                <div className="mt-1 flex items-center">
                  {isEditing && news.image && (
                    <div className="mr-4">
                      <img src={news.image} alt={news.title} className="h-32 w-auto object-cover rounded-md" />
                    </div>
                  )}
                  <div className="flex-1">
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
                              onChange={(e) => setData('image', e.target.files[0])}
                            />
                          </label>
                          <p className="pl-1">или перетащите сюда</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF до 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Содержание */}
              <div className="sm:col-span-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Содержание
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
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
              {processing ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать новость'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

NewsEdit.layout = page => <AdminLayout title={page.props.news ? 'Редактирование новости' : 'Создание новости'}>{page}</AdminLayout>;

import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function DocumentsIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Моковые данные категорий документов
  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'medical-education', name: 'Медицинское образование' },
    { id: 'human-resources', name: 'Кадровые ресурсы' },
    { id: 'drug-policy', name: 'Лекарственная политика' },
    { id: 'medical-science', name: 'Медицинская наука' },
    { id: 'medical-rating', name: 'Рейтинг медицинских организаций' },
  ];
  
  // Моковые данные документов
  const documents = [
    { id: 1, title: 'Методические рекомендации по аккредитации', category: 'medical-education', date: '15.03.2024', size: '2.5 MB', type: 'pdf' },
    { id: 2, title: 'Стандарты аккредитации медицинских организаций', category: 'medical-rating', date: '10.03.2024', size: '1.8 MB', type: 'pdf' },
    { id: 3, title: 'Отчет о кадровых ресурсах 2023', category: 'human-resources', date: '05.03.2024', size: '3.2 MB', type: 'docx' },
    { id: 4, title: 'Руководство по лекарственной политике', category: 'drug-policy', date: '01.03.2024', size: '4.5 MB', type: 'pdf' },
    { id: 5, title: 'Научные исследования в медицине', category: 'medical-science', date: '25.02.2024', size: '2.1 MB', type: 'pdf' },
    { id: 6, title: 'Рейтинг медицинских организаций 2023', category: 'medical-rating', date: '20.02.2024', size: '5.3 MB', type: 'xlsx' },
    { id: 7, title: 'Программа обучения медицинских работников', category: 'medical-education', date: '15.02.2024', size: '1.7 MB', type: 'pdf' },
  ];

  // Фильтрация документов по поисковому запросу и категории
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Функция для определения иконки типа файла
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 11.5h10v1H7zM7 8.5h10v1H7zM7 14.5h7v1H7z" />
            <path d="M19.5 3.5v17a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1zm-1 0h-13v17h13v-17z" />
          </svg>
        );
      case 'docx':
        return (
          <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 11.5h10v1H7zM7 8.5h10v1H7zM7 14.5h7v1H7z" />
            <path d="M19.5 3.5v17a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1zm-1 0h-13v17h13v-17z" />
          </svg>
        );
      case 'xlsx':
        return (
          <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 11.5h10v1H7zM7 8.5h10v1H7zM7 14.5h7v1H7z" />
            <path d="M19.5 3.5v17a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1zm-1 0h-13v17h13v-17z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 11.5h10v1H7zM7 8.5h10v1H7zM7 14.5h7v1H7z" />
            <path d="M19.5 3.5v17a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1zm-1 0h-13v17h13v-17z" />
          </svg>
        );
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Управление документами</h2>
        <Link
          href={route('admin.documents.create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить документ
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск документов..."
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
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => (
            <li key={document.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{document.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {document.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {categories.find(cat => cat.id === document.category)?.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          {document.size}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>
                          {document.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Link
                    href={route('admin.documents.edit', document.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Изменить
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
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

DocumentsIndex.layout = page => <AdminLayout title="Управление документами">{page}</AdminLayout>;

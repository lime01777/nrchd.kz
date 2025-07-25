import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import { Link } from '@inertiajs/react';
import LayoutNews from '@/Layouts/LayoutNews';

export default function NewsIndex({ news, categories, filters }) {
  const { data, setData, get, processing } = useForm({
    search: filters.search || '',
    category: filters.category || 'all',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    get(route('news'), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleCategoryChange = (category) => {
    setData('category', category);
    get(route('news'), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Новости" meta={[{ name: 'description', content: 'Последние новости Национального научного центра развития здравоохранения.' }]} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Поиск и фильтры */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск новостей..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.search}
                  onChange={(e) => setData('search', e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={processing}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">Все категории</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Список новостей */}
        {news.data.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800">Новости не найдены</h3>
            <p className="mt-2 text-gray-600">Попробуйте изменить параметры поиска или фильтрации</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.data.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                    <span>{new Date(item.publish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                  <Link 
                    href={route('news.show', item.slug)} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Читать далее
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Пагинация */}
        {news.data.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              {news.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className={`px-4 py-2 rounded-md ${
                    link.active
                      ? 'bg-blue-500 text-white'
                      : link.url
                      ? 'bg-white text-gray-700 hover:bg-gray-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  preserveScroll
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}

NewsIndex.layout = page => <LayoutNews img="news" h1="Новости">{page}</LayoutNews>;

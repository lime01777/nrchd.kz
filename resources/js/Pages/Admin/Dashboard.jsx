import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentNews, recentComments }) {
  // Функция для форматирования чисел
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '—';
    return num.toLocaleString('ru-RU');
  };

  const statItems = [
    {
      name: 'Всего документов',
      stat: formatNumber(stats?.documents),
      icon: (
        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Всего новостей',
      stat: formatNumber(stats?.news),
      icon: (
        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      name: 'Всего комментариев',
      stat: formatNumber(stats?.comments),
      icon: (
        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      name: 'Посетителей за неделю',
      stat: formatNumber(stats?.visitorsWeek),
      icon: (
        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      hint: stats?.visitorsWeek === null ? 'Для отображения подключите Яндекс.Метрику' : undefined
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Статистика</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    {item.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.stat}</div>
                    </dd>
                    {item.hint && (
                      <div className="text-xs text-gray-400 mt-1">{item.hint}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Последние новости */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Последние новости</h3>
              <Link href={route('admin.news.index')} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Все новости
              </Link>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentNews && recentNews.length > 0 ? recentNews.map((newsItem) => (
                  <li key={newsItem.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{newsItem.title}</p>
                        <div className="flex mt-1">
                          <p className="text-sm text-gray-500 mr-4">{newsItem.created_at}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {newsItem.views}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Link
                          href={route('admin.news.edit', newsItem.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                        >
                          Изменить
                        </Link>
                      </div>
                    </div>
                  </li>
                )) : <li className="py-4 text-gray-400">Нет новостей</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Последние комментарии */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Последние комментарии</h3>
              <Link href={route('admin.comments.index')} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Все комментарии
              </Link>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentComments && recentComments.length > 0 ? recentComments.map((comment, idx) => (
                  <li key={idx} className="py-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                          {comment.user.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{comment.user}</span> {comment.action} <span className="font-medium">{comment.target}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">"{comment.content}"</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <p className="text-xs text-gray-400">{comment.time}</p>
                          {!comment.is_approved && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              На модерации
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )) : <li className="py-4 text-gray-400">Нет комментариев</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = page => <AdminLayout title="Панель управления">{page}</AdminLayout>;

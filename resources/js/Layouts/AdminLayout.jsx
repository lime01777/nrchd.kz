import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function AdminLayout({ children, title }) {
  const { auth } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCurrent = (...patterns) => patterns.some((pattern) => route().current(pattern));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head title={title ? `Админ - ${title}` : 'Админ-панель'} />

      {/* Боковая панель для мобильных устройств */}
      <Transition
        show={sidebarOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
      </Transition>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h2 className="text-xl font-semibold">Админ ННЦРЗ</h2>
        </div>
        <nav className="mt-5 px-2">
          <Link 
            href={route('admin.dashboard')} 
            className={`group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.dashboard') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Главная
          </Link>
          <Link 
            href={route('admin.news.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.news.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Новости
          </Link>
          <Link 
            href={route('admin.admin.documents')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.documents', 'admin.admin.documents.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Документы
          </Link>
          <Link 
            href={route('admin.admin.document-accordions.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.document-accordions.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Аккордеоны документов
          </Link>
          <Link 
            href={route('admin.admin.otz-applications.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.otz-applications.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Заявки ОТЗ
          </Link>
          <Link 
            href={route('admin.admin.users')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.users', 'admin.admin.users.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Пользователи
          </Link>
          <Link 
            href={route('admin.admin.translations')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.translations', 'admin.admin.translations.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Переводы
          </Link>
          <Link 
            href={route('vacancies.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${route().current('vacancies.index') || route().current('vacancies.create') || route().current('vacancies.edit') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Вакансии
          </Link>
          <Link 
            href={route('admin.vacancy-applications.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.vacancy-applications.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Заявки на вакансии
          </Link>
          <Link 
            href={route('admin.contact-applications.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.contact-applications.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Заявки обратной связи
          </Link>
          <Link 
            href={route('admin.youth-health-centers.index')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.youth-health-centers.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            МЦЗ (Карта)
          </Link>
          <Link 
            href={route('admin.admin.settings')} 
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md ${isCurrent('admin.admin.settings', 'admin.admin.settings.*') ? 'text-white bg-blue-500' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}
          >
            <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Настройки
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full">
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {auth?.user?.name || 'Администратор'}
                </p>
                <Link 
                  href={route('logout')} 
                  method="post" 
                  as="button"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Выйти
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1 h-screen overflow-hidden">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={toggleSidebar}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">{title || 'Админ-панель'}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Link href={route('home')} className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Перейти на сайт</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="py-6 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

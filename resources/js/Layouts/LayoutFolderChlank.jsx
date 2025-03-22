import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';

export default function LayoutFolderChlank({ children, img, h1, parentRoute, parentName }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
              </Link>
            </div>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <NavLink href={route('home')} active={route().current('home')}>
                Главная
              </NavLink>
              <NavLink href={route('about')} active={route().current('about')}>
                О нас
              </NavLink>
              <NavLink href={route('contacts')} active={route().current('contacts')}>
                Контакты
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url('/img/headers/${img}.jpg')` }}></div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{h1}</h1>
            {parentRoute && parentName && (
              <div className="text-white mb-4">
                <Link href={parentRoute} className="text-white hover:text-gray-300 transition duration-150 ease-in-out">
                  {parentName}
                </Link>
                <span className="mx-2">→</span>
                <span>{h1}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gray-200">
        {children}
      </main>

      <Footer />
    </div>
  );
}

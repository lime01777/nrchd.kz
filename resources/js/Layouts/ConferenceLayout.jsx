import React from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Макет для страниц конференции
 * Содержит шапку с навигацией и подвал, общие для всех страниц конференции
 * 
 * @param {object} props Свойства компонента
 * @param {React.ReactNode} props.children Дочерние элементы
 * @param {string} props.title Заголовок страницы
 * @returns {React.ReactElement} Компонент макета конференции
 */
export default function ConferenceLayout({ children, title }) {
  const { locale } = usePage().props;
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href={route('conference.home')} className="text-2xl font-bold">
                NRCHD Conference 2025
              </Link>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-4 lg:space-x-6">
              <Link href={route('conference.about')} className="hover:text-blue-200 py-1 px-2">О мероприятии</Link>
              <Link href={route('conference.speakers')} className="hover:text-blue-200 py-1 px-2">Спикеры</Link>
              <Link href={route('conference.organizers')} className="hover:text-blue-200 py-1 px-2">Организаторы</Link>
              <Link href={route('conference.program')} className="hover:text-blue-200 py-1 px-2">Программа</Link>
              <Link href={route('conference.registration')} className="hover:text-blue-200 py-1 px-2">Регистрация</Link>
              <Link href={route('conference.fees')} className="hover:text-blue-200 py-1 px-2">Взносы</Link>
            </nav>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href={route('conference.home', { lang: 'ru' })} className={`py-1 px-2 ${locale === 'ru' ? 'font-bold bg-blue-800 rounded' : ''}`}>РУ</Link>
              <Link href={route('conference.home', { lang: 'en' })} className={`py-1 px-2 ${locale === 'en' ? 'font-bold bg-blue-800 rounded' : ''}`}>EN</Link>
              <Link href={route('conference.home', { lang: 'kz' })} className={`py-1 px-2 ${locale === 'kz' ? 'font-bold bg-blue-800 rounded' : ''}`}>KZ</Link>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {title && (
          <div className="bg-blue-600 text-white py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </main>
      
      <footer className="bg-blue-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NRCHD Conference 2025</h3>
              <p className="mb-2">Национальный научный центр развития здравоохранения имени Салидат Каирбековой</p>
              <p className="text-sm text-blue-200">Международная конференция по медицинскому туризму</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="mb-2">Email: info@nrchd.kz</p>
              <p className="mb-2">Телефон: +7 (7XX) XXX-XX-XX</p>
              <p className="mb-2">Адрес: г. Астана, ул. Мангилик ел, 20</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Быстрые ссылки</h4>
              <div className="space-y-2">
                <Link href={route('conference.registration')} className="block text-blue-200 hover:text-white">Регистрация</Link>
                <Link href={route('conference.sponsor-packages')} className="block text-blue-200 hover:text-white">Спонсорские пакеты</Link>
                <Link href={route('conference.about')} className="block text-blue-200 hover:text-white">О конференции</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-blue-700 text-center">
            <p>© {new Date().getFullYear()} NRCHD Conference. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

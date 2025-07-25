import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import route from '../Utils/routeWithLocale';

function LanguageSwitcher() {
  const { locale } = usePage().props;

  // Function to get the URL for a specific locale
  const getUrlForLocale = (targetLocale) => {
    try {
      // First try to use Ziggy route if available (best method)
      const currentRoute = route().current();
      if (currentRoute) {
        // Get current route parameters
        const params = route().params;
        
        // Add or update the locale parameter
        return route(currentRoute, { ...params, locale: targetLocale });
      }
    } catch (error) {
      console.warn('Failed to use Ziggy route for language switch:', error);
    }
    
    // Fallback to manual URL manipulation if Ziggy route is not available
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Check if we're on the homepage
    if (pathSegments.length === 0 || (pathSegments.length === 1 && ['ru', 'en', 'kz'].includes(pathSegments[0]))) {
      return `/${targetLocale}`;
    }
    
    // For other pages: if the first segment is a locale, replace it
    if (pathSegments.length > 0 && ['ru', 'en', 'kz'].includes(pathSegments[0])) {
      pathSegments[0] = targetLocale;
      return '/' + pathSegments.join('/');
    } 
    
    // If no locale in URL, add it as the first segment
    return '/' + targetLocale + currentPath;
  };

  const languageNames = {
    'ru': 'Русский',
    'en': 'English',
    'kz': 'Қазақша'
  };

  // Для анимированного перехода при смене языка
  const [transitioning, setTransitioning] = useState(false);
  const [currentLocaleDisplay, setCurrentLocaleDisplay] = useState(locale);

  // Состояния для управления показом меню и тултипа
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Обновляем текущее отображаемое значение локали с анимацией
  useEffect(() => {
    if (locale !== currentLocaleDisplay) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentLocaleDisplay(locale);
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [locale]);

  // Закрываем меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (showMenu && !event.target.closest('.language-switcher-container')) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="language-switcher-container relative">
      {/* Индикатор текущего языка с выпадающим меню */}
      <div 
        className="relative z-10 flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={
            `flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 cursor-pointer shadow-sm hover:bg-gray-50
            ${transitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`
          }
          aria-label="Выбрать язык"
          aria-expanded={showMenu}
        >
          <span className="w-5 h-5 flex items-center justify-center mr-1">
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-blue-500"></span>
          </span>
          <span className="font-medium mr-1">{currentLocaleDisplay.toUpperCase()}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Тултип с полным названием языка */}
        {showTooltip && !showMenu && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 opacity-75">
            {languageNames[locale]}
          </div>
        )}
      </div>

      {/* Выпадающее меню с языками */}
      {showMenu && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-1 z-20 min-w-[140px] transform origin-top transition-transform duration-150 ease-in-out"
          role="menu"
        >
          <Link
            href={getUrlForLocale('ru')}
            className={`flex items-center py-2 px-4 text-base hover:bg-gray-100 transition duration-150 rounded ${locale === 'ru' ? 'font-medium bg-gray-50' : 'text-gray-600'}`}
            preserveState
            preserveScroll
            onClick={() => setShowMenu(false)}
            role="menuitem"
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2.5 ${locale === 'ru' ? 'bg-blue-500' : 'bg-transparent border border-gray-300'}`}></span>
            <span>Русский</span>
          </Link>
          <Link
            href={getUrlForLocale('en')}
            className={`flex items-center py-2 px-4 text-base hover:bg-gray-100 transition duration-150 rounded ${locale === 'en' ? 'font-medium bg-gray-50' : 'text-gray-600'}`}
            preserveState
            preserveScroll
            onClick={() => setShowMenu(false)}
            role="menuitem"
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2.5 ${locale === 'en' ? 'bg-blue-500' : 'bg-transparent border border-gray-300'}`}></span>
            <span>English</span>
          </Link>
          <Link
            href={getUrlForLocale('kz')}
            className={`flex items-center py-2 px-4 text-base hover:bg-gray-100 transition duration-150 rounded ${locale === 'kz' ? 'font-medium bg-gray-50' : 'text-gray-600'}`}
            preserveState
            preserveScroll
            onClick={() => setShowMenu(false)}
            role="menuitem"
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2.5 ${locale === 'kz' ? 'bg-blue-500' : 'bg-transparent border border-gray-300'}`}></span>
            <span>Қазақша</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

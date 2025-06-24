import React, { useState, useEffect, useRef } from 'react';
import languageManager from '@/Utils/LanguageManager';

function ImprovedLanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Определяем названия языков для отображения
  const languageNames = {
    'ru': 'Русский',
    'kz': 'Қазақ',
    'en': 'English'
  };

  // Определяем коды флагов для языков
  const languageFlags = {
    'ru': '🇷🇺',
    'kz': '🇰🇿',
    'en': '🇬🇧'
  };

  useEffect(() => {
    // Получаем текущий язык из менеджера или системы
    const initialLang = languageManager.getCurrentLanguage() || 
                        localStorage.getItem('preferredLanguage') || 
                        document.documentElement.getAttribute('data-language') ||
                        'ru';
    
    setCurrentLang(initialLang);
    
    // Принудительная инициализация LanguageManager при монтировании компонента
    if (!languageManager.initialized) {
      console.log('[LanguageSwitcher] Initializing LanguageManager...');
      setTimeout(() => {
        languageManager.init();
      }, 100);
    }
    
    // Проверяем наличие CSRF токена
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
      console.warn('[LanguageSwitcher] CSRF token not found, adding...');
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'csrf-token');
      meta.setAttribute('content', window.Laravel?.csrfToken || '');
      document.head.appendChild(meta);
    }
    
    // Устанавливаем обработчик URL для языка
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['ru', 'en', 'kz'].includes(langParam) && langParam !== initialLang) {
      console.log(`[LanguageSwitcher] URL contains language ${langParam}, switching...`);
      setTimeout(() => {
        handleLanguageChange(langParam);
      }, 500);
    }
    
    // Слушаем клики вне дропдауна для его закрытия
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Слушаем событие изменения языка для обновления состояния
    const handleLanguageChanged = (e) => {
      if (e.detail?.language) {
        setCurrentLang(e.detail.language);
        setIsTranslating(false);
      }
    };
    
    document.addEventListener('language-changed', handleLanguageChanged);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('language-changed', handleLanguageChanged);
    };
  }, []);

  const handleLanguageChange = async (lang) => {
    console.log(`[LanguageSwitcher] Button clicked: ${lang}, current language: ${currentLang}`);
    if (lang === currentLang || isTranslating) return;
    
    try {
      // Закрываем дропдаун после выбора языка
      setIsDropdownOpen(false);
      
      // Обновляем состояние UI
      setIsTranslating(true);
      
      // Сохраняем выбранный язык без изменения URL
      // Удаляем изменение URL с параметром ?lang=
      // Вместо этого просто сохраняем язык локально
      
      // Используем улучшенный менеджер языка
      await languageManager.switchLanguage(lang);
      
      // Обновляем состояние после смены языка (чтобы избежать рассинхрона)
      setCurrentLang(lang);
    } catch (error) {
      console.error('[LanguageSwitcher] Translation error:', error);
      alert(`Ошибка при переключении языка: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Обработчик клика по кнопке переключателя
  const toggleDropdown = () => {
    if (isTranslating) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* GitHub-style language switcher button */}
      <button 
        onClick={toggleDropdown} 
        className={`flex items-center px-3 py-1.5 text-sm font-medium border rounded-md ${isTranslating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'} transition-all duration-200`}
        disabled={isTranslating}
        aria-expanded={isDropdownOpen}
      >
        <span className="flex items-center">
          <span className="mr-1">{languageFlags[currentLang]}</span>
          <span className="hidden sm:inline">{languageNames[currentLang]}</span>
          <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        </span>
        <svg 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
          <div className="py-1">
            {Object.keys(languageNames).map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${currentLang === lang ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                disabled={isTranslating}
              >
                <div className="flex items-center">
                  <span className="mr-2">{languageFlags[lang]}</span>
                  <span>{languageNames[lang]}</span>
                </div>
                {currentLang === lang && (
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation in progress indicator */}
      {isTranslating && (
        <div className="fixed bottom-4 right-4 bg-white rounded-md shadow-lg p-4 z-50 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
          <span>Переключение языка...</span>
        </div>
      )}
    </div>
  );
}

export default ImprovedLanguageSwitcher;

import React, { useState, useEffect, useRef } from 'react';
import TranslationService from '@/Services/SimpleFastTranslationService';

const ImprovedLanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('ru');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'kz', name: 'Қазақша' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  // Инициализация языка
  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
    setCurrentLang(savedLang);
  }, []);

  // Закрытие выпадающего списка при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Быстрое переключение языка
  const handleLanguageChange = async (langCode) => {
    if (langCode === currentLang) return;

    setIsDropdownOpen(false);

    try {
      // Используем новый быстрый сервис переводов
      await TranslationService.translatePage(langCode);

      // Сохраняем выбранный язык
      localStorage.setItem('selectedLanguage', langCode);
      setCurrentLang(langCode);

      // Обновляем активные кнопки
      updateActiveLanguageButtons(langCode);

      console.log(`Язык успешно переключен на: ${langCode}`);
    } catch (error) {
      console.error('Ошибка переключения языка:', error);
      
      // Показываем ошибку пользователю
      showErrorNotification('Не удалось переключить язык. Попробуйте еще раз.');
    }
  };



  // Показать уведомление об ошибке
  const showErrorNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  // Обновить активные кнопки языков
  const updateActiveLanguageButtons = (langCode) => {
    // Обновляем все кнопки языков на странице
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
      const buttonLang = button.getAttribute('data-lang');
      if (buttonLang === langCode) {
        button.style.backgroundColor = '#3b82f6';
        button.style.color = 'white';
      } else {
        button.style.backgroundColor = 'white';
        button.style.color = '#3b82f6';
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Основная кнопка */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-1 px-3 py-1 bg-transparent border-0 focus:outline-none hover:bg-gray-200 rounded text-xs transition-all duration-200"
        aria-label="Выбрать язык"
        title="Переключить язык"
      >
        <span className="font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Выпадающий список */}
      {isDropdownOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[100px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-100 transition-colors duration-150 ${
                language.code === currentLang 
                  ? 'bg-gray-100 font-medium' 
                  : 'text-gray-700'
              } ${
                language.code === languages[0].code ? 'rounded-t' : ''
              } ${
                language.code === languages[languages.length - 1].code ? 'rounded-b' : ''
              }`}
            >
              <span className="font-medium">{language.code.toUpperCase()}</span>
              {language.code === currentLang && (
                <svg className="w-3 h-3 ml-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}


    </div>
  );
};

export default ImprovedLanguageSwitcher;
import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
    const t = (key, fallback = '') => translations?.[key] || fallback;

function DropdownLanguageSwitcher() {
    const { locale } = usePage().props;
    const currentLocale = locale || 'kz';
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const languages = [
        { code: 'kz', name: 'KZ', fullName: 'Қазақша' },
        { code: 'ru', name: 'RU', fullName: 'Русский' },
        { code: 'en', name: 'EN', fullName: 'English' }
    ];
    
    const currentLanguage = languages.find(lang => lang.code === currentLocale);
    
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
    
    const handleLanguageChange = (langCode) => {
        if (langCode === currentLocale) return;
        
        setIsDropdownOpen(false);
        
        // Получаем текущий URL
        const currentUrl = window.location.pathname;
        const segments = currentUrl.split('/').filter(segment => segment !== '');
        
        // Проверяем, есть ли уже языковой код в URL
        const hasLanguageInUrl = ['kz', 'ru', 'en'].includes(segments[0]);
        
        let newUrl;
        if (hasLanguageInUrl) {
            // Заменяем языковой код
            segments[0] = langCode;
            newUrl = '/' + segments.join('/');
        } else {
            // Добавляем языковой код в начало
            newUrl = '/' + langCode + currentUrl;
        }
        
        // Добавляем параметры запроса, если они есть
        const searchParams = window.location.search;
        if (searchParams) {
            newUrl += searchParams;
        }
        
        // Переходим на новую страницу
        router.visit(newUrl, {
            method: 'get',
            preserveState: false,
            preserveScroll: false
        });
    };
    
    return (
        <div className="relative" ref={dropdownRef}>
            {/* Основная кнопка */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none hover:bg-gray-50 text-xs transition-all duration-200"
                aria-label="Выбрать язык"
                title="Переключить язык"
            >
                <span className="font-medium text-gray-700">{currentLanguage?.name}</span>
                <svg 
                    className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Выпадающий список */}
            {isDropdownOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[120px]">
                    {languages.map((language, index) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 transition-colors duration-150 ${
                                language.code === currentLocale 
                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                    : 'text-gray-700'
                            } ${
                                index === 0 ? 'rounded-t-md' : ''
                            } ${
                                index === languages.length - 1 ? 'rounded-b-md' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">{language.name}</span>
                                <span className="text-gray-400 text-xs">({language.fullName})</span>
                            </div>
                            {language.code === currentLocale && (
                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownLanguageSwitcher;

import React from 'react';
import { router, usePage } from '@inertiajs/react';
    const t = (key, fallback = '') => translations?.[key] || fallback;

function SimpleLanguageSwitcher() {
    const { locale } = usePage().props;
    const currentLocale = locale || 'kz';
    
    const languages = [
        { code: 'kz', name: 'ҚАЗ', fullName: 'Қазақша' },
        { code: 'ru', name: 'РУС', fullName: 'Русский' },
        { code: 'en', name: 'ENG', fullName: 'English' }
    ];
    
    const handleLanguageChange = (langCode) => {
        if (langCode === currentLocale) return;
        
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
        <div className="flex space-x-2">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`lang-btn py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                        currentLocale === lang.code 
                            ? 'bg-blue-100 font-medium border-blue-300' 
                            : 'bg-white'
                    }`}
                    title={lang.fullName}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
}

export default SimpleLanguageSwitcher;

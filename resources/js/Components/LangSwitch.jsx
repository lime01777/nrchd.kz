import React, { useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Компонент переключения языка
 * 
 * Использует существующие кнопки из хедера
 * Отправляет POST запрос на /locale/{lang} для установки языка
 */
export default function LangSwitch({ currentLocale = 'ru', className = '' }) {
    const [locale, setLocale] = useState(currentLocale);

    const languages = [
        { code: 'ru', name: 'RU', fullName: 'Русский' },
        { code: 'kk', name: 'ҚҚ', fullName: 'Қазақша' },
        { code: 'en', name: 'EN', fullName: 'English' },
    ];

    const handleLanguageChange = (langCode) => {
        if (langCode === locale) return;

        // Отправляем POST запрос на установку локали
        router.post(
            `/locale/${langCode}`,
            {},
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setLocale(langCode);
                    // Перезагружаем страницу для применения новой локали
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Failed to change language:', errors);
                },
            }
        );
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`
                        px-3 py-1 text-sm font-medium rounded transition-colors
                        ${locale === lang.code
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                    `}
                    title={lang.fullName}
                    aria-label={`Switch to ${lang.fullName}`}
                    aria-current={locale === lang.code ? 'true' : 'false'}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
}


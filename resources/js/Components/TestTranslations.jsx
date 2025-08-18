import React from 'react';
import { usePage } from '@inertiajs/react';

function TestTranslations() {
    const { translations, locale } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md m-4">
            <h2 className="text-2xl font-bold mb-4">Тест переводов</h2>
            
            <div className="mb-4">
                <strong>Текущий язык:</strong> {locale}
            </div>
            
            <div className="space-y-2">
                <div><strong>home:</strong> {t('home', 'Домой')}</div>
                <div><strong>about:</strong> {t('about', 'О нас')}</div>
                <div><strong>contacts:</strong> {t('contacts', 'Контакты')}</div>
                <div><strong>news:</strong> {t('news', 'Новости')}</div>
                <div><strong>documents:</strong> {t('documents', 'Документы')}</div>
                <div><strong>services:</strong> {t('services', 'Услуги')}</div>
                <div><strong>center_name:</strong> {t('center_name', 'Название центра')}</div>
                <div><strong>language:</strong> {t('language', 'Язык')}</div>
                <div><strong>login:</strong> {t('login', 'Войти')}</div>
                <div><strong>logout:</strong> {t('logout', 'Выйти')}</div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <strong>Все доступные переводы:</strong>
                <pre className="text-xs mt-2 overflow-auto max-h-40">
                    {JSON.stringify(translations, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default TestTranslations;

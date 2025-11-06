import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import autoTranslationService from '@/Services/AutoTranslationService';
import axios from 'axios';

/**
 * Компонент для управления автоматическими переводами в админке
 * Позволяет просматривать, редактировать и обновлять переводы
 */
const TranslationManager = ({ errors = {}, success = null }) => {
    const [contentType, setContentType] = useState('news');
    const [contentId, setContentId] = useState('');
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(false);
    const [newText, setNewText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('ru');

    const contentTypes = [
        { id: 'news', name: 'Новости' },
        { id: 'page', name: 'Страницы' },
        { id: 'service', name: 'Услуги' },
        { id: 'direction', name: 'Направления' },
    ];

    // Получение переводов для выбранного контента
    const fetchTranslations = async () => {
        if (!contentId || !contentType) return;

        setLoading(true);
        try {
            const data = await autoTranslationService.getContentTranslations(contentType, contentId);
            setTranslations(data);
        } catch (error) {
            console.error('Ошибка при получении переводов:', error);
        } finally {
            setLoading(false);
        }
    };

    // Обработка перевода нового текста
    const handleTranslateNewText = async () => {
        if (!newText.trim()) return;

        setLoading(true);
        try {
            const data = await autoTranslationService.translateText(
                newText,
                sourceLanguage,
                contentType,
                contentId ? parseInt(contentId) : null
            );

            // Добавляем новый перевод к существующим
            setTranslations(prev => ({
                ...prev,
                [newText]: data
            }));

            setNewText('');
        } catch (error) {
            console.error('Ошибка при переводе текста:', error);
        } finally {
            setLoading(false);
        }
    };

    // Запрос переводов при изменении content_id или content_type
    useEffect(() => {
        if (contentId && contentType) {
            fetchTranslations();
        }
    }, [contentId, contentType]);

    // Редактирование существующего перевода
    const handleEditTranslation = async (originalText, language, newTranslation) => {
        if (!originalText || !language) return;

        // Обновляем локальное состояние
        const updatedTranslations = { ...translations };
        if (!updatedTranslations[originalText]) {
            updatedTranslations[originalText] = {};
        }
        updatedTranslations[originalText][language] = newTranslation;
        setTranslations(updatedTranslations);

        try {
            // Сохраняем изменение в базе данных через API
            await axios.post('/api/auto-translate/update', {
                original_text: originalText,
                source_language: sourceLanguage,
                target_language: language,
                translated_text: newTranslation,
                content_type: contentType,
                content_id: contentId ? parseInt(contentId) : null
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
        } catch (error) {
            console.error('Ошибка при обновлении перевода:', error);
        }
    };

    // Перезапуск перевода для выбранного текста
    const handleRetranslate = async (originalText) => {
        if (!originalText) return;

        setLoading(true);
        try {
            const data = await autoTranslationService.translateText(
                originalText,
                sourceLanguage,
                contentType,
                contentId ? parseInt(contentId) : null
            );

            // Обновляем переводы
            setTranslations(prev => ({
                ...prev,
                [originalText]: data
            }));
        } catch (error) {
            console.error('Ошибка при повторном переводе:', error);
        } finally {
            setLoading(false);
        }
    };

    // Удаление перевода
    const handleDeleteTranslation = async (originalText) => {
        if (!originalText) return;

        if (window.confirm('Вы уверены, что хотите удалить этот перевод?')) {
            // Удаляем из локального состояния
            const updatedTranslations = { ...translations };
            delete updatedTranslations[originalText];
            setTranslations(updatedTranslations);

            try {
                // Удаляем из базы данных
                await axios.post('/api/auto-translate/delete', {
                    original_text: originalText,
                    content_type: contentType,
                    content_id: contentId ? parseInt(contentId) : null
                }, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    }
                });
            } catch (error) {
                console.error('Ошибка при удалении перевода:', error);
            }
        }
    };

    // Рендеринг таблицы переводов
    const renderTranslationsTable = () => {
        const languages = ['ru', 'en', 'kk'];
        const entries = Object.entries(translations);

        if (entries.length === 0) {
            return (
                <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-700">
                        Нет переводов для этого контента. Добавьте новый текст выше.
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Оригинальный текст
                            </th>
                            {languages.map(lang => (
                                <th key={lang} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {lang.toUpperCase()}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map(([originalText, translations], index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-normal">
                                    <div className="text-sm text-gray-900">
                                        {originalText.length > 100 
                                            ? `${originalText.substring(0, 100)}...` 
                                            : originalText}
                                    </div>
                                </td>
                                {languages.map(lang => (
                                    <td key={lang} className="px-6 py-4 whitespace-normal">
                                        <textarea 
                                            className="text-sm text-gray-900 w-full border p-2 rounded"
                                            value={translations[lang] || ''}
                                            onChange={(e) => handleEditTranslation(originalText, lang, e.target.value)}
                                            rows={3}
                                        />
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-2">
                                        <button 
                                            onClick={() => handleRetranslate(originalText)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Обновить перевод
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteTranslation(originalText)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AdminLayout title="Управление переводами">
            <Head title="Управление переводами" />
            
            <div className="py-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Управление автоматическими переводами
                        </h1>

                        {success && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                                <p>{success}</p>
                            </div>
                        )}

                        {/* Форма фильтрации */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Тип контента
                                </label>
                                <select
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={contentType}
                                    onChange={(e) => setContentType(e.target.value)}
                                >
                                    {contentTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID контента
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={contentId}
                                    onChange={(e) => setContentId(e.target.value)}
                                    placeholder="Введите ID"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={fetchTranslations}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={loading}
                                >
                                    {loading ? 'Загрузка...' : 'Найти переводы'}
                                </button>
                            </div>
                        </div>

                        {/* Добавление нового текста для перевода */}
                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-2">
                                Добавить новый текст для перевода
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3">
                                    <textarea
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                        placeholder="Введите текст для перевода"
                                        rows={4}
                                    />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Исходный язык
                                        </label>
                                        <select
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={sourceLanguage}
                                            onChange={(e) => setSourceLanguage(e.target.value)}
                                        >
                                            <option value="ru">Русский (RU)</option>
                                            <option value="en">Английский (EN)</option>
                                            <option value="kk">Казахский (KK)</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleTranslateNewText}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={loading || !newText.trim()}
                                    >
                                        {loading ? 'Перевод...' : 'Перевести и сохранить'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Таблица с переводами */}
                        <div className="mt-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">
                                Переводы для {contentType} (ID: {contentId || 'не указан'})
                            </h2>
                            {loading ? (
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                renderTranslationsTable()
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TranslationManager;

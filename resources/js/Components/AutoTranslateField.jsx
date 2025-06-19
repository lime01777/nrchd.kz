import React, { useState, useEffect } from 'react';
import autoTranslationService from '../Services/AutoTranslationService';
import { Inertia } from '@inertiajs/inertia';

/**
 * Компонент поля ввода с автоматическим переводом
 * При вводе текста на одном языке автоматически генерирует переводы на другие языки
 * и сохраняет их в базе данных для последующего использования
 */
const AutoTranslateField = ({ 
    name, 
    label, 
    defaultValue = '', 
    contentType = 'general',
    contentId = null,
    sourceLanguage = 'ru',
    targetLanguages = ['en', 'kz'],
    className = '',
    onChange = null,
    onAutoTranslate = null,
    autoTranslateDelay = 1000, // задержка перед автоматическим переводом (мс)
}) => {
    const [value, setValue] = useState(defaultValue);
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [translateTimer, setTranslateTimer] = useState(null);
    const [showTranslations, setShowTranslations] = useState(false);
    
    // Инициализация переводов при монтировании компонента
    useEffect(() => {
        if (defaultValue && contentId) {
            // Если есть ID контента, пытаемся получить существующие переводы
            fetchExistingTranslations();
        }
    }, [defaultValue, contentId]);
    
    // Получить существующие переводы для контента
    const fetchExistingTranslations = async () => {
        if (!contentId) return;
        
        try {
            const translations = await autoTranslationService.getContentTranslations(contentType, contentId);
            if (translations[defaultValue]) {
                setTranslations(translations[defaultValue]);
            }
        } catch (error) {
            console.error('Error fetching existing translations:', error);
        }
    };
    
    // Обработка изменения текста
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        
        // Вызываем пользовательский обработчик onChange, если он предоставлен
        if (onChange) {
            onChange(e);
        }
        
        // Сбрасываем предыдущий таймер
        if (translateTimer) {
            clearTimeout(translateTimer);
        }
        
        // Если поле пустое, сбрасываем переводы
        if (!newValue.trim()) {
            setTranslations({});
            return;
        }
        
        // Устанавливаем новый таймер для автоматического перевода после задержки
        const timer = setTimeout(() => {
            autoTranslateText(newValue);
        }, autoTranslateDelay);
        
        setTranslateTimer(timer);
    };
    
    // Автоматический перевод текста
    const autoTranslateText = async (text) => {
        setIsTranslating(true);
        
        try {
            const translationResults = await autoTranslationService.translateText(
                text, 
                sourceLanguage, 
                contentType, 
                contentId
            );
            
            setTranslations(translationResults);
            
            // Вызываем пользовательский обработчик onAutoTranslate, если он предоставлен
            if (onAutoTranslate) {
                onAutoTranslate(translationResults);
            }
        } catch (error) {
            console.error('Error auto-translating text:', error);
        } finally {
            setIsTranslating(false);
        }
    };
    
    // Принудительный перевод текста
    const forceTranslate = () => {
        if (value.trim()) {
            autoTranslateText(value);
        }
    };
    
    // Отображение статуса перевода
    const renderTranslationStatus = () => {
        if (isTranslating) {
            return <span className="text-blue-500 text-sm ml-2">Перевод...</span>;
        }
        
        if (Object.keys(translations).length > 0) {
            return (
                <span 
                    className="text-green-500 text-sm ml-2 cursor-pointer"
                    onClick={() => setShowTranslations(!showTranslations)}
                >
                    Переведено {Object.keys(translations).length} языков
                    {showTranslations ? ' ▲' : ' ▼'}
                </span>
            );
        }
        
        return null;
    };
    
    // Отображение результатов перевода
    const renderTranslationResults = () => {
        if (!showTranslations || Object.keys(translations).length === 0) {
            return null;
        }
        
        return (
            <div className="mt-2 border rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Автоматические переводы:</h4>
                {targetLanguages.map(lang => (
                    <div key={lang} className="mb-2">
                        <div className="flex items-center">
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                {lang.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-800">
                                {translations[lang] || 'Нет перевода'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                    {label}
                </label>
                {renderTranslationStatus()}
                {!isTranslating && value.trim() && (
                    <button 
                        type="button"
                        onClick={forceTranslate}
                        className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                    >
                        Обновить перевод
                    </button>
                )}
            </div>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
            />
            {renderTranslationResults()}
        </div>
    );
};

export default AutoTranslateField;

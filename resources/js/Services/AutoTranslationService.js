/**
 * Сервис для автоматического перевода контента на все поддерживаемые языки
 * с сохранением в базе данных для повторного использования
 */

import axios from 'axios';

class AutoTranslationService {
    /**
     * Конструктор с настройками
     */
    constructor() {
        this.supportedLanguages = ['ru', 'en', 'kz'];
        this.defaultLanguage = 'ru';
        this.translationCache = {};
        this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    }

    /**
     * Автоматически переводит текст на все поддерживаемые языки и сохраняет в базе
     * 
     * @param {string} text - Текст для перевода
     * @param {string} sourceLanguage - Исходный язык (по умолчанию ru)
     * @param {string} contentType - Тип контента (например, 'news', 'page')
     * @param {number|null} contentId - ID связанного контента
     * @returns {Promise<Object>} - Объект с переводами на все языки
     */
    async translateText(text, sourceLanguage = 'ru', contentType = 'general', contentId = null) {
        // Проверяем кэш перед запросом к серверу
        const cacheKey = `${text}_${sourceLanguage}_${contentType}_${contentId}`;
        if (this.translationCache[cacheKey]) {
            console.log('[AutoTranslation] Using cached translation');
            return this.translationCache[cacheKey];
        }
        
        try {
            const response = await axios.post('/api/auto-translate', {
                text,
                source_language: sourceLanguage,
                content_type: contentType,
                content_id: contentId
            }, {
                headers: {
                    'X-CSRF-TOKEN': this.csrfToken
                }
            });
            
            // Сохраняем результат в кэше
            this.translationCache[cacheKey] = response.data.translations;
            
            return response.data.translations;
        } catch (error) {
            console.error('[AutoTranslation] Error translating text:', error);
            
            // В случае ошибки возвращаем исходный текст для всех языков
            const fallbackTranslations = {};
            this.supportedLanguages.forEach(lang => {
                fallbackTranslations[lang] = text;
            });
            
            return fallbackTranslations;
        }
    }
    
    /**
     * Получить сохраненный перевод для текста
     * 
     * @param {string} text - Оригинальный текст
     * @param {string} sourceLanguage - Исходный язык
     * @param {string} targetLanguage - Целевой язык
     * @returns {Promise<string>} - Переведенный текст
     */
    async getTranslation(text, sourceLanguage = 'ru', targetLanguage = 'en') {
        try {
            const response = await axios.get('/api/auto-translate', {
                params: {
                    text,
                    source_language: sourceLanguage,
                    target_language: targetLanguage
                }
            });
            
            return response.data.translation;
        } catch (error) {
            console.error('[AutoTranslation] Error getting translation:', error);
            return text; // Возвращаем исходный текст в случае ошибки
        }
    }
    
    /**
     * Массовый перевод нескольких текстов за один запрос
     * 
     * @param {Array<Object>} items - Массив объектов {key: 'уникальный_ключ', text: 'текст_для_перевода'}
     * @param {string} sourceLanguage - Исходный язык
     * @param {string} contentType - Тип контента
     * @param {number|null} contentId - ID связанного контента
     * @returns {Promise<Object>} - Объект с переводами для каждого ключа
     */
    async bulkTranslate(items, sourceLanguage = 'ru', contentType = 'general', contentId = null) {
        try {
            const response = await axios.post('/api/auto-translate/bulk', {
                items,
                source_language: sourceLanguage,
                content_type: contentType,
                content_id: contentId
            }, {
                headers: {
                    'X-CSRF-TOKEN': this.csrfToken
                }
            });
            
            return response.data.results;
        } catch (error) {
            console.error('[AutoTranslation] Error bulk translating:', error);
            
            // В случае ошибки возвращаем исходные тексты
            const fallbackResults = {};
            items.forEach(item => {
                fallbackResults[item.key] = {};
                this.supportedLanguages.forEach(lang => {
                    fallbackResults[item.key][lang] = item.text;
                });
            });
            
            return fallbackResults;
        }
    }
    
    /**
     * Получить все переводы для конкретного контента
     * 
     * @param {string} contentType - Тип контента
     * @param {number} contentId - ID контента
     * @returns {Promise<Object>} - Объект с переводами
     */
    async getContentTranslations(contentType, contentId) {
        try {
            const response = await axios.get('/api/auto-translate/content', {
                params: {
                    content_type: contentType,
                    content_id: contentId
                }
            });
            
            return response.data.translations;
        } catch (error) {
            console.error('[AutoTranslation] Error getting content translations:', error);
            return {};
        }
    }

    /**
     * Обновить существующий перевод
     * 
     * @param {string} originalText - Оригинальный текст
     * @param {string} sourceLanguage - Исходный язык
     * @param {string} targetLanguage - Целевой язык
     * @param {string} translatedText - Новый перевод
     * @param {string} contentType - Тип контента
     * @param {number|null} contentId - ID контента
     * @returns {Promise<Object>} - Результат операции
     */
    async updateTranslation(originalText, sourceLanguage, targetLanguage, translatedText, contentType = 'general', contentId = null) {
        try {
            const response = await axios.post('/api/auto-translate/update', {
                original_text: originalText,
                source_language: sourceLanguage,
                target_language: targetLanguage,
                translated_text: translatedText,
                content_type: contentType,
                content_id: contentId
            }, {
                headers: {
                    'X-CSRF-TOKEN': this.csrfToken
                }
            });
            
            // Очищаем кэш для этого текста
            const cacheKey = `${originalText}_${sourceLanguage}_${contentType}_${contentId}`;
            if (this.translationCache[cacheKey]) {
                delete this.translationCache[cacheKey];
            }
            
            return response.data;
        } catch (error) {
            console.error('[AutoTranslation] Error updating translation:', error);
            throw error;
        }
    }
    
    /**
     * Удалить перевод
     * 
     * @param {string} originalText - Оригинальный текст для удаления всех его переводов
     * @param {string} contentType - Тип контента
     * @param {number|null} contentId - ID контента
     * @returns {Promise<Object>} - Результат операции
     */
    async deleteTranslation(originalText, contentType = 'general', contentId = null) {
        try {
            const response = await axios.post('/api/auto-translate/delete', {
                original_text: originalText,
                content_type: contentType,
                content_id: contentId
            }, {
                headers: {
                    'X-CSRF-TOKEN': this.csrfToken
                }
            });
            
            // Очищаем все связанные записи из кэша
            Object.keys(this.translationCache).forEach(key => {
                if (key.startsWith(`${originalText}_`)) {
                    delete this.translationCache[key];
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('[AutoTranslation] Error deleting translation:', error);
            throw error;
        }
    }
}

// Создаем и экспортируем экземпляр сервиса для использования во всем приложении
const autoTranslationService = new AutoTranslationService();
export default autoTranslationService;

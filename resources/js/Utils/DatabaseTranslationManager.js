/**
 * Менеджер переводов из базы данных
 */
class DatabaseTranslationManager {
    constructor() {
        this.cache = new Map();
        this.currentLanguage = 'kz'; // По умолчанию казахский
        this.baseUrl = window.location.origin;
    }

    /**
     * Установить текущий язык
     * @param {string} language - Код языка (ru, kz, en)
     */
    setLanguage(language) {
        this.currentLanguage = language;
        this.clearCache();
    }

    /**
     * Получить перевод из базы данных
     * @param {string} text - Оригинальный текст
     * @param {string} targetLanguage - Целевой язык
     * @param {string} sourceLanguage - Исходный язык
     * @returns {Promise<string>}
     */
    async getTranslation(text, targetLanguage = null, sourceLanguage = 'ru') {
        const targetLang = targetLanguage || this.currentLanguage;
        
        // Проверяем кэш
        const cacheKey = `${text}_${targetLang}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    text: text,
                    target_language: targetLang,
                    source_language: sourceLanguage
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Кэшируем результат
                this.cache.set(cacheKey, data.translation);
                return data.translation;
            } else {
                console.error('Translation API error:', data.message);
                return text; // Возвращаем оригинальный текст
            }

        } catch (error) {
            console.error('Error getting translation:', error);
            return text; // Возвращаем оригинальный текст
        }
    }

    /**
     * Получить переводы для страницы
     * @param {string} pageUrl - URL страницы
     * @param {string} targetLanguage - Целевой язык
     * @returns {Promise<Object>}
     */
    async getPageTranslations(pageUrl, targetLanguage = null) {
        const targetLang = targetLanguage || this.currentLanguage;

        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/page`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    page_url: pageUrl,
                    target_language: targetLang
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.translations;
            } else {
                console.error('Page translations API error:', data.message);
                return {};
            }

        } catch (error) {
            console.error('Error getting page translations:', error);
            return {};
        }
    }

    /**
     * Сохранить перевод в базу данных
     * @param {string} originalText - Оригинальный текст
     * @param {string} translatedText - Переведенный текст
     * @param {string} targetLanguage - Целевой язык
     * @param {string} sourceLanguage - Исходный язык
     * @param {string} contentType - Тип контента
     * @param {number} contentId - ID контента
     * @returns {Promise<boolean>}
     */
    async saveTranslation(originalText, translatedText, targetLanguage = null, sourceLanguage = 'ru', contentType = null, contentId = null) {
        const targetLang = targetLanguage || this.currentLanguage;

        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    original_text: originalText,
                    translated_text: translatedText,
                    target_language: targetLang,
                    source_language: sourceLanguage,
                    content_type: contentType,
                    content_id: contentId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Очищаем кэш для этого перевода
                const cacheKey = `${originalText}_${targetLang}`;
                this.cache.delete(cacheKey);
                return true;
            } else {
                console.error('Save translation API error:', data.message);
                return false;
            }

        } catch (error) {
            console.error('Error saving translation:', error);
            return false;
        }
    }

    /**
     * Массовое сохранение переводов
     * @param {Array} translations - Массив переводов
     * @returns {Promise<Object>}
     */
    async bulkSaveTranslations(translations) {
        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/bulk-save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    translations: translations
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Очищаем весь кэш
                this.clearCache();
                return data;
            } else {
                console.error('Bulk save translations API error:', data.message);
                return { success: false, message: data.message };
            }

        } catch (error) {
            console.error('Error bulk saving translations:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Получить все переводы для языка
     * @param {string} targetLanguage - Целевой язык
     * @returns {Promise<Object>}
     */
    async getAllTranslations(targetLanguage = null) {
        const targetLang = targetLanguage || this.currentLanguage;

        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/all?target_language=${targetLang}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.translations;
            } else {
                console.error('Get all translations API error:', data.message);
                return {};
            }

        } catch (error) {
            console.error('Error getting all translations:', error);
            return {};
        }
    }

    /**
     * Очистить кэш переводов
     * @param {string} targetLanguage - Целевой язык
     * @returns {Promise<boolean>}
     */
    async clearTranslationCache(targetLanguage = null) {
        try {
            const response = await fetch(`${this.baseUrl}/api/db-translations/clear-cache`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    target_language: targetLanguage
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.clearCache();
                return true;
            } else {
                console.error('Clear cache API error:', data.message);
                return false;
            }

        } catch (error) {
            console.error('Error clearing translation cache:', error);
            return false;
        }
    }

    /**
     * Очистить локальный кэш
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Создать функцию перевода для использования в компонентах
     * @param {string} targetLanguage - Целевой язык
     * @returns {Function}
     */
    createTranslateFunction(targetLanguage = null) {
        const targetLang = targetLanguage || this.currentLanguage;
        
        return async (text, fallback = '') => {
            if (!text || text.trim() === '') {
                return fallback;
            }

            try {
                const translation = await this.getTranslation(text, targetLang);
                return translation || fallback || text;
            } catch (error) {
                console.error('Translation error:', error);
                return fallback || text;
            }
        };
    }

    /**
     * Инициализировать переводы для страницы
     * @param {string} pageUrl - URL страницы
     * @param {string} targetLanguage - Целевой язык
     * @returns {Promise<Object>}
     */
    async initializePageTranslations(pageUrl, targetLanguage = null) {
        const targetLang = targetLanguage || this.currentLanguage;
        
        try {
            const translations = await this.getPageTranslations(pageUrl, targetLang);
            
            // Сохраняем переводы в глобальную переменную для использования в компонентах
            window.pageTranslations = translations;
            
            return translations;
        } catch (error) {
            console.error('Error initializing page translations:', error);
            return {};
        }
    }
}

// Создаем глобальный экземпляр
window.databaseTranslationManager = new DatabaseTranslationManager();

// Экспортируем для использования в модулях
export default window.databaseTranslationManager;

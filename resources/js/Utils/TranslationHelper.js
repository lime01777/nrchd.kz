/**
 * Утилита для работы с переводами на фронтенде
 * Поддерживает казахский язык как основной
 */

class TranslationHelper {
    constructor() {
        this.currentLanguage = 'kz'; // Казахский по умолчанию
        this.translations = {};
        this.fallbackLanguage = 'kz';
        this.availableLanguages = ['kz', 'ru', 'en'];
        
        this.init();
    }
    
    /**
     * Инициализация переводчика
     */
    init() {
        // Определяем текущий язык
        this.detectLanguage();
        
        // Загружаем переводы
        this.loadTranslations();
        
        // Устанавливаем глобальный объект для доступа к переводам
        window.translations = this.translations;
        
        console.log('[TranslationHelper] Initialized with language:', this.currentLanguage);
    }
    
    /**
     * Определяет текущий язык пользователя
     */
    detectLanguage() {
        // 1. Проверяем URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.availableLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            return;
        }
        
        // 2. Проверяем localStorage
        const storedLang = localStorage.getItem('language');
        if (storedLang && this.availableLanguages.includes(storedLang)) {
            this.currentLanguage = storedLang;
            return;
        }
        
        // 3. Проверяем язык браузера
        const browserLang = navigator.language.substring(0, 2);
        if (this.availableLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
            return;
        }
        
        // 4. Используем казахский по умолчанию
        this.currentLanguage = this.fallbackLanguage;
    }
    
    /**
     * Загружает переводы для текущего языка
     */
    async loadTranslations() {
        try {
            // Загружаем переводы из сервера
            const response = await fetch(`/api/translations/${this.currentLanguage}`);
            if (response.ok) {
                this.translations = await response.json();
            } else {
                // Если не удалось загрузить, используем встроенные переводы
                this.loadBuiltinTranslations();
            }
        } catch (error) {
            console.warn('[TranslationHelper] Failed to load translations from server:', error);
            this.loadBuiltinTranslations();
        }
    }
    
    /**
     * Загружает встроенные переводы
     */
    loadBuiltinTranslations() {
        // Базовые переводы для медиа слайдера
        this.translations = {
            // Казахский
            'kz': {
                'media_file': 'Медиа файл',
                'no_media_files': 'Көрсету үшін медиа файлдары жоқ',
                'browser_not_support_video': 'Сіздің браузеріңіз бейнені қолдамайды.',
                'video': 'Бейне',
                'image': 'Сурет',
                'pause': 'Тоқтату',
                'play': 'Ойнату',
                'previous_slide': 'Алдыңғы слайд',
                'next_slide': 'Келесі слайд',
                'go_to_slide': 'Слайдқа өту',
                'welcome': 'Хош келдіңіз',
                'home': 'Үй',
                'about': 'Біз туралы',
                'contacts': 'Байланыстар',
                'news': 'Жаңалықтар',
                'search': 'Іздеу',
                'loading': 'Жүктеу...',
                'error_occurred': 'Қате пайда болды',
                'try_again': 'Қайтадан көріңіз',
            },
            // Русский
            'ru': {
                'media_file': 'Медиа файл',
                'no_media_files': 'Нет медиа файлов для отображения',
                'browser_not_support_video': 'Ваш браузер не поддерживает видео.',
                'video': 'Видео',
                'image': 'Изображение',
                'pause': 'Пауза',
                'play': 'Воспроизвести',
                'previous_slide': 'Предыдущий слайд',
                'next_slide': 'Следующий слайд',
                'go_to_slide': 'Перейти к слайду',
                'welcome': 'Добро пожаловать',
                'home': 'Главная',
                'about': 'О нас',
                'contacts': 'Контакты',
                'news': 'Новости',
                'search': 'Поиск',
                'loading': 'Загрузка...',
                'error_occurred': 'Произошла ошибка',
                'try_again': 'Попробуйте снова',
            },
            // Английский
            'en': {
                'media_file': 'Media file',
                'no_media_files': 'No media files to display',
                'browser_not_support_video': 'Your browser does not support video.',
                'video': 'Video',
                'image': 'Image',
                'pause': 'Pause',
                'play': 'Play',
                'previous_slide': 'Previous slide',
                'next_slide': 'Next slide',
                'go_to_slide': 'Go to slide',
                'welcome': 'Welcome',
                'home': 'Home',
                'about': 'About',
                'contacts': 'Contacts',
                'news': 'News',
                'search': 'Search',
                'loading': 'Loading...',
                'error_occurred': 'An error occurred',
                'try_again': 'Try again',
            }
        };
        
        // Устанавливаем переводы для текущего языка
        this.translations = this.translations[this.currentLanguage] || this.translations[this.fallbackLanguage];
    }
    
    /**
     * Получает перевод по ключу
     *
     * @param {string} key Ключ перевода
     * @param {string} fallback Fallback текст
     * @returns {string}
     */
    t(key, fallback = null) {
        const translation = this.translations[key];
        
        if (translation) {
            return translation;
        }
        
        // Если нет перевода, возвращаем fallback или ключ
        return fallback || key;
    }
    
    /**
     * Устанавливает язык
     *
     * @param {string} language Код языка
     */
    setLanguage(language) {
        if (!this.availableLanguages.includes(language)) {
            console.warn(`[TranslationHelper] Unsupported language: ${language}`);
            return;
        }
        
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        
        // Перезагружаем переводы
        this.loadTranslations();
        
        // Обновляем глобальный объект
        window.translations = this.translations;
        
        console.log(`[TranslationHelper] Language changed to: ${language}`);
    }
    
    /**
     * Получает текущий язык
     *
     * @returns {string}
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Проверяет, является ли текущий язык казахским
     *
     * @returns {boolean}
     */
    isKazakh() {
        return this.currentLanguage === 'kz';
    }
    
    /**
     * Проверяет, является ли текущий язык русским
     *
     * @returns {boolean}
     */
    isRussian() {
        return this.currentLanguage === 'ru';
    }
    
    /**
     * Проверяет, является ли текущий язык английским
     *
     * @returns {boolean}
     */
    isEnglish() {
        return this.currentLanguage === 'en';
    }
    
    /**
     * Переводит весь текст на странице
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const fallback = element.textContent;
            
            element.textContent = this.t(key, fallback);
        });
    }
    
    /**
     * Создает элемент с переводом
     *
     * @param {string} key Ключ перевода
     * @param {string} fallback Fallback текст
     * @param {string} tag HTML тег
     * @returns {HTMLElement}
     */
    createTranslatedElement(key, fallback = null, tag = 'span') {
        const element = document.createElement(tag);
        element.textContent = this.t(key, fallback);
        element.setAttribute('data-translate', key);
        return element;
    }
}

// Создаем глобальный экземпляр
window.translationHelper = new TranslationHelper();

// Экспортируем для использования в модулях
export default window.translationHelper;

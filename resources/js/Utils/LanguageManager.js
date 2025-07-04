/**
 * Глобальный менеджер языка для сайта
 * Обеспечивает загрузку переводов и переключение языка для всего сайта
 */

// Импортируем только типы, чтобы избежать конфликтов
// Сама функция translatePage будет импортирована динамически
// import { translatePage } from './new-translator.js';

// Доступные языки
const AVAILABLE_LANGUAGES = ['ru', 'kz', 'en'];
const DEFAULT_LANGUAGE = 'ru';

// Класс для управления языком сайта
class LanguageManager {
  constructor() {
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.previousLanguage = DEFAULT_LANGUAGE;
    this.translationCache = {};
    this.initialized = false;
    this.localTranslations = this.loadLocalTranslations();
    this.pageTranslations = {};
    this.lastCacheClear = Date.now();
  }

  /**
   * Инициализация менеджера языка
   */
  init() {
    if (this.initialized) {
      console.log('[LanguageManager] Already initialized, skipping');
      return;
    }

    // Получить язык из localStorage или из куки
    this.currentLanguage = this.getSavedLanguage();
    console.log(`[LanguageManager] Initial language from storage: ${this.currentLanguage}`);
    
    // Обрабатываем URL параметр только однократно при инициализации
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && AVAILABLE_LANGUAGES.includes(langParam)) {
      console.log(`[LanguageManager] Using language from URL param: ${langParam}`);
      this.currentLanguage = langParam;
      this.saveLanguagePreference(langParam);
    }
    
    // Установка языка на HTML для CSS-стилей
    document.documentElement.setAttribute('data-language', this.currentLanguage);
    
    // Отметить кнопку выбранного языка
    this.updateLanguageButtons();
    
    this.initialized = true;
    
    // Сообщить серверу о выбранном языке
    this.syncLanguageWithServer();
    
    // Автоматически применить язык при загрузке - только если не дефолтный язык
    if (this.currentLanguage !== DEFAULT_LANGUAGE) {
      this.applyLanguage();
    }
    
    console.log(`[LanguageManager] Initialized with language: ${this.currentLanguage}`);
  }
  
  /**
   * Получить сохраненный язык из разных источников (localStorage, cookies, URL, заголовки)
   */
  getSavedLanguage() {
    // Сначала проверить localStorage (наивысший приоритет, т.к. это явный выбор пользователя)
    const localLang = localStorage.getItem('preferredLanguage');
    if (localLang && AVAILABLE_LANGUAGES.includes(localLang)) {
      console.log(`[LanguageManager] Found language in localStorage: ${localLang}`);
      return localLang;
    }
    
    // Затем проверить URL параметры
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && AVAILABLE_LANGUAGES.includes(urlLang)) {
      console.log(`[LanguageManager] Found language in URL params: ${urlLang}`);
      this.saveLanguagePreference(urlLang); // Сохранить в localStorage и cookies
      return urlLang;
    }
    
    // Проверить куки
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      if (cookie[0] === 'language' && cookie[1] && AVAILABLE_LANGUAGES.includes(cookie[1])) {
        console.log(`[LanguageManager] Found language in cookies: ${cookie[1]}`);
        // Синхронизировать с localStorage
        localStorage.setItem('preferredLanguage', cookie[1]);
        return cookie[1];
      }
    }
    
    // Проверить заголовок X-App-Locale от сервера (если доступен)
    const serverLang = document.querySelector('meta[name="x-app-locale"]')?.getAttribute('content');
    if (serverLang && AVAILABLE_LANGUAGES.includes(serverLang)) {
      console.log(`[LanguageManager] Found language in meta tag: ${serverLang}`);
      return serverLang;
    }
    
    console.log(`[LanguageManager] No saved language found, using default: ${DEFAULT_LANGUAGE}`);
    return DEFAULT_LANGUAGE;
  }
  
  /**
   * Сохранить выбранный язык во всех местах хранения
   */
  saveLanguagePreference(language) {
    if (!AVAILABLE_LANGUAGES.includes(language)) {
      console.error(`[LanguageManager] Invalid language: ${language}`);
      return;
    }
    
    // Сохранить в localStorage (сохраняется между сессиями браузера)
    try {
      localStorage.setItem('preferredLanguage', language);
      console.log(`[LanguageManager] Language saved to localStorage: ${language}`);
    } catch (e) {
      console.error('[LanguageManager] Error saving to localStorage:', e);
    }
    
    // Сохранить в sessionStorage (для текущей сессии)
    try {
      sessionStorage.setItem('preferredLanguage', language);
    } catch (e) {
      console.error('[LanguageManager] Error saving to sessionStorage:', e);
    }
    
    // Сохранить в куки для обмена с сервером (срок 30 дней)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `language=${language}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    console.log(`[LanguageManager] Language saved to cookies: ${language}`);
    
    // Установить в классе для текущей сессии
    this.currentLanguage = language;
    
    // Установить data-attribute на html для стилизации через CSS
    document.documentElement.setAttribute('data-language', language);
  }
  
  /**
   * Синхронизировать выбранный язык с сервером
   */
  async syncLanguageWithServer() {
    try {
      // Получить CSRF токен
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!token) {
        console.error('[LanguageManager] CSRF token not found');
        return;
      }
      
      // Отправить запрос на сервер для обновления языка в сессии
      const response = await fetch('/api/set-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          language: this.currentLanguage
        }),
        credentials: 'include' // Важно для отправки и получения куки
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Пробуем получить ответ в JSON
      const data = await response.json();
      console.log(`[LanguageManager] Language synced with server: ${this.currentLanguage}`, data);
      
      // Добавить мета-тег с языком для использования в следующих загрузках
      let metaLang = document.querySelector('meta[name="x-app-locale"]');
      if (!metaLang) {
        metaLang = document.createElement('meta');
        metaLang.setAttribute('name', 'x-app-locale');
        document.head.appendChild(metaLang);
      }
      metaLang.setAttribute('content', this.currentLanguage);
      
      return data;
    } catch (error) {
      console.error('[LanguageManager] Error syncing language with server:', error);
    }
  }
  
  /**
   * Получить текущий язык
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  /**
   * Вернуться к предыдущему языку при ошибке перевода
   */
  revertToLastLanguage() {
    if (this.previousLanguage && this.previousLanguage !== this.currentLanguage) {
      console.log(`[LanguageManager] Reverting to previous language: ${this.previousLanguage}`);
      this.currentLanguage = this.previousLanguage;
      // Восстанавливаем сохраненные настройки
      document.documentElement.setAttribute('data-language', this.previousLanguage);
      this.updateLanguageButtons();
      return true;
    }
    return false;
  }
  
  /**
   * Переключить язык сайта
   * @param {string} language - Код языка для переключения
   * @param {boolean} [showLoader=true] - Показывать ли индикатор загрузки
   * @returns {Promise<void>}
   */
  async switchLanguage(language, showLoader = true) {
    console.time('switchLanguage');
    
    if (!AVAILABLE_LANGUAGES.includes(language)) {
      console.error(`[LanguageManager] Invalid language: ${language}`);
      return;
    }
    
    if (this.currentLanguage === language) {
      console.log(`[LanguageManager] Language already set to ${language}`);
      return;
    }
    
    // Показываем индикатор загрузки, если нужно
    if (showLoader) {
      this.showLanguageLoader(true);
    }
    
    // Сохраняем предыдущий язык для возможного восстановления
    this.previousLanguage = this.currentLanguage;
    console.log(`[LanguageManager] Switching from ${this.previousLanguage} to ${language}`);
    
    // Сохраняем новый язык во всех хранилищах
    this.currentLanguage = language;
    this.saveLanguagePreference(language);
    
    try {
      // Синхронизировать с сервером
      await this.syncLanguageWithServer();
      
      // Применить перевод к странице
      await this.applyLanguage();
      
      // Обновить URL, добавив параметр языка
      this.updateUrlWithLanguage();
      
      // Обновить кнопки языка
      this.updateLanguageButtons();
      
      if (showLoader) {
        this.showLanguageLoader(false);
      }
      
      // Событие о переключении языка
      document.dispatchEvent(new CustomEvent('language-changed', { detail: { language } }));
      
      console.timeEnd('switchLanguage');
    } catch (error) {
      console.error('[LanguageManager] Error during language switch:', error);
      if (showLoader) {
        this.showLanguageLoader(false);
      }
    }
  }
  
  /**
   * Применить текущий язык к странице
   */
  /**
   * Перевести текст с помощью API
   * @param {string} text - Текст для перевода
   * @param {string} sourceLang - Исходный язык
   * @param {string} targetLang - Целевой язык
   * @returns {Promise<string>} - Переведенный текст
   */
  async translateText(text, sourceLang, targetLang) {
    if (!text || text.trim() === '') {
      return text;
    }
    
    // Проверяем, есть ли уже такой перевод в кэше
    const cacheKey = `${text}_${targetLang}`;
    const cachedTranslation = localStorage.getItem(cacheKey);
    if (cachedTranslation) {
      console.log(`[LanguageManager] Using cached translation for: ${text.substring(0, 30)}...`);
      return cachedTranslation;
    }
    
    try {
      // Получаем CSRF токен
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!token) {
        console.error('[LanguageManager] CSRF token not found for translation');
        return text;
      }
      
      // Отправляем запрос на перевод
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          text: text,
          source: sourceLang,
          target: targetLang,
          cache: true // Сохранять перевод в БД
        })
      });
      
      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.translation) {
        // Кэшируем перевод для будущего использования
        localStorage.setItem(cacheKey, data.translation);
        return data.translation;
      } else {
        console.error(`[LanguageManager] Translation error: ${data.message || 'Unknown error'}`);
        return text; // Возвращаем оригинальный текст в случае ошибки
      }
    } catch (error) {
      console.error(`[LanguageManager] Error translating text: ${error.message}`);
      return text; // Возвращаем оригинальный текст в случае ошибки
    }
  }
  
  async applyLanguage() {
    console.time('language-switch');
    // Проверяем и сохраняем текущий язык снова
    const savedLanguage = this.getSavedLanguage();
    if (savedLanguage !== this.currentLanguage) {
      console.log(`[LanguageManager] Language mismatch: current=${this.currentLanguage}, saved=${savedLanguage}`);
      this.currentLanguage = savedLanguage;
    }
    
    // Устанавливаем атрибут языка на HTML-элементе для CSS
    document.documentElement.setAttribute('data-language', this.currentLanguage);
    
    if (this.currentLanguage === DEFAULT_LANGUAGE) {
      console.log(`[LanguageManager] Using default language: ${DEFAULT_LANGUAGE}`);
      console.timeEnd('language-switch');
      return;
    }
    
    console.log(`[LanguageManager] Applying language: ${this.currentLanguage}`);
    
    try {
      // Загружаем переводы из локального кэша сначала (быстрый путь)
      const localCache = this.loadLocalTranslations();
      
      // Принудительная загрузка переводов для текущей страницы в фоне
      this.fetchPageTranslations().then(translations => {
        // Сливаем с локальным кэшем, если получили новые переводы
        if (translations && Object.keys(translations).length > 0) {
          // Сохраняем в локальное хранилище
          this.saveLocalTranslations(translations);
        }
      }).catch(err => {
        console.error('[LanguageManager] Failed to fetch page translations:', err);
      });
      
      // Используем импортированную translatePage из translator-simple.js
      console.log(`[LanguageManager] Translating page to ${this.currentLanguage} using cached translations`);
      try {
        // Явно импортируем translatePage в случае, если был конфликт
        const { translatePage } = await import('./new-translator.js');
        await translatePage(this.currentLanguage, localCache, () => {
          console.log('[LanguageManager] Translation completed');
          // Переводим специальные компоненты после основного перевода страницы
          this.translateSpecialComponents(localCache);
        });
      } catch (translationError) {
        console.error('[LanguageManager] Translation error:', translationError);
      }
      
      console.timeEnd('language-switch');
      
      // Регистрируем MutationObserver для перевода новых элементов
      this.registerContentObserver();
    } catch (error) {
      console.error('[LanguageManager] Error applying language:', error);
    }
  }
  
  /**
   * Загрузить локальные переводы из localStorage
   * @returns {Object} Загруженные переводы
   */
  loadLocalTranslations() {
    try {
      const localData = localStorage.getItem('siteTranslations');
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('[LanguageManager] Loaded local translations:', Object.keys(parsed).length);
        return parsed;
      }
    } catch (e) {
      console.error('[LanguageManager] Error loading local translations:', e);
      // В случае ошибки, попытаемся очистить повреждённые данные
      localStorage.removeItem('siteTranslations');
    }
    return {};
  }

  /**
   * Сохранить переводы локально
   * @param {Object} translations - Переводы для сохранения
   */
  saveLocalTranslations(translations) {
    try {
      // Объединяем с существующими переводами
      const updated = { ...this.localTranslations, ...translations };
      this.localTranslations = updated;
      
      // Сохраняем в localStorage
      localStorage.setItem('siteTranslations', JSON.stringify(updated));
      console.log('[LanguageManager] Saved local translations:', Object.keys(updated).length);
    } catch (e) {
      console.error('[LanguageManager] Error saving local translations:', e);
    }
  }

  /**
   * Получить переводы для текущей страницы с сервера или из кэша
   * @returns {Object} Полученные переводы
   */
  async fetchPageTranslations() {
    try {
      // Определяем URL текущей страницы
      const currentPageUrl = window.location.pathname;
      
      // Сначала проверим локальное хранилище
      const cachedPageKey = `pageTranslations_${this.currentLanguage}_${currentPageUrl}`;
      const cachedTranslations = localStorage.getItem(cachedPageKey);
      
      if (cachedTranslations) {
        try {
          const translations = JSON.parse(cachedTranslations);
          if (translations && Object.keys(translations).length > 0) {
            console.log(`[LanguageManager] Using ${Object.keys(translations).length} cached translations for ${this.currentLanguage} on page ${currentPageUrl}`);
            return translations;
          }
        } catch (e) {
          console.error('[LanguageManager] Error parsing cached translations:', e);
          // Удаляем невалидный кэш
          localStorage.removeItem(cachedPageKey);
        }
      }
      
      // Получить CSRF токен
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!token) {
        console.error('[LanguageManager] CSRF token not found');
        return {};
      }
      
      // Получить переводы для текущей страницы
      console.log(`[LanguageManager] Fetching translations for ${this.currentLanguage} from server for page ${currentPageUrl}`);
      const response = await fetch('/api/page-translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          page_url: currentPageUrl,
          language: this.currentLanguage,
          save_all: true // Флаг для сервера, чтобы сохранять все переводы для страницы
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.translations) {
        // Сохранить в локальное хранилище с привязкой к странице
        try {
          localStorage.setItem(cachedPageKey, JSON.stringify(data.translations));
          
          // Также сохраняем время последнего обновления
          localStorage.setItem(`${cachedPageKey}_updated`, new Date().toISOString());
          
          // Если есть данные о количестве сохраненных переводов, тоже сохраняем
          if (data.saved_count) {
            console.log(`[LanguageManager] Server saved ${data.saved_count} translations for future use`);
          }
        } catch (e) {
          console.error('[LanguageManager] Error caching translations:', e);
        }
        return data.translations;
      } else {
        console.log(`[LanguageManager] No translations found for ${this.currentLanguage}`);
        return {};
      }
    } catch (error) {
      console.error('[LanguageManager] Error fetching translations:', error);
      return {};
    }
  }
  
  /**
   * Сохранить переводы на сервере для последующего использования
   * @param {Object} translations Объект с переводами в формате { оригинал: перевод }
   * @param {string} pageUrl URL текущей страницы
   */
  saveTranslationsToServer(translations, pageUrl) {
    if (!translations || Object.keys(translations).length === 0) {
      console.log('[LanguageManager] No translations to save');
      return;
    }
    
    // Получаем CSRF токен
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      console.error('[LanguageManager] CSRF token not found, cannot save translations');
      return;
    }
    
    // Отправляем на сервер для сохранения
    console.log(`[LanguageManager] Saving ${Object.keys(translations).length} translations to server for page ${pageUrl}`);
    
    fetch('/api/page-translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({
        page_url: pageUrl,
        language: this.currentLanguage,
        save_all: true,
        translations: translations
      }),
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to save translations: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        console.log(`[LanguageManager] Successfully saved ${data.saved_count || Object.keys(translations).length} translations for future use`);
        // Обновляем кэш в локальном хранилище
        const cachedPageKey = `pageTranslations_${this.currentLanguage}_${pageUrl}`;
        try {
          const existingData = localStorage.getItem(cachedPageKey);
          if (existingData) {
            const existingTranslations = JSON.parse(existingData);
            // Объединяем существующие переводы с новыми
            const updatedTranslations = { ...existingTranslations, ...translations };
            localStorage.setItem(cachedPageKey, JSON.stringify(updatedTranslations));
            localStorage.setItem(`${cachedPageKey}_updated`, new Date().toISOString());
          }
        } catch (e) {
          console.error('[LanguageManager] Error updating local cache:', e);
        }
      } else {
        console.error('[LanguageManager] Failed to save translations:', data);
      }
    })
    .catch(error => {
      console.error('[LanguageManager] Error saving translations:', error);
    });
  }
  
  /**
   * Обновить URL с языком (отключено, чтобы избежать добавления ?lang= в URL)
   */
  updateUrlWithLanguage() {
    // Отключаем функцию изменения URL с параметром language
    // Вместо этого язык сохраняется в localStorage и cookies
    console.log('[LanguageManager] URL update with language parameter is disabled');
    return;
  }
  
  /**
   * Перевести контент страницы, используя готовые переводы
   * @param {Object} translations Объект с переводами в формате { оригинал: перевод }
   */
  async translatePageContent(translations = {}) {
    if (!translations || Object.keys(translations).length === 0) {
      console.log('[LanguageManager] No translations provided');
      return;
    }
    
    // Собираем все текстовые элементы страницы
    const textElements = this.collectTextElements();
    
    console.log(`[LanguageManager] Translating ${textElements.length} elements using ${Object.keys(translations).length} translations`);
    
    const untranslated = {};
    const newTranslations = {};
    const currentPageUrl = window.location.pathname;
    
    // Переводим каждый элемент
    for (const element of textElements) {
      const originalText = element.originalText;
      
      // Пропускаем пустые тексты или тексты только с пробелами
      if (!originalText || originalText.trim() === '') continue;
      
      // Пропускаем числа и короткие тексты, которые могут быть идентификаторами
      if (/^\d+$/.test(originalText) || originalText.length <= 2) continue;
      
      // Если есть готовый перевод, используем его
      if (translations[originalText]) {
        const translatedText = translations[originalText];
        if (element.node.nodeType === Node.TEXT_NODE) {
          element.node.nodeValue = translatedText;
        } else if (element.node.nodeType === Node.ELEMENT_NODE) {
          if (element.attributeName) {
            element.node.setAttribute(element.attributeName, translatedText);
          } else {
            element.node.innerText = translatedText;
          }
        }
      } else {
        // Если перевода нет в готовых, добавляем в список для перевода
        untranslated[originalText] = '';
      }
    }
    
    // Если есть непереведенные тексты, переводим их
    const untranslatedTexts = Object.keys(untranslated);
    if (untranslatedTexts.length > 0) {
      console.log(`[LanguageManager] Translating ${untranslatedTexts.length} new texts`);
      
      // Переводим небольшими пачками для оптимизации
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < untranslatedTexts.length; i += batchSize) {
        batches.push(untranslatedTexts.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        await Promise.all(batch.map(async (text) => {
          try {
            const translation = await this.translateText(text, DEFAULT_LANGUAGE, this.currentLanguage);
            if (translation) {
              newTranslations[text] = translation;
            }
          } catch (error) {
            console.error(`[LanguageManager] Error translating text: ${text}`, error);
          }
        }));
      }
      
      // Применяем новые переводы
      for (const element of textElements) {
        const originalText = element.originalText;
        if (newTranslations[originalText]) {
          const translatedText = newTranslations[originalText];
          if (element.node.nodeType === Node.TEXT_NODE) {
            element.node.nodeValue = translatedText;
          } else if (element.node.nodeType === Node.ELEMENT_NODE) {
            if (element.attributeName) {
              element.node.setAttribute(element.attributeName, translatedText);
            } else {
              element.node.innerText = translatedText;
            }
          }
        }
      }
      
      // Добавляем новые переводы в общий список
      Object.assign(translations, newTranslations);
      
      // Сохраняем все новые переводы в БД через API
      if (Object.keys(newTranslations).length > 0) {
        this.saveTranslationsToServer(newTranslations, currentPageUrl);
      }
    }
    
    return translations;
  }
  
  /**
   * Собирает все текстовые элементы на странице для перевода
   * @returns {Array} Массив объектов с текстовыми элементами
   */
  collectTextElements() {
    const elements = [];
    const translatableElements = document.querySelectorAll('[data-translate]');
    
    // Сначала обрабатываем элементы с атрибутом data-translate
    translatableElements.forEach(element => {
      // Пропускаем элементы, которые не нужно переводить
      if (element.getAttribute('data-no-translate') === 'true') {
        return;
      }
      
      // Проверяем наличие полезного текста
      const text = element.innerText?.trim();
      if (text && text.length > 0) {
        elements.push({
          node: element,
          originalText: text,
          attributeName: null
        });
      }
      
      // Проверяем атрибуты, которые нужно перевести
      const translateAttributes = element.getAttribute('data-translate-attrs');
      if (translateAttributes) {
        translateAttributes.split(',').forEach(attr => {
          attr = attr.trim();
          const attrValue = element.getAttribute(attr);
          if (attrValue && attrValue.trim().length > 0) {
            elements.push({
              node: element,
              originalText: attrValue,
              attributeName: attr
            });
          }
        });
      }
    });
    
    // Дополнительно ищем все элементы с атрибутом data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(element => {
      const text = element.innerText?.trim();
      if (text && text.length > 0) {
        elements.push({
          node: element,
          originalText: text,
          attributeName: null
        });
      }
    });
    
    // Также добавляем элементы с классом 'translatable'
    const customElements = document.querySelectorAll('.translatable');
    customElements.forEach(element => {
      const text = element.innerText?.trim();
      if (text && text.length > 0) {
        elements.push({
          node: element,
          originalText: text,
          attributeName: null
        });
      }
    });
    
    console.log(`[LanguageManager] Collected ${elements.length} text elements for translation`);
    return elements;
  }
  
  /**
   * Получить все текстовые узлы DOM для перевода
   * @param {Node} rootNode Корневой элемент для поиска текстовых узлов
   * @returns {Array} Массив текстовых узлов
   */
  getAllTextNodes(rootNode) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Пропускаем пустые узлы
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          
          // Пропускаем узлы скриптов, стилей и т.д.
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style' || tagName === 'noscript' || tagName === 'pre' || tagName === 'code') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Пропускаем элементы с data-no-translate
          if (parent.getAttribute('data-no-translate') !== null) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim().length > 2) {
        textNodes.push(walker.currentNode);
      }
    }
    
    return textNodes;
  }
  
  /**
   * Регистрирует MutationObserver для отслеживания изменений в DOM
   * и автоматического перевода новых элементов
   */
  registerContentObserver() {
    // Удалить существующий наблюдатель, если он есть
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Если текущий язык - язык по умолчанию, то не нужно наблюдать
    if (this.currentLanguage === DEFAULT_LANGUAGE) {
      return;
    }
    
    // Получить кэшированные переводы
    const cachedTranslations = localStorage.getItem(`pageTranslations_${this.currentLanguage}`);
    if (!cachedTranslations) {
      return; // Нет переводов для использования
    }
    
    let translations;
    try {
      translations = JSON.parse(cachedTranslations);
    } catch (e) {
      console.error('[LanguageManager] Error parsing cached translations:', e);
      return;
    }
    
    // Создать наблюдатель за изменениями DOM
    const debounceTime = 500; // мс, чтобы не обрабатывать слишком часто
    let debounceTimer = null;
    
    this.observer = new MutationObserver((mutations) => {
      // Используем дебаунсинг, чтобы не обрабатывать много изменений подряд
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Обработать только мутации с добавлением узлов или изменением текста
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Перевести новый элемент и все его дочерние текстовые узлы
                const textNodes = this.getAllTextNodes(node);
                for (const textNode of textNodes) {
                  const originalText = textNode.textContent.trim();
                  if (originalText.length < 3) continue;
                  
                  if (translations[originalText]) {
                    textNode.textContent = textNode.textContent.replace(originalText, translations[originalText]);
                  }
                }
                
                // Проверить, является ли элемент или его родитель специальным компонентом
                this.checkAndTranslateSpecialComponents(node, translations);
              }
            }
          } else if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
            // Перевести измененный текстовый узел
            const originalText = mutation.target.textContent.trim();
            if (originalText.length < 3) continue;
            
            if (translations[originalText]) {
              mutation.target.textContent = mutation.target.textContent.replace(originalText, translations[originalText]);
            }
          }
        }
      }, debounceTime);
    });
    
    // Начать наблюдение за всем документом
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('[LanguageManager] DOM observer registered for dynamic translations');
  }
  
  /**
   * Перевести специальные компоненты сайта
   * @param {Object} translations Объект с переводами
   */
  async translateSpecialComponents(translations) {
    if (!translations || Object.keys(translations).length === 0) return;
    
    // Перевести FilesAccord и его компоненты
    this.translateFilesAccordComponents(translations);
    
    // Перевести SimpleFileDisplay и его компоненты
    this.translateSimpleFileDisplayComponents(translations);
    
    // Перевести модальные окна
    this.translateModalComponents(translations);
    
    // Перевести специальные атрибуты в DOM
    this.translateSpecialAttributes(translations);
  }
  
  /**
   * Проверить и перевести специальные компоненты
   * @param {Node} node Нода для проверки
   * @param {Object} translations Объект с переводами
   */
  checkAndTranslateSpecialComponents(node, translations) {
    // Проверка на FilesAccord
    if (node.classList && (node.classList.contains('files-accord') || 
        node.classList.contains('file-accord-title') || 
        node.classList.contains('file-accord-chlank'))) {
      this.translateFilesAccordComponents(translations);
      return;
    }
    
    // Проверка на SimpleFileDisplay
    if (node.classList && (node.classList.contains('simple-file-display') || 
        node.parentElement?.classList?.contains('simple-file-display'))) {
      this.translateSimpleFileDisplayComponents(translations);
      return;
    }
    
    // Проверка на модальные окна
    if (node.getAttribute && (node.getAttribute('role') === 'dialog' || 
        node.classList?.contains('modal'))) {
      this.translateModalComponents(translations);
    }
  }
  
  /**
   * Перевести компоненты FilesAccord
   * @param {Object} translations Объект с переводами
   */
  translateFilesAccordComponents(translations) {
    // Перевод заголовков разделов
    const titles = document.querySelectorAll('.file-accord-title');
    titles.forEach(title => {
      const titleText = title.querySelector('span:first-child');
      if (titleText && translations[titleText.textContent.trim()]) {
        titleText.textContent = translations[titleText.textContent.trim()];
      }
    });
    
    // Перевод описаний файлов
    const fileDescs = document.querySelectorAll('.file-accord-chlank .file-desc');
    fileDescs.forEach(desc => {
      if (desc && translations[desc.textContent.trim()]) {
        desc.textContent = translations[desc.textContent.trim()];
      }
    });
    
    // Перевод кнопок и других элементов
    const buttons = document.querySelectorAll('.files-accord button, .file-accord-chlank button');
    buttons.forEach(button => {
      if (button && translations[button.textContent.trim()]) {
        button.textContent = translations[button.textContent.trim()];
      }
    });
  }
  
  /**
   * Перевести компоненты SimpleFileDisplay
   * @param {Object} translations Объект с переводами
   */
  translateSimpleFileDisplayComponents(translations) {
    const fileDisplays = document.querySelectorAll('.simple-file-display');
    fileDisplays.forEach(display => {
      // Перевести заголовок, если есть
      const title = display.querySelector('h2, h3, h4');
      if (title && translations[title.textContent.trim()]) {
        title.textContent = translations[title.textContent.trim()];
      }
      
      // Перевести названия файлов
      const fileNames = display.querySelectorAll('.file-name');
      fileNames.forEach(name => {
        if (name && translations[name.textContent.trim()]) {
          name.textContent = translations[name.textContent.trim()];
        }
      });
      
      // Перевести кнопки
      const buttons = display.querySelectorAll('button');
      buttons.forEach(button => {
        if (button && translations[button.textContent.trim()]) {
          button.textContent = translations[button.textContent.trim()];
        }
      });
    });
  }
  
  /**
   * Перевести модальные окна
   * @param {Object} translations Объект с переводами
   */
  translateModalComponents(translations) {
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    modals.forEach(modal => {
      // Перевести заголовок модального окна
      const title = modal.querySelector('.modal-title, h3, h4, h5');
      if (title && translations[title.textContent.trim()]) {
        title.textContent = translations[title.textContent.trim()];
      }
      
      // Перевести кнопки в модальном окне
      const buttons = modal.querySelectorAll('button');
      buttons.forEach(button => {
        if (button && translations[button.textContent.trim()]) {
          button.textContent = translations[button.textContent.trim()];
        }
      });
      
      // Перевести все параграфы
      const paragraphs = modal.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p && translations[p.textContent.trim()]) {
          p.textContent = translations[p.textContent.trim()];
        }
      });
    });
  }
  
  /**
   * Перевести специальные атрибуты в DOM
   * @param {Object} translations Объект с переводами
   */
  translateSpecialAttributes(translations) {
    // Перевести data-original-title для Bootstrap tooltips
    const tooltips = document.querySelectorAll('[data-original-title]');
    tooltips.forEach(element => {
      const originalTitle = element.getAttribute('data-original-title');
      if (originalTitle && translations[originalTitle]) {
        element.setAttribute('data-original-title', translations[originalTitle]);
      }
    });
    
    // Перевести aria-label атрибуты
    const ariaLabels = document.querySelectorAll('[aria-label]');
    ariaLabels.forEach(element => {
      const label = element.getAttribute('aria-label');
      if (label && translations[label]) {
        element.setAttribute('aria-label', translations[label]);
      }
    });
  }

  /**
   * Показать или скрыть индикатор загрузки при переключении языка
   * @param {boolean} show - Показывать или скрывать индикатор
   */
  showLanguageLoader(show) {
    // Предыдущий индикатор
    let existingLoader = document.querySelector('#language-loader');
    
    // Если нужно скрыть индикатор
    if (!show) {
      if (existingLoader) {
        existingLoader.classList.add('fade-out');
        setTimeout(() => {
          if (existingLoader && existingLoader.parentNode) {
            existingLoader.parentNode.removeChild(existingLoader);
          }
        }, 500); // Задержка для анимации перед удалением
      }
      return;
    }
    
    // Если индикатор уже существует, просто показываем его
    if (existingLoader) {
      existingLoader.classList.remove('fade-out');
      return;
    }
    
    // Создаем новый индикатор
    const loader = document.createElement('div');
    loader.id = 'language-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    // Создаем контейнер с индикатором
    const container = document.createElement('div');
    container.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    
    // Создаем спиннер
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    `;
    
    // Добавляем стиль анимации
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      #language-loader.fade-out {
        opacity: 0 !important;
      }
    `;
    
    // Добавляем текст
    const text = document.createElement('div');
    text.textContent = 'Переключение языка...';
    text.style.cssText = 'font-size: 16px; color: #333;';
    
    // Собираем все элементы
    container.appendChild(spinner);
    container.appendChild(text);
    loader.appendChild(container);
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Запускаем анимацию появления
    setTimeout(() => {
      loader.style.opacity = '1';
    }, 10);
  }
  
  /**
   * Обновить кнопки языка на странице
   */
  updateLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const langCode = btn.getAttribute('data-lang');
      if (langCode === this.currentLanguage) {
        btn.style.backgroundColor = '#3b82f6';
        btn.style.color = 'white';
      } else {
        btn.style.backgroundColor = 'white';
        btn.style.color = '#3b82f6';
      }
    });
  }
}

// Создать и экспортировать синглтон менеджера языка
const languageManager = new LanguageManager();

// Инициализировать при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  languageManager.init();
});

export default languageManager;

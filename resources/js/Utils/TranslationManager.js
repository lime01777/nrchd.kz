/**
 * TranslationManager.js - Улучшенная система переводов 
 * Обеспечивает хранение, загрузку и применение переводов для всего сайта
 */

// Константы языков
const SUPPORTED_LANGUAGES = ['ru', 'en', 'kz'];
const DEFAULT_LANGUAGE = 'ru';

// Класс управления переводами
class TranslationManager {
  constructor() {
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.translations = {
      ru: {},
      en: {},
      kz: {}
    };
    this.initialized = false;
    
    // Максимальное допустимое количество элементов в кэше (защита от переполнения)
    this.MAX_CACHE_ITEMS = 5000;
    
    // Флаг для отслеживания процесса перевода
    this.isTranslating = false;
    
    // Дата последней очистки кэша
    this.lastCacheClear = Date.now();
  }

  /**
   * Инициализация менеджера переводов
   */
  init() {
    if (this.initialized) {
      console.log('[TranslationManager] Already initialized');
      return this;
    }
    
    // Загрузить сохраненный язык
    this.currentLanguage = this.getSavedLanguage();
    
    // Загрузить кэшированные переводы
    this.loadTranslationsFromStorage();
    
    // Установить язык на HTML для CSS-стилей
    document.documentElement.setAttribute('data-language', this.currentLanguage);
    
    // Автоматически применить перевод, если не дефолтный язык
    if (this.currentLanguage !== DEFAULT_LANGUAGE) {
      this.applyTranslations();
    }
    
    // Настроить наблюдатель DOM для автоматического перевода новых элементов
    this.setupMutationObserver();
    
    this.initialized = true;
    console.log(`[TranslationManager] Initialized with language: ${this.currentLanguage}`);
    
    return this;
  }
  
  /**
   * Получить сохраненный язык из localStorage или cookies
   */
  getSavedLanguage() {
    // Проверить localStorage
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      return storedLang;
    }
    
    // Проверить cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      if (cookie[0] === 'language' && SUPPORTED_LANGUAGES.includes(cookie[1])) {
        // Синхронизировать с localStorage
        localStorage.setItem('preferredLanguage', cookie[1]);
        return cookie[1];
      }
    }
    
    return DEFAULT_LANGUAGE;
  }
  
  /**
   * Сохранить предпочтительный язык
   */
  saveLanguagePreference(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      console.error(`[TranslationManager] Invalid language: ${language}`);
      return;
    }
    
    // Сохранить в localStorage
    localStorage.setItem('preferredLanguage', language);
    
    // Сохранить в cookies (30 дней)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `language=${language}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    // Установить на HTML для CSS
    document.documentElement.setAttribute('data-language', language);
    
    this.currentLanguage = language;
  }
  
  /**
   * Загрузить кэшированные переводы из localStorage
   */
  loadTranslationsFromStorage() {
    try {
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (lang === DEFAULT_LANGUAGE) return; // Не загружаем дефолтный язык
        
        const key = `translations_${lang}`;
        const storedData = localStorage.getItem(key);
        
        if (storedData) {
          try {
            const data = JSON.parse(storedData);
            this.translations[lang] = { ...data };
            console.log(`[TranslationManager] Loaded ${Object.keys(data).length} translations for ${lang}`);
          } catch (e) {
            console.error(`[TranslationManager] Error parsing translations for ${lang}`, e);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.error('[TranslationManager] Error loading translations from storage', e);
    }
  }
  
  /**
   * Сохранить переводы в localStorage
   */
  saveTranslationsToStorage() {
    try {
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (lang === DEFAULT_LANGUAGE) return; // Не сохраняем дефолтный язык
        
        const translations = this.translations[lang];
        if (Object.keys(translations).length > 0) {
          try {
            localStorage.setItem(`translations_${lang}`, JSON.stringify(translations));
          } catch (e) {
            console.error(`[TranslationManager] Error saving translations for ${lang}`, e);
            
            if (e.name === 'QuotaExceededError') {
              this.cleanupTranslations(lang);
              try {
                localStorage.setItem(`translations_${lang}`, JSON.stringify(this.translations[lang]));
              } catch (e2) {
                console.error(`[TranslationManager] Still can't save translations after cleanup`, e2);
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('[TranslationManager] Error saving translations to storage', e);
    }
  }
  
  /**
   * Очистить часть кэша переводов при переполнении
   */
  cleanupTranslations(lang) {
    const translations = this.translations[lang];
    const keys = Object.keys(translations);
    
    if (keys.length > this.MAX_CACHE_ITEMS / 2) {
      // Удалить 30% самых старых записей
      const removeCount = Math.floor(keys.length * 0.3);
      const keysToRemove = keys.slice(0, removeCount);
      
      keysToRemove.forEach(key => {
        delete translations[key];
      });
      
      console.log(`[TranslationManager] Removed ${removeCount} translations from ${lang} cache`);
    }
  }
  
  /**
   * Перевести текстовые элементы DOM на указанный язык
   */
  async translateToLanguage(targetLang) {
    if (!targetLang || !SUPPORTED_LANGUAGES.includes(targetLang)) {
      console.error(`[TranslationManager] Invalid target language: ${targetLang}`);
      return false;
    }
    
    if (targetLang === this.currentLanguage) {
      console.log(`[TranslationManager] Already using ${targetLang}`);
      return true;
    }
    
    if (this.isTranslating) {
      console.log('[TranslationManager] Translation already in progress');
      return false;
    }
    
    try {
      this.isTranslating = true;
      
      // Показать индикатор перевода
      this.showTranslationIndicator(targetLang);
      
      // Запомнить предыдущий язык для возможного отката
      const previousLang = this.currentLanguage;
      
      // Установить новый язык
      this.currentLanguage = targetLang;
      this.saveLanguagePreference(targetLang);
      
      // Если переключаемся на дефолтный язык, то восстанавливаем оригинальные тексты
      if (targetLang === DEFAULT_LANGUAGE) {
        await this.restoreOriginalTexts();
      } else {
        // Иначе применяем переводы
        await this.applyTranslations();
      }
      
      // Обновить URL без перезагрузки страницы
      this.updateUrlWithLanguage(targetLang);
      
      return true;
    } catch (error) {
      console.error(`[TranslationManager] Error translating to ${targetLang}:`, error);
      return false;
    } finally {
      this.isTranslating = false;
      this.hideTranslationIndicator();
    }
  }
  
  /**
   * Показать индикатор процесса перевода
   */
  showTranslationIndicator(targetLang) {
    let indicator = document.getElementById('translation-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'translation-indicator';
      indicator.style.position = 'fixed';
      indicator.style.top = '20px';
      indicator.style.right = '20px';
      indicator.style.padding = '10px 15px';
      indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      indicator.style.color = 'white';
      indicator.style.borderRadius = '4px';
      indicator.style.zIndex = '9999';
      indicator.style.fontSize = '14px';
      document.body.appendChild(indicator);
    }
    
    // Показываем текст в соответствии с целевым языком
    if (targetLang === 'en') {
      indicator.textContent = 'Translating to English...';
    } else if (targetLang === 'kz') {
      indicator.textContent = 'Қазақ тіліне аударылуда...';
    } else {
      indicator.textContent = 'Перевод на русский...';
    }
  }
  
  /**
   * Скрыть индикатор процесса перевода
   */
  hideTranslationIndicator() {
    const indicator = document.getElementById('translation-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  /**
   * Обновить URL с параметром языка без перезагрузки страницы
   */
  updateUrlWithLanguage(lang) {
    if (!window.history || !window.history.replaceState) return;
    
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Добавляет перевод в кэш
   */
  addTranslation(originalText, targetLang, translatedText) {
    if (!originalText || !translatedText || targetLang === DEFAULT_LANGUAGE) return;
    
    this.translations[targetLang][originalText] = translatedText;
    
    // Периодически сохраняем в localStorage
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this.saveTranslationsToStorage(), 2000);
  }

  /**
   * Получает перевод из кэша
   */
  getTranslation(originalText, targetLang) {
    if (!originalText || targetLang === DEFAULT_LANGUAGE) return originalText;
    return this.translations[targetLang][originalText] || null;
  }

  /**
   * Получить текущий язык
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Настройка наблюдателя DOM для автоматического перевода новых элементов
   */
  setupMutationObserver() {
    // Если DOM уже наблюдается, не создаем новый observer
    if (this._mutationObserver) return;
    
    // Создаем observer для мониторинга изменений в DOM
    this._mutationObserver = new MutationObserver((mutations) => {
      // Если язык не дефолтный, переводим новые элементы
      if (this.currentLanguage !== DEFAULT_LANGUAGE && !this.isTranslating) {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Перевести новые элементы
                this.translateElement(node);
              }
            });
          }
        });
      }
    });
    
    // Начинаем наблюдение за DOM
    this._mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Остановка наблюдателя DOM
   */
  stopMutationObserver() {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
  }
  
  // Методы для работы с API и переводом будут реализованы в файлах-расширениях
}

// Создание и экспорт единственного экземпляра
const translationManager = new TranslationManager();
export default translationManager;

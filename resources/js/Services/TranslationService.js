// Простой и быстрый сервис переводов на основе JSON файлов
import kzTranslations from '../locales/kz.json';
import ruTranslations from '../locales/ru.json';
import enTranslations from '../locales/en.json';

class TranslationService {
  constructor() {
    // Загружаем все переводы сразу
    this.translations = {
      kz: kzTranslations,
      ru: ruTranslations,
      en: enTranslations
    };
    
    // Дефолтный язык - казахский
    this.currentLanguage = this.getStoredLanguage() || 'kz';
    
    console.log('[TranslationService] Initialized with language:', this.currentLanguage);
  }

  /**
   * Получить сохраненный язык из localStorage
   */
  getStoredLanguage() {
    try {
      const stored = localStorage.getItem('selectedLanguage');
      if (stored && ['ru', 'kz', 'en'].includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.error('[TranslationService] Error reading from localStorage:', e);
    }
    return 'kz'; // Дефолтный язык
  }

  /**
   * Сохранить выбранный язык
   */
  setLanguage(lang) {
    if (!['ru', 'kz', 'en'].includes(lang)) {
      console.error('[TranslationService] Invalid language:', lang);
      return false;
    }
    
    this.currentLanguage = lang;
    
    try {
      localStorage.setItem('selectedLanguage', lang);
      document.documentElement.setAttribute('lang', lang);
      console.log('[TranslationService] Language changed to:', lang);
      
      // Генерируем событие для компонентов
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      
      return true;
    } catch (e) {
      console.error('[TranslationService] Error saving to localStorage:', e);
      return false;
    }
  }

  /**
   * Получить текущий язык
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Получить перевод по ключу
   * @param {string} key - Ключ в формате "section.subsection.key"
   * @param {string} fallback - Текст по умолчанию, если перевод не найден
   */
  t(key, fallback = null) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Если перевод не найден, возвращаем fallback или ключ
        return fallback || key;
      }
    }
    
    return value;
  }

  /**
   * Получить все переводы для текущего языка
   */
  getAll() {
    return this.translations[this.currentLanguage] || {};
  }

  /**
   * Получить все переводы для определенной секции
   * @param {string} section - Название секции (например, "header", "directions")
   */
  getSection(section) {
    return this.translations[this.currentLanguage]?.[section] || {};
  }
}

// Создаем единственный экземпляр сервиса
const translationService = new TranslationService();

// Экспортируем как default и named export для совместимости
export default translationService;
export { translationService };


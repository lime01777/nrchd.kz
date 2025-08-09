/**
 * FastTranslationService - Быстрый сервис переводов с использованием БД
 * Обеспечивает мгновенное переключение языков за счет кэширования в БД
 */

class FastTranslationService {
  constructor() {
    this.currentLanguage = 'ru';
    this.translationCache = new Map();
    this.isTranslating = false;
    this.pageUrl = window.location.pathname;
  }

  /**
   * Быстрое переключение языка страницы
   * @param {string} targetLanguage - Целевой язык (en, kz, ru)
   */
  async translatePage(targetLanguage) {
    if (this.isTranslating || targetLanguage === this.currentLanguage) {
      return;
    }

    console.log(`[FastTranslationService] Переключение на язык: ${targetLanguage}`);
    this.isTranslating = true;

    try {
      // Если переключаемся на русский, просто восстанавливаем оригинальные тексты
      if (targetLanguage === 'ru') {
        this.restoreOriginalTexts();
        this.currentLanguage = targetLanguage;
        return;
      }

      // Получаем переводы из БД
      const translations = await this.getPageTranslations(targetLanguage);
      
      // Применяем переводы к странице
      this.applyTranslations(translations, targetLanguage);
      
      this.currentLanguage = targetLanguage;
      console.log(`[FastTranslationService] Язык успешно переключен на: ${targetLanguage}`);
      
    } catch (error) {
      console.error('[FastTranslationService] Ошибка переключения языка:', error);
      throw error;
    } finally {
      this.isTranslating = false;
    }
  }

  /**
   * Получить переводы для текущей страницы из БД
   * @param {string} targetLanguage - Целевой язык
   * @returns {Object} Объект с переводами
   */
  async getPageTranslations(targetLanguage) {
    try {
      // Используем API маршрут для переводов
      const response = await fetch(`/api/translate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          page_url: this.pageUrl,
          target_language: targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.translations || {};
      } else {
        throw new Error(data.message || 'Ошибка получения переводов');
      }
    } catch (error) {
      console.error('[FastTranslationService] Ошибка получения переводов:', error);
      
      // Возвращаем пустой объект, если не удалось получить переводы
      // Это позволит переключиться на язык без переводов
      return {};
    }
  }

  /**
   * Применить переводы к элементам страницы
   * @param {Object} translations - Объект с переводами
   * @param {string} targetLanguage - Целевой язык
   */
  applyTranslations(translations, targetLanguage) {
    // Сохраняем оригинальные тексты перед переводом
    this.saveOriginalTexts();

    // Получаем все текстовые элементы для перевода
    const elementsToTranslate = this.getTranslatableElements();

    let translatedCount = 0;
    let notFoundCount = 0;

    elementsToTranslate.forEach(element => {
      const originalText = element.textContent.trim();
      
      // Пропускаем пустые тексты и элементы, которые не должны переводиться
      if (!originalText || 
          originalText.length < 2 || 
          element.hasAttribute('data-no-translate') ||
          this.shouldSkipElement(element)) {
        return;
      }

      // Ищем перевод в полученных данных
      const translatedText = this.findTranslation(originalText, translations);
      
      if (translatedText && translatedText !== originalText) {
        element.textContent = translatedText;
        element.setAttribute('data-translated', 'true');
        element.setAttribute('data-target-lang', targetLanguage);
        translatedCount++;
      } else {
        notFoundCount++;
        // Можно отправить запрос на перевод нового текста в фоновом режиме
        this.requestBackgroundTranslation(originalText, targetLanguage);
      }
    });

    console.log(`[FastTranslationService] Переведено: ${translatedCount}, не найдено: ${notFoundCount}`);
  }

  /**
   * Найти перевод для текста
   * @param {string} originalText - Оригинальный текст
   * @param {Object} translations - Объект с переводами
   * @returns {string|null} Переведенный текст или null
   */
  findTranslation(originalText, translations) {
    // Прямое совпадение
    if (translations[originalText]) {
      return translations[originalText];
    }

    // Поиск по частичному совпадению (для коротких текстов)
    if (originalText.length <= 50) {
      for (const [original, translated] of Object.entries(translations)) {
        if (original.includes(originalText) || originalText.includes(original)) {
          return translated;
        }
      }
    }

    return null;
  }

  /**
   * Получить элементы для перевода
   * @returns {Array} Массив элементов
   */
  getTranslatableElements() {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'span:not(.icon):not([class*="svg"])',
      'a:not([class*="icon"])',
      'button:not([class*="icon"]):not(.lang-btn)',
      'li',
      'td',
      'th',
      'label',
      '.translatable'
    ];

    const elements = [];
    
    selectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(element => {
        // Проверяем, что элемент содержит текст и не является контейнером
        if (element.childNodes.length === 1 && 
            element.childNodes[0].nodeType === Node.TEXT_NODE &&
            element.textContent.trim().length > 0) {
          elements.push(element);
        }
      });
    });

    return elements;
  }

  /**
   * Проверить, нужно ли пропустить элемент
   * @param {Element} element - DOM элемент
   * @returns {boolean}
   */
  shouldSkipElement(element) {
    // Пропускаем элементы с определенными классами или атрибутами
    const skipClasses = ['lang-btn', 'icon', 'logo', 'no-translate'];
    const skipTypes = ['script', 'style', 'noscript'];
    
    if (skipTypes.includes(element.tagName.toLowerCase())) {
      return true;
    }

    for (const className of skipClasses) {
      if (element.classList.contains(className)) {
        return true;
      }
    }

    // Пропускаем числа и даты
    const text = element.textContent.trim();
    if (/^\d+$/.test(text) || /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(text)) {
      return true;
    }

    return false;
  }

  /**
   * Сохранить оригинальные тексты
   */
  saveOriginalTexts() {
    if (!this.originalTexts) {
      this.originalTexts = new Map();
      
      const elements = this.getTranslatableElements();
      elements.forEach((element, index) => {
        this.originalTexts.set(`element_${index}`, {
          element: element,
          originalText: element.textContent.trim()
        });
      });
    }
  }

  /**
   * Восстановить оригинальные тексты
   */
  restoreOriginalTexts() {
    if (!this.originalTexts) return;

    this.originalTexts.forEach(({ element, originalText }) => {
      if (element && element.parentNode) {
        element.textContent = originalText;
        element.removeAttribute('data-translated');
        element.removeAttribute('data-target-lang');
      }
    });

    console.log('[FastTranslationService] Оригинальные тексты восстановлены');
  }

  /**
   * Запросить перевод в фоновом режиме
   * @param {string} text - Текст для перевода
   * @param {string} targetLanguage - Целевой язык
   */
  async requestBackgroundTranslation(text, targetLanguage) {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          text: text,
          source: 'ru',
          target: targetLanguage,
          cache: true
        })
      });

      if (response.ok) {
        console.log(`[FastTranslationService] Фоновый перевод запрошен для: "${text.substring(0, 50)}..."`);
      }
    } catch (error) {
      // Игнорируем ошибки фонового перевода
      console.debug('[FastTranslationService] Фоновый перевод не удался:', error.message);
    }
  }

  /**
   * Получить текущий язык
   * @returns {string}
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Очистить кэш переводов
   */
  clearCache() {
    this.translationCache.clear();
    this.originalTexts = null;
  }
}

// Создаем глобальный экземпляр сервиса
const TranslationService = new FastTranslationService();

// Экспортируем для использования в других модулях
export { TranslationService };
export default TranslationService;

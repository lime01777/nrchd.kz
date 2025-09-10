/**
 * Модуль для автоматической инициализации и настройки системы мультиязычности
 * Работает с новой системой перевода new-translator.js (только из БД)
 * 
 * Версия 1.0 - 2025-06-23
 */

import Translator from './new-translator';
import LanguageManager from './LanguageManager';

// Глобальный флаг инициализации
let isInitialized = false;

/**
 * Инициализация языковой системы
 * @param {boolean} verbose - Флаг подробного логгирования
 * @returns {Promise<string>} Текущий язык
 */
export async function initializeLanguageSystem(verbose = false) {
  // Предотвращаем повторную инициализацию
  if (isInitialized) {
    if (verbose) console.log('[LanguageInitializer] Already initialized, skipping');
    return LanguageManager.getCurrentLanguage();
  }
  
  if (verbose) console.log('[LanguageInitializer] Starting initialization...');
  
  try {
    // Убеждаемся, что CSRF токен присутствует
    ensureCsrfToken();
    
    // Используем LanguageManager для инициализации (он уже содержит всю логику)
    // НЕ вызываем Translator.initialize() - это дублирование!
    const currentLanguage = LanguageManager.getCurrentLanguage();
    if (verbose) console.log(`[LanguageInitializer] LanguageManager already initialized with language: ${currentLanguage}`);
    
    // Проверяем язык в URL, возможно нужно переключиться
    const urlLanguage = checkUrlLanguage();
    if (urlLanguage && urlLanguage !== currentLanguage) {
      if (verbose) console.log(`[LanguageInitializer] URL language (${urlLanguage}) differs from current (${currentLanguage}), switching`);
      await LanguageManager.switchLanguage(urlLanguage);
    } else {
      // Если текущий язык не русский, применяем перевод через LanguageManager
      if (currentLanguage !== 'ru') {
        if (verbose) console.log(`[LanguageInitializer] Applying initial translation to ${currentLanguage}`);
        await LanguageManager.applyLanguage();
      }
    }
    
    // Устанавливаем обработчики событий для динамически добавляемого контента
    setupDynamicContentHandlers(currentLanguage, verbose);
    
    // Устанавливаем обработчик для URL с параметром языка
    setupLanguageUrlHandler(verbose);
    
    // Отмечаем, что инициализация завершена
    isInitialized = true;
    if (verbose) console.log('[LanguageInitializer] Initialization complete');
    
    return currentLanguage;
  } catch (error) {
    console.error('[LanguageInitializer] Initialization error:', error);
    return 'ru'; // В случае ошибки возвращаем русский язык
  }
}

/**
 * Убеждаемся, что CSRF токен присутствует в документе
 */
function ensureCsrfToken() {
  const metaToken = document.querySelector('meta[name="csrf-token"]');
  if (!metaToken) {
    console.warn('[LanguageInitializer] CSRF token meta tag not found');
    
    // Создаем токен на основе cookie, если возможно
    const csrfCookie = getCookieValue('XSRF-TOKEN');
    if (csrfCookie) {
      const meta = document.createElement('meta');
      meta.name = 'csrf-token';
      meta.content = decodeURIComponent(csrfCookie);
      document.head.appendChild(meta);
      console.log('[LanguageInitializer] CSRF token created from cookie');
    } else {
      console.error('[LanguageInitializer] No CSRF token available in cookies!');
    }
  }
}

/**
 * Проверяем язык в URL
 * @returns {string|null} Язык из URL параметров или null
 */
function checkUrlLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  
  if (lang && ['ru', 'en', 'kz'].includes(lang)) {
    return lang;
  }
  
  return null;
}

/**
 * Получение значения cookie по его имени
 * @param {string} name - Имя cookie
 * @returns {string|null} Значение cookie или null, если не найдено
 */
function getCookieValue(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

/**
 * Устанавливаем обработчики для динамически добавляемого контента
 * @param {string} language - Текущий язык
 * @param {boolean} verbose - Флаг подробного логгирования
 */
function setupDynamicContentHandlers(language, verbose) {
  if (verbose) console.log('[LanguageInitializer] Setting up dynamic content handlers');
  
  // Создаем MutationObserver для отслеживания изменений в DOM
  const observer = new MutationObserver((mutations) => {
    let needsTranslation = false;
    
    // Проверяем, есть ли добавленные узлы, которые могут содержать текст
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          // Проверяем только элементы, не текстовые узлы или комментарии
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Проверяем, что элемент не имеет атрибута data-no-translate
            if (!node.hasAttribute('data-no-translate')) {
              needsTranslation = true;
            }
          }
        });
      }
    });
    
    // Если были добавлены новые элементы с текстом, переводим их
    if (needsTranslation && language !== 'ru') {
      if (verbose) console.log('[LanguageInitializer] New content detected, applying translation');
      LanguageManager.applyLanguage();
    }
  });
  
  // Наблюдаем за изменениями во всем body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  if (verbose) console.log('[LanguageInitializer] Dynamic content observer setup complete');
}

/**
 * Устанавливаем обработчик для URL с параметром языка
 * @param {boolean} verbose - Флаг подробного логгирования
 */
function setupLanguageUrlHandler(verbose) {
  if (verbose) console.log('[LanguageInitializer] Setting up language URL handler');
  
  // Переопределяем метод pushState для отслеживания изменений URL
  const originalPushState = window.history.pushState;
  window.history.pushState = function(state, title, url) {
    originalPushState.apply(this, arguments);
    
    // Проверяем, есть ли в новом URL параметр языка
    if (url) {
      const urlObj = new URL(url, window.location.origin);
      const langParam = urlObj.searchParams.get('lang');
      
      if (langParam && ['ru', 'en', 'kz'].includes(langParam)) {
        const currentLanguage = LanguageManager.getCurrentLanguage();
        if (langParam !== currentLanguage) {
          if (verbose) console.log(`[LanguageInitializer] URL language changed to ${langParam}, applying translation`);
          LanguageManager.switchLanguage(langParam);
        }
      }
    }
  };
  
  // То же самое для метода replaceState
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function(state, title, url) {
    originalReplaceState.apply(this, arguments);
    
    // Проверяем, есть ли в новом URL параметр языка
    if (url) {
      const urlObj = new URL(url, window.location.origin);
      const langParam = urlObj.searchParams.get('lang');
      
      if (langParam && ['ru', 'en', 'kz'].includes(langParam)) {
        const currentLanguage = LanguageManager.getCurrentLanguage();
        if (langParam !== currentLanguage) {
          if (verbose) console.log(`[LanguageInitializer] URL language changed to ${langParam}, applying translation`);
          LanguageManager.switchLanguage(langParam);
        }
      }
    }
  };
  
  if (verbose) console.log('[LanguageInitializer] Language URL handler setup complete');
}

/**
 * Переключение языка сайта (для внешних вызовов)
 * @param {string} language - Язык для переключения
 * @param {boolean} forceTranslate - Принудительный перевод, даже если язык не изменился
 * @returns {Promise<boolean>} Успешность переключения
 */
export async function switchLanguage(language, forceTranslate = false) {
  try {
    // Проверяем, поддерживается ли запрошенный язык
    if (!['ru', 'en', 'kz'].includes(language)) {
      console.error(`[LanguageInitializer] Unsupported language: ${language}`);
      return false;
    }
    
    // Используем LanguageManager для переключения языка
    await LanguageManager.switchLanguage(language);
    
    return true;
  } catch (error) {
    console.error('[LanguageInitializer] Language switch error:', error);
    return false;
  }
}

/**
 * Очистка всех кэшей переводов
 * @returns {Promise<boolean>} Успешность очистки
 */
export async function clearTranslationCache() {
  try {
    const success = Translator.clearAllCache();
    return success;
  } catch (error) {
    console.error('[LanguageInitializer] Cache clearing error:', error);
    return false;
  }
}

// Экспортируем основную функцию и вспомогательные методы
export default {
  initialize: initializeLanguageSystem,
  switchLanguage,
  clearCache: clearTranslationCache,
  getLanguage: () => LanguageManager.getCurrentLanguage(),
  getSupportedLanguages: () => Translator.getSupportedLanguages()
};

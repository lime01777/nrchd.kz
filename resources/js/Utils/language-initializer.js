/**
 * Модуль для автоматической инициализации и исправления системы мультиязычности
 * Решает типичные проблемы с переключением языков на сайте
 */

import languageManager from './LanguageManager';
import { runDebug } from './translation-debug';

// Глобальный флаг инициализации
let isInitialized = false;

/**
 * Основная функция инициализации языковой системы
 * Выполняет проверку и исправление типичных проблем
 */
export function initializeLanguageSystem() {
  if (isInitialized) return;
  
  console.log('[language-initializer] Запуск инициализации языковой системы...');
  
  // Проверяем наличие CSRF токена
  ensureCsrfToken();
  
  // Проверяем язык в URL
  const urlLang = checkUrlLanguage();
  
  // Проверяем текущий язык и источники истины
  const currentLanguage = determineCurrentLanguage();
  
  // Проверяем состояние localStorage и cookie
  syncLanguageStorage(currentLanguage);
  
  // Инициализация менеджера языков
  ensureLanguageManagerInitialized();
  
  // Принудительно запускаем диагностику через setTimeout
  setTimeout(() => {
    runDebug(false);
  }, 1500);
  
  // Устанавливаем обработчики для URL с параметром lang
  setupLanguageUrlHandler();
  
  isInitialized = true;
  console.log('[language-initializer] Инициализация языковой системы завершена.');
}

/**
 * Убеждаемся, что CSRF токен присутствует в документе
 */
function ensureCsrfToken() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  if (!csrfToken) {
    console.warn('[language-initializer] CSRF токен не найден, добавляем...');
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'csrf-token');
    
    // Пробуем получить токен из window.Laravel
    let tokenValue = '';
    if (window.Laravel && window.Laravel.csrfToken) {
      tokenValue = window.Laravel.csrfToken;
    } else {
      // Временное решение - использовать токен из куки, если он там есть
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
          tokenValue = decodeURIComponent(value);
          break;
        }
      }
    }
    
    meta.setAttribute('content', tokenValue);
    document.head.appendChild(meta);
    
    if (!tokenValue) {
      console.error('[language-initializer] Не удалось найти значение CSRF токена!');
    }
  }
}

/**
 * Проверяем язык в URL
 */
function checkUrlLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('lang');
}

/**
 * Определяем текущий язык из всех возможных источников
 */
function determineCurrentLanguage() {
  // Порядок приоритета: URL > localStorage > cookie > HTML атрибут > дефолт
  const urlLang = checkUrlLanguage();
  if (urlLang && ['ru', 'en', 'kz'].includes(urlLang)) {
    return urlLang;
  }
  
  const localLang = localStorage.getItem('preferredLanguage');
  if (localLang && ['ru', 'en', 'kz'].includes(localLang)) {
    return localLang;
  }
  
  // Проверяем куки
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'language' && ['ru', 'en', 'kz'].includes(value)) {
      return value;
    }
  }
  
  // Проверяем HTML атрибут
  const htmlLang = document.documentElement.getAttribute('data-language');
  if (htmlLang && ['ru', 'en', 'kz'].includes(htmlLang)) {
    return htmlLang;
  }
  
  // Дефолтный язык
  return 'ru';
}

/**
 * Синхронизируем все хранилища языка
 */
function syncLanguageStorage(lang) {
  if (!lang || !['ru', 'en', 'kz'].includes(lang)) {
    lang = 'ru';
  }
  
  // Обновляем localStorage
  localStorage.setItem('preferredLanguage', lang);
  
  // Обновляем куки
  document.cookie = `language=${lang}; path=/; max-age=${30*24*60*60}; SameSite=Lax`;
  
  // Обновляем HTML атрибут
  document.documentElement.setAttribute('data-language', lang);
  
  return lang;
}

/**
 * Проверяем инициализацию LanguageManager
 */
function ensureLanguageManagerInitialized() {
  if (!languageManager.initialized) {
    console.log('[language-initializer] Инициализируем LanguageManager...');
    try {
      languageManager.init();
      
      // Добавляем повторную попытку через таймаут для надежности
      setTimeout(() => {
        if (!languageManager.initialized) {
          console.log('[language-initializer] Повторная инициализация LanguageManager...');
          languageManager.init();
        }
      }, 1000);
    } catch (e) {
      console.error('[language-initializer] Ошибка при инициализации LanguageManager:', e);
    }
  }
}

/**
 * Устанавливаем обработчик для URL с параметром языка
 */
function setupLanguageUrlHandler() {
  // Обработчик изменений URL
  const handleUrlChange = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && ['ru', 'en', 'kz'].includes(langParam)) {
      const currentLang = determineCurrentLanguage();
      
      if (langParam !== currentLang) {
        console.log(`[language-initializer] Обнаружен параметр языка в URL: ${langParam}, переключаемся...`);
        
        // Обновляем localStorage и cookie
        syncLanguageStorage(langParam);
        
        // Запускаем перевод через LanguageManager
        if (languageManager.initialized) {
          languageManager.switchLanguage(langParam)
            .catch(e => console.error('[language-initializer] Ошибка при переключении языка:', e));
        } else {
          // Если менеджер не инициализирован, пробуем инициализировать и повторить
          ensureLanguageManagerInitialized();
          setTimeout(() => {
            languageManager.switchLanguage(langParam)
              .catch(e => console.error('[language-initializer] Ошибка при переключении языка:', e));
          }, 500);
        }
      }
    }
  };
  
  // Для Single Page Application важно отслеживать изменения URL
  window.addEventListener('popstate', handleUrlChange);
  
  // Также перехватываем pushState и replaceState
  const originalPushState = window.history.pushState;
  window.history.pushState = function() {
    originalPushState.apply(this, arguments);
    handleUrlChange();
  };
  
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    handleUrlChange();
  };
}

// Экспортируем основную функцию и вспомогательные методы
export default {
  initialize: initializeLanguageSystem,
  checkUrlLanguage,
  determineCurrentLanguage,
  syncLanguageStorage,
  ensureLanguageManagerInitialized
};

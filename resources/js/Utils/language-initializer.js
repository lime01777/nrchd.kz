/**
 * Модуль для автоматической инициализации и настройки системы мультиязычности
 * Работает исключительно с translator-simple.js
 * 
 * Версия 3.0 - 2025-06-22
 */

// Глобальный флаг инициализации
let isInitialized = false;

// Доступные языки
const SUPPORTED_LANGUAGES = ['ru', 'en', 'kz'];

// Язык по умолчанию
const DEFAULT_LANGUAGE = 'ru';

/**
 * Инициализация языковой системы
 * @returns {Promise<void>}
 */
async function initializeLanguageSystem() {
  try {
    if (isInitialized) {
      console.log('[language-initializer] Система уже инициализирована');
      return;
    }
    
    console.log('[language-initializer] Инициализация новой языковой системы...');
    
    // Проверяем наличие CSRF токена
    ensureCsrfToken();
    
    // Определяем текущий язык
    const currentLanguage = determineCurrentLanguage();
    console.log(`[language-initializer] Определен язык: ${currentLanguage}`);
    
    // Синхронизируем языковые настройки во всех хранилищах
    syncLanguageStorage(currentLanguage);
    
    // Проверяем и обрабатываем URL с параметром языка
    setupLanguageUrlHandler();
    
    // Инициализируем новый переводчик
    initializeTranslator(currentLanguage);
    
    console.log(`[language-initializer] Языковая система успешно инициализирована с языком: ${currentLanguage}`);
    isInitialized = true;
    return currentLanguage;
    
  } catch (error) {
    console.error('[language-initializer] Ошибка инициализации языковой системы:', error);
    throw error;
  }
}

/**
 * Инициализация переводчика
 * @param {string} language - Язык для инициализации
 */
function initializeTranslator(language) {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    language = DEFAULT_LANGUAGE;
  }
  
  console.log(`[language-initializer] Инициализация переводчика для языка: ${language}`);
  
  // Динамически загружаем переводчик
  import('./translator-simple.js')
    .then(translator => {
      // Применяем начальный перевод страницы
      translator.translatePage(language, {}, null, false);
      
      // Добавляем обработчики событий для динамического контента
      setupDynamicContentHandlers(translator, language);
    })
    .catch(err => {
      console.error('[language-initializer] Ошибка загрузки переводчика:', err);
    });
}

/**
 * Устанавливаем обработчики для динамически добавляемого контента
 * @param {Object} translator - Объект переводчика
 * @param {string} language - Текущий язык
 */
function setupDynamicContentHandlers(translator, language) {
  // Отслеживаем изменения в DOM для перевода нового контента
  const observer = new MutationObserver((mutations) => {
    let shouldTranslate = false;
    
    // Проверяем, есть ли новые элементы для перевода
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldTranslate = true;
        break;
      }
    }
    
    if (shouldTranslate) {
      // Используем задержку, чтобы дать контенту полностью загрузиться
      setTimeout(() => {
        translator.translatePage(language, {}, null, false);
      }, 500);
    }
  });
  
  // Начинаем отслеживать изменения
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
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
 * @returns {string|null} Язык из URL параметров или null
 */
function checkUrlLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  // Проверяем, что язык существует в списке поддерживаемых
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
    console.log(`[language-initializer] Найден язык в URL: ${urlLang}`);
    return urlLang;
  }
  
  return null;
}

/**
 * Определяем текущий язык из всех возможных источников
 * @returns {string} Определенный язык
 */
function determineCurrentLanguage() {
  // Порядок приоритета: URL > localStorage > cookie > HTML атрибут > дефолт
  
  // 1. Проверяем язык в URL
  const urlLang = checkUrlLanguage();
  if (urlLang) {
    return urlLang;
  }
  
  // 2. Проверяем язык в localStorage (основное хранилище)
  const storedLang = localStorage.getItem('language');
  if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
    console.log(`[language-initializer] Найден язык в localStorage: ${storedLang}`);
    return storedLang;
  }
  
  // 3. Проверяем старый ключ preferredLanguage
  const oldStoredLang = localStorage.getItem('preferredLanguage');
  if (oldStoredLang && SUPPORTED_LANGUAGES.includes(oldStoredLang)) {
    console.log(`[language-initializer] Найден язык в старом ключе localStorage: ${oldStoredLang}`);
    // Переносим в новый ключ
    localStorage.setItem('language', oldStoredLang);
    return oldStoredLang;
  }
  
  // 4. Проверяем куки
  const cookieLang = getCookieValue('language');
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang)) {
    console.log(`[language-initializer] Найден язык в cookie: ${cookieLang}`);
    // Сохраняем в localStorage для последовательности
    localStorage.setItem('language', cookieLang);
    return cookieLang;
  }
  
  // 5. Проверяем HTML атрибут
  const htmlLang = document.documentElement.lang;
  if (htmlLang && SUPPORTED_LANGUAGES.includes(htmlLang)) {
    console.log(`[language-initializer] Найден язык в HTML: ${htmlLang}`);
    return htmlLang;
  }
  
  // 6. Используем язык по умолчанию
  console.log(`[language-initializer] Используем язык по умолчанию: ${DEFAULT_LANGUAGE}`);
  return DEFAULT_LANGUAGE;
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
 * Синхронизируем хранилища языка
 * @param {string} currentLang - Текущий язык
 */
function syncLanguageStorage(currentLang) {
  if (!currentLang || !SUPPORTED_LANGUAGES.includes(currentLang)) {
    currentLang = DEFAULT_LANGUAGE;
  }
  
  try {
    // Сохраняем в localStorage (основное хранилище)
    localStorage.setItem('language', currentLang);
    
    // Сохраняем также в старом ключе для обратной совместимости
    localStorage.setItem('preferredLanguage', currentLang);
    
    // Устанавливаем куки
    document.cookie = `language=${currentLang}; path=/; max-age=31536000; samesite=lax`;
    
    // Устанавливаем атрибут на HTML
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('data-language', currentLang);
    
    console.log(`[language-initializer] Язык синхронизирован во всех хранилищах: ${currentLang}`);
  } catch (e) {
    console.error('[language-initializer] Ошибка синхронизации языка:', e);
  }
}

/**
 * Проверяем инициализацию LanguageManager
 */
function ensureLanguageManagerInitialized() {
  if (!languageManager.initialized) {
    console.log('[language-initializer] Инициализируем LanguageManager...');
  }
}

/**
 * Устанавливаем обработчик для URL с параметром языка
 */
function setupLanguageUrlHandler() {
  const urlLang = checkUrlLanguage();
  if (urlLang) {
    // Если в URL есть параметр языка, обрабатываем его и очищаем URL
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;
    
    console.log(`[language-initializer] Применяем язык из URL: ${urlLang}`);
    
    // Синхронизируем выбранный язык
    syncLanguageStorage(urlLang);
    
    // Загружаем и применяем новый переводчик
    import('./translator-simple.js').then(translator => {
      translator.translatePage(urlLang, {}, null, true); // Принудительный перевод
    }).catch(err => {
      console.error('[language-initializer] Ошибка применения языка из URL:', err);
    });
    
    // Очищаем URL от параметра языка
    params.delete('lang');
    const cleanUrl = `${currentUrl.pathname}${params.toString() ? '?' + params.toString() : ''}${currentUrl.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

/**
 * Переключение языка сайта (для внешних вызовов)
 * @param {string} language - Язык для переключения
 */
function switchLanguage(language) {
  if (language && SUPPORTED_LANGUAGES.includes(language)) {
    // Синхронизируем выбранный язык
    syncLanguageStorage(language);
    
    // Загружаем и применяем новый переводчик
    return import('./translator-simple.js').then(translator => {
      return translator.translatePage(language, {}, null, true); // Принудительный перевод
    }).catch(err => {
      console.error('[language-initializer] Ошибка переключения языка:', err);
      throw err;
    });
  } else {
    console.error(`[language-initializer] Неподдерживаемый язык: ${language}`);
    return Promise.reject(`Неподдерживаемый язык: ${language}`);
  }
}

// Экспортируем основную функцию и вспомогательные методы
export default {
  initialize: initializeLanguageSystem,
  checkUrlLanguage,
  determineCurrentLanguage,
  syncLanguageStorage,
  ensureLanguageManagerInitialized
};

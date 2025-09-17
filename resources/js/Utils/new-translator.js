/**
 * new-translator.js - Легкий и простой переводчик для сайта
 *
 * Этот модуль предоставляет функционал для перевода страницы из базы данных.
 * Google Translate API отключен.
 */

// Поддерживаемые языки
const SUPPORTED_LANGUAGES = ['ru', 'en', 'kz'];

// Текущий язык по умолчанию
let currentLanguage = 'ru';

// Кэш переводов в памяти (для быстрого доступа)
const translationCache = {
  ru: {},
  en: {},
  kz: {}
};

/**
 * Инициализирует систему перевода
 */
const DISABLE_TRANSLATION = true;

export function initialize() {
  if (DISABLE_TRANSLATION) {
    console.log('[Translator] Disabled');
    return 'ru';
  }
  console.log('[Translator] Initializing...');
  
  // Определяем текущий язык
  currentLanguage = detectLanguage();
  
  // Загружаем кэш из localStorage, если он есть
  loadCacheFromStorage();
  
  console.log(`[Translator] Initialized with language: ${currentLanguage}`);
  return currentLanguage;
}

/**
 * Определяет текущий язык пользователя
 * Приоритет: URL параметр > localStorage > cookie > navigator
 */
function detectLanguage() {
  // 1. Проверяем URL параметры
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && SUPPORTED_LANGUAGES.includes(langParam)) {
    console.log(`[Translator] Language detected from URL: ${langParam}`);
    return langParam;
  }
  
  // 2. Проверяем localStorage
  const storedLang = localStorage.getItem('preferredLanguage');
  
  if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
    console.log(`[Translator] Language detected from localStorage: ${storedLang}`);
    return storedLang;
  }
  
  // 3. Проверяем cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'language' && SUPPORTED_LANGUAGES.includes(value)) {
      console.log(`[Translator] Language detected from cookie: ${value}`);
      return value;
    }
  }
  
  // 4. Проверяем язык браузера
  const browserLang = navigator.language.substring(0, 2);
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    console.log(`[Translator] Language detected from browser: ${browserLang}`);
    return browserLang;
  }
  
  // 5. Возвращаем казахский по умолчанию
  return 'kz';
}

/**
 * Загружает кэш переводов из localStorage
 */
function loadCacheFromStorage() {
  try {
    SUPPORTED_LANGUAGES.forEach(lang => {
      const cacheKey = `translationCache_${lang}`;
      const storedCache = localStorage.getItem(cacheKey);
      
      if (storedCache) {
        try {
          const parsedCache = JSON.parse(storedCache);
          translationCache[lang] = { ...parsedCache };
          console.log(`[Translator] Loaded ${Object.keys(parsedCache).length} cached translations for ${lang}`);
        } catch (e) {
          console.error(`[Translator] Error parsing cache for ${lang}:`, e);
          // В случае ошибки очищаем некорректный кэш
          localStorage.removeItem(cacheKey);
        }
      }
    });
  } catch (e) {
    console.error('[Translator] Error loading cache:', e);
  }
}

/**
 * Сохраняет кэш переводов в localStorage
 */
function saveCacheToStorage() {
  try {
    SUPPORTED_LANGUAGES.forEach(lang => {
      const cacheKey = `translationCache_${lang}`;
      const cacheData = translationCache[lang];
      
      if (Object.keys(cacheData).length > 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          console.log(`[Translator] Saved ${Object.keys(cacheData).length} translations for ${lang} to localStorage`);
        } catch (e) {
          console.error(`[Translator] Error saving cache for ${lang}:`, e);
          
          // Если локальное хранилище переполнено, очищаем часть кэша
          if (e.name === 'QuotaExceededError') {
            console.log('[Translator] Storage quota exceeded, cleaning up cache...');
            cleanupCache(lang);
          }
        }
      }
    });
  } catch (e) {
    console.error('[Translator] Error saving cache:', e);
  }
}

/**
 * Очищает часть кэша, когда хранилище переполнено
 */
function cleanupCache(lang) {
  const cache = translationCache[lang];
  const keys = Object.keys(cache);
  
  if (keys.length > 100) {
    // Удаляем 20% кэша начиная с первых элементов (наиболее старых)
    const removeCount = Math.floor(keys.length * 0.2);
    const keysToRemove = keys.slice(0, removeCount);
    
    keysToRemove.forEach(key => {
      delete cache[key];
    });
    
    console.log(`[Translator] Removed ${removeCount} items from ${lang} cache`);
    
    // Пробуем сохранить уменьшенный кэш
    try {
      localStorage.setItem(`translationCache_${lang}`, JSON.stringify(cache));
    } catch (e) {
      console.error(`[Translator] Still can't save cache after cleanup:`, e);
    }
  }
}

/**
 * Получает перевод из кэша
 */
function getCachedTranslation(text, targetLang) {
  if (!text || !targetLang) return null;
  
  const cache = translationCache[targetLang];
  if (!cache) return null;
  
  return cache[text] || null;
}

/**
 * Сохраняет перевод в кэш
 */
function saveToCache(text, targetLang, translation) {
  if (!text || !targetLang || !translation) return;
  
  // Сохраняем только если текст действительно был переведен (не совпадает с оригиналом)
  if (text !== translation) {
    translationCache[targetLang][text] = translation;
    
    // Периодически сохраняем кэш в localStorage
    // Используем debounce, чтобы не вызывать сохранение слишком часто
    clearTimeout(window.saveCacheTimeout);
    window.saveCacheTimeout = setTimeout(saveCacheToStorage, 2000);
  }
}

/**
 * Получает перевод из базы данных через API (без Google Translate)
 */
async function translateViaAPI(text, sourceLang, targetLang) {
  if (!text || text.trim() === '') return text;
  
  try {
    // Получаем CSRF токен для Laravel
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!csrfToken) {
      console.error('[Translator] No CSRF token found');
      return null;
    }
    
    // Делаем запрос к API для получения перевода из БД
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        text: text,
        source: sourceLang,
        target: targetLang,
        cache: false // Не сохраняем новые переводы, только получаем существующие
      })
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.translation) {
      return data.translation;
    }
    
    // Если перевод не найден в БД, возвращаем оригинал
    return text;
  } catch (error) {
    console.error('[Translator] API error:', error);
    return text; // Возвращаем оригинал в случае ошибки
  }
}

/**
 * Находит все элементы на странице, которые нужно перевести
 */
function getTranslatableElements() {
  // Селекторы для элементов, которые нужно переводить
  const selectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'span', 'li', 'button',
    'label', 'th', 'td', 'div.text-content',
    '.translate-this', '[data-translate="true"]',
    '.text-lg', '.text-sm', '.text-xl', '.text-base',
    '.card-title', '.card-text', '.page-title',
    '[data-translate]'
  ];
  
  // Селекторы для элементов, которые НЕ нужно переводить
  const excludeSelectors = [
    'script', 'style', 'pre', 'code',
    '[data-no-translate="true"]',
    'input', 'textarea', '.no-translate', '.notranslate',
    'svg', 'path', 'circle', 'rect'
  ];
  
  // Получаем все переводимые элементы
  const allElements = [];
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => allElements.push(el));
    } catch (e) {
      console.error(`[Translator] Error selecting "${selector}":`, e);
    }
  });
  
  // Фильтруем элементы, исключая те, которые не нужно переводить
  return allElements.filter(el => {
    // Пропускаем элементы без текста
    if (!el.textContent.trim()) return false;
    
    // Проверяем, не находится ли элемент в исключенных
    for (const excludeSelector of excludeSelectors) {
      if (el.matches(excludeSelector) || el.closest(excludeSelector)) {
        return false;
      }
    }
    
    // Включаем элемент в список для перевода
    return true;
  });
}

/**
 * Заменяет текст в элементах, сохраняя HTML структуру
 */
function replaceTextInElement(element, originalText, translatedText) {
  // Для элементов без дочерних просто заменяем textContent
  if (element.childElementCount === 0) {
    if (element.textContent.trim() === originalText.trim()) {
      element.textContent = translatedText;
    }
    return;
  }
  
  // Для сложных элементов обходим все текстовые узлы
  const walker = document.createTreeWalker(
    element, 
    NodeFilter.SHOW_TEXT, 
    { acceptNode: node => node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }
  );
  
  let node;
  while (node = walker.nextNode()) {
    const nodeText = node.nodeValue.trim();
    if (nodeText && nodeText === originalText.trim()) {
      node.nodeValue = node.nodeValue.replace(originalText, translatedText);
    }
  }
}

/**
 * Переводит страницу на указанный язык (только из БД, без Google Translate)
 */
export async function translatePage(targetLang, forceTranslate = false) {
  if (DISABLE_TRANSLATION) {
    return;
  }
  console.time('translation');
  
  // Проверяем поддерживается ли запрошенный язык
  if (!SUPPORTED_LANGUAGES.includes(targetLang)) {
    console.error(`[Translator] Unsupported language: ${targetLang}`);
    return;
  }
  
  // Если принудительный перевод не запрошен и текущий язык совпадает с целевым, ничего не делаем
  if (!forceTranslate && currentLanguage === targetLang) {
    console.log(`[Translator] Page is already in ${targetLang}`);
    return;
  }
  
  console.log(`[Translator] Translating page to ${targetLang}${forceTranslate ? ' (forced)' : ''}`);
  
  // Очищаем кэш при принудительном переводе
  if (forceTranslate) {
    translationCache[targetLang] = {};
    localStorage.removeItem(`translationCache_${targetLang}`);
    console.log(`[Translator] Cache cleared for ${targetLang}`);
  }
  
  // Получаем все элементы для перевода
  const elements = getTranslatableElements();
  console.log(`[Translator] Found ${elements.length} elements to translate`);
  
  if (elements.length === 0) {
    console.log('[Translator] No elements to translate');
    return;
  }
  
  // Сохраняем язык как текущий и обновляем в разных местах
  currentLanguage = targetLang;
  localStorage.setItem('preferredLanguage', targetLang);
  document.documentElement.setAttribute('lang', targetLang);
  document.cookie = `language=${targetLang};path=/;max-age=31536000`;
  
  // Счетчик переведенных элементов
  let translatedCount = 0;
  
  // Переводим каждый элемент
  for (const element of elements) {
    const text = element.textContent.trim();
    
    // Пропускаем пустые или слишком короткие тексты
    if (!text || text.length < 2) continue;
    
    // Проверяем кэш сначала
    const cachedTranslation = getCachedTranslation(text, targetLang);
    
    if (cachedTranslation) {
      // Применяем кэшированный перевод, сохраняя HTML структуру
      replaceTextInElement(element, text, cachedTranslation);
      translatedCount++;
      continue;
    }
    
    // Если текста нет в кэше, проверяем БД через API
    try {
      const translation = await translateViaAPI(text, 'ru', targetLang);
      
      if (translation && translation !== text) {
        // Сохраняем перевод в элементе, сохраняя HTML структуру
        replaceTextInElement(element, text, translation);
        
        // Сохраняем в кэш
        saveToCache(text, targetLang, translation);
        translatedCount++;
      }
    } catch (err) {
      console.error(`[Translator] Translation error:`, err);
    }
  }
  
  console.log(`[Translator] Translated ${translatedCount} elements`);
  console.timeEnd('translation');
  
  // Обновляем визуальное состояние кнопок языка
  updateLanguageButtons(targetLang);
}

/**
 * Обновляет визуальное состояние кнопок языка
 */
function updateLanguageButtons(selectedLang) {
  const buttons = document.querySelectorAll('[data-lang]');
  
  buttons.forEach(button => {
    const buttonLang = button.getAttribute('data-lang');
    
    // Сбрасываем все стили
    button.classList.remove('active');
    button.style.backgroundColor = buttonLang === selectedLang ? '#3b82f6' : 'white';
    button.style.color = buttonLang === selectedLang ? 'white' : '#3b82f6';
  });
}

/**
 * Очищает весь кэш переводов
 */
export function clearAllCache() {
  try {
    console.log('[Translator] Clearing all translation caches');
    
    // Очищаем кэш в памяти
    SUPPORTED_LANGUAGES.forEach(lang => {
      translationCache[lang] = {};
    });
    
    // Очищаем кэш в localStorage
    SUPPORTED_LANGUAGES.forEach(lang => {
      localStorage.removeItem(`translationCache_${lang}`);
    });
    
    console.log('[Translator] All translation caches cleared');
    return true;
  } catch (e) {
    console.error('[Translator] Error clearing cache:', e);
    return false;
  }
}

// Экспортируем основные функции
export default {
  initialize,
  translatePage,
  clearAllCache,
  getSupportedLanguages: () => [...SUPPORTED_LANGUAGES],
  getCurrentLanguage: () => currentLanguage
};

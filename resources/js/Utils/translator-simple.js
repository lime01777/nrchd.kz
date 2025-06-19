/**
 * Advanced translation utility with translation caching
 * Uses Google Translate API through Laravel backend
 * And stores translations in the database for reuse
 * 
 * Updated version with improved integration with language-initializer
 * 
 * Optimized for faster language switching with local caching
 */

import languageInitializer from './language-initializer';

// Отключаем отображение сообщений о переводе
const DEBUG = false;

// Cache object to store translations during the current session
const translationCache = {};

// Локальное кэширование в localStorage
const loadLocalTranslations = () => {
  try {
    const savedTranslations = localStorage.getItem('site_translations_cache');
    if (savedTranslations) {
      const parsed = JSON.parse(savedTranslations);
      console.log(`[Translator] Loaded ${Object.keys(parsed).length} translations from localStorage`);
      return parsed;
    }
  } catch (e) {
    console.error('[Translator] Error loading translations from localStorage:', e);
    // Очищаем поврежденный кэш
    localStorage.removeItem('site_translations_cache');
  }
  return {};
};

// Загружаем кэш переводов из localStorage
Object.assign(translationCache, loadLocalTranslations());

// Функция сохранения переводов в localStorage
const saveLocalTranslations = () => {
  try {
    // Проверяем размер кэша - не сохраняем, если слишком большой
    const cacheSize = Object.keys(translationCache).length;
    if (cacheSize > 5000) {
      console.log(`[Translator] Cache too large (${cacheSize} items), optimizing before save`);
      // Можно добавить оптимизацию кэша, удалив старые записи
      return;
    }
    
    localStorage.setItem('site_translations_cache', JSON.stringify(translationCache));
    console.log(`[Translator] Saved ${cacheSize} translations to localStorage`);
  } catch (e) {
    console.error('[Translator] Failed to save translations to localStorage:', e);
  }
};

// Периодическое сохранение кэша
setInterval(saveLocalTranslations, 60000); // Каждую минуту

/**
 * Log messages to console only
 */
const logMessage = (message) => {
  // Скрываем все сообщения о переводе, чтобы не отображать информационный блок
  if (DEBUG) {
    // просто выводим в консоль
    console.log('[Translator]', message);
  }
};

/**
 * Get cached translation if available
 */
const getCachedTranslation = (text, targetLang) => {
  if (!text || text.trim() === '') return text;
  
  // Нормализуем текст для кэширования
  const normalizedText = text.trim();
  const cacheKey = `${normalizedText}_${targetLang}`;
  return translationCache[cacheKey];
};

/**
 * Save translation to cache
 */
const saveToCache = (text, targetLang, translation) => {
  if (!text || text.trim() === '' || !translation) return;
  
  // Нормализуем текст для кэширования
  const normalizedText = text.trim();
  const cacheKey = `${normalizedText}_${targetLang}`;
  translationCache[cacheKey] = translation;
  
  // Если кэш стал большим, инициируем сохранение
  const cacheSize = Object.keys(translationCache).length;
  if (cacheSize % 50 === 0) {
    // Сохраняем переводы после каждых 50 новых переводов
    setTimeout(saveLocalTranslations, 1000);
  }
};

/**
 * Translate the page to the specified language
 * @param {string} targetLang - Target language code (en, ru, kz)
 * @param {Object} preloadedTranslations - Предварительно загруженные переводы
 * @param {Function} callback - Колбэк после завершения перевода
 */
export const translatePage = async (targetLang, preloadedTranslations = {}, callback = null) => {
  console.time('page-translation');
  
  // Используем улучшенный инициализатор для проверки и установки текущего языка
  const currentLang = languageInitializer.determineCurrentLanguage();
  
  // Проверяем, если страница уже переведена на этот язык, пропускаем перевод
  if (currentLang === targetLang) {
    console.log(`[Переводчик] Страница уже переведена на ${targetLang}`);
    if (callback) callback();
    return;
  }
  
  // Добавляем предварительно загруженные переводы в кэш
  if (preloadedTranslations && Object.keys(preloadedTranslations).length > 0) {
    for (const [text, translation] of Object.entries(preloadedTranslations)) {
      saveToCache(text, targetLang, translation);
    }
    console.log(`[Переводчик] Добавлено ${Object.keys(preloadedTranslations).length} предзагруженных переводов в кэш`);
  }
  
  // Обновляем все источники истины о языке
  languageInitializer.syncLanguageStorage(targetLang);
  
  try {
    // Добавляем стиль для скрытия всех информационных блоков
    const style = document.createElement('style');
    style.textContent = `
      body > div:not(.main-container):not(.container):not(.wrapper):not([class*="component"]):not([id*="component"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          pointer-events: none !important;
          position: absolute !important;
          top: -9999px !important;
      }
    `;
    document.head.appendChild(style);
    
    // Удаляем существующие инфоблоки о переводе
    const elementsToHide = [
      'Перевод страницы', 'Прогресс:', 'Найдено', 'Тестирование API', 'CSRF токен',
      'Перевод элемента', 'Инициализация'
    ];
    
    // Удаляем текстовые узлы, содержащие информацию о переводе
    const allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToRemove = [];
    let currentNode;
    while (currentNode = allTextNodes.nextNode()) {
      if (elementsToHide.some(text => currentNode.nodeValue && currentNode.nodeValue.includes(text))) {
        nodesToRemove.push(currentNode);
      }
    }
    
    // Удаляем или скрываем найденные узлы
    nodesToRemove.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    
    // Получаем все текстовые элементы на странице
    const textElements = getTranslatableElements();
    
    logMessage(`Найдено ${textElements.length} элементов для перевода`);
    
    // Получаем CSRF токен
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      console.error('CSRF токен не найден. Добавьте мета-тег csrf-token в head.');
      return;
    }
    
    // Создаем индикатор прогресса
    const progressBar = createProgressBar();
    
    let translatedCount = 0;
    const totalElements = textElements.length;
    
    // Кэш для хранения переводов текущей сессии
    const pageTranslations = {};
    
    // Перебираем все элементы и применяем перевод
    for (const element of textElements) {
      const text = element.innerText.trim();
      if (!text || text.length < 2) continue;
      
      // Проверяем кэш
      const cachedTranslation = getCachedTranslation(text, targetLang);
      if (cachedTranslation) {
        // Применяем кэшированный перевод
        element.setAttribute('data-original-text', text);
        element.innerText = cachedTranslation;
        pageTranslations[text] = cachedTranslation;
        translatedCount++;
        updateProgressBar(progressBar, translatedCount / totalElements);
        continue;
      }
      
      // Если нет в кэше, добавляем в список для перевода через API
      try {
        const translation = await translateTextViaAPI(text, 'ru', targetLang, token);
        if (translation) {
          element.setAttribute('data-original-text', text);
          element.innerText = translation;
          pageTranslations[text] = translation;
          saveToCache(text, targetLang, translation);
        }
      } catch (err) {
        logMessage(`Ошибка перевода: ${err.message}`);
      }
      
      translatedCount++;
      updateProgressBar(progressBar, translatedCount / totalElements);
    }
    
    // Удаляем индикатор прогресса
    if (progressBar && progressBar.parentNode) {
      progressBar.parentNode.removeChild(progressBar);
    }
    
    // Удаляем стиль скрытия
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
    
    // Сохраняем все переводы в локальное хранилище
    setTimeout(saveLocalTranslations, 1000);
    
    // Вызываем колбэк для дальнейших действий
    if (callback) callback();
    
    console.timeEnd('page-translation');
    console.log(`[Translator] Translation completed: ${translatedCount} elements translated to ${targetLang}`);
    
  } catch (error) {
    console.error('[Translator] Translation error:', error);
    if (callback) callback(error);
  }
};

/**
 * Получение всех переводимых элементов на странице
 */
const getTranslatableElements = () => {
  const elements = [];
  
  // Селекторы для элементов, которые нужно переводить
  const selectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'span', 'li', 'button',
    'label', 'th', 'td', 'div.text-content',
    '.translate-this', '[data-translate="true"]',
    '.text-lg', '.text-sm', '.text-xl', '.text-base',
    '.card-title', '.card-text', '.page-title',
    'div.content > *', '.description', '.subtitle'
  ];
  
  // Селекторы для элементов, которые не нужно переводить
  const excludeSelectors = [
    'script', 'style', 'pre', 'code',
    '[data-no-translate="true"]', '[contenteditable="true"]',
    'input', 'textarea', '.no-translate', '.notranslate',
    '[lang="en"].no-translate-override', // Элементы с явно указанным языком и меткой отмены перевода
    'svg', 'path', 'circle', 'rect', // SVG элементы
    '.language-switcher *', // Элементы внутри переключателя языка
    '.code', '.api-token', '.url-path', // Технические элементы
    'iframe', 'canvas', // Интерактивные элементы
    '.react-code', '.code-sample' // React код  
  ];
  
  // Добавляем селектор для проверки родителей
  const parentExcludeSelectors = [
    '.no-translate-container',
    '.code-block',
    'pre',
    'code',
    '.notranslate',
    '[data-no-translate="true"]'
  ];
  
  // Создаем селектор для исключений
  const excludeSelector = excludeSelectors.join(', ');
  
  // Получаем все элементы, которые нужно перевести
  selectors.forEach(selector => {
    try {
      const found = document.querySelectorAll(selector);
      found.forEach(el => {
        // Проверяем, не находится ли элемент внутри исключенного
        if (!el.closest(excludeSelector) && el.innerText && el.innerText.trim()) {
          // Проверяем родителей на наличие классов/атрибутов, исключающих перевод
          let shouldExclude = parentExcludeSelectors.some(parentSelector => 
            el.closest(parentSelector) !== null
          );
          
          if (!shouldExclude) {
            elements.push(el);
          }
        }
      });
    } catch (e) {
      console.error(`Error selecting ${selector}:`, e);
    }
  });
  
  console.log(`[Translator] Found ${elements.length} translatable elements`);
  return elements;
};

/**
 * Создание прогресс-бара для отображения прогресса перевода
 */
const createProgressBar = () => {
  // Создаем контейнер
  const progressContainer = document.createElement('div');
  progressContainer.id = 'translation-progress';
  progressContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 4px; z-index: 9999; max-width: 300px;';
  
  // Создаем заголовок
  const progressTitle = document.createElement('div');
  progressTitle.textContent = 'Перевод страницы';
  progressTitle.style.cssText = 'font-weight: bold; margin-bottom: 5px;';
  progressContainer.appendChild(progressTitle);
  
  // Создаем контейнер для прогресс-бара
  const progressBarContainer = document.createElement('div');
  progressBarContainer.style.cssText = 'width: 100%; height: 8px; background: #444; border-radius: 4px; overflow: hidden;';
  progressContainer.appendChild(progressBarContainer);
  
  // Создаем сам прогресс-бар
  const progressBarElement = document.createElement('div');
  progressBarElement.style.cssText = 'width: 0%; height: 100%; background: #4CAF50; transition: width 0.2s;';
  progressBarContainer.appendChild(progressBarElement);
  
  // Текст с процентами
  const progressText = document.createElement('div');
  progressText.textContent = '0%';
  progressText.style.cssText = 'margin-top: 5px; font-size: 12px; text-align: center;';
  progressContainer.appendChild(progressText);
  
  // Добавляем на страницу
  document.body.appendChild(progressContainer);
  
  // Сохраняем ссылки на элементы
  progressContainer.barElement = progressBarElement;
  progressContainer.textElement = progressText;
  
  return progressContainer;
};

/**
 * Обновление прогресс-бара
 */
const updateProgressBar = (progressBar, progress) => {
  if (!progressBar) return;
  
  const percent = Math.min(100, Math.round(progress * 100));
  progressBar.barElement.style.width = `${percent}%`;
  progressBar.textElement.textContent = `${percent}%`;
};

/**
 * Перевод текста через API
 */
const translateTextViaAPI = async (text, sourceLang, targetLang, csrfToken) => {
  if (!text || text.trim() === '') return text;
  
  try {
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
        cache: true // Сохраняем перевод на сервере
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.translation) {
      return data.translation;
    }
    
    throw new Error(data.message || 'Unknown translation error');
  } catch (error) {
    console.error('Translation API error:', error);
    return null;
  }
};

/**
 * Применение сохраненных переводов к элементам страницы
 * @param {Object} translations - Объект с переводами {оригинальный_текст: переведенный_текст}
 */
const applyStoredTranslations = (translations) => {
  if (!translations || Object.keys(translations).length === 0) return;
  
  const elements = getTranslatableElements();
  let appliedCount = 0;
  
  elements.forEach(element => {
    const text = element.innerText.trim();
    if (text && translations[text]) {
      element.setAttribute('data-original-text', text);
      element.innerText = translations[text];
      appliedCount++;
    }
  });
  
  console.log(`[Translator] Applied ${appliedCount} stored translations`);
};

/**
 * Обновляет стили кнопок языка в зависимости от выбранного языка
 * @param {string} selectedLang - Выбранный язык
 */
const updateButtonStyles = (selectedLang) => {
  const langButtons = document.querySelectorAll('.language-switcher button');
  
  if (langButtons.length === 0) return;
  
  langButtons.forEach(button => {
    const buttonLang = button.getAttribute('data-lang');
    
    button.classList.remove('active', 'selected');
    
    if (buttonLang === selectedLang) {
      button.classList.add('active', 'selected');
    }
  });
};

// Экспортируем главную функцию перевода
export { translatePage };

// Экспортируем вспомогательные функции для использования в других модулях
export const translatorHelpers = {
  getCachedTranslation,
  saveToCache,
  translateTextViaAPI,
  applyStoredTranslations,
  updateButtonStyles,
  getTranslatableElements
};

// Текущий язык страницы
let currentLanguage = localStorage.getItem('preferredLanguage') || 'ru';

// Экспортируем переменные для доступа из других модулей
export const translatorState = {
  get currentLanguage() { return currentLanguage; },
  set currentLanguage(lang) { currentLanguage = lang; }
};

// Экспортируем основной модуль перевода как default
export default {
  translatePage,
  translatorHelpers,
  translatorState
};

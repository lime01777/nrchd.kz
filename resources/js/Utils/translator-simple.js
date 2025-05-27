/**
 * Advanced translation utility with translation caching
 * Uses Google Translate API through Laravel backend
 * And stores translations in the database for reuse
 */

// Отключаем отображение сообщений о переводе
const DEBUG = false;

// Cache object to store translations during the current session
const translationCache = {};

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
  const cacheKey = `${text}_${targetLang}`;
  return translationCache[cacheKey];
};

/**
 * Save translation to cache
 */
const saveToCache = (text, targetLang, translation) => {
  const cacheKey = `${text}_${targetLang}`;
  translationCache[cacheKey] = translation;
};

/**
 * Translate the page to the specified language
 * @param {string} targetLang - Target language code (en, ru, kz)
 */
export const translatePage = async (targetLang) => {
  // Проверяем, если страница уже переведена на этот язык, пропускаем перевод
  if (document.documentElement.getAttribute('data-language') === targetLang) {
    return;
  }
  
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
  const allNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const nodesToRemove = [];
  let currentNode;
  while (currentNode = allNodes.nextNode()) {
    if (elementsToHide.some(text => currentNode.nodeValue && currentNode.nodeValue.includes(text))) {
      nodesToRemove.push(currentNode);
    }
  }
  
  // Удаляем или скрываем найденные узлы
  nodesToRemove.forEach(node => {
    if (node.parentNode) {
      const parentElement = node.parentNode.closest('div, p, span');
      if (parentElement && !parentElement.closest('.component') && !parentElement.closest('.container')) {
        parentElement.style.display = 'none';
      }
    }
  });
  
  try {
    // Get CSRF token
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      logMessage('ОШИБКА: CSRF токен не найден!');
      return;
    }
    
    logMessage('CSRF токен найден');
    
    // Устанавливаем язык страницы
    document.documentElement.setAttribute('data-language', targetLang);
    currentLanguage = targetLang;
    localStorage.setItem('preferredLanguage', targetLang);
    
    // Обновляем стили кнопок языка
    updateButtonStyles(targetLang);
    
    // First check if translations are available in the cache
    const cachedTranslations = localStorage.getItem(`pageTranslations_${targetLang}`);
    if (cachedTranslations) {
      logMessage(`Найдены кэшированные переводы для языка ${targetLang}, применяем их`);
      try {
        const translations = JSON.parse(cachedTranslations);
        applyStoredTranslations(translations);
        logMessage('Кэшированные переводы успешно применены');
        return;
      } catch (e) {
        logMessage(`Ошибка при применении кэшированных переводов: ${e.message}, продолжаем с переводом API`);
        // Continue with API translation
      }
    }
    
    // Get all text nodes
    logMessage('Поиск текстовых элементов на странице...');
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty nodes
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          
          // Skip script, style tags
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    // Collect all nodes
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim().length > 2) {
        textNodes.push(walker.currentNode);
      }
    }
    
    logMessage(`Найдено ${textNodes.length} текстовых элементов для перевода`);
    
    // Prepare collection to store translations for saving
    const translationsToSave = {};
    
    // Simple sequential translation of each node to avoid overwhelming API
    let translatedCount = 0;
    
    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      const originalText = node.textContent.trim();
      
      if (originalText.length < 2) continue;
      
      try {
        // Check if already cached in this session
        let translatedText = getCachedTranslation(originalText, targetLang);
        
        if (!translatedText) {
          // Not in session cache, try to get from API
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
              text: originalText,
              source: 'ru',
              target: targetLang,
              cache: true // Tell API to store this translation
            })
          });
          
          const result = await response.json();
          
          if (result.success && result.translation) {
            translatedText = result.translation;
            saveToCache(originalText, targetLang, translatedText);
          } else {
            logMessage(`Ошибка перевода элемента: ${result.message || 'Неизвестная ошибка'}`);
            continue;
          }
        } else {
          logMessage(`Использован кэшированный перевод для "${originalText.substring(0, 20)}..."`);
        }
        
        // Apply translation
        node.textContent = node.textContent.replace(originalText, translatedText);
        translationsToSave[originalText] = translatedText;
        translatedCount++;
        
      } catch (error) {
        logMessage(`Ошибка при переводе элемента ${i+1}: ${error.message}`);
      }
      
      // Log progress every 20 elements
      if (i % 20 === 0) {
        logMessage(`Прогресс: ${i+1}/${textNodes.length} (${Math.round((i+1)/textNodes.length*100)}%)`);
      }
    }
    
    // Save all translations to localStorage for future use
    if (Object.keys(translationsToSave).length > 0) {
      localStorage.setItem(`pageTranslations_${targetLang}`, JSON.stringify(translationsToSave));
      logMessage(`Сохранены переводы для языка ${targetLang} в локальное хранилище`);
      
      // Also send all translations to server for permanent storage
      try {
        await fetch('/api/save-translations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            translations: translationsToSave,
            target_language: targetLang,
            page_url: window.location.pathname
          })
        });
        logMessage('Переводы сохранены на сервере');
      } catch (e) {
        logMessage(`Ошибка при сохранении переводов на сервере: ${e.message}`);
      }
    }
    
    // Save language preference
    localStorage.setItem('preferredLanguage', targetLang);
    
    logMessage(`Перевод завершен! Переведено ${translatedCount} из ${textNodes.length} элементов`);
    
    // Update active language button style
    updateButtonStyles(targetLang);
    
  } catch (error) {
    logMessage(`КРИТИЧЕСКАЯ ОШИБКА: ${error.message}`);
  }
};

/**
 * Применяет сохраненные переводы к элементам страницы
 * @param {Object} translations - Объект с переводами {оригинальный_текст: переведенный_текст}
 */
const applyStoredTranslations = (translations) => {
  if (!translations || Object.keys(translations).length === 0) {
    logMessage('Нет переводов для применения');
    return;
  }
  
  logMessage(`Применение ${Object.keys(translations).length} переводов`);
  
  try {
    // Получаем все текстовые узлы на странице
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Пропускаем пустые узлы
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          
          // Пропускаем script, style теги
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    // Собираем все текстовые узлы
    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }
    
    // Применяем переводы к каждому узлу
    let translatedCount = 0;
    for (const node of textNodes) {
      const originalText = node.textContent.trim();
      if (originalText && translations[originalText]) {
        node.textContent = node.textContent.replace(originalText, translations[originalText]);
        translatedCount++;
      }
    }
    
    // Обновляем атрибут языка на HTML-элементе
    document.documentElement.setAttribute('data-language', currentLanguage);
    
    logMessage(`Успешно переведено ${translatedCount} элементов из ${textNodes.length}`);
  } catch (error) {
    logMessage(`Ошибка при применении переводов: ${error.message}`);
  }
};

/**
 * Обновляет стили кнопок языка в зависимости от выбранного языка
 * @param {string} selectedLang - Выбранный язык
 */
const updateButtonStyles = (selectedLang) => {
  // Получаем все кнопки языка
  const langButtons = document.querySelectorAll('button[class*="lang-"], button:contains("EN"), button:contains("RU"), button:contains("KZ")');
  
  // Сбрасываем стили всех кнопок
  langButtons.forEach(btn => {
    btn.classList.remove('bg-gray-300');
    btn.classList.add('hover:bg-gray-200');
    btn.classList.add('bg-transparent');
  });
  
  // Выделяем активную кнопку
  const activeButtons = Array.from(langButtons).filter(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (selectedLang === 'en' && text === 'en') return true;
    if (selectedLang === 'ru' && text === 'ru') return true;
    if (selectedLang === 'kz' && text === 'kz') return true;
    return false;
  });
  
  // Применяем стили к активной кнопке
  activeButtons.forEach(btn => {
    btn.classList.remove('hover:bg-gray-200');
    btn.classList.remove('bg-transparent');
    btn.classList.add('bg-gray-300');
  });
  
  // Сохраняем текущий язык
  currentLanguage = selectedLang;
  localStorage.setItem('preferredLanguage', selectedLang);
};

// Текущий язык страницы
let currentLanguage = localStorage.getItem('preferredLanguage') || 'ru';

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
  // Set initial language button styles based on localStorage
  const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
  const buttons = document.querySelectorAll('.lang-btn');
  
  buttons.forEach(btn => {
    const langCode = btn.getAttribute('data-lang');
    if (langCode === currentLang) {
      btn.style.backgroundColor = '#3b82f6';
      btn.style.color = 'white';
    } else {
      btn.style.backgroundColor = 'white';
      btn.style.color = '#3b82f6';
    }
  });
  
  console.log('[Translator] Simplified translation system initialized');
});

// Устанавливаем начальный язык страницы
document.documentElement.setAttribute('data-language', currentLanguage);

logMessage('Simplified translation system initialized');
logMessage(`Initial language: ${currentLanguage}`);

// Экспортируем переменную в глобальную область видимости для отладки
window.translator = {
  translatePage,
  currentLanguage
};

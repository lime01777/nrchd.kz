/**
 * Утилита для определения предпочтительного языка пользователя
 * на основе настроек браузера
 */

// Поддерживаемые языки в нашем приложении
const SUPPORTED_LOCALES = ['ru', 'en', 'kk'];
const DEFAULT_LOCALE = 'ru';

/**
 * Извлекает код языка из строки локали браузера
 * Например, из "ru-RU" получаем "ru"
 */
function extractLanguageCode(locale) {
  return locale.split('-')[0].toLowerCase();
}

/**
 * Определяет предпочтительный язык пользователя на основе настроек браузера
 * @returns {string} код языка (ru, en, kk)
 */
export function detectBrowserLocale() {
  // Если мы не в браузере, возвращаем язык по умолчанию
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }

  let browserLocale = '';

  // 1. Пробуем получить из navigator.languages (наиболее полный источник)
  if (navigator.languages && navigator.languages.length) {
    // Перебираем все предпочтительные языки браузера
    for (const locale of navigator.languages) {
      const langCode = extractLanguageCode(locale);
      if (SUPPORTED_LOCALES.includes(langCode)) {
        browserLocale = langCode;
        break;
      }
    }
  }

  // 2. Если не нашли подходящий язык, используем navigator.language или navigator.userLanguage
  if (!browserLocale) {
    const fallbackLocale = navigator.language || navigator.userLanguage || '';
    const langCode = extractLanguageCode(fallbackLocale);
    if (SUPPORTED_LOCALES.includes(langCode)) {
      browserLocale = langCode;
    }
  }

  // 3. Если всё ещё не определили язык, используем язык по умолчанию
  if (!browserLocale) {
    browserLocale = DEFAULT_LOCALE;
  }

  console.log(`[browserLocale] Определен предпочтительный язык: ${browserLocale}`);
  return browserLocale;
}

/**
 * Применяет определенный язык, сохраняя его в localStorage
 * и выполняя редирект на нужную локализованную страницу, если необходимо
 * @param {string} locale код языка для применения
 * @param {boolean} redirect нужно ли выполнять редирект
 */
export function applyBrowserLocale(locale = null, redirect = true) {
  // Если локаль не передана, определяем её на основе настроек браузера
  const detectedLocale = locale || detectBrowserLocale();
  
  try {
    // Сохраняем в localStorage для будущих сессий
    localStorage.setItem('lang', detectedLocale);
    
    // Если нужен редирект и мы в браузере
    if (redirect && typeof window !== 'undefined') {
      // Получаем текущий путь
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      
      // Проверяем, нужен ли редирект
      const needsRedirect = pathSegments.length === 0 || 
        !SUPPORTED_LOCALES.includes(pathSegments[0]);
        
      // Если первый сегмент не является локалью или его нет, добавляем локаль
      if (needsRedirect) {
        const newPath = `/${detectedLocale}${currentPath}`;
        window.location.href = newPath;
        return true; // Редирект был выполнен
      }
    }
  } catch (error) {
    console.error('[browserLocale] Ошибка при применении локали:', error);
  }
  
  return false; // Редирект не требовался или не был выполнен
}

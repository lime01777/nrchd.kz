/**
 * Translation Helper Utilities
 * Provides safer access to translations with fallbacks
 */

/**
 * Get a translation value from nested key path
 * Example usage: t(translations, 'common.welcome', 'Welcome')
 * 
 * @param {Object} translations - The translations object from usePage().props
 * @param {string} key - Dot notation path to translation key (e.g., 'common.welcome')
 * @param {string} fallback - Fallback text if translation is missing
 * @returns {string} - The translated text or fallback
 */
export const t = (translations, key, fallback = '') => {
  if (!translations) return fallback;
  
  try {
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (!result[k]) return fallback;
      result = result[k];
    }
    
    return result || fallback;
  } catch (e) {
    console.warn(`Missing translation key: ${key}`, e);
    
    // Log to server if logToFile is available
    if (typeof window !== 'undefined' && window.logToFile) {
      window.logToFile(`Missing translation key: ${key}`, 'warning');
    }
    
    return fallback;
  }
};

/**
 * Get current browser language
 * @returns {string} - Language code (e.g., 'ru', 'en', 'kz')
 */
export const getBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'ru'; // Default to Russian on SSR
  
  try {
    const fullLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
    
    // Extract the language code without region
    const langCode = fullLang.split('-')[0];
    
    // Map browser language codes to our supported languages
    const supportedLanguages = {
      'ru': 'ru',
      'kk': 'kz', // Kazakh in browser is 'kk'
      'en': 'en',
    };
    
    return supportedLanguages[langCode] || 'ru'; // Default to Russian
  } catch (e) {
    console.warn('Failed to detect browser language:', e);
    return 'ru'; // Default to Russian
  }
};

/**
 * Store user language preference
 * @param {string} lang - Language code to store
 */
export const setUserLanguagePreference = (lang) => {
  try {
    localStorage.setItem('locale', lang);
  } catch (e) {
    console.warn('Failed to save locale to localStorage:', e);
  }
};

/**
 * Get user language preference from storage
 * @returns {string|null} - Stored language preference or null if not found
 */
export const getUserLanguagePreference = () => {
  try {
    return localStorage.getItem('locale');
  } catch (e) {
    console.warn('Failed to get locale from localStorage:', e);
    return null;
  }
};

/**
 * Format text with variables
 * Example: formatText('Hello, {name}!', { name: 'John' }) => 'Hello, John!'
 * 
 * @param {string} text - Text with placeholders in {variable} format
 * @param {Object} variables - Variables to inject into text
 * @returns {string} - Formatted text
 */
export const formatText = (text, variables = {}) => {
  if (!text) return '';
  
  return text.replace(/{([^}]+)}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

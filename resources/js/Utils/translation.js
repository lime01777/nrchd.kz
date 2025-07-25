import { usePage } from '@inertiajs/react';

/**
 * Get a translation by key
 * 
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters to replace in the translation
 * @returns {string} - Translated text or the key itself if no translation found
 */
export function useTranslation() {
    const { translations } = usePage().props;
    
    /**
     * Translates a given key to the current locale
     * 
     * @param {string} key - Translation key
     * @param {Object} params - Optional parameters to replace in the translation
     * @returns {string} - Translated text or key if no translation found
     */
    const t = (key, params = {}) => {
        // If translations not loaded yet, return the key
        if (!translations) return key;

        // Get the translation or return the key if not found
        const translation = translations[key] || key;
        
        // Replace any parameters in the translation
        if (params && Object.keys(params).length > 0) {
            return translation.replace(/:(\w+)/g, (match, paramKey) => {
                return params[paramKey] !== undefined ? params[paramKey] : match;
            });
        }
        
        return translation;
    };
    
    return { t };
}

/**
 * Creates a global translation function that can be used outside of React components
 * This is less ideal than useTranslation() hook, but useful for utilities
 * 
 * @returns {function} - A global translation function
 */
export function createGlobalTranslator() {
    let cachedTranslations = {};
    
    // Function to update the cached translations
    const updateTranslations = (translations) => {
        cachedTranslations = translations || {};
    };
    
    // The actual translation function
    const t = (key, params = {}) => {
        const translation = cachedTranslations[key] || key;
        
        if (params && Object.keys(params).length > 0) {
            return translation.replace(/:(\w+)/g, (match, paramKey) => {
                return params[paramKey] !== undefined ? params[paramKey] : match;
            });
        }
        
        return translation;
    };
    
    return { t, updateTranslations };
}

// Create a singleton global translator instance
export const { t, updateTranslations } = createGlobalTranslator();

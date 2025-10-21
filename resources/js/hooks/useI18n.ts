import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Кастомный хук для работы с системой переводов i18n
 * 
 * @param scope - Область переводов (например, 'ui', 'content')
 * @param initialLocale - Начальная локаль
 * @returns {object} Объект с переводами и методами управления
 */
export function useI18n(scope: string = 'ui', initialLocale: string | null = null) {
    const [locale, setLocaleState] = useState<string>(() => {
        return initialLocale || document.documentElement.lang || 'ru';
    });
    
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Загрузить словарь переводов для текущего scope и локали
     */
    const loadDictionary = useCallback(async (targetLocale: string = locale) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/i18n', {
                params: {
                    scope,
                    locale: targetLocale,
                },
            });

            if (response.data.success) {
                setTranslations(response.data.data || {});
            } else {
                throw new Error('Failed to load translations');
            }
        } catch (err: any) {
            console.error('[useI18n] Failed to load dictionary:', err);
            setError(err.message || 'Translation loading error');
        } finally {
            setLoading(false);
        }
    }, [scope, locale]);

    /**
     * Изменить локаль
     */
    const setLocale = useCallback(async (newLocale: string) => {
        if (!['ru', 'kk', 'en'].includes(newLocale)) {
            console.warn(`[useI18n] Invalid locale: ${newLocale}`);
            return;
        }

        try {
            // Устанавливаем локаль на сервере
            await axios.post('/api/locale', { locale: newLocale });

            // Обновляем локальное состояние
            setLocaleState(newLocale);
            document.documentElement.lang = newLocale;

            // Перезагружаем словарь для новой локали
            await loadDictionary(newLocale);

        } catch (err: any) {
            console.error('[useI18n] Failed to set locale:', err);
            setError(err.message || 'Locale change error');
        }
    }, [loadDictionary]);

    /**
     * Получить перевод по ключу
     */
    const t = useCallback((key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    }, [translations]);

    /**
     * Проверить наличие перевода
     */
    const has = useCallback((key: string): boolean => {
        return key in translations;
    }, [translations]);

    /**
     * Загрузить словарь при монтировании или изменении scope
     */
    useEffect(() => {
        loadDictionary();
    }, [scope]);

    return {
        locale,
        setLocale,
        translations,
        loading,
        error,
        t,
        has,
        reload: loadDictionary,
    };
}

/**
 * Хук для получения текущей локали без загрузки словаря
 */
export function useLocale() {
    const [locale, setLocaleState] = useState<string>(() => {
        return document.documentElement.lang || 'ru';
    });

    const setLocale = useCallback(async (newLocale: string) => {
        if (!['ru', 'kk', 'en'].includes(newLocale)) {
            console.warn(`[useLocale] Invalid locale: ${newLocale}`);
            return;
        }

        try {
            await axios.post('/api/locale', { locale: newLocale });
            setLocaleState(newLocale);
            document.documentElement.lang = newLocale;
            
            // Перезагружаем страницу для применения новой локали
            window.location.reload();
        } catch (err: any) {
            console.error('[useLocale] Failed to set locale:', err);
        }
    }, []);

    return { locale, setLocale };
}

export default useI18n;


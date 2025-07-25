import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
import { t as globalT, updateTranslations } from './translation';

/**
 * Расширенный хук для работы с переводами
 * Добавляет поддержку плюрализации и форматирования
 * 
 * @returns {Object} Объект с функциями для работы с переводами
 */
export function useI18n() {
  // Получаем доступ к переводам и текущей локали из Inertia props
  const { translations, locale } = usePage().props;

  /**
   * Получает перевод по ключу с заменой параметров
   * 
   * @param {string} key Ключ перевода
   * @param {Object} params Объект с параметрами для замены в переводе
   * @returns {string} Переведенный текст
   */
  const t = useCallback((key, params = {}) => {
    // Если переводы еще не загружены, возвращаем ключ
    if (!translations) return key;

    // Получаем перевод или возвращаем ключ, если перевод не найден
    const translation = translations[key] || key;
    
    // Заменяем параметры в переводе
    if (params && Object.keys(params).length > 0) {
      return translation.replace(/:(\w+)/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return translation;
  }, [translations]);

  /**
   * Плюрализация перевода в зависимости от количества
   * 
   * @param {string} key Базовый ключ перевода
   * @param {number} count Количество
   * @param {Object} params Дополнительные параметры для замены
   * @returns {string} Переведенный текст с учетом плюрализации
   */
  const plural = useCallback((key, count, params = {}) => {
    // Русская логика плюрализации
    let suffix = 'many';
    
    if (locale === 'ru') {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        suffix = 'many';
      } else if (lastDigit === 1) {
        suffix = 'one';
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        suffix = 'few';
      } else {
        suffix = 'many';
      }
    } else if (locale === 'kk') {
      // Казахская логика плюрализации (упрощенная)
      if (count === 1) {
        suffix = 'one';
      } else {
        suffix = 'many';
      }
    } else {
      // Английская логика плюрализации
      suffix = count === 1 ? 'one' : 'many';
    }
    
    // Формируем ключ с учетом плюрализации
    const pluralKey = `${key}.${suffix}`;
    
    // Добавляем параметр count к параметрам для замены
    const mergedParams = { ...params, count };
    
    // Получаем перевод с учетом плюрализации
    return t(pluralKey, mergedParams);
  }, [locale, t]);

  /**
   * Форматирование даты в соответствии с локалью
   * 
   * @param {Date|string|number} date Дата для форматирования
   * @param {Object} options Опции форматирования
   * @returns {string} Отформатированная дата
   */
  const formatDate = useCallback((date, options = {}) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Настройки форматирования по умолчанию
    const defaultOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    // Объединяем настройки по умолчанию с переданными настройками
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      // Форматируем дату с учетом локали
      return new Intl.DateTimeFormat(locale, mergedOptions).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toString();
    }
  }, [locale]);

  /**
   * Получение текущей локали
   * @returns {string} Код текущей локали (ru, en, kk)
   */
  const currentLocale = useMemo(() => locale, [locale]);

  return {
    t,
    plural,
    formatDate,
    currentLocale,
    updateTranslations
  };
}

// Экспортируем глобальную функцию перевода для использования вне компонентов
export const { t } = { t: globalT };

export default useI18n;

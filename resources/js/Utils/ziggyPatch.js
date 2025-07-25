/**
 * ziggyPatch.js
 * 
 * Этот файл создает глобальную обертку для функции route() из Ziggy,
 * автоматически добавляя параметр locale ко всем вызовам маршрутов.
 * 
 * Эта обертка решает проблему "Ziggy error: 'locale' parameter is required for route"
 */

import { usePage } from '@inertiajs/react';

/**
 * Сохраняем оригинальную функцию route до патчирования
 */
const originalRoute = window.route;

/**
 * Получение текущей локали приложения
 * 
 * @returns {string} Текущая локаль (ru, en, kk)
 */
function getCurrentLocale() {
  try {
    // Попытка получить из usePage()
    if (usePage && usePage().props && usePage().props.locale) {
      return usePage().props.locale;
    }
  } catch (e) {
    // usePage может быть недоступен вне компонентов React
  }

  try {
    // Попытка получить из URL
    const localeMatch = window.location.pathname.match(/^\/(ru|en|kk)(\/|$)/);
    if (localeMatch && localeMatch[1]) {
      return localeMatch[1];
    }
  } catch (e) {
    // Ошибка при разборе URL
  }

  // Возвращаем дефолтную локаль
  return 'ru';
}

/**
 * Расширенная функция route, автоматически добавляющая locale
 * 
 * @param {string} name - Имя маршрута
 * @param {object} params - Параметры маршрута
 * @param {boolean} absolute - Генерировать абсолютный URL
 * @param {object} config - Конфигурация Ziggy
 * @returns {string} Сгенерированный URL
 */
function patchedRoute(name, params = {}, absolute = false, config = {}) {
  // Если params уже содержит locale, не трогаем
  if (!params || !params.locale) {
    // Создаем копию объекта params, добавляя locale
    params = {
      ...params,
      locale: getCurrentLocale()
    };
  }

  // Вызываем оригинальный route с добавленным locale
  return originalRoute(name, params, absolute, config);
}

// Применяем патч, заменяя глобальную функцию route
window.route = patchedRoute;

export default patchedRoute;

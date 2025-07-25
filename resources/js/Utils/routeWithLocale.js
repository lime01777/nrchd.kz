import { route as ziggyRoute } from 'ziggy-js';

/**
 * Хелпер для генерации URL с учетом параметра locale.
 * 
 * В Laravel маршруты настроены с префиксом {locale} как ЧАСТЬ ПУТИ (segment),
 * а не query-параметр. Например: /ru/home вместо /home?locale=ru
 * 
 * @param {string} name - Имя маршрута
 * @param {object} params - Параметры маршрута
 * @param {boolean} absolute - Генерировать абсолютный URL
 * @returns {string} Корректный URL с локалью как сегментом пути
 */
export default function routeWithLocale(name, params = {}, absolute = true) {
  // Получаем локаль из доступных источников
  let locale = params.locale;
  
  // Если локаль не передана явно, пытаемся определить её
  if (!locale) {
    // Пытаемся получить из localStorage
    try {
      locale = localStorage.getItem('lang');
    } catch (e) {
      // Игнорируем ошибки localStorage (например, в SSR)
    }
    
    // Если всё ещё нет, пытаемся получить из URL
    if (!locale) {
      const pathMatch = typeof window !== 'undefined' && window.location.pathname.match(/^\/([a-z]{2})(\/?|\/.+)$/);
      if (pathMatch && pathMatch[1]) {
        locale = pathMatch[1];
      }
    }
    
    // Если ничего не помогло, используем значение по умолчанию
    if (!locale) {
      locale = 'ru';
    }
  }
  
  // Добавляем locale к параметрам, если ещё не добавлен
  // Ziggy ожидает locale как сегмент пути, если маршрут так настроен
  return ziggyRoute(name, { ...params, locale }, absolute);
}

/**
 * Простая обертка для доступа к глобальной функции route, которую Laravel инжектирует через директиву @routes
 * в шаблон Blade. Это позволяет избежать проблем с импортом/экспортом Ziggy конфигурации.
 */

export function route(name, params, absolute, config) {
  // Используем глобальную функцию route, предоставленную Laravel через директиву @routes
  if (typeof window !== 'undefined' && typeof window.route === 'function') {
    return window.route(name, params, absolute, config);
  }
  
  // Fallback для случаев, когда window.route недоступна (например, во время SSR)
  console.error('window.route is not available. Make sure @routes directive is included in your Blade template.');
  return '#';
}

export default route;

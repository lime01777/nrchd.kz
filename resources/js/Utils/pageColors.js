/**
 * Маппинг цветов фона для разных страниц сайта
 * Используется для автоматического определения цвета аккордеонов документов
 */
export const pageColors = {
    'medical.education': 'bg-blue-100',
    'human.resources': 'bg-green-100',
    'science': 'bg-purple-100',
    'international.cooperation': 'bg-yellow-100',
    'press.center': 'bg-red-100',
    // Добавьте другие страницы по мере необходимости
};

/**
 * Получить цвет фона для указанного маршрута страницы
 * @param {string} pageRoute - Маршрут страницы
 * @returns {string} - Класс цвета фона
 */
export const getPageColor = (pageRoute) => {
    return pageColors[pageRoute] || 'bg-green-100'; // По умолчанию зеленый
};

/**
 * Функция отладки для системы переводов
 * Вызывается при загрузке страницы для проверки состояния системы перевода
 */

import languageManager from './LanguageManager';

export function debugTranslationSystem() {
    console.log('=== ДИАГНОСТИКА СИСТЕМЫ ПЕРЕВОДОВ ===');
    
    // Проверка состояния менеджера языков
    console.log('Статус инициализации:', languageManager.initialized);
    console.log('Текущий язык:', languageManager.getCurrentLanguage());
    
    // Проверка настроек CSRF токена
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    console.log('CSRF токен доступен:', csrfToken ? 'Да' : 'НЕТ (ОШИБКА)');
    
    // Проверка API-маршрутов
    checkApiEndpoint('/api/set-language', 'POST')
        .then(status => console.log('API маршрут /api/set-language:', status ? 'Доступен' : 'НЕДОСТУПЕН'))
        .catch(err => console.error('Ошибка проверки /api/set-language:', err));
        
    checkApiEndpoint('/api/page-translations', 'POST')
        .then(status => console.log('API маршрут /api/page-translations:', status ? 'Доступен' : 'НЕДОСТУПЕН'))
        .catch(err => console.error('Ошибка проверки /api/page-translations:', err));
        
    checkApiEndpoint('/api/translate', 'POST')
        .then(status => console.log('API маршрут /api/translate:', status ? 'Доступен' : 'НЕДОСТУПЕН'))
        .catch(err => console.error('Ошибка проверки /api/translate:', err));
    
    // Проверка кук и localStorage
    console.log('Текущий язык в куки:', getCookie('language'));
    console.log('Текущий язык в localStorage:', localStorage.getItem('preferredLanguage'));
    
    // Исправление распространенных проблем
    fixCommonIssues();
}

/**
 * Проверяет доступность API-маршрута
 */
async function checkApiEndpoint(url, method) {
    try {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) return false;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                test: true,
                language: 'ru'
            })
        });
        
        return response.status !== 404;
    } catch (e) {
        console.error(`Ошибка проверки API: ${url}`, e);
        return false;
    }
}

/**
 * Получает значение куки по имени
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Исправляет распространенные проблемы с мультиязычностью
 */
function fixCommonIssues() {
    // 1. Проверяем наличие CSRF токена
    if (!document.querySelector('meta[name="csrf-token"]')) {
        console.warn('CSRF токен отсутствует, добавляем...');
        const csrfMeta = document.createElement('meta');
        csrfMeta.setAttribute('name', 'csrf-token');
        csrfMeta.setAttribute('content', window.csrfToken || '');
        document.head.appendChild(csrfMeta);
    }
    
    // 2. Повторная инициализация LanguageManager если не инициализирован
    if (!languageManager.initialized) {
        console.warn('LanguageManager не инициализирован, инициализируем...');
        languageManager.init();
    }
    
    // 3. Синхронизируем язык с сервером
    console.log('Синхронизируем язык с сервером...');
    languageManager.syncLanguageWithServer().catch(e => {
        console.error('Ошибка синхронизации языка с сервером:', e);
    });
}

/**
 * Запуск отладки системы переводов
 * @param {boolean} showAlert - Показать алерт с отладочной информацией
 */
export function runDebug(showAlert = false) {
    console.log('Запуск диагностики перевода...');
    
    // Собираем отладочную информацию
    const debugInfo = {};
    
    // Текущий язык
    debugInfo.currentLanguage = languageManager.getCurrentLanguage() || 'ru';
    
    // Состояние инициализации
    debugInfo.managerInitialized = languageManager.initialized ? 'Да' : 'Нет';
    
    // Наличие CSRF токена
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    debugInfo.csrfTokenPresent = csrfToken ? 'Да' : 'Нет';
    
    // Значения языка в разных хранилищах
    debugInfo.cookieLanguage = getCookie('language');
    debugInfo.localStorageLanguage = localStorage.getItem('preferredLanguage');
    debugInfo.htmlDataLanguage = document.documentElement.getAttribute('data-language');
    
    // Запускаем полную диагностику
    setTimeout(() => {
        debugTranslationSystem();
        
        if (showAlert) {
            // Формируем текст для алерта
            let alertText = 'Диагностика системы переводов:\n\n';
            alertText += `Текущий язык: ${debugInfo.currentLanguage}\n`;
            alertText += `LanguageManager инициализирован: ${debugInfo.managerInitialized}\n`;
            alertText += `CSRF токен присутствует: ${debugInfo.csrfTokenPresent}\n\n`;
            alertText += `Язык в cookie: ${debugInfo.cookieLanguage || 'не установлен'}\n`;
            alertText += `Язык в localStorage: ${debugInfo.localStorageLanguage || 'не установлен'}\n`;
            alertText += `Язык в HTML атрибуте: ${debugInfo.htmlDataLanguage || 'не установлен'}\n\n`;
            alertText += `Подробная информация в консоли.`;
            
            alert(alertText);
        }
        
        // Автоматически исправляем проблемы
        fixCommonIssues();
    }, 500);
}

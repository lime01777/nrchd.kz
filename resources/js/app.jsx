import '../css/app.css';
import './bootstrap';
// ВАЖНО: Полностью обновленная система перевода (только из БД)
import './Utils/translation-blocker'; // Import blocker for translation information blocks
import languageInitializer from './Utils/language-initializer-new'; // Новейший инициализатор языка

// Скрываем все информационные блоки о переводе
const hideTranslationInfo = () => {
  // Создаем стиль для скрытия всех возможных информационных блоков перевода
  const style = document.createElement('style');
  style.textContent = `
    /* Полностью скрываем информационные блоки о переводе */
    .translation-progress, 
    .translating-message,
    .translation-info,
    .translation-status {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
      position: absolute !important;
      top: -9999px !important;
    }
  `;
  document.head.appendChild(style);
};

// Добавляем стили для скрытия информационных блоков
document.addEventListener('DOMContentLoaded', hideTranslationInfo);

// Используем новую систему перевода с подробным логированием
document.addEventListener('DOMContentLoaded', () => {
  languageInitializer.initialize(true); // Включаем подробное логирование
});

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const render = props.initialPage.props.layout || ((page) => page);
        
        // Инициализируем языковую систему и применяем перевод через новый инициализатор
        languageInitializer.initialize(true)
            .then(currentLang => {
                console.log('[App] Языковая система успешно инициализирована с языком:', currentLang);
            })
            .catch(err => {
                console.error('[App] Ошибка инициализации языковой системы:', err);
            });

        root.render(render(<App {...props} />));
    },
    progress: {
        color: '#4B5563',
    },
});

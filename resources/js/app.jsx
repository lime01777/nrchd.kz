import '../css/app.css';
import './bootstrap';
import languageManager from './Utils/LanguageManager'; // Import language manager for site-wide translations
import './Utils/translation-blocker'; // Import blocker for translation information blocks
import languageInitializer from './Utils/language-initializer'; // Import new robust language initializer

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

// Используем улучшенный инициализатор языка для более надежной работы
document.addEventListener('DOMContentLoaded', () => {
  languageInitializer.initialize();
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
        
        // Применяем улучшенную обработку языковых настроек при загрузке приложения
        setTimeout(() => {
            // Даем время на рендер и применяем язык через новый инициализатор
            languageInitializer.initialize();
            // Дополнительно применяем язык на случай, если есть необходимость
            languageManager.applyLanguage();
        }, 500);

        root.render(render(<App {...props} />));
    },
    progress: {
        color: '#4B5563',
    },
});

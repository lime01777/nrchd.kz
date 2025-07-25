import './bootstrap';
import '../css/app.css';

// Импортируем патч для Ziggy route функции
import './Utils/ziggyPatch';

// Импортируем функцию для определения языка браузера
import { detectBrowserLocale, applyBrowserLocale } from './Utils/browserLocale';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { updateTranslations } from './Utils/translation';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        // Initialize translations for global use
        if (props.initialPage.props.translations) {
            updateTranslations(props.initialPage.props.translations);
        }
        
        // Автоматическое определение и применение локали при первой загрузке
        try {
            const currentLocale = props.initialPage.props.locale || null;
            const savedLocale = localStorage.getItem('lang');
            
            // Если у пользователя еще нет сохраненного языка, определяем автоматически
            if (!savedLocale) {
                const browserLocale = detectBrowserLocale();
                console.log(`[App] Языковая система: определен язык браузера ${browserLocale}`); 
                
                // Применяем локаль только если она отличается от текущей
                if (browserLocale !== currentLocale) {
                    // Если мы на главной странице без локали, делаем редирект
                    const currentPath = window.location.pathname;
                    const pathSegments = currentPath.split('/').filter(Boolean);
                    
                    // Проверяем, если нужен редирект на локализованную версию
                    if (pathSegments.length === 0 || !['ru', 'en', 'kk'].includes(pathSegments[0])) {
                        applyBrowserLocale(browserLocale, true);
                        // Если был выполнен редирект, не рендерим приложение
                        return;
                    } else {
                        // Сохраняем только для будущих сессий
                        localStorage.setItem('lang', browserLocale);
                    }
                }
            }
            
            console.log(`[App] Языковая система успешно инициализирована с языком: ${currentLocale || savedLocale || 'default'}`); 
        } catch (error) {
            console.error('[App] Ошибка при инициализации языковой системы:', error);
        }
        
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

import React, { useState, useEffect } from 'react';

/**
 * Компонент кнопки "Наверх" - появляется при скролле вниз
 * Показывает стрелочку в правом нижнем углу для возврата наверх страницы
 */
export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Отслеживание скролла страницы
    useEffect(() => {
        const toggleVisibility = () => {
            // Показываем кнопку когда прокрутка больше 300px
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Добавляем обработчик скролла
        window.addEventListener('scroll', toggleVisibility);

        // Очистка при размонтировании
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Плавная прокрутка наверх
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-gray-500/80 hover:bg-gray-600/90 backdrop-blur-sm text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    aria-label="Вернуться наверх"
                    title="Вернуться наверх"
                >
                    {/* SVG стрелка вверх */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    );
}

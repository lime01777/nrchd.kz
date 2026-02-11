import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

const FooterNav = ({ title, links, subMenus = {} }) => {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    
    const toggleSubmenu = (linkLabel) => {
        setOpenSubmenu(openSubmenu === linkLabel ? null : linkLabel);
    };
    
    // Безопасная функция для создания URL
    const safeRoute = (routeName) => {
        try {
            return route(routeName);
        } catch (e) {
            console.error(`Ошибка маршрута: ${routeName}`, e);
            return '#'; // Возвращаем безопасную ссылку-якорь в случае проблемы
        }
    };
    
    return (
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            {/* Заголовок с центрированием на мобильных устройствах */}
            <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3 text-center md:text-left" data-translate>{title}</h2>
            {/* Навигация с центрированием на мобильных устройствах */}
            <nav className="list-none mb-10 text-center md:text-left">
                {links.map((link, index) => (
                <li key={index} className="mb-2">
                    {subMenus[link.label] ? (
                        <div>
                            {/* Кнопка с центрированием на мобильных устройствах */}
                            <button 
                                onClick={() => toggleSubmenu(link.label)}
                                className="flex items-center justify-center md:justify-start text-gray-600 hover:text-gray-800 w-full md:text-left"
                            >
                                <span {...(link.translate ? {'data-translate': true} : {})}>{link.label}</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`ml-1 h-4 w-4 transition-transform ${openSubmenu === link.label ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {/* Подменю с центрированием на мобильных устройствах */}
                            {openSubmenu === link.label && (
                                <ul className="pl-4 mt-2 space-y-1 border-l border-gray-200 text-center md:text-left">
                                    {subMenus[link.label].map((subLink, subIndex) => (
                                        <li key={subIndex}>
                                            <Link 
                                                href={safeRoute(subLink.url)} 
                                                className="text-gray-600 hover:text-gray-800 text-sm"
                                                {...(subLink.translate ? {'data-translate': true} : {})}
                                            >
                                                {subLink.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <Link 
                            href={safeRoute(link.url)} 
                            className="text-gray-600 hover:text-gray-800"
                            {...(link.translate ? {'data-translate': true} : {})}
                        >
                            {link.label}
                        </Link>
                    )}
                </li>
                ))}
            </nav>
        </div>
    );
};

export default FooterNav
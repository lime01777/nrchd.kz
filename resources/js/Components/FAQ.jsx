import React, { useState } from 'react';

/**
 * FAQ компонент в виде аккордеона
 * @param {Object} props
 * @param {Array} props.items - Массив объектов с вопросами и ответами: [{question: 'Вопрос', answer: 'Ответ'}]
 * @param {string} props.title - Заголовок для блока FAQ (опционально)
 * @param {string} props.className - Дополнительные классы для контейнера (опционально)
 */
export default function FAQ({ items = [], title, className = '' }) {
    // Состояние для отслеживания открытых вопросов
    const [openItems, setOpenItems] = useState({});

    // Демо-данные, если items не переданы
    const faqItems = items.length > 0 ? items : [
        {
            question: 'Как получить доступ к данным Национальных счетов здравоохранения?',
            answer: 'Данные Национальных счетов здравоохранения доступны на нашем сайте в разделе "Национальные счета здравоохранения". Для получения дополнительной информации вы можете обратиться в наш центр.'
        },
        {
            question: 'Как часто обновляются данные Национальных счетов здравоохранения?',
            answer: 'Данные обновляются ежегодно после сбора и обработки информации за предыдущий календарный год.'
        },
        {
            question: 'Можно ли использовать данные НСЗ для научных исследований?',
            answer: 'Да, данные НСЗ могут быть использованы для научных исследований с обязательной ссылкой на источник.'
        }
    ];

    // Функция для переключения состояния вопроса
    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className={`w-full ${className}`}>
            {title && (
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
            )}

            <div className="divide-y divide-black divide-opacity-100 border-t border-b border-black">
                {faqItems.map((item, index) => (
                    <div key={index} className="py-5">
                        <button
                            onClick={() => toggleItem(index)}
                            className="flex justify-between items-center w-full text-left focus:outline-none group"
                        >
                            <span className="text-base md:text-lg font-medium text-gray-900">{item.question}</span>
                            <span className="ml-6 flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transform transition-all duration-300 ${openItems[index] ? 'bg-white' : 'bg-white'}`}>
                                    {openItems[index] ? (
                                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path>
                                        </svg>
                                    )}
                                </div>
                            </span>
                        </button>
                        
                        <div 
                            className={`mt-2 overflow-hidden transition-all duration-500 ease-in-out ${
                                openItems[index] 
                                    ? 'max-h-[1000px] opacity-100' 
                                    : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="text-base text-gray-700 pt-2 pb-1">
                                {typeof item.answer === 'string' ? (
                                    <p>{item.answer}</p>
                                ) : (
                                    item.answer
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

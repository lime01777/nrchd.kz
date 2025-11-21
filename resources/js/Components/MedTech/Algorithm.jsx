import React, { useState } from 'react';

/**
 * Компонент блока "Алгоритм внедрения технологий"
 */
export default function Algorithm({ image, steps = [], indicators = [] }) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Алгоритм внедрения технологий
            </h3>

            {/* Графическая схема */}
            {image && (
                <div className="mb-6">
                    <div
                        className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        onClick={() => setIsImageModalOpen(true)}
                    >
                        <img
                            src={image}
                            alt="Алгоритм внедрения технологий"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        Нажмите на изображение для увеличения
                    </p>
                </div>
            )}

            {/* Текстовое перечисление этапов */}
            {steps.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Этапы алгоритма:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        {steps.map((step, index) => (
                            <li key={index} className="leading-relaxed">
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Ключевые индикаторы */}
            {indicators.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Ключевые индикаторы:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {indicators.map((indicator, index) => (
                            <li key={index} className="leading-relaxed">
                                {indicator}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Модальное окно для увеличенного изображения */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="max-w-4xl max-h-full">
                        <img
                            src={image}
                            alt="Алгоритм внедрения технологий"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


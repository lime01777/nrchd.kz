import React from 'react';

/**
 * Компонент блока "Обзор платформы"
 */
export default function Overview({ onViewRegistry, onSubmitTechnology }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Обзор платформы
            </h3>

            <div className="prose max-w-none">
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Технологическая платформа MedTech — это единое окно для работы с медицинскими технологиями, 
                    созданное для информирования о нормативной базе и алгоритмах внедрения технологий здравоохранения, 
                    ведения публичного реестра технологий, отображения пилотных площадок и возможности онлайн-подачи 
                    технологий на рассмотрение в ОЦТК.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Платформа предназначена для разработчиков медицинских технологий, клиник, медицинских организаций 
                    и Министерства здравоохранения РК. Основные функции платформы включают регистрацию технологий, 
                    их оценку, апробацию и внедрение в клиническую практику.
                </p>
            </div>

            {/* Кнопки Call-to-Action */}
            <div className="flex flex-wrap gap-4 mt-6">
                <button
                    onClick={onViewRegistry}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    Смотреть реестр
                </button>
                <button
                    onClick={onSubmitTechnology}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                    Подать технологию
                </button>
            </div>
        </div>
    );
}


import React, { useState } from 'react';

/**
 * Компонент блока "Алгоритм внедрения технологий"
 * Отображает графическую схему и таблицу этапов с детальной информацией
 */
export default function Algorithm({ image, steps = [], indicators = [] }) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);

    // Дефолтные этапы, если не переданы через props
    const defaultSteps = [
        {
            number: 1,
            name: 'Инициирование',
            description: 'Разработчик подаёт заявку, краткое описание, TRL, риск',
            responsible: 'Разработчик, ОЦТК',
            result: 'Зарегистрированная заявка',
            documents: 'Форма заявки'
        },
        {
            number: 2,
            name: 'Предварительная оценка и TRL',
            description: 'Проверка TRL, класса риска, соответствия приоритетам',
            responsible: 'ОЦТК, эксперты',
            result: 'Решение: допуск к экспертизе / отказ',
            documents: 'Отчёт предоценки'
        },
        {
            number: 3,
            name: 'Экспертиза ОЦТК',
            description: 'Научная, клиническая, организационная оценка',
            responsible: 'Эксперты ОЦТК',
            result: 'Заключение экспертизы',
            documents: 'Экспертное заключение'
        },
        {
            number: 4,
            name: 'Выбор пилотной площадки',
            description: 'Подбор учреждения, согласование протокола',
            responsible: 'ОЦТК + клиника',
            result: 'Подписанное соглашение',
            documents: 'Договор/Протокол'
        },
        {
            number: 5,
            name: 'Клиническая апробация',
            description: 'Реальное применение, сбор данных',
            responsible: 'Клиника',
            result: 'Набор данных, отчёт',
            documents: 'Отчёт апробации'
        },
        {
            number: 6,
            name: 'Оценка результатов',
            description: 'Анализ клин./экон./организ. эффектов',
            responsible: 'ОЦТК, HTA',
            result: 'Итоговый отчёт',
            documents: 'Сводный отчёт'
        },
        {
            number: 7,
            name: 'Масштабирование',
            description: 'Рекомендации по включению в стандарты, тарифы',
            responsible: 'МЗ, профильные отделы',
            result: 'Решение МЗ',
            documents: 'Приказ/письмо'
        }
    ];

    // Используем переданные steps или дефолтные
    const algorithmSteps = steps.length > 0 ? steps : defaultSteps;

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

            {/* Визуальная лента этапов (если нет изображения) */}
            {!image && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        {algorithmSteps.map((step, index) => (
                            <div key={step.number || index} className="flex items-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                                        {step.number || index + 1}
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 max-w-[100px]">
                                        {step.name || step}
                                    </p>
                                </div>
                                {index < algorithmSteps.length - 1 && (
                                    <div className="hidden md:block w-8 h-0.5 bg-blue-400 mx-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Таблица этапов */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Этап
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Описание
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ответственный
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Результат
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Документы
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {algorithmSteps.map((step, index) => {
                            const stepData = typeof step === 'string' 
                                ? { name: step, description: '', responsible: '', result: '', documents: '' }
                                : step;
                            
                            return (
                                <tr
                                    key={step.number || index}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedStep(stepData)}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-2">
                                                {stepData.number || index + 1}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {stepData.name || stepData}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {stepData.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600">
                                            {stepData.responsible || '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600">
                                            {stepData.result || '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600">
                                            {stepData.documents || '-'}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Кнопка "Посмотреть требования к заявке" */}
            <div className="text-center mt-6">
                <a
                    href="#medtech-submission"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    Посмотреть требования к заявке
                </a>
            </div>

            {/* Модальное окно с деталями этапа */}
            {selectedStep && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedStep(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {selectedStep.number || '?'}
                                    </span>
                                    <h4 className="text-xl font-semibold text-gray-800">
                                        {selectedStep.name || selectedStep}
                                    </h4>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStep(null)}
                                className="text-gray-500 hover:text-gray-700"
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

                        <div className="space-y-3 text-sm">
                            {selectedStep.description && (
                                <div>
                                    <strong className="text-gray-700">Описание:</strong>
                                    <p className="text-gray-600 mt-1 leading-relaxed">
                                        {selectedStep.description}
                                    </p>
                                </div>
                            )}
                            {selectedStep.responsible && (
                                <div>
                                    <strong className="text-gray-700">Ответственный:</strong>
                                    <p className="text-gray-600 mt-1">{selectedStep.responsible}</p>
                                </div>
                            )}
                            {selectedStep.result && (
                                <div>
                                    <strong className="text-gray-700">Результат:</strong>
                                    <p className="text-gray-600 mt-1">{selectedStep.result}</p>
                                </div>
                            )}
                            {selectedStep.documents && (
                                <div>
                                    <strong className="text-gray-700">Документы:</strong>
                                    <p className="text-gray-600 mt-1">{selectedStep.documents}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для увеличенного изображения */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="max-w-4xl max-h-full relative">
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


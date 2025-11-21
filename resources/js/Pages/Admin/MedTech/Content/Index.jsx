import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ContentIndex({ algorithmSteps = [], algorithmIndicators = [], algorithmImage = null }) {
    const [steps, setSteps] = useState(
        algorithmSteps.length > 0
            ? algorithmSteps.map((step, index) => ({ id: index, content_ru: step, content_kz: '', content_en: '' }))
            : [{ id: 0, content_ru: '', content_kz: '', content_en: '' }]
    );

    const [indicators, setIndicators] = useState(
        algorithmIndicators.length > 0
            ? algorithmIndicators.map((indicator, index) => ({ id: index, content_ru: indicator, content_kz: '', content_en: '' }))
            : [{ id: 0, content_ru: '', content_kz: '', content_en: '' }]
    );

    const { data, setData, post, processing } = useForm({
        algorithm_steps: steps,
        algorithm_indicators: indicators,
        image: null,
    });

    const addStep = () => {
        setSteps([...steps, { id: Date.now(), content_ru: '', content_kz: '', content_en: '' }]);
    };

    const removeStep = (id) => {
        setSteps(steps.filter((step) => step.id !== id));
    };

    const updateStep = (id, field, value) => {
        setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)));
    };

    const addIndicator = () => {
        setIndicators([...indicators, { id: Date.now(), content_ru: '', content_kz: '', content_en: '' }]);
    };

    const removeIndicator = (id) => {
        setIndicators(indicators.filter((indicator) => indicator.id !== id));
    };

    const updateIndicator = (id, field, value) => {
        setIndicators(indicators.map((indicator) => (indicator.id === id ? { ...indicator, [field]: value } : indicator)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Фильтруем пустые этапы и индикаторы
        const filteredSteps = steps.filter(step => step.content_ru && step.content_ru.trim());
        const filteredIndicators = indicators.filter(indicator => indicator.content_ru && indicator.content_ru.trim());
        
        console.log('Отправка данных:', {
            steps: filteredSteps,
            indicators: filteredIndicators,
            hasImage: !!data.image,
        });
        
        // Подготавливаем данные для отправки
        const submitData = {
            algorithm_steps: filteredSteps,
            algorithm_indicators: filteredIndicators,
        };
        
        // Если есть изображение, добавляем его
        if (data.image) {
            submitData.image = data.image;
        }

        router.post(route('admin.medtech.content.store'), submitData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Контент успешно сохранен');
                // Обновляем состояние после успешного сохранения
                if (page.props.algorithmSteps) {
                    setSteps(page.props.algorithmSteps.length > 0 
                        ? page.props.algorithmSteps.map((step, index) => ({ 
                            id: Date.now() + index, 
                            content_ru: step, 
                            content_kz: '', 
                            content_en: '' 
                        }))
                        : [{ id: Date.now(), content_ru: '', content_kz: '', content_en: '' }]
                    );
                }
                if (page.props.algorithmIndicators) {
                    setIndicators(page.props.algorithmIndicators.length > 0 
                        ? page.props.algorithmIndicators.map((indicator, index) => ({ 
                            id: Date.now() + index, 
                            content_ru: indicator, 
                            content_kz: '', 
                            content_en: '' 
                        }))
                        : [{ id: Date.now(), content_ru: '', content_kz: '', content_en: '' }]
                    );
                }
                setData('image', null);
            },
            onError: (errors) => {
                console.error('Ошибки при сохранении:', errors);
                alert('Произошла ошибка при сохранении. Проверьте консоль для деталей.');
            },
        });
    };

    return (
        <AdminLayout title="Управление контентом MedTech">
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.index')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к платформе MedTech
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Управление контентом платформы</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Изображение алгоритма */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Изображение алгоритма внедрения</h2>
                            {algorithmImage && (
                                <div className="mb-4">
                                    <img
                                        src={algorithmImage}
                                        alt="Алгоритм внедрения"
                                        className="max-w-full h-auto rounded-lg border border-gray-200"
                                    />
                                </div>
                            )}
                            <div>
                                <InputLabel htmlFor="image" value="Загрузить новое изображение" />
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {/* Этапы алгоритма */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Этапы алгоритма</h2>
                                <button
                                    type="button"
                                    onClick={addStep}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Добавить этап
                                </button>
                            </div>
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Этап {index + 1}</span>
                                            {steps.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeStep(step.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Удалить
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            value={step.content_ru || ''}
                                            onChange={(e) => updateStep(step.id, 'content_ru', e.target.value)}
                                            rows={3}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                            placeholder="Описание этапа на русском *"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ключевые индикаторы */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Ключевые индикаторы</h2>
                                <button
                                    type="button"
                                    onClick={addIndicator}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Добавить индикатор
                                </button>
                            </div>
                            <div className="space-y-4">
                                {indicators.map((indicator, index) => (
                                    <div key={indicator.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Индикатор {index + 1}</span>
                                            {indicators.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIndicator(indicator.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Удалить
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            value={indicator.content_ru || ''}
                                            onChange={(e) => updateIndicator(indicator.id, 'content_ru', e.target.value)}
                                            rows={2}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                            placeholder="Описание индикатора на русском *"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Сохранение...' : 'Сохранить контент'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}


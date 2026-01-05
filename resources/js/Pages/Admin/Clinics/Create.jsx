import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { route } from '@/ziggy-helper';

export default function ClinicCreate() {
    const { data, setData, post, processing, errors, progress } = useForm({
        name_ru: '',
        name_kk: '',
        name_en: '',
        short_desc_ru: '',
        short_desc_kk: '',
        short_desc_en: '',
        full_desc_ru: '',
        full_desc_kk: '',
        full_desc_en: '',
        city_ru: '',
        city_kk: '',
        city_en: '',
        address_ru: '',
        address_kk: '',
        address_en: '',
        phone: '',
        email: '',
        website: '',
        services_ru: [],
        services_kk: [],
        services_en: [],
        specialties_ru: [],
        specialties_kk: [],
        specialties_en: [],
        hero: null,
        is_published: false,
        is_medical_tourism: true, // По умолчанию для клиник Казахстана
    });

    // Предустановленные услуги для выбора
    const commonServices = [
        'Кардиология', 'Неврология', 'Ортопедия', 'Гинекология', 'Урология',
        'Онкология', 'Педиатрия', 'Терапия', 'Хирургия', 'Диагностика',
        'Лабораторные анализы', 'УЗИ', 'МРТ', 'КТ', 'Эндоскопия'
    ];

    const handleServiceToggle = (service) => {
        const currentServices = data.services_ru || [];
        if (currentServices.includes(service)) {
            setData('services_ru', currentServices.filter(s => s !== service));
        } else {
            setData('services_ru', [...currentServices, service]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.clinics.store'), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Создание клиники" />
            
            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Добавить клинику Казахстана
                                </h2>
                                <Link
                                    href={route('admin.clinics.index')}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                >
                                    ← Назад к списку
                                </Link>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                {/* Название */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Название (Русский) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_ru}
                                            onChange={e => setData('name_ru', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_ru ? 'border-red-500' : ''}`}
                                            placeholder='Название клиники'
                                        />
                                        {errors.name_ru && <p className="mt-1 text-sm text-red-600">{errors.name_ru}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Название (Казахский)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_kk}
                                            onChange={e => setData('name_kk', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_kk ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name_kk && <p className="mt-1 text-sm text-red-600">{errors.name_kk}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Название (English)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_en}
                                            onChange={e => setData('name_en', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_en ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name_en && <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>}
                                    </div>
                                </div>

                                {/* Краткое описание */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Краткое описание (Русский)
                                    </label>
                                    <textarea
                                        value={data.short_desc_ru}
                                        onChange={e => setData('short_desc_ru', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.short_desc_ru ? 'border-red-500' : ''}`}
                                        rows="3"
                                        placeholder='Краткое описание клиники'
                                    />
                                    {errors.short_desc_ru && <p className="mt-1 text-sm text-red-600">{errors.short_desc_ru}</p>}
                                </div>

                                {/* Главное изображение */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Главное изображение (для карточки) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('hero', e.target.files[0])}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.hero && <p className="mt-1 text-sm text-red-600">{errors.hero}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Рекомендуемый размер: 800x600px</p>
                                </div>

                                {/* Город и адрес */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Город (Русский)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city_ru}
                                            onChange={e => setData('city_ru', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city_ru ? 'border-red-500' : ''}`}
                                            placeholder='г. Астана'
                                        />
                                        {errors.city_ru && <p className="mt-1 text-sm text-red-600">{errors.city_ru}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Адрес (Русский)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address_ru}
                                            onChange={e => setData('address_ru', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address_ru ? 'border-red-500' : ''}`}
                                            placeholder='ул. Пример, д. 1'
                                        />
                                        {errors.address_ru && <p className="mt-1 text-sm text-red-600">{errors.address_ru}</p>}
                                    </div>
                                </div>

                                {/* Контактная информация */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Телефон
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                                            placeholder='+7 (XXX) XXX-XX-XX'
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                                            placeholder='info@clinic.kz'
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Сайт
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={e => setData('website', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.website ? 'border-red-500' : ''}`}
                                            placeholder='https://clinic.kz'
                                        />
                                        {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                                    </div>
                                </div>

                                {/* Услуги */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Услуги (можно выбрать несколько)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border rounded-md">
                                        {commonServices.map((service) => (
                                            <label key={service} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.services_ru?.includes(service) || false}
                                                    onChange={() => handleServiceToggle(service)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{service}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.services_ru && <p className="mt-1 text-sm text-red-600">{errors.services_ru}</p>}
                                </div>

                                {/* Флаги */}
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={e => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Опубликована</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_medical_tourism}
                                            onChange={e => setData('is_medical_tourism', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Медицинский туризм</span>
                                    </label>
                                </div>

                                {/* Прогресс загрузки */}
                                {progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )}

                                {/* Кнопки */}
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <Link
                                        href={route('admin.clinics.index')}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Отмена
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Сохранение...' : 'Создать клинику'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ClinicCreate.layout = page => <AdminLayout title="Создание клиники">{page}</AdminLayout>;


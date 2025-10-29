import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function YouthHealthCenterCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        organization: '',
        address: '',
        region: '',
        latitude: '',
        longitude: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.youth-health-centers.store'));
    };

    return (
        <>
            <Head title="Создание МЦЗ" />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Создание нового МЦЗ
                                </h2>
                                <Link
                                    href={route('admin.youth-health-centers.index')}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                >
                                    ← Назад к списку
                                </Link>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Название */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Название МЦЗ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                                        placeholder='Молодежный центр здоровья «Саулық»'
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                
                                {/* Организация */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Организация <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.organization}
                                        onChange={e => setData('organization', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.organization ? 'border-red-500' : ''}`}
                                        placeholder='ГКП на ПХВ «Городская поликлиника №1»'
                                    />
                                    {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
                                </div>
                                
                                {/* Регион */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Регион/Область <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.region}
                                        onChange={e => setData('region', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.region ? 'border-red-500' : ''}`}
                                        placeholder='город Алматы'
                                    />
                                    {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Примеры: Алматинская область, город Астана, Западно-Казахстанская область
                                    </p>
                                </div>
                                
                                {/* Адрес */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Адрес <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                                        rows="3"
                                        placeholder='город Алматы, Бостандыкский район, улица Торайгырова, дом 12а'
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>
                                
                                {/* Координаты */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Широта (Latitude) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0000001"
                                            value={data.latitude}
                                            onChange={e => setData('latitude', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.latitude ? 'border-red-500' : ''}`}
                                            placeholder='43.2357'
                                        />
                                        {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Диапазон: от -90 до 90
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Долгота (Longitude) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0000001"
                                            value={data.longitude}
                                            onChange={e => setData('longitude', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.longitude ? 'border-red-500' : ''}`}
                                            placeholder='76.9094'
                                        />
                                        {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Диапазон: от -180 до 180
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Активность */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Активен (отображается на карте)
                                    </label>
                                </div>
                                
                                {/* Подсказка для координат */}
                                <div className="p-4 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Подсказка:</strong> Вы можете найти координаты адреса на 
                                        <a 
                                            href="https://www.google.com/maps" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="ml-1 underline hover:text-blue-600"
                                        >
                                            Google Maps
                                        </a>
                                        , кликнув правой кнопкой мыши на нужное место и выбрав координаты.
                                    </p>
                                </div>
                                
                                {/* Кнопки */}
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <Link
                                        href={route('admin.youth-health-centers.index')}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Отмена
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Сохранение...' : 'Создать МЦЗ'}
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

YouthHealthCenterCreate.layout = page => <AdminLayout title="Создание МЦЗ">{page}</AdminLayout>;


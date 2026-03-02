import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { route } from '@/ziggy-helper';

export default function ClinicEdit({ clinic }) {
    // Получаем параметр языка из URL (по умолчанию 'ru')
    const [currentLang, setCurrentLang] = useState('ru');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang') || 'ru';
            setCurrentLang(lang);
        }
    }, []);

    const { data, setData, post, processing, errors, progress } = useForm({
        name_ru: clinic.name_ru || '',
        name_kk: clinic.name_kk || '',
        name_en: clinic.name_en || '',
        short_desc_ru: clinic.short_desc_ru || '',
        short_desc_kk: clinic.short_desc_kk || '',
        short_desc_en: clinic.short_desc_en || '',
        full_desc_ru: clinic.full_desc_ru || '',
        full_desc_kk: clinic.full_desc_kk || '',
        full_desc_en: clinic.full_desc_en || '',
        city_ru: clinic.city_ru || '',
        city_kk: clinic.city_kk || '',
        city_en: clinic.city_en || '',
        address_ru: clinic.address_ru || '',
        address_kk: clinic.address_kk || '',
        address_en: clinic.address_en || '',
        phone: clinic.phone || '',
        email: clinic.email || '',
        website: clinic.website || '',
        services_ru: clinic.services_ru || [],
        services_kk: clinic.services_kk || [],
        services_en: clinic.services_en || [],
        specialties_ru: clinic.specialties_ru || [],
        specialties_kk: clinic.specialties_kk || [],
        specialties_en: clinic.specialties_en || [],
        logo: null,
        hero: null,
        is_published: clinic.is_published || false,
        is_medical_tourism: clinic.is_medical_tourism || false,
        _method: 'PUT',
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
        post(route('admin.clinics.update', clinic.id), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Редактирование клиники: ${clinic.name_ru}`} />
            
            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Редактирование клиники
                                </h2>
                                <Link
                                    href={route('admin.clinics.index')}
                                    className="px-4 py-2 bg-gray-50/500 text-white rounded-xl hover:bg-gray-600 transition"
                                >
                                    ← Назад к списку
                                </Link>
                            </div>
                            
                            {/* Переключатель языка */}
                            <div className="mb-6 flex space-x-1 border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentLang('ru');
                                        const url = new URL(window.location);
                                        url.searchParams.set('lang', 'ru');
                                        window.history.pushState({}, '', url.pathname + url.search);
                                    }}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                                        currentLang === 'ru'
                                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                    }`}
                                >
                                    🇷🇺 Русский
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentLang('kk');
                                        const url = new URL(window.location);
                                        url.searchParams.set('lang', 'kk');
                                        window.history.pushState({}, '', url.pathname + url.search);
                                    }}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                                        currentLang === 'kk'
                                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                    }`}
                                >
                                    🇰🇿 Казахский
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentLang('en');
                                        const url = new URL(window.location);
                                        url.searchParams.set('lang', 'en');
                                        window.history.pushState({}, '', url.pathname + url.search);
                                    }}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                                        currentLang === 'en'
                                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                    }`}
                                >
                                    🇬🇧 English
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                {/* Название */}
                                {currentLang === 'ru' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Название (Русский) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_ru}
                                            onChange={e => setData('name_ru', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_ru ? 'border-red-500' : ''}`}
                                            placeholder='Название клиники'
                                        />
                                        {errors.name_ru && <p className="mt-1 text-sm text-red-600">{errors.name_ru}</p>}
                                    </div>
                                )}
                                {currentLang === 'kk' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Название (Казахский)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_kk}
                                            onChange={e => setData('name_kk', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_kk ? 'border-red-500' : ''}`}
                                            placeholder='Клиника атауы'
                                        />
                                        {errors.name_kk && <p className="mt-1 text-sm text-red-600">{errors.name_kk}</p>}
                                    </div>
                                )}
                                {currentLang === 'en' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name (English)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name_en}
                                            onChange={e => setData('name_en', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name_en ? 'border-red-500' : ''}`}
                                            placeholder='Clinic name'
                                        />
                                        {errors.name_en && <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>}
                                    </div>
                                )}

                                {/* Краткое описание */}
                                {currentLang === 'ru' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Краткое описание (Русский)
                                        </label>
                                        <textarea
                                            value={data.short_desc_ru}
                                            onChange={e => setData('short_desc_ru', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.short_desc_ru ? 'border-red-500' : ''}`}
                                            rows="3"
                                            placeholder='Краткое описание клиники'
                                        />
                                        {errors.short_desc_ru && <p className="mt-1 text-sm text-red-600">{errors.short_desc_ru}</p>}
                                    </div>
                                )}
                                {currentLang === 'kk' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Қысқаша сипаттама (Қазақша)
                                        </label>
                                        <textarea
                                            value={data.short_desc_kk}
                                            onChange={e => setData('short_desc_kk', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.short_desc_kk ? 'border-red-500' : ''}`}
                                            rows="3"
                                            placeholder='Клиниканың қысқаша сипаттамасы'
                                        />
                                        {errors.short_desc_kk && <p className="mt-1 text-sm text-red-600">{errors.short_desc_kk}</p>}
                                    </div>
                                )}
                                {currentLang === 'en' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short Description (English)
                                        </label>
                                        <textarea
                                            value={data.short_desc_en}
                                            onChange={e => setData('short_desc_en', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.short_desc_en ? 'border-red-500' : ''}`}
                                            rows="3"
                                            placeholder='Short clinic description'
                                        />
                                        {errors.short_desc_en && <p className="mt-1 text-sm text-red-600">{errors.short_desc_en}</p>}
                                    </div>
                                )}

                                {/* Изображения */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Логотип {clinic.logo_url && (
                                                <span className="text-xs text-gray-500 ml-2">(текущий загружен)</span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('logo', e.target.files[0])}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                                        {clinic.logo_url && (
                                            <div className="mt-2">
                                                <img src={clinic.logo_url} alt="Логотип" className="h-20 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Главное изображение {clinic.hero_url && (
                                                <span className="text-xs text-gray-500 ml-2">(текущее загружено)</span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('hero', e.target.files[0])}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.hero && <p className="mt-1 text-sm text-red-600">{errors.hero}</p>}
                                        {clinic.hero_url && (
                                            <div className="mt-2">
                                                <img src={clinic.hero_url} alt="Главное изображение" className="h-20 object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Город и адрес */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentLang === 'ru' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Город (Русский)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.city_ru}
                                                    onChange={e => setData('city_ru', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city_ru ? 'border-red-500' : ''}`}
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
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address_ru ? 'border-red-500' : ''}`}
                                                    placeholder='ул. Пример, д. 1'
                                                />
                                                {errors.address_ru && <p className="mt-1 text-sm text-red-600">{errors.address_ru}</p>}
                                            </div>
                                        </>
                                    )}
                                    {currentLang === 'kk' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Қала (Қазақша)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.city_kk}
                                                    onChange={e => setData('city_kk', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city_kk ? 'border-red-500' : ''}`}
                                                    placeholder='Астана қ.'
                                                />
                                                {errors.city_kk && <p className="mt-1 text-sm text-red-600">{errors.city_kk}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Мекен-жай (Қазақша)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.address_kk}
                                                    onChange={e => setData('address_kk', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address_kk ? 'border-red-500' : ''}`}
                                                    placeholder='Мысал көшесі, 1 үй'
                                                />
                                                {errors.address_kk && <p className="mt-1 text-sm text-red-600">{errors.address_kk}</p>}
                                            </div>
                                        </>
                                    )}
                                    {currentLang === 'en' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City (English)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.city_en}
                                                    onChange={e => setData('city_en', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city_en ? 'border-red-500' : ''}`}
                                                    placeholder='Astana'
                                                />
                                                {errors.city_en && <p className="mt-1 text-sm text-red-600">{errors.city_en}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address (English)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.address_en}
                                                    onChange={e => setData('address_en', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address_en ? 'border-red-500' : ''}`}
                                                    placeholder='Example St, 1'
                                                />
                                                {errors.address_en && <p className="mt-1 text-sm text-red-600">{errors.address_en}</p>}
                                            </div>
                                        </>
                                    )}
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
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
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
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
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
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.website ? 'border-red-500' : ''}`}
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border rounded-xl">
                                        {commonServices.map((service) => (
                                            <label key={service} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.services_ru?.includes(service) || false}
                                                    onChange={() => handleServiceToggle(service)}
                                                    className="rounded border-gray-200 text-blue-600 shadow-sm focus:ring-blue-500"
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
                                            className="rounded border-gray-200 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Опубликована</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_medical_tourism}
                                            onChange={e => setData('is_medical_tourism', e.target.checked)}
                                            className="rounded border-gray-200 text-blue-600 shadow-sm focus:ring-blue-500"
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
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
                                    >
                                        Отмена
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Сохранение...' : 'Сохранить изменения'}
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

ClinicEdit.layout = page => <AdminLayout title="Редактирование клиники">{page}</AdminLayout>;


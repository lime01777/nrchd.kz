import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import DropdownLanguageSwitcher from '@/Components/DropdownLanguageSwitcher';

export default function TestLanguageSwitch() {
    const { locale, translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    return (
        <>
            <Head title="Тест переключения языков" />
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Тест переключения языков
                                </h1>
                                <DropdownLanguageSwitcher />
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4">Текущая информация:</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p><strong>Текущий язык:</strong> {locale}</p>
                                    <p><strong>Всего переводов:</strong> {Object.keys(translations || {}).length}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4">Тестовые переводы:</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium mb-2">Основные элементы:</h3>
                                        <p><strong>Домой:</strong> {t('home', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>О нас:</strong> {t('about', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Новости:</strong> {t('news', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Услуги:</strong> {t('services', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Направления:</strong> {t('directions', 'НЕ НАЙДЕНО')}</p>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="font-medium mb-2">Header элементы:</h3>
                                        <p><strong>О центре:</strong> {t('about.center', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Филиалы:</strong> {t('branches', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Вакансии:</strong> {t('vacancies', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Контактная информация:</strong> {t('about.contact_info', 'НЕ НАЙДЕНО')}</p>
                                        <p><strong>Партнеры:</strong> {t('about.partners', 'НЕ НАЙДЕНО')}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4">Филиалы (первые 5):</h2>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p><strong>Астана:</strong> {t('branchesSubLinks.astana', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Алматы:</strong> {t('branchesSubLinks.almaty', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Абайская область:</strong> {t('branchesSubLinks.abay', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Акмолинская область:</strong> {t('branchesSubLinks.akmola', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Актюбинская область:</strong> {t('branchesSubLinks.aktobe', 'НЕ НАЙДЕНО')}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4">Направления (первые 5):</h2>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p><strong>Медицинское образование:</strong> {t('directionsSubLinks.medical_education', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Кадровые ресурсы:</strong> {t('directionsSubLinks.human_resources', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Электронное здравоохранение:</strong> {t('directionsSubLinks.electronic_health', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Аккредитация:</strong> {t('directionsSubLinks.medical_accreditation', 'НЕ НАЙДЕНО')}</p>
                                    <p><strong>Оценка технологий:</strong> {t('directionsSubLinks.health_rate', 'НЕ НАЙДЕНО')}</p>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-gray-600">
                                    Переключите язык с помощью выпадающего списка выше и посмотрите, как изменяются переводы
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

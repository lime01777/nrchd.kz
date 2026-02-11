import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import translationService from '@/Services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

// Справочники (Enums) - копируем из HealthTechnologyRegistry.jsx для консистентности
const dictTypes = {
    digital: 'Цифровая',
    ai_software: 'ИИ/ПО',
    medical_device: 'Медицинское изделие',
    biomedical: 'Клеточная/биомедицинская',
    drug: 'Лекарственная',
    organizational: 'Организационная',
    combined: 'Комбинированная'
};

const dictStatus = {
    project: { label: 'Проект', color: 'bg-gray-100 text-gray-800' },
    pilot: { label: 'На пилоте', color: 'bg-blue-100 text-blue-800' },
    implementation: { label: 'На стадии внедрения', color: 'bg-green-100 text-green-800' },
    scaling: { label: 'Масштабирование', color: 'bg-purple-100 text-purple-800' },
    suspended: { label: 'Приостановлено', color: 'bg-yellow-100 text-yellow-800' },
    archive: { label: 'Архив', color: 'bg-red-100 text-red-800' }
};

const dictDirections = {
    ai: 'ИИ',
    telemedicine: 'Телемедицина',
    teleradiology: 'Телерадиология',
    oncology: 'Онкология',
    diagnostics: 'Диагностика',
    lab: 'Лаборатория',
    rehab: 'Реабилитация',
    biotech: 'Биотехнологии',
    cardiology: 'Кардиология',
    ophthalmology: 'Офтальмология'
};

const dictAutonomy = {
    low: 'Низкая автономность',
    medium: 'Средняя автономность',
    high: 'Высокая автономность'
};

/**
 * Детальная страница технологии из реестра (RTZ)
 */
export default function RegistryDetail({ item }) {
    const [activeTab, setActiveTab] = useState('general'); // general, details, documents

    if (!item) {
        return (
            <Layout>
                <Head title="Технология не найдена" />
                <div className="container mx-auto px-5 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Технология не найдена</h2>
                        <Link
                            href={route('electronic.health')}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Вернуться к перечню
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const statusConfig = dictStatus[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' };

    // Парсим JSON поля, если они пришли строкой (хотя Laravel usually casts array, но на всякий случай)
    const directions = Array.isArray(item.directions) ? item.directions : (JSON.parse(item.directions || '[]'));
    const appOrgs = Array.isArray(item.app_orgs) ? item.app_orgs : (JSON.parse(item.app_orgs || '[]'));
    const documents = Array.isArray(item.documents) ? item.documents : (JSON.parse(item.documents || '[]'));
    const publications = Array.isArray(item.publications) ? item.publications : (JSON.parse(item.publications || '[]'));

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    // Detail Row Component
    const DetailRow = ({ label, value }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50 transition-colors px-2">
            <div className="font-semibold text-gray-700 md:col-span-1">{label}</div>
            <div className="text-gray-900 md:col-span-2 break-words">{value || <span className="text-gray-400 italic">Не указано</span>}</div>
        </div>
    );

    return (
        <Layout>
            <Head title={`${item.name || 'Технология'} - Перечень технологий здравоохранения`} />

            {/* Hero Header */}
            <div className="relative w-full min-h-[400px] mb-8" style={{ marginTop: '96px' }}>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"
                    style={{
                        backgroundImage: item.logo_url ? `url(${item.logo_url})` : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-5 py-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig.color.replace('bg-', 'bg-opacity-90 bg-').replace('text-', 'text-black ')}`}>
                                {statusConfig.label}
                            </span>
                            <span className="font-mono bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white border-opacity-30">
                                {item.registry_code}
                            </span>
                            <span className="bg-blue-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                {dictTypes[item.type] || item.type}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {item.name}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-8 text-white text-opacity-90">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span>Разработчик: <strong>{item.developer || 'Не указан'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                <span>Инициатор: <strong>{item.initiator || 'Не указан'}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-5 pb-16">

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'general'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Общая информация
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Детали и классификация
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'documents'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Документы ({documents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('publications')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'publications'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Публикации ({publications.length})
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

                    {/* Tab: General */}
                    {activeTab === 'general' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Описание технологии</h3>
                                <div className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    {item.description || 'Описание отсутствует.'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Жизненный цикл</h3>
                                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                                        <DetailRow label="ID записи" value={item.id} />
                                        <DetailRow label="Реестровый код" value={item.registry_code} />
                                        <DetailRow label="Дата валидации" value={formatDate(item.validation_date)} />
                                        <DetailRow label="Дата ревалидации" value={formatDate(item.revalidation_date)} />
                                        <DetailRow label="Дата пилотирования" value={formatDate(item.piloting_date)} />
                                        <DetailRow label="Дата изменения статуса" value={formatDate(item.status_date)} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Участники и Локация</h3>
                                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                                        <DetailRow label="Организация пилотирования" value={item.pilot_org} />
                                        <DetailRow label="Организации внедрения" value={appOrgs.join(', ')} />
                                        <DetailRow label="Регион" value={item.region} />
                                    </div>
                                </div>
                            </div>

                            {directions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Направления применения</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {directions.map(d => (
                                            <span key={d} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                                {dictDirections[d] || d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Details */}
                    {activeTab === 'details' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-purple-500 pl-3">Классификация и Кодировка</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <DetailRow label="Класс А (Природа ИИ)" value={item.code_a ? `${item.code_a} (см. справочник)` : null} />
                                    <DetailRow label="Класс B (Функция)" value={item.code_b ? `${item.code_b} (см. справочник)` : null} />
                                    <DetailRow label="Класс C (Уровень здрав.)" value={item.code_c ? `${item.code_c} (см. справочник)` : null} />
                                    <DetailRow label="Класс D (Интеграция)" value={item.code_d ? `${item.code_d} (см. справочник)` : null} />
                                    <DetailRow label="Класс E (Обучаемость)" value={item.code_e ? `${item.code_e} (см. справочник)` : null} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Оценка рисков и зрелости</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                        <h4 className="font-bold text-orange-800 mb-2">Уровень риска</h4>
                                        <div className="text-3xl font-bold text-orange-600 mb-2">{item.risk_level || '-'}</div>
                                        <p className="text-sm text-orange-700 opacity-80">Классификация риска применения технологии в клинической практике.</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h4 className="font-bold text-blue-800 mb-2">Уровень автономии</h4>
                                        <div className="text-xl font-bold text-blue-600 mb-2">{dictAutonomy[item.autonomy_level] || item.autonomy_level || '-'}</div>
                                        <p className="text-sm text-blue-700 opacity-80">Степень самостоятельности системы в принятии решений.</p>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                        <h4 className="font-bold text-green-800 mb-2">Уровень TRL</h4>
                                        <div className="text-3xl font-bold text-green-600 mb-2">{item.trl || '-'}</div>
                                        <p className="text-sm text-green-700 opacity-80">Technology Readiness Level - уровень технологической готовности.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Documents */}
                    {activeTab === 'documents' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-gray-500 pl-3">Прикрепленные документы</h3>
                            {documents.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-white p-2 rounded border border-gray-200 text-gray-500">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">{doc.name || `Документ ${idx + 1}`}</div>
                                                    <div className="text-xs text-gray-500">{doc.size || 'Размер не указан'}</div>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url ? (doc.url.startsWith('/') ? doc.url : `/storage/${doc.url}`) : '#'}
                                                download
                                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 font-medium transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Скачать
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <p className="text-gray-500">Документы отсутствуют</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Publications */}
                    {activeTab === 'publications' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">Публикации</h3>
                            {publications.length > 0 ? (
                                <div className="space-y-4">
                                    {publications.map((pub, idx) => {
                                        const title = typeof pub === 'string' ? pub : (pub.title || pub.name || 'Публикация');
                                        const url = typeof pub === 'object' ? pub.url : null;
                                        const date = typeof pub === 'object' ? pub.date : null;
                                        const source = typeof pub === 'object' ? pub.source : null;
                                        const description = typeof pub === 'object' ? pub.description : null;

                                        return (
                                            <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                {url ? (
                                                    <h4 className="font-medium text-blue-800 mb-2 hover:underline">
                                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                                            {title}
                                                        </a>
                                                    </h4>
                                                ) : (
                                                    <h4 className="font-medium text-gray-800 mb-2">
                                                        {title}
                                                    </h4>
                                                )}

                                                {description && (
                                                    <p className="text-sm text-gray-600 mb-2">{description}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    {date && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            {formatDate(date)}
                                                        </span>
                                                    )}
                                                    {source && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                                            {source}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                    <p className="text-gray-500">Публикации отсутствуют</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}

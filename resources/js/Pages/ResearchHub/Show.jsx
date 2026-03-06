import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/Services/TranslationService';

export default function Show({ research, locale }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguage());

    const t = (key, fallback = '') => translationService.t(key, fallback);

    useEffect(() => {
        const handleLanguageChange = (e) => setCurrentLanguage(e.detail.language);
        window.addEventListener('languageChanged', handleLanguageChange);
        return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    const tabs = [
        { id: 'overview', label: t('research.tabs.overview', 'Обзор') },
        { id: 'indicators', label: t('research.tabs.indicators', 'Показатели') },
        { id: 'dashboards', label: t('research.tabs.dashboards', 'Дашборды') },
        { id: 'files', label: t('research.tabs.files', 'Файлы') },
        { id: 'infographics', label: t('research.tabs.infographics', 'Инфографика') },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`${research.title} - Research Hub`} />

            {/* Intro section minimal info */}
            <section className="bg-white border-b border-gray-200 print:hidden">
                <div className="container mx-auto px-5 pt-10 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <Link href={route('research_hub.index')} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4 inline-block">&larr; В реестр исследований</Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{research.title}</h1>
                        </div>
                        {research.period && (
                            <div className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-lg font-bold shadow-sm whitespace-nowrap">
                                {research.period}
                            </div>
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-t-2xl font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-12 bg-gray-50 min-h-[60vh] print:py-0 print:bg-white">
                <div className="container mx-auto px-5">

                    {/* Tab 1: Overview */}
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 max-w-4xl">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-blue-600 pl-4">Обзор исследования</h2>

                            <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
                                {research.description && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Описание</h3>
                                        <p>{research.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl">
                                    {research.sample && (
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Выборка</h4>
                                            <p className="font-medium">{research.sample}</p>
                                        </div>
                                    )}
                                    {research.geography && (
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">География</h4>
                                            <p className="font-medium">{research.geography}</p>
                                        </div>
                                    )}
                                    {research.methodology && (
                                        <div className="md:col-span-2">
                                            <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Методология</h4>
                                            <p>{research.methodology}</p>
                                        </div>
                                    )}
                                </div>

                                {research.citation_rules && (
                                    <div className="border-t border-gray-200 pt-8 mt-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Правила цитирования</h3>
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-blue-900 font-mono text-sm">
                                            {research.citation_rules}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Indicators */}
                    {activeTab === 'indicators' && (
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-emerald-500 pl-4">Каталог показателей</h2>

                            {research.indicators && research.indicators.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {research.indicators.map((indicator, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-emerald-700">{indicator.name}</h3>
                                            <p className="text-gray-600">{indicator.definition}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Показатели пока не добавлены.</p>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Dashboards */}
                    {activeTab === 'dashboards' && (
                        <div className="space-y-12">
                            {research.dashboards && research.dashboards.length > 0 ? (
                                research.dashboards.map((dash, idx) => (
                                    <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-100">
                                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{dash.title}</h2>
                                        {dash.description && <p className="text-gray-600 mb-6">{dash.description}</p>}
                                        <div className="w-full bg-gray-100 rounded-xl max-w-full overflow-hidden flex items-center justify-center min-h-[400px] border border-gray-200">
                                            {dash.embed_url ? (
                                                <iframe src={dash.embed_url} width="100%" height="600" frameBorder="0" allowFullScreen></iframe>
                                            ) : (
                                                <div className="text-center p-10">
                                                    <span className="text-5xl border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-gray-400">📊</span>
                                                    <p className="font-semibold text-gray-500">Визуализация: {dash.type}</p>
                                                    <p className="text-sm text-gray-400">URL дашборда не указан.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
                                    <p className="text-gray-500">Дашборды пока не добавлены.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 4: Files */}
                    {activeTab === 'files' && (
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-purple-500 pl-4">Материалы и файлы</h2>

                            {research.files && research.files.length > 0 ? (
                                <div className="space-y-4">
                                    {research.files.map((file, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:bg-purple-50 transition-colors">
                                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold">
                                                    {file.file_type ? file.file_type.toUpperCase() : 'FILE'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{file.title}</h4>
                                                    <span className="text-xs font-semibold uppercase text-purple-500 tracking-wider">
                                                        {file.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <a
                                                href={`/storage/${file.file_path}`}
                                                target="_blank"
                                                download
                                                className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-600 transition-colors inline-block text-center"
                                            >
                                                Скачать
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Файлы пока не добавлены.</p>
                            )}
                        </div>
                    )}

                    {/* Tab 5: Infographics */}
                    {activeTab === 'infographics' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Материалы для коммуникаций</h2>
                                    <p className="text-gray-600">Готовые карточки и слайды для соцсетей, презентаций и печати.</p>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
                                >
                                    📥 Сохранить PDF
                                </button>
                            </div>

                            {/* Infographics Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:w-full">
                                {research.infographics && research.infographics.length > 0 ? (
                                    research.infographics.map((info, idx) => (
                                        <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 print:mb-12 print:break-inside-avoid">

                                            {/* Image / Card visual representation if no image is uploaded - acting as template generator */}
                                            {info.image_path ? (
                                                <div className="aspect-[4/3] w-full bg-gray-200">
                                                    <img src={`/storage/${info.image_path}`} alt={info.title} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-900 to-indigo-800 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                                                    {/* Decorative circles */}
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

                                                    <div className="relative z-10 flex justify-between items-start">
                                                        <div className="font-bold text-2xl tracking-tighter opacity-90">
                                                            {info.attributes?.brand || 'NRCHD'}
                                                        </div>
                                                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                            {info.attributes?.period || research.period}
                                                        </div>
                                                    </div>

                                                    <div className="relative z-10 my-auto py-6">
                                                        <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{info.title}</h3>
                                                        <p className="text-blue-100 text-lg opacity-90 border-l-4 border-blue-400 pl-4 py-1">
                                                            Ключевой вывод исследования
                                                        </p>
                                                    </div>

                                                    <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-4 mt-4">
                                                        <div className="text-xs opacity-75 max-w-[60%]">
                                                            {info.attributes?.disclaimers || 'Данные основаны на результатах национального исследования.'}
                                                        </div>
                                                        <div className="text-xs font-semibold tracking-wider uppercase opacity-90">
                                                            Источник: {info.attributes?.source || research.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6 bg-white print:hidden">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-gray-900">{info.title}</h4>
                                                    <div className="flex gap-2">
                                                        {info.image_path && (
                                                            <a href={`/storage/${info.image_path}`} download className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Скачать Image">
                                                                🖼️
                                                            </a>
                                                        )}
                                                        {info.pdf_path && (
                                                            <a href={`/storage/${info.pdf_path}`} download className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Скачать PDF">
                                                                📄
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
                                        <p className="text-gray-500">Визуальные материалы пока не добавлены.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}

// Wrap with standard layout, hiding breadcrumbs or using minimal layout if requested.
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

Show.layout = (page) => (
    <LayoutFolderChlank
        h1={translationService.t('researchHub.title', 'Research Hub')}
        parentRoute={route('research_hub.index')}
        parentName={translationService.t('researchHub.title', 'Research Hub')}
        heroBgColor="bg-blue-200"
        heroColorSec="bg-blue-300"
        buttonBgColor="bg-blue-100"
        buttonHoverBgColor="hover:bg-blue-200"
        buttonBorderColor="border-blue-300"
        bgColor="bg-white"
        breadcrumbs={[
            { name: translationService.t('nav.directions', 'Направления'), route: 'directions' },
            { name: translationService.t('directions.center_prevention', 'Центр профилактики'), route: 'direction.center_prevention' },
            { name: 'Research Hub', route: 'research_hub.index' },
            { name: page.props.research?.title || 'Исследование', route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);

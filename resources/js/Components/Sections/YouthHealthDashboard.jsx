import React, { useState, useEffect } from 'react';
import {
    YouthTrainingChart,
    YouthStaffingNormativeChart,
    YouthGenderChart,
    YouthSpecialistStructureChart,
    YouthMediaActivityChart,
    YouthVideoRotationChart,
    YouthIomDistributionChart,
    YouthTargetReachChart
} from '@/Components/YouthHealthCharts';
import translationService from '@/Services/TranslationService';
import Modal from '@/Components/UI/Modal';

export default function YouthHealthDashboard() {
    const [currentLanguage, setCurrentLanguage] = useState(translationService.currentLanguage);
    const t = (key, fallback = '') => translationService.t(key, fallback);

    useEffect(() => {
        const handleLanguageChange = (e) => {
            setCurrentLanguage(e.detail.language);
        };
        window.addEventListener('languageChanged', handleLanguageChange);
        return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    const categories = [
        { id: 'staffing', title: t('sections.youthHealth.categories.staffing', 'Кадры и Обучение'), icon: '👥' },
        { id: 'audience', title: t('sections.youthHealth.categories.audience', 'Аудитория и Обращаемость'), icon: '📈' },
        { id: 'media', title: t('sections.youthHealth.categories.media', 'СМИ и Коммуникации'), icon: '📱' }
    ];

    const reports = [
        { id: 'training', category: 'staffing', title: t('sections.youthHealth.reports.training', 'Уровень обучения специалистов') },
        { id: 'staffingNormative', category: 'staffing', title: t('sections.youthHealth.reports.staffingNormative', 'Дефицит штата vs Норматив') },
        { id: 'specialistStructure', category: 'audience', title: t('sections.youthHealth.reports.specialistStructure', 'Структура обращений (Психологи)') },
        { id: 'genderAccess', category: 'audience', title: t('sections.youthHealth.reports.genderAccess', 'Распределение по полу') },
        { id: 'targetReach', category: 'audience', title: t('sections.youthHealth.reports.targetReach', 'Охват по форматам мероприятий') },
        { id: 'mediaActivity', category: 'media', title: t('sections.youthHealth.reports.mediaActivity', 'Активность в ТВ/Радио/Пресса') },
        { id: 'videoRotation', category: 'media', title: t('sections.youthHealth.reports.videoRotation', 'Ротация роликов и Интернет') },
        { id: 'iomDistribution', category: 'media', title: t('sections.youthHealth.reports.iomDistribution', 'Распределение печатных ИОМ') }
    ];

    const [activeReport, setActiveReport] = useState(reports[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderChart = (chartId) => {
        const wrapper = (component) => <div className="h-[500px] w-full">{component}</div>;
        switch (chartId) {
            case 'training': return wrapper(<YouthTrainingChart t={t} />);
            case 'staffingNormative': return wrapper(<YouthStaffingNormativeChart t={t} />);
            case 'genderAccess': return wrapper(<YouthGenderChart t={t} />);
            case 'specialistStructure': return wrapper(<YouthSpecialistStructureChart t={t} />);
            case 'mediaActivity': return wrapper(<YouthMediaActivityChart t={t} />);
            case 'videoRotation': return wrapper(<YouthVideoRotationChart t={t} />);
            case 'iomDistribution': return wrapper(<YouthIomDistributionChart t={t} />);
            case 'targetReach': return wrapper(<YouthTargetReachChart t={t} />);
            default: return wrapper(<YouthTrainingChart t={t} />);
        }
    };

    return (
        <section className="text-gray-600 body-font py-12 bg-gray-50 rounded-[3rem] overflow-hidden shadow-inner mt-12 border border-blue-50">
            <div className="container px-5 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{t('sections.youthHealth.title', 'Статистика и аналитика МЦЗ')}</h2>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500 font-medium italic">
                        {t('sections.youthHealth.subtitle', 'Нажмите на область графика, чтобы выбрать другой отчет из библиотеки данных.')}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group min-h-[500px] flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                    {activeReport.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                        {categories.find(c => c.id === activeReport.category)?.title}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsLibraryOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-200 active:scale-95 group"
                        >
                            <span className="font-bold">{t('sections.youthHealth.changeReport', 'Выбрать другой отчет')}</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-grow flex items-center justify-center relative cursor-pointer" onClick={() => setIsLibraryOpen(true)}>
                        <div className="w-full">
                            {renderChart(activeReport.id)}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} maxWidth="4xl">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">{t('sections.youthHealth.modal.title', 'Библиотека отчетов')}</h2>
                            <p className="text-gray-500 mt-1">{t('sections.youthHealth.modal.subtitle', 'Выберите показатель для отображения на дашборде')}</p>
                        </div>
                        <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder={t('sections.youthHealth.modal.searchPlaceholder', 'Найти нужный показатель...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map(category => {
                            const categoryReports = filteredReports.filter(r => r.category === category.id);
                            if (categoryReports.length === 0) return null;

                            return (
                                <div key={category.id} className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <span className="text-xl">{category.icon}</span>
                                        <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">{category.title}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {categoryReports.map(report => (
                                            <button
                                                key={report.id}
                                                onClick={() => {
                                                    setActiveReport(report);
                                                    setIsLibraryOpen(false);
                                                }}
                                                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 ${activeReport.id === report.id
                                                        ? 'bg-blue-50 border-blue-500 translate-x-1 outline-none'
                                                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                                    }`}
                                            >
                                                <span className={`text-sm font-bold leading-tight block ${activeReport.id === report.id ? 'text-blue-700' : 'text-gray-700'
                                                    }`}>
                                                    {report.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </section>
    );
}

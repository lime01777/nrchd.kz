import React, { useState } from 'react';
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

export default function YouthHealthDashboard() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChart, setSelectedChart] = useState('training');

    const chartCategories = [
        {
            id: 'staffing',
            name: 'Кадры и Обучение',
            reports: [
                { id: 'training', name: 'Уровень обучения специалистов', type: 'chart' },
                { id: 'staffingNormative', name: 'Дефицит штата vs Норматив', type: 'chart' },
            ]
        },
        {
            id: 'audience',
            name: 'Аудитория и Обращаемость',
            reports: [
                { id: 'specialistStructure', name: 'Структура обращений (Психологи)', type: 'chart' },
                { id: 'genderAccess', name: 'Распределение по полу', type: 'chart' },
                { id: 'targetReach', name: 'Охват по форматам мероприятий', type: 'chart' },
            ]
        },
        {
            id: 'media',
            name: 'СМИ и Коммуникации',
            reports: [
                { id: 'mediaActivity', name: 'Активность в ТВ/Радио/Пресса', type: 'chart' },
                { id: 'videoRotation', name: 'Ротация роликов и Интернет', type: 'chart' },
                { id: 'iomDistribution', name: 'Распределение печатных ИОМ', type: 'chart' },
            ]
        }
    ];

    const filteredCategories = chartCategories.map(category => ({
        ...category,
        reports: category.reports.filter(report =>
            report.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.reports.length > 0);

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

    const getSelectedReportName = () => {
        for (const cat of chartCategories) {
            const report = cat.reports.find(r => r.id === selectedChart);
            if (report) return report.name;
        }
        return '';
    };

    return (
        <section className="text-gray-600 body-font py-12 bg-gray-50 rounded-[3rem] overflow-hidden shadow-inner mt-12 border border-blue-50">
            <div className="container px-5 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Статистика и аналитика МЦЗ</h2>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-gray-500">
                        Нажмите на область графика, чтобы выбрать другой отчет из библиотеки данных.
                    </p>
                </div>

                <div className="w-full max-w-6xl mx-auto">
                    <div
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer border border-gray-100 group relative"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {/* Бейдж выбранного отчета */}
                        <div className="absolute top-8 left-10 flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">
                                {getSelectedReportName()}
                            </h3>
                        </div>

                        {/* Индикатор смены графика */}
                        <div className="absolute top-8 right-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Выбрать другой отчет</span>
                        </div>

                        <div className="mt-12">
                            {renderChart(selectedChart)}
                        </div>
                    </div>
                </div>

                {/* Модальное окно (Библиотека отчетов) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/20">
                            <div className="p-8 md:p-10 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Библиотека отчетов</h2>
                                        <p className="text-gray-400 mt-1 font-semibold">Выберите показатель для отображения на дашборде</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all text-gray-300 hover:text-gray-600"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Найти нужный показатель..."
                                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-blue-500 focus:ring-0 outline-none transition-all text-gray-700 shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="w-6 h-6 text-gray-300 absolute left-6 top-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-grow p-8 md:p-10 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredCategories.map((category) => (
                                        <div key={category.id} className="space-y-6">
                                            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                {category.name}
                                            </h3>
                                            <div className="flex flex-col gap-2">
                                                {category.reports.map((report) => (
                                                    <button
                                                        key={report.id}
                                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left group ${selectedChart === report.id
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50'
                                                            : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedChart(report.id);
                                                            setIsModalOpen(false);
                                                        }}
                                                    >
                                                        <span className="font-bold text-sm leading-tight">{report.name}</span>
                                                        <div className={`p-1.5 rounded-lg transition-colors ${selectedChart === report.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-200 group-hover:text-blue-400'}`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

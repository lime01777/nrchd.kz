import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// --- 1. Кадры и Обучение ---
export const YouthTrainingChart = ({ t }) => {
    const data = {
        labels: ['Кызылординская', 'Алматинская', 'Улытау', 'Костанайская', 'Абай', 'Атырауская', 'Алматы', 'СКО', 'Павлодарская', 'Астана', 'Карагандинская', 'Мангистауская', 'ВКО', 'Акмолинская', 'Туркестанская', 'Жамбылская', 'ЗКО', 'Актюбинская', 'Шымкент (26.3%)', 'Жетису (7.1%)'],
        datasets: [{
            label: t('sections.youthHealth.charts.training', 'Обучено специалистов (%)'),
            data: [97, 85.7, 83.3, 83.3, 73.9, 70.9, 69.9, 63.6, 60, 57.2, 55.1, 50.6, 43.8, 43.75, 40.7, 40.4, 34.1, 33.3, 26.3, 7.1],
            backgroundColor: (ctx) => {
                const val = ctx.dataset.data[ctx.dataIndex];
                return val < 30 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(99, 102, 241, 0.7)';
            }
        }]
    };
    return <Bar data={data} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `${t('sections.youthHealth.reports.training', 'Уровень обучения специалистов')} (${t('sections.youthHealth.charts.average', 'Средний')}: 49.4%)` } } }} />;
};

export const YouthStaffingNormativeChart = ({ t }) => {
    const data = {
        labels: ['ЗКО', 'Улытау', 'Караганда', 'Акмола', 'Астана', 'ВКО', 'Жамбыл', 'Туркестан', 'Алматинская', 'Актюбинск', 'Павлодар', 'Алматы', 'Мангистау', 'Шымкент', 'Абай', 'СКО', 'Костанай', 'Жетису', 'Атырау', 'Кызылорда'],
        datasets: [
            { label: t('sections.youthHealth.charts.fact', 'Факт'), data: [14.5, 16.5, 28.8, 12, 67, 38, 52.2, 20, 7, 29.8, 22.5, 106.8, 30.5, 83, 38, 11, 12, 14, 28, 33], backgroundColor: '#3b82f6' },
            { label: t('sections.youthHealth.charts.normative', 'Норматив'), data: [44, 33, 55, 22, 121, 66, 88, 33, 11, 44, 33, 154, 44, 99, 44, 11, 12, 11, 22, 11], backgroundColor: '#e5e7eb' }
        ]
    };
    return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: t('sections.youthHealth.reports.staffingNormative', 'Дефицит штата vs Норматив') } } }} />;
};

// --- 2. Обращаемость и Аудитория ---
export const YouthGenderChart = ({ t }) => {
    const data = {
        labels: [`${t('sections.youthHealth.charts.gender.female', 'Женщины')} (56.3%)`, `${t('sections.youthHealth.charts.gender.male', 'Мужчины')} (43.6%)`],
        datasets: [{
            data: [474554, 353678],
            backgroundColor: ['rgba(236, 72, 153, 0.7)', 'rgba(59, 130, 246, 0.7)'],
        }]
    };
    return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: t('sections.youthHealth.reports.genderAccess', 'Распределение по полу') } } }} />;
};

export const YouthSpecialistStructureChart = ({ t }) => {
    const data = {
        labels: ['Психолог (31.5%)', 'Терапевт', 'Гинеколог', 'Уролог', 'Дерматолог', 'Педиатр', 'Другие', 'Соц. работник', 'Медсестра', 'Юрист'],
        datasets: [{
            label: t('sections.youthHealth.charts.visits', 'Кол-во обращений (тыс.)'),
            data: [254, 151, 141, 70, 64, 53, 41, 24, 22, 4],
            backgroundColor: 'rgba(16, 185, 129, 0.7)'
        }]
    };
    return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: t('sections.youthHealth.reports.specialistStructure', 'Структура обращений (Психологи)') } } }} />;
};

// --- 3. Работа в СМИ и Коммуникации ---
export const YouthMediaActivityChart = ({ t }) => {
    const data = {
        labels: ['ТВ выступления', 'Пресс-конференции', 'Радио выступления', 'Бегущая строка'],
        datasets: [{
            label: t('sections.youthHealth.charts.media', 'Количество'),
            data: [164, 76, 26, 60],
            backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'],
        }]
    };
    return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: t('sections.youthHealth.reports.mediaActivity', 'Активность в ТВ/Радио/Пресса') } } }} />;
};

export const YouthVideoRotationChart = ({ t }) => {
    const data = {
        labels: ['Орг. ПМСП', 'Орг. образования', 'LED/Транспорт', 'Интернет-ресурсы'],
        datasets: [{
            label: t('sections.youthHealth.charts.rotation', 'Ротации / Публикации'),
            data: [73762, 21163, 2189, 21819],
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
        }]
    };
    return <Bar data={data} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: t('sections.youthHealth.reports.videoRotation', 'Ротация роликов и Интернет') } } }} />;
};

// --- 4. Информационные материалы (ИОМ) ---
export const YouthIomDistributionChart = ({ t }) => {
    const data = {
        labels: ['Листовки', 'Буклеты', 'Брошюры', 'Плакаты', 'Стенды/Выставки', 'Другое'],
        datasets: [{
            data: [132507, 85440, 66593, 2625, 1223, 10054],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'],
        }]
    };
    return <Pie data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `${t('sections.youthHealth.reports.iomDistribution', 'Распределение печатных ИОМ')} (${t('sections.youthHealth.charts.total', 'Всего')}: 298 442)` } } }} />;
};

// --- 5. Охват форматов (Рисунок 6.2) ---
export const YouthTargetReachChart = ({ t }) => {
    const data = {
        labels: ['Семинары/тренинги', 'Консультации/беседы', 'Школы здоровья', 'Дни дверей', 'Акции в масс. местах', 'Круглые столы', 'Интерактив', 'Род. собрания', 'Спорт', 'Конференции', 'Соцопросы', 'Конкурсы', 'Дебаты', 'Консилиумы'],
        datasets: [{
            label: t('sections.youthHealth.charts.reach', 'Охват (чел)'),
            data: [296018, 168382, 75904, 50783, 40872, 23668, 21966, 20492, 18256, 17142, 10050, 6005, 4263, 172],
            backgroundColor: 'rgba(79, 70, 229, 0.7)',
        }]
    };
    return <Bar data={data} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `${t('sections.youthHealth.reports.targetReach', 'Охват по форматам мероприятий')} (${t('sections.youthHealth.charts.total', 'Всего')}: 699 679)` } } }} />;
};

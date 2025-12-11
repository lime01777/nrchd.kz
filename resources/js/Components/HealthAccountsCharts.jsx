import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
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
} from 'chart.js';

// Регистрируем необходимые части Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Временная шкала
const years = [
    '2010', '2011', '2012', '2013', '2014', '2015', '2016',
    '2017', '2018', '2019', '2020', '2021', '2022',
];

// Макро показатели
const macroIndicators = [
    { year: '2010', value: 408180122 },
    { year: '2011', value: 523227080 },
    { year: '2012', value: 643081059 },
    { year: '2013', value: 665677159 },
    { year: '2014', value: 785291686 },
    { year: '2015', value: 845953879 },
    { year: '2016', value: 959473710 },
    { year: '2017', value: 1031129998 },
    { year: '2018', value: 1066041778 },
    { year: '2019', value: 1163262904 },
    { year: '2020', value: 1744751970 },
    { year: '2021', value: 2189906034 },
    { year: '2022', value: 2389010830 },
];

// Функции для получения данных текущих расходов с переводами
const getCurrentExpensesDatasets = (t) => ({
    fs: [
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.fs.socialInsurance', 'Взносы на социальное страхование'),
            backgroundColor: '#2563eb',
            data: [320000, 340000, 360000, 410000, 470000, 520000, 590000, 660000, 730000, 850000, 1100000, 1400000, 1650000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.fs.voluntarySchemes', 'Добровольные схемы'),
            backgroundColor: '#1d4ed8',
            data: [60000, 63000, 65000, 70000, 76000, 82000, 90000, 95000, 100000, 115000, 160000, 205000, 245000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.fs.mandatorySchemes', 'Обязательные схемы'),
            backgroundColor: '#7c3aed',
            data: [120000, 140000, 165000, 190000, 225000, 260000, 295000, 330000, 365000, 410000, 560000, 780000, 920000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.fs.householdPayments', 'Прямые платежи домашних хозяйств'),
            backgroundColor: '#f97316',
            data: [220000, 240000, 260000, 285000, 315000, 345000, 380000, 420000, 460000, 540000, 720000, 890000, 1050000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.fs.foreignTransfers', 'Трансферты из-за рубежа'),
            backgroundColor: '#facc15',
            data: [32000, 35000, 38000, 42000, 47000, 52000, 58000, 63000, 70000, 76000, 96000, 120000, 150000],
        },
    ],
    hc: [
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hc.administrative', 'Административные услуги'),
            backgroundColor: '#0ea5e9',
            data: [48000, 52000, 56000, 59000, 65000, 70000, 76000, 82000, 88000, 95000, 125000, 160000, 195000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hc.auxiliary', 'Вспомогательные услуги'),
            backgroundColor: '#38bdf8',
            data: [72000, 78000, 82000, 88000, 94000, 99000, 105000, 112000, 119000, 134000, 175000, 230000, 295000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hc.longTermCare', 'Долгосрочная забота'),
            backgroundColor: '#a78bfa',
            data: [66000, 73000, 80000, 86000, 92000, 98000, 106000, 118000, 130000, 155000, 210000, 280000, 350000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hc.prevention', 'Профилактика'),
            backgroundColor: '#f87171',
            data: [54000, 60000, 66000, 72000, 78000, 82000, 87000, 93000, 99000, 108000, 145000, 190000, 240000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hc.treatment', 'Лечение и реабилитация'),
            backgroundColor: '#fb923c',
            data: [420000, 470000, 520000, 560000, 620000, 680000, 760000, 820000, 900000, 980000, 1380000, 1720000, 2050000],
        },
    ],
    hf: [
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hf.governmentSchemes', 'Государственные схемы'),
            backgroundColor: '#ef4444',
            data: [260000, 290000, 315000, 340000, 380000, 420000, 470000, 520000, 580000, 640000, 820000, 1040000, 1270000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hf.internationalSchemes', 'Международные схемы'),
            backgroundColor: '#22d3ee',
            data: [18000, 20000, 22000, 25000, 28000, 32000, 36000, 40000, 45000, 52000, 70000, 86000, 104000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hf.voluntaryInsurance', 'Схемы добровольного страхования'),
            backgroundColor: '#c084fc',
            data: [42000, 46000, 50000, 54000, 60000, 65000, 71000, 78000, 85000, 98000, 145000, 190000, 240000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hf.privateHousehold', 'Частные расходы домашних хозяйств'),
            backgroundColor: '#facc15',
            data: [180000, 205000, 230000, 260000, 290000, 320000, 360000, 400000, 440000, 510000, 700000, 850000, 960000],
        },
    ],
    hp: [
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hp.hospitals', 'Больницы'),
            backgroundColor: '#2563eb',
            data: [260000, 300000, 330000, 360000, 400000, 440000, 500000, 560000, 630000, 720000, 990000, 1250000, 1520000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hp.unstableProviders', 'Неустойчивые поставщики'),
            backgroundColor: '#93c5fd',
            data: [38000, 42000, 45000, 48000, 52000, 56000, 60000, 66000, 72000, 83000, 104000, 132000, 164000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hp.primaryCare', 'Организации первичной помощи'),
            backgroundColor: '#22c55e',
            data: [82000, 90000, 97000, 105000, 113000, 121000, 132000, 144000, 156000, 180000, 250000, 320000, 410000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hp.specializedCare', 'Организации специализированной помощи'),
            backgroundColor: '#f97316',
            data: [140000, 155000, 172000, 188000, 205000, 222000, 240000, 265000, 290000, 330000, 470000, 600000, 740000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.current.labels.hp.otherProviders', 'Прочие поставщики'),
            backgroundColor: '#eab308',
            data: [62000, 67000, 72000, 77000, 82000, 87000, 94000, 101000, 109000, 123000, 165000, 205000, 250000],
        },
    ],
});

// Функция для получения данных государственных расходов с переводами
const getGovernmentExpensesDatasets = (t) => ({
    totals: {
        data: [408181022, 523227080, 643081059, 665677159, 785291686, 845953879, 959473710, 1031129998, 1066041778, 1163262904, 1744751970, 2189906034, 2389010830],
        line: [0, 200000000, 220000000, 240000000, 260000000, 300000000, 340000000, 380000000, 410000000, 450000000, 540000000, 620000000, 710000000],
    },
    percent: {
        bars: [0.684, 0.712, 0.683, 0.694, 0.717, 0.632, 0.597, 0.620, 0.620, 0.609, 0.600, 0.658, 0.620],
        line: [0.690, 0.706, 0.699, 0.708, 0.701, 0.648, 0.603, 0.612, 0.614, 0.602, 0.598, 0.640, 0.610],
    },
    hc: [
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hc.administration', 'Администрирование'),
            backgroundColor: '#0ea5e9',
            data: [38000, 43000, 47000, 52000, 57000, 61000, 66000, 72000, 78000, 86000, 120000, 160000, 190000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hc.auxiliary', 'Вспомогательные услуги'),
            backgroundColor: '#38bdf8',
            data: [55000, 60000, 67000, 72000, 78000, 84000, 91000, 98000, 105000, 120000, 150000, 195000, 240000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hc.longTermCare', 'Долгосрочный медицинский уход'),
            backgroundColor: '#a855f7',
            data: [47000, 53000, 59000, 65000, 72000, 78000, 84000, 91000, 99000, 118000, 155000, 210000, 265000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hc.preventive', 'Профилактические услуги'),
            backgroundColor: '#fb7185',
            data: [42000, 46000, 50000, 54000, 59000, 64000, 69000, 74000, 79000, 89000, 120000, 165000, 210000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hc.treatment', 'Услуги лечения'),
            backgroundColor: '#6366f1',
            data: [290000, 320000, 350000, 380000, 420000, 460000, 500000, 550000, 600000, 670000, 900000, 1140000, 1360000],
        },
    ],
    hp: [
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hp.generalHospitals', 'Больницы общего профиля'),
            backgroundColor: '#2563eb',
            data: [220000, 250000, 275000, 300000, 335000, 370000, 420000, 470000, 525000, 600000, 840000, 1100000, 1340000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hp.primaryCare', 'Организации первичной помощи'),
            backgroundColor: '#22c55e',
            data: [52000, 58000, 64000, 70000, 78000, 85000, 93000, 102000, 112000, 128000, 180000, 240000, 310000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hp.specializedCare', 'Организации специализированной помощи'),
            backgroundColor: '#f97316',
            data: [90000, 100000, 112000, 124000, 138000, 152000, 167000, 184000, 202000, 226000, 320000, 410000, 520000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hp.rehabilitation', 'Поставщики услуг реабилитации'),
            backgroundColor: '#facc15',
            data: [25000, 28000, 31000, 34000, 38000, 42000, 46000, 50000, 55000, 63000, 88000, 112000, 138000],
        },
        {
            label: t('directionsPages.healthAccounts.tabs.government.labels.hp.otherProviders', 'Прочие поставщики'),
            backgroundColor: '#94a3b8',
            data: [21000, 23000, 26000, 29000, 32000, 35000, 38000, 42000, 47000, 54000, 76000, 98000, 122000],
        },
    ],
});

// Вспомогательные функции
const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(value);

const buildStackedData = (datasets, customLabels = years) => ({
    labels: customLabels,
    datasets: datasets.map((dataset) => ({
        ...dataset,
        maxBarThickness: 32,
    })),
});

const stackedOptions = (title, t, formatNumber) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                boxWidth: 14,
                boxHeight: 14,
                padding: 12,
                font: { size: 11 },
            },
        },
        title: {
            display: true,
            text: title,
            font: { size: 16, weight: '600', family: "'Inter', sans-serif" },
            color: '#0f172a',
            padding: { bottom: 12 },
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.dataset.label}: ${formatNumber(context.raw)} ${t('directionsPages.medicalStatistics.chart.units.millionTenge', 'млн. тг.')}`,
            },
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            cornerRadius: 6,
            titleFont: { size: 13, weight: '600' },
            bodyFont: { size: 12 },
            padding: 10,
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#334155', font: { size: 11 } },
        },
        y: {
            stacked: true,
            grid: { color: 'rgba(148, 163, 184, 0.2)' },
            ticks: {
                callback: (value) => formatNumber(value),
                color: '#334155',
                font: { size: 11 },
            },
        },
    },
});

// Компонент макро показателей
export const MacroIndicatorsChart = ({ t }) => {
    const chartData = useMemo(
        () => ({
            labels: macroIndicators.map((item) => item.year),
            datasets: [
                {
                    label: t('directionsPages.healthAccounts.tabs.macro.chartLabel', 'Показатели по годам (тыс. тг.)'),
                    data: macroIndicators.map((item) => item.value),
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    maxBarThickness: 36,
                },
            ],
        }),
        [t]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: t('directionsPages.healthAccounts.tabs.macro.chartTitle', 'Показатели по годам (тыс. тг.)'),
                    font: { size: 18, weight: '600', family: "'Inter', sans-serif" },
                    padding: { bottom: 16 },
                    color: '#111827',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${formatNumber(context.raw)} ${t('directionsPages.medicalStatistics.chart.units.thousandTenge', 'тыс. тг.')}`,
                    },
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    cornerRadius: 6,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    padding: 10,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#374151', font: { size: 12 } },
                },
                y: {
                    grid: { color: 'rgba(107, 114, 128, 0.1)' },
                    ticks: {
                        callback: (value) => formatNumber(value),
                        color: '#374151',
                        font: { size: 12 },
                    },
                },
            },
        }),
        [t]
    );

    return <Bar data={chartData} options={chartOptions} />;
};

// Компоненты для текущих расходов
export const CurrentExpensesFSChart = ({ t }) => {
    const datasets = useMemo(() => getCurrentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.fs), [datasets.fs]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.current.fsTitle', 'Текущие расходы на здравоохранение (FS, млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};

export const CurrentExpensesHCChart = ({ t }) => {
    const datasets = useMemo(() => getCurrentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.hc), [datasets.hc]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.current.hcTitle', 'Текущие расходы на здравоохранение (HC, млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};

export const CurrentExpensesHFChart = ({ t }) => {
    const datasets = useMemo(() => getCurrentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.hf), [datasets.hf]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.current.hfTitle', 'Текущие расходы на здравоохранение (HF, млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};

export const CurrentExpensesHPChart = ({ t }) => {
    const datasets = useMemo(() => getCurrentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.hp), [datasets.hp]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.current.hpTitle', 'Текущие расходы на здравоохранение (HP, млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};

// Компоненты для государственных расходов
export const GovernmentExpensesTotalChart = ({ t }) => {
    const datasets = useMemo(() => getGovernmentExpensesDatasets(t), [t]);
    const chartData = useMemo(
        () => ({
            labels: years,
            datasets: [
                {
                    type: 'bar',
                    label: t('directionsPages.healthAccounts.tabs.government.totalBar', 'Гос.расходы (тыс. тг.)'),
                    data: datasets.totals.data,
                    backgroundColor: '#2563eb',
                    borderRadius: 6,
                    maxBarThickness: 40,
                },
                {
                    type: 'line',
                    label: t('directionsPages.healthAccounts.tabs.government.totalLine', 'Рост (тыс. тг.)'),
                    data: datasets.totals.line,
                    borderColor: '#f97316',
                    backgroundColor: '#f97316',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y1',
                },
            ],
        }),
        [t, datasets]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: t('directionsPages.healthAccounts.tabs.government.totalTitle', 'Гос.расходы ИТОГИ (тыс. тг.)'),
                    font: { size: 16, weight: '600' },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatNumber(context.raw)}`,
                    },
                },
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: { callback: (value) => formatNumber(value) },
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { callback: (value) => formatNumber(value) },
                },
                x: { ticks: { color: '#334155' } },
            },
        }),
        [t]
    );

    return <Bar data={chartData} options={chartOptions} />;
};

export const GovernmentExpensesPercentChart = ({ t }) => {
    const datasets = useMemo(() => getGovernmentExpensesDatasets(t), [t]);
    const chartData = useMemo(
        () => ({
            labels: years,
            datasets: [
                {
                    type: 'bar',
                    label: t('directionsPages.healthAccounts.tabs.government.percentBar', '% гос.расходов от ТРЗ'),
                    data: datasets.percent.bars,
                    backgroundColor: '#1d4ed8',
                    maxBarThickness: 36,
                },
                {
                    type: 'line',
                    label: t('directionsPages.healthAccounts.tabs.government.percentLine', 'Тренд'),
                    data: datasets.percent.line,
                    borderColor: '#facc15',
                    backgroundColor: '#facc15',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                },
            ],
        }),
        [t, datasets]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: t('directionsPages.healthAccounts.tabs.government.percentTitle', '% гос.расходов от ТРЗ (%)'),
                    font: { size: 16, weight: '600' },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${
                                context.dataset.type === 'bar' ? `${(context.raw * 100).toFixed(1)}%` : context.raw.toFixed(3)
                            }`,
                    },
                },
            },
            scales: {
                y: {
                    ticks: { callback: (value) => `${(value * 100).toFixed(0)}%` },
                },
                x: { ticks: { color: '#334155' } },
            },
        }),
        [t]
    );

    return <Bar data={chartData} options={chartOptions} />;
};

export const GovernmentExpensesHCChart = ({ t }) => {
    const datasets = useMemo(() => getGovernmentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.hc), [datasets.hc]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.government.hcTitle', 'Гос.расходы HC 2010-2022 (млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};

export const GovernmentExpensesHPChart = ({ t }) => {
    const datasets = useMemo(() => getGovernmentExpensesDatasets(t), [t]);
    const chartData = useMemo(() => buildStackedData(datasets.hp), [datasets.hp]);
    const chartOptions = useMemo(
        () => stackedOptions(
            t('directionsPages.healthAccounts.tabs.government.hpTitle', 'Гос.расходы HP 2010-2022 (млн. тг.)'),
            t,
            formatNumber
        ),
        [t]
    );
    return <Bar data={chartData} options={chartOptions} />;
};


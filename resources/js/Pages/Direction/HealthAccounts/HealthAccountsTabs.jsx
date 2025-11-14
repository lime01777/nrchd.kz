import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import DocumentGrid from '@/Components/DocumentGrid';
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

// Регистрируем необходимые части Chart.js один раз для модуля
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

// Основная временная шкала
const years = [
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
];

// Статические данные для макро показателей
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

// Данные для вкладки «Текущие расходы здравоохранения РК 2010-2022»
const currentExpensesDatasets = {
    fs: [
        {
            label: 'Взносы на социальное страхование',
            backgroundColor: '#2563eb',
            data: [320000, 340000, 360000, 410000, 470000, 520000, 590000, 660000, 730000, 850000, 1100000, 1400000, 1650000],
        },
        {
            label: 'Добровольные схемы',
            backgroundColor: '#1d4ed8',
            data: [60000, 63000, 65000, 70000, 76000, 82000, 90000, 95000, 100000, 115000, 160000, 205000, 245000],
        },
        {
            label: 'Обязательные схемы',
            backgroundColor: '#7c3aed',
            data: [120000, 140000, 165000, 190000, 225000, 260000, 295000, 330000, 365000, 410000, 560000, 780000, 920000],
        },
        {
            label: 'Прямые платежи домашних хозяйств',
            backgroundColor: '#f97316',
            data: [220000, 240000, 260000, 285000, 315000, 345000, 380000, 420000, 460000, 540000, 720000, 890000, 1050000],
        },
        {
            label: 'Трансферты из-за рубежа',
            backgroundColor: '#facc15',
            data: [32000, 35000, 38000, 42000, 47000, 52000, 58000, 63000, 70000, 76000, 96000, 120000, 150000],
        },
    ],
    hc: [
        {
            label: 'Административные услуги',
            backgroundColor: '#0ea5e9',
            data: [48000, 52000, 56000, 59000, 65000, 70000, 76000, 82000, 88000, 95000, 125000, 160000, 195000],
        },
        {
            label: 'Вспомогательные услуги',
            backgroundColor: '#38bdf8',
            data: [72000, 78000, 82000, 88000, 94000, 99000, 105000, 112000, 119000, 134000, 175000, 230000, 295000],
        },
        {
            label: 'Долгосрочная забота',
            backgroundColor: '#a78bfa',
            data: [66000, 73000, 80000, 86000, 92000, 98000, 106000, 118000, 130000, 155000, 210000, 280000, 350000],
        },
        {
            label: 'Профилактика',
            backgroundColor: '#f87171',
            data: [54000, 60000, 66000, 72000, 78000, 82000, 87000, 93000, 99000, 108000, 145000, 190000, 240000],
        },
        {
            label: 'Лечение и реабилитация',
            backgroundColor: '#fb923c',
            data: [420000, 470000, 520000, 560000, 620000, 680000, 760000, 820000, 900000, 980000, 1380000, 1720000, 2050000],
        },
    ],
    hf: [
        {
            label: 'Государственные схемы',
            backgroundColor: '#ef4444',
            data: [260000, 290000, 315000, 340000, 380000, 420000, 470000, 520000, 580000, 640000, 820000, 1040000, 1270000],
        },
        {
            label: 'Международные схемы',
            backgroundColor: '#22d3ee',
            data: [18000, 20000, 22000, 25000, 28000, 32000, 36000, 40000, 45000, 52000, 70000, 86000, 104000],
        },
        {
            label: 'Схемы добровольного страхования',
            backgroundColor: '#c084fc',
            data: [42000, 46000, 50000, 54000, 60000, 65000, 71000, 78000, 85000, 98000, 145000, 190000, 240000],
        },
        {
            label: 'Частные расходы домашних хозяйств',
            backgroundColor: '#facc15',
            data: [180000, 205000, 230000, 260000, 290000, 320000, 360000, 400000, 440000, 510000, 700000, 850000, 960000],
        },
    ],
    hp: [
        {
            label: 'Больницы',
            backgroundColor: '#2563eb',
            data: [260000, 300000, 330000, 360000, 400000, 440000, 500000, 560000, 630000, 720000, 990000, 1250000, 1520000],
        },
        {
            label: 'Неустойчивые поставщики',
            backgroundColor: '#93c5fd',
            data: [38000, 42000, 45000, 48000, 52000, 56000, 60000, 66000, 72000, 83000, 104000, 132000, 164000],
        },
        {
            label: 'Организации первичной помощи',
            backgroundColor: '#22c55e',
            data: [82000, 90000, 97000, 105000, 113000, 121000, 132000, 144000, 156000, 180000, 250000, 320000, 410000],
        },
        {
            label: 'Организации специализированной помощи',
            backgroundColor: '#f97316',
            data: [140000, 155000, 172000, 188000, 205000, 222000, 240000, 265000, 290000, 330000, 470000, 600000, 740000],
        },
        {
            label: 'Прочие поставщики',
            backgroundColor: '#eab308',
            data: [62000, 67000, 72000, 77000, 82000, 87000, 94000, 101000, 109000, 123000, 165000, 205000, 250000],
        },
    ],
};

// Данные для вкладки «Государственные расходы РК 2010-2022»
const governmentExpensesDatasets = {
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
            label: 'Администрирование',
            backgroundColor: '#0ea5e9',
            data: [38000, 43000, 47000, 52000, 57000, 61000, 66000, 72000, 78000, 86000, 120000, 160000, 190000],
        },
        {
            label: 'Вспомогательные услуги',
            backgroundColor: '#38bdf8',
            data: [55000, 60000, 67000, 72000, 78000, 84000, 91000, 98000, 105000, 120000, 150000, 195000, 240000],
        },
        {
            label: 'Долгосрочный медицинский уход',
            backgroundColor: '#a855f7',
            data: [47000, 53000, 59000, 65000, 72000, 78000, 84000, 91000, 99000, 118000, 155000, 210000, 265000],
        },
        {
            label: 'Профилактические услуги',
            backgroundColor: '#fb7185',
            data: [42000, 46000, 50000, 54000, 59000, 64000, 69000, 74000, 79000, 89000, 120000, 165000, 210000],
        },
        {
            label: 'Услуги лечения',
            backgroundColor: '#6366f1',
            data: [290000, 320000, 350000, 380000, 420000, 460000, 500000, 550000, 600000, 670000, 900000, 1140000, 1360000],
        },
    ],
    hp: [
        {
            label: 'Больницы общего профиля',
            backgroundColor: '#2563eb',
            data: [220000, 250000, 275000, 300000, 335000, 370000, 420000, 470000, 525000, 600000, 840000, 1100000, 1340000],
        },
        {
            label: 'Организации первичной помощи',
            backgroundColor: '#22c55e',
            data: [52000, 58000, 64000, 70000, 78000, 85000, 93000, 102000, 112000, 128000, 180000, 240000, 310000],
        },
        {
            label: 'Организации специализированной помощи',
            backgroundColor: '#f97316',
            data: [90000, 100000, 112000, 124000, 138000, 152000, 167000, 184000, 202000, 226000, 320000, 410000, 520000],
        },
        {
            label: 'Поставщики услуг реабилитации',
            backgroundColor: '#facc15',
            data: [25000, 28000, 31000, 34000, 38000, 42000, 46000, 50000, 55000, 63000, 88000, 112000, 138000],
        },
        {
            label: 'Прочие поставщики',
            backgroundColor: '#94a3b8',
            data: [21000, 23000, 26000, 29000, 32000, 35000, 38000, 42000, 47000, 54000, 76000, 98000, 122000],
        },
    ],
};

// Данные для вкладки «Частные расходы РК (НС-НР) 2010-2022»
const privateExpensesDatasets = {
    hc: {
        voluntary: [
            {
                label: 'Добровольные страховые схемы',
                backgroundColor: '#1d4ed8',
                data: [2800, 3100, 3400, 3600, 3800, 4000, 5100, 6200, 7100, 8400, 9200, 10800, 12600],
            },
            {
                label: 'Добровольные взносы работодателей',
                backgroundColor: '#ef4444',
                data: [5200, 5600, 6000, 6500, 7100, 7600, 8800, 9700, 10800, 12100, 14000, 16200, 18600],
            },
        ],
        outOfPocket: [
            {
                label: 'Лекарства',
                backgroundColor: '#6b21a8',
                data: [6200, 6800, 7500, 8200, 9000, 9800, 11200, 12800, 14500, 16400, 18800, 21400, 24600],
            },
            {
                label: 'Медицинские услуги',
                backgroundColor: '#f97316',
                data: [3800, 4200, 4700, 5300, 5900, 6500, 7200, 8200, 9300, 10800, 12600, 14800, 17200],
            },
            {
                label: 'Прочие расходы',
                backgroundColor: '#fde047',
                data: [1200, 1500, 1800, 2100, 2400, 2700, 3100, 3600, 4200, 4800, 5400, 6100, 6900],
            },
        ],
        corporate: [
            {
                label: 'Расходы предприятий на медуслуги',
                backgroundColor: '#0f766e',
                data: [3200, 3600, 3900, 4300, 4700, 5200, 6100, 7200, 8500, 10400, 12800, 15600, 18900],
            },
            {
                label: 'Расходы предприятий на профилактику',
                backgroundColor: '#155e75',
                data: [980, 1100, 1230, 1360, 1500, 1680, 1850, 2100, 2400, 2800, 3200, 3700, 4200],
            },
        ],
    },
    hp: {
        voluntary: [
            {
                label: 'Частные клиники',
                backgroundColor: '#f97316',
                data: [4200, 4700, 5200, 5600, 6100, 6700, 7400, 8200, 9000, 10000, 11800, 14200, 16800],
            },
            {
                label: 'Диагностические центры',
                backgroundColor: '#facc15',
                data: [3200, 3500, 3700, 4000, 4400, 4800, 5300, 5800, 6400, 7100, 8200, 9600, 11200],
            },
        ],
        outOfPocket: [
            {
                label: 'Аптеки и фармацевты',
                backgroundColor: '#9333ea',
                data: [96000, 105000, 118000, 132000, 145000, 162000, 184000, 206000, 232000, 265000, 304000, 358000, 420000],
            },
            {
                label: 'Стоматологические услуги',
                backgroundColor: '#d946ef',
                data: [32000, 35000, 38000, 42000, 47000, 53000, 60000, 68000, 76000, 88000, 102000, 120000, 143000],
            },
            {
                label: 'Прочие услуги',
                backgroundColor: '#f97316',
                data: [28000, 30000, 33000, 36000, 40000, 44000, 50000, 56000, 63000, 72000, 86000, 102000, 123000],
            },
        ],
        corporate: [
            {
                label: 'Медицинские пункты предприятий',
                backgroundColor: '#38bdf8',
                data: [5200, 5600, 6100, 6700, 7400, 8200, 9100, 10200, 11400, 13000, 15400, 18200, 21400],
            },
            {
                label: 'Корпоративные клиники',
                backgroundColor: '#0ea5e9',
                data: [1600, 1800, 2000, 2200, 2500, 2800, 3200, 3600, 4100, 4700, 5600, 6600, 7800],
            },
        ],
    },
};

// Данные для вкладки «Частные расходы РК (ДМС, карманные) 2010-2022»
const privateFinalDatasets = {
    totals: {
        years: ['2010', '2011', '2012', '2014', '2016', '2018', '2019', '2020', '2022'],
        data: [188301, 219955, 291955, 457119, 630716, 776473, 905861, 1101804, 1466034],
        trend: [188301, 206000, 245000, 330000, 452000, 568000, 700000, 890000, 1200000],
    },
    percentTotal: {
        years: ['2010', '2011', '2012', '2014', '2016', '2018', '2019', '2020', '2022'],
        data: [0.315, 0.287, 0.317, 0.305, 0.282, 0.368, 0.379, 0.390, 0.380],
    },
    combined: {
        years: ['2010', '2011', '2012', '2014', '2016', '2018', '2019', '2020', '2022'],
        datasets: [
            {
                label: 'ДМС',
                backgroundColor: '#2563eb',
                data: [62000, 70000, 82000, 98000, 115000, 132000, 148000, 168000, 198000],
            },
            {
                label: 'Карманные расходы',
                backgroundColor: '#f97316',
                data: [92000, 102000, 122000, 175000, 236000, 285000, 330000, 382000, 460000],
            },
            {
                label: 'Расходы предприятий',
                backgroundColor: '#10b981',
                data: [34200, 45955, 87955, 184119, 279716, 359473, 427861, 553804, 807034],
            },
        ],
    },
    percentPocket: {
        years: ['2010', '2011', '2012', '2014', '2016', '2018', '2019', '2020', '2022'],
        data: [0.238, 0.246, 0.250, 0.260, 0.273, 0.311, 0.331, 0.335, 0.357],
    },
};

// Общие опции для многослойных диаграмм
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
                font: {
                    size: 11,
                },
            },
        },
        title: {
            display: true,
            text: title,
            font: {
                size: 16,
                weight: '600',
                family: "'Inter', sans-serif",
            },
            color: '#0f172a',
            padding: { bottom: 12 },
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.dataset.label}: ${formatNumber(context.raw)} млн. тг.`,
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
            ticks: {
                color: '#334155',
                font: { size: 11 },
            },
        },
        y: {
            stacked: true,
            grid: {
                color: 'rgba(148, 163, 184, 0.2)',
            },
            ticks: {
                callback: (value) => formatNumber(value),
                color: '#334155',
                font: { size: 11 },
            },
        },
    },
});

const HealthAccountsTabs = ({ t }) => {
    const [activeTab, setActiveTab] = useState('macro');

    // Форматирование чисел с разделителями тысяч
    const formatNumber = (value) =>
        new Intl.NumberFormat('ru-RU').format(value);

    // Данные и опции для столбчатой диаграммы
    const macroChartData = useMemo(
        () => ({
            labels: macroIndicators.map((item) => item.year),
            datasets: [
                {
                    label: t(
                        'directionsPages.healthAccounts.tabs.macro.chartLabel',
                        'Показатели по годам (тыс. тг.)'
                    ),
                    data: macroIndicators.map((item) => item.value),
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    maxBarThickness: 36,
                },
            ],
        }),
        [t]
    );

    const macroChartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.tabs.macro.chartTitle',
                        'Показатели по годам (тыс. тг.)'
                    ),
                    font: {
                        size: 18,
                        weight: '600',
                        family: "'Inter', sans-serif",
                    },
                    padding: {
                        bottom: 16,
                    },
                    color: '#111827',
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${formatNumber(context.raw)} тыс. тг.`,
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
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#374151',
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)',
                    },
                    ticks: {
                        callback: (value) => formatNumber(value),
                        color: '#374151',
                        font: {
                            size: 12,
                        },
                    },
                },
            },
        }),
        [t]
    );

    const buildStackedData = (datasets, customLabels = years) => ({
        labels: customLabels,
        datasets: datasets.map((dataset) => ({
            ...dataset,
            maxBarThickness: 32,
        })),
    });

    // Конфигурация вкладок (для остальных вкладок пока используем DocumentGrid)
    const tabs = [
        {
            id: 'macro',
            label: t(
                'directionsPages.healthAccounts.tabs.macro.title',
                'Макро показатели РК 2010-2022'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="h-80">
                            <Bar data={macroChartData} options={macroChartOptions} />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'current',
            label: t(
                'directionsPages.healthAccounts.tabs.current.title',
                'Текущие расходы здравоохранения РК 2010-2022'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(currentExpensesDatasets.fs)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.current.fsTitle',
                                            'Текущие расходы на здравоохранение (FS, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(currentExpensesDatasets.hc)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.current.hcTitle',
                                            'Текущие расходы на здравоохранение (HC, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(currentExpensesDatasets.hf)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.current.hfTitle',
                                            'Текущие расходы на здравоохранение (HF, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(currentExpensesDatasets.hp)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.current.hpTitle',
                                            'Текущие расходы на здравоохранение (HP, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'financing',
            label: t(
                'directionsPages.healthAccounts.tabs.government.title',
                'Государственные расходы РК 2010-2022'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="bg-blue-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: years,
                                        datasets: [
                                            {
                                                type: 'bar',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.government.totalBar',
                                                    'Гос.расходы (тыс. тг.)'
                                                ),
                                                data: governmentExpensesDatasets.totals.data,
                                                backgroundColor: '#2563eb',
                                                borderRadius: 6,
                                                maxBarThickness: 40,
                                            },
                                            {
                                                type: 'line',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.government.totalLine',
                                                    'Рост (тыс. тг.)'
                                                ),
                                                data: governmentExpensesDatasets.totals.line,
                                                borderColor: '#f97316',
                                                backgroundColor: '#f97316',
                                                borderWidth: 2,
                                                tension: 0.3,
                                                fill: false,
                                                yAxisID: 'y1',
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: t(
                                                    'directionsPages.healthAccounts.tabs.government.totalTitle',
                                                    'Гос.расходы ИТОГИ (тыс. тг.)'
                                                ),
                                                font: { size: 16, weight: '600' },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) =>
                                                        `${context.dataset.label}: ${formatNumber(context.raw)}`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                type: 'linear',
                                                position: 'left',
                                                ticks: {
                                                    callback: (value) => formatNumber(value),
                                                },
                                            },
                                            y1: {
                                                type: 'linear',
                                                position: 'right',
                                                grid: {
                                                    drawOnChartArea: false,
                                                },
                                                ticks: {
                                                    callback: (value) => formatNumber(value),
                                                },
                                            },
                                            x: {
                                                ticks: {
                                                    color: '#334155',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: years,
                                        datasets: [
                                            {
                                                type: 'bar',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.government.percentBar',
                                                    '% гос.расходов от ТРЗ'
                                                ),
                                                data: governmentExpensesDatasets.percent.bars,
                                                backgroundColor: '#1d4ed8',
                                                maxBarThickness: 36,
                                            },
                                            {
                                                type: 'line',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.government.percentLine',
                                                    'Тренд'
                                                ),
                                                data: governmentExpensesDatasets.percent.line,
                                                borderColor: '#facc15',
                                                backgroundColor: '#facc15',
                                                borderWidth: 2,
                                                tension: 0.3,
                                                fill: false,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: t(
                                                    'directionsPages.healthAccounts.tabs.government.percentTitle',
                                                    '% гос.расходов от ТРЗ (%)'
                                                ),
                                                font: { size: 16, weight: '600' },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) =>
                                                        `${context.dataset.label}: ${
                                                            context.dataset.type === 'bar'
                                                                ? `${(context.raw * 100).toFixed(1)}%`
                                                                : context.raw.toFixed(3)
                                                        }`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                ticks: {
                                                    callback: (value) => `${(value * 100).toFixed(0)}%`,
                                                },
                                            },
                                            x: {
                                                ticks: { color: '#334155' },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(governmentExpensesDatasets.hc)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.government.hcTitle',
                                            'Гос.расходы HC 2010-2022 (млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(governmentExpensesDatasets.hp)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.government.hpTitle',
                                            'Гос.расходы HP 2010-2022 (млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'private',
            label: t(
                'directionsPages.healthAccounts.tabs.private.title',
                'Частные расходы РК (НС-НР) 2010-2022'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hc.voluntary)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hcVoluntaryTitle',
                                            'ДМС HC (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hc.outOfPocket)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hcPocketTitle',
                                            'Карманные НС (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hc.corporate)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hcCorporateTitle',
                                            'Предприятия НС (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hp.voluntary)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hpVoluntaryTitle',
                                            'ДМС HP 2010-2022 (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hp.outOfPocket)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hpPocketTitle',
                                            'Карманные HP 2010-2022 (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-sky-100 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(privateExpensesDatasets.hp.corporate)}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.private.hpCorporateTitle',
                                            'Предприятия HP 2010-2022 (большие группы, млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'privateSummary',
            label: t(
                'directionsPages.healthAccounts.tabs.privateSummary.title',
                'Частн.расходы РК (ДМС, карманные) 2010-2022'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: privateFinalDatasets.totals.years,
                                        datasets: [
                                            {
                                                type: 'bar',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.totalBar',
                                                    'Частные расходы (млн. тг.)'
                                                ),
                                                data: privateFinalDatasets.totals.data,
                                                backgroundColor: '#2563eb',
                                                maxBarThickness: 42,
                                                borderRadius: 6,
                                            },
                                            {
                                                type: 'line',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.totalTrend',
                                                    'Тренд'
                                                ),
                                                data: privateFinalDatasets.totals.trend,
                                                borderColor: '#fb7185',
                                                backgroundColor: '#fb7185',
                                                borderWidth: 2,
                                                tension: 0.25,
                                                fill: false,
                                                yAxisID: 'y1',
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' },
                                            title: {
                                                display: true,
                                                text: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.totalTitle',
                                                    'Частные расходы 2010-2022 гг. (млн. тг.)'
                                                ),
                                                font: { size: 16, weight: '600' },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) =>
                                                        `${context.dataset.label}: ${
                                                            context.dataset.type === 'line'
                                                                ? formatNumber(context.raw)
                                                                : formatNumber(context.raw)
                                                        }`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                type: 'linear',
                                                position: 'left',
                                                ticks: {
                                                    callback: (value) => formatNumber(value),
                                                },
                                            },
                                            y1: {
                                                type: 'linear',
                                                position: 'right',
                                                grid: { drawOnChartArea: false },
                                                ticks: {
                                                    callback: (value) => formatNumber(value),
                                                },
                                            },
                                            x: { ticks: { color: '#334155' } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: privateFinalDatasets.percentTotal.years,
                                        datasets: [
                                            {
                                                type: 'bar',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.percentBar',
                                                    '% част.расходов от ТРЗ'
                                                ),
                                                data: privateFinalDatasets.percentTotal.data,
                                                backgroundColor: '#1d4ed8',
                                                maxBarThickness: 40,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: {
                                                display: true,
                                                text: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.percentTitle',
                                                    '% част.расходов от ТРЗ'
                                                ),
                                                font: { size: 16, weight: '600' },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) =>
                                                        `${(context.raw * 100).toFixed(1)}%`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                ticks: {
                                                    callback: (value) => `${(value * 100).toFixed(0)}%`,
                                                },
                                            },
                                            x: { ticks: { color: '#334155' } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={buildStackedData(
                                        privateFinalDatasets.combined.datasets,
                                        privateFinalDatasets.combined.years
                                    )}
                                    options={stackedOptions(
                                        t(
                                            'directionsPages.healthAccounts.tabs.privateSummary.combinedTitle',
                                            'Частные расходы ДМС, карманные, предприятия (млн. тг.)'
                                        ),
                                        t,
                                        formatNumber
                                    )}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-sm p-4">
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: privateFinalDatasets.percentPocket.years,
                                        datasets: [
                                            {
                                                type: 'bar',
                                                label: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.percentPocketLabel',
                                                    '% карманных расходов от ТРЗ'
                                                ),
                                                data: privateFinalDatasets.percentPocket.data,
                                                backgroundColor: '#f97316',
                                                maxBarThickness: 40,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: {
                                                display: true,
                                                text: t(
                                                    'directionsPages.healthAccounts.tabs.privateSummary.percentPocketTitle',
                                                    '% карманных расходов от ТРЗ'
                                                ),
                                                font: { size: 16, weight: '600' },
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) =>
                                                        `${(context.raw * 100).toFixed(1)}%`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                ticks: {
                                                    callback: (value) => `${(value * 100).toFixed(0)}%`,
                                                },
                                            },
                                            x: { ticks: { color: '#334155' } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const renderTabContent = () => {
        const currentTab = tabs.find((tab) => tab.id === activeTab);

        if (!currentTab) {
            return null;
        }

        if (currentTab.render) {
            return currentTab.render();
        }

        return (
            <DocumentGrid
                folder={currentTab.folder}
                title={t(
                    'directionsPages.healthAccounts.tabs.generic.attachmentsTitle',
                    'Документы и статистика'
                )}
                bgColor={`${currentTab.color ?? 'bg-white'} border border-white`}
                columns={3}
            />
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        type="button"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default HealthAccountsTabs;


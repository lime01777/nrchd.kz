import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Небольшой пользовательский плагин для прорисовки подписей поверх столбцов/точек
const valueLabelPlugin = {
    id: 'valueLabelPlugin',
    afterDatasetsDraw: (chart) => {
        const { ctx, data } = chart;
        ctx.save();

        data.datasets.forEach((dataset, datasetIndex) => {
            const valueLabels = dataset.valueLabels;
            if (!valueLabels) {
                return;
            }

            const meta = chart.getDatasetMeta(datasetIndex);
            if (meta.hidden) {
                return;
            }

            const {
                backgroundColor = 'rgba(255,255,255,0.9)',
                color = '#0f172a',
                fontSize = 12,
                fontWeight = '600',
                paddingX = 8,
                paddingY = 4,
                offsetY = 8,
                offsetX = 0,
                formatter = (value) => value,
                borderRadius = 6,
            } = valueLabels;

            meta.data.forEach((element, index) => {
                const rawValue = dataset.data[index];
                if (rawValue === undefined || rawValue === null) {
                    return;
                }

                const { x, y } = element.tooltipPosition();
                const text = formatter(rawValue, index);

                ctx.font = `${fontWeight} ${fontSize}px 'Inter', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const textMetrics = ctx.measureText(text);
                const textWidth = textMetrics.width;
                const textHeight = fontSize;

                const boxX = x + offsetX - textWidth / 2 - paddingX;
                const boxY = y - offsetY - textHeight / 2 - paddingY;
                const boxWidth = textWidth + paddingX * 2;
                const boxHeight = textHeight + paddingY * 2;

                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                const radius = borderRadius;
                ctx.moveTo(boxX + radius, boxY);
                ctx.lineTo(boxX + boxWidth - radius, boxY);
                ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
                ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
                ctx.quadraticCurveTo(
                    boxX + boxWidth,
                    boxY + boxHeight,
                    boxX + boxWidth - radius,
                    boxY + boxHeight
                );
                ctx.lineTo(boxX + radius, boxY + boxHeight);
                ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
                ctx.lineTo(boxX, boxY + radius);
                ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = color;
                ctx.fillText(text, x + offsetX, boxY + boxHeight / 2);
            });
        });

        ctx.restore();
    },
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    valueLabelPlugin
);

const formatCompact = (value) => {
    const million = 1_000_000;
    const billion = 1_000_000_000;

    if (value >= billion) {
        return `${(value / billion).toFixed(1)}B`;
    }
    if (value >= million) {
        return `${(value / million).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('ru-RU').format(value);
};

const regionNames = [
    'Алматинская',
    'г. Алматы',
    'г. Астана',
    'Карагандинская',
    'Алматинская',
    'ВКО',
    'Шымкент',
    'Актюбинская',
    'Жамбылская',
    'Кызылординская',
    'Павлодарская',
    'Туркестанская',
    'Костанайская',
    'Атырауская',
    'Мангистауская',
    'ЗКО',
    'Акмолинская',
    'СКО',
];

const regionsBarValues = [
    10_300_000,
    9_200_000,
    9_000_000,
    6_700_000,
    6_500_000,
    6_400_000,
    6_000_000,
    5_000_000,
    4_000_000,
    3_600_000,
    3_500_000,
    3_400_000,
    3_400_000,
    3_300_000,
    3_100_000,
    2_700_000,
    2_700_000,
    2_400_000,
];

const functionGroups = [
    'Администрирование',
    'АПП',
    'Диагностика',
    'Дневной стационар',
    'Долгосрочный уход',
    'Домашний уход',
    'Профилактика',
    'Прочие',
    'Реабилитация',
    'Скорая помощь',
    'Стационар',
    'Фармацевтика',
];

const functionColors = [
    '#0ea5e9',
    '#2563eb',
    '#38bdf8',
    '#f97316',
    '#a855f7',
    '#facc15',
    '#22c55e',
    '#6b7280',
    '#f43f5e',
    '#6366f1',
    '#8b5cf6',
    '#c084fc',
];

const functionExpensesByRegion = [
    [160, 120, 95, 85, 60, 55, 52, 48, 44, 40, 36, 32],
    [140, 104, 82, 78, 55, 49, 47, 44, 40, 36, 30, 28],
    [120, 90, 76, 69, 50, 46, 43, 38, 36, 33, 29, 25],
    [110, 82, 70, 60, 48, 42, 40, 36, 32, 30, 26, 22],
    [96, 75, 64, 58, 44, 38, 36, 32, 28, 26, 24, 20],
    [84, 68, 58, 52, 40, 34, 31, 28, 24, 22, 20, 18],
    [72, 60, 50, 45, 34, 30, 28, 25, 22, 20, 18, 16],
    [64, 52, 44, 40, 30, 26, 24, 21, 19, 17, 15, 13],
    [58, 46, 38, 34, 26, 23, 21, 19, 17, 15, 13, 11],
    [52, 40, 34, 30, 22, 20, 18, 16, 14, 12, 10, 9],
    [46, 36, 30, 26, 20, 18, 16, 14, 12, 10, 9, 8],
    [40, 32, 26, 22, 18, 16, 14, 12, 10, 9, 8, 7],
];

const perCapitaExpenses = [
    { region: 'г. Алматы', value: 9_500_000 },
    { region: 'г. Астана', value: 8_800_000 },
    { region: 'Карагандинская', value: 7_900_000 },
    { region: 'Алматинская', value: 6_900_000 },
    { region: 'ВКО', value: 6_200_000 },
    { region: 'Туркестанская', value: 5_600_000 },
    { region: 'Павлодарская', value: 5_100_000 },
    { region: 'Шымкент', value: 4_800_000 },
    { region: 'Кызылординская', value: 4_400_000 },
    { region: 'Жамбылская', value: 4_000_000 },
    { region: 'Актюбинская', value: 3_800_000 },
    { region: 'ЗКО', value: 3_600_000 },
    { region: 'Акмолинская', value: 3_200_000 },
    { region: 'СКО', value: 3_000_000 },
];

const HealthAccountsRegions = ({ t }) => {
    const [activeTab, setActiveTab] = useState('expenses');
    const [financingTab, setFinancingTab] = useState('budget');
    const [stateShareTab, setStateShareTab] = useState('stationaryShare');
    const [populationFilter, setPopulationFilter] = useState('all');

    const barWithTrendData = useMemo(
        () => ({
            labels: regionNames,
            datasets: [
                {
                    type: 'bar',
                    label: t(
                        'directionsPages.healthAccounts.regions.expenses.barLabel',
                        'Расходы на здравоохранение'
                    ),
                    data: regionsBarValues,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    maxBarThickness: 36,
                    valueLabels: {
                        formatter: (value) => `${(value / 1_000_000).toFixed(1)}M`,
                        offsetY: 14,
                    },
                },
                {
                    type: 'line',
                    label: t(
                        'directionsPages.healthAccounts.regions.expenses.lineLabel',
                        'Динамика по регионам'
                    ),
                    data: regionsBarValues,
                    borderColor: '#1d4ed8',
                    backgroundColor: '#1d4ed8',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#1d4ed8',
                    valueLabels: {
                        formatter: (value) => `${(value / 1_000_000).toFixed(1)}M`,
                        backgroundColor: 'rgba(99, 102, 241, 0.95)',
                        color: '#ffffff',
                        offsetY: 26,
                    },
                },
            ],
        }),
        [t]
    );

    const barWithTrendOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.expenses.chartTitle',
                        'Расходы на здравоохранение по регионам 2022 г.'
                    ),
                    color: '#0f172a',
                    font: { size: 18, weight: '600' },
                    padding: { bottom: 16 },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#334155',
                        maxRotation: 60,
                        minRotation: 45,
                        font: { size: 11 },
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        callback: (value) => `${(value / 1_000_000).toFixed(1)}M`,
                        color: '#334155',
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.2)',
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        }),
        [t]
    );

    const functionsStackedData = useMemo(() => {
        const labels = [
            'г. Алматы',
            'г. Астана',
            'Карагандинская',
            'Алматинская',
            'ВКО',
            'Туркестанская',
            'Шымкент',
            'Актюбинская',
            'Жамбылская',
            'Кызылординская',
            'Павлодарская',
            'ЗКО',
        ];

        return {
            labels,
            datasets: functionGroups.map((group, index) => ({
                label: group,
                data: functionExpensesByRegion[index],
                backgroundColor: functionColors[index],
                borderRadius: 4,
                stack: 'functions',
            })),
        };
    }, []);

    const functionsStackedOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.functions.chartTitle',
                        'Расходы на здравоохранение по функциям 2022 г.'
                    ),
                    color: '#0f172a',
                    font: { size: 16, weight: '600' },
                    padding: { bottom: 12 },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: (value) => `${value}bn`,
                        color: '#334155',
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.2)',
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#334155',
                    },
                    grid: {
                        display: false,
                    },
                },
            },
        }),
        [t]
    );

    const perCapitaData = useMemo(
        () => ({
            labels: perCapitaExpenses.map((item) => item.region),
            datasets: [
                {
                    label: t(
                        'directionsPages.healthAccounts.regions.perCapita.chartLabel',
                        'Расходы на душу населения'
                    ),
                    data: perCapitaExpenses.map((item) => item.value),
                    backgroundColor: '#7c3aed',
                    borderRadius: 6,
                    categoryPercentage: 0.6,
                },
            ],
        }),
        [t]
    );

    const perCapitaOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.perCapita.chartTitle',
                        'Расходы на здравоохранение по функциям на 1 жителя по регионам 2022 г.'
                    ),
                    color: '#0f172a',
                    font: { size: 16, weight: '600' },
                    padding: { bottom: 12 },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        callback: (value) => `${(value / 1_000_000).toFixed(1)}M`,
                        color: '#334155',
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.2)',
                    },
                },
                y: {
                    ticks: { color: '#334155' },
                    grid: { display: false },
                },
            },
        }),
        [t]
    );

    const medicalAidCharts = useMemo(
        () => [
            {
                id: 'stationary',
                title: t(
                    'directionsPages.healthAccounts.regions.medicalAid.stationary.title',
                    'Расходы на стационар 2022 г. (гос. и част.)'
                ),
                labels: regionNames,
                datasets: [
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.stationary.state',
                            'Государственные'
                        ),
                        data: [
                            174_300_000, 150_200_000, 120_300_000, 90_200_000, 85_400_000, 80_500_000, 70_300_000,
                            65_200_000, 60_400_000, 58_300_000, 55_000_000, 52_000_000, 48_500_000, 46_000_000,
                            42_300_000, 38_000_000, 36_000_000, 32_000_000,
                        ],
                        backgroundColor: '#38bdf8',
                        stack: 'stationary',
                    },
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.stationary.private',
                            'Частные'
                        ),
                        data: [
                            34_500_000, 29_000_000, 25_200_000, 18_000_000, 16_700_000, 15_200_000, 13_000_000,
                            11_200_000, 9_600_000, 8_200_000, 7_300_000, 6_200_000, 5_600_000, 5_100_000, 4_600_000,
                            3_800_000, 3_200_000, 2_900_000,
                        ],
                        backgroundColor: '#1d4ed8',
                        stack: 'stationary',
                    },
                ],
            },
            {
                id: 'primary',
                title: t(
                    'directionsPages.healthAccounts.regions.medicalAid.primary.title',
                    'Расходы на АПП 2022 г. (гос. и част.)'
                ),
                labels: regionNames,
                datasets: [
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.primary.state',
                            'Государственные'
                        ),
                        data: [
                            100_000_000, 92_000_000, 84_000_000, 72_000_000, 68_000_000, 60_000_000, 58_000_000,
                            52_000_000, 48_000_000, 45_000_000, 42_000_000, 40_000_000, 38_000_000, 36_000_000,
                            34_000_000, 31_000_000, 29_000_000, 26_000_000,
                        ],
                        backgroundColor: '#38bdf8',
                        stack: 'primary',
                    },
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.primary.private',
                            'Частные'
                        ),
                        data: [
                            25_000_000, 20_000_000, 18_000_000, 15_000_000, 13_000_000, 12_000_000, 10_000_000,
                            8_500_000, 7_200_000, 6_200_000, 5_400_000, 5_000_000, 4_200_000, 3_900_000, 3_400_000,
                            3_000_000, 2_800_000, 2_500_000,
                        ],
                        backgroundColor: '#0f52ba',
                        stack: 'primary',
                    },
                ],
            },
            {
                id: 'pharma',
                title: t(
                    'directionsPages.healthAccounts.regions.medicalAid.pharma.title',
                    'Расходы на фармпрепараты 2022 г. (гос. и част.)'
                ),
                labels: regionNames,
                datasets: [
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.pharma.state',
                            'Государственные'
                        ),
                        data: [
                            69_300_000, 58_200_000, 50_000_000, 40_000_000, 37_000_000, 32_000_000, 30_000_000,
                            27_500_000, 25_000_000, 23_000_000, 21_000_000, 19_000_000, 17_000_000, 15_000_000,
                            13_500_000, 12_000_000, 11_000_000, 9_000_000,
                        ],
                        backgroundColor: '#38bdf8',
                        stack: 'pharma',
                    },
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.pharma.private',
                            'Частные'
                        ),
                        data: [
                            38_500_000, 31_500_000, 29_200_000, 22_000_000, 20_000_000, 18_000_000, 16_700_000,
                            14_000_000, 12_600_000, 11_000_000, 9_600_000, 8_200_000, 7_100_000, 6_400_000,
                            5_500_000, 4_700_000, 4_200_000, 3_600_000,
                        ],
                        backgroundColor: '#1d4ed8',
                        stack: 'pharma',
                    },
                ],
            },
            {
                id: 'rehab',
                title: t(
                    'directionsPages.healthAccounts.regions.medicalAid.rehab.title',
                    'Расходы на реабилитацию 2022 г. (гос. и част.)'
                ),
                labels: regionNames,
                datasets: [
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.rehab.state',
                            'Государственные'
                        ),
                        data: [
                            8_950_000, 7_800_000, 6_500_000, 5_000_000, 4_500_000, 3_800_000, 3_500_000, 3_200_000,
                            2_800_000, 2_500_000, 2_300_000, 2_000_000, 1_800_000, 1_600_000, 1_400_000, 1_200_000,
                            1_000_000, 900_000,
                        ],
                        backgroundColor: '#38bdf8',
                        stack: 'rehab',
                    },
                    {
                        label: t(
                            'directionsPages.healthAccounts.regions.medicalAid.rehab.private',
                            'Частные'
                        ),
                        data: [
                            3_500_000, 2_400_000, 2_100_000, 1_600_000, 1_400_000, 1_200_000, 1_100_000, 900_000,
                            800_000, 700_000, 620_000, 540_000, 480_000, 420_000, 360_000, 320_000, 280_000, 240_000,
                        ],
                        backgroundColor: '#4338ca',
                        stack: 'rehab',
                    },
                ],
            },
        ],
        [t]
    );

    const medicalAidOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#334155',
                        maxRotation: 50,
                        minRotation: 40,
                        font: { size: 10 },
                    },
                    grid: { display: false },
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: (value) => `${(value / 1_000_000).toFixed(0)}M`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                },
            },
        }),
        []
    );

    const stateShareCharts = useMemo(
        () => [
            {
                id: 'stationaryShare',
                title: t(
                    'directionsPages.healthAccounts.regions.stateShare.stationaryTitle',
                    'Доли расходов на стационар 2022 г. (гос. и част.)'
                ),
                labels: [
                    'Алматинская',
                    'Костанайская',
                    'СКО',
                    'ВКО',
                    'Павлодарская',
                    'Актюбинская',
                    'Карагандинская',
                    'Жамбылская',
                    'Кызылординская',
                    'Туркестанская',
                    'Шымкент',
                    'ЗКО',
                    'Мангистауская',
                    'Атырауская',
                    'г. Астана',
                    'г. Алматы',
                ],
                stateData: [0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.86, 0.83, 0.8, 0.78, 0.72],
            },
            {
                id: 'primaryShare',
                title: t(
                    'directionsPages.healthAccounts.regions.stateShare.primaryTitle',
                    'Доли расходов на АПП 2022 г. (гос. и част.)'
                ),
                labels: [
                    'г. Алматы',
                    'г. Астана',
                    'Мангистауская',
                    'Атырауская',
                    'Карагандинская',
                    'Павлодарская',
                    'Жамбылская',
                    'Актюбинская',
                    'ЗКО',
                    'ВКО',
                    'Костанайская',
                    'Шымкент',
                    'СКО',
                    'Алматинская',
                    'Жамбылская',
                    'Туркестанская',
                ],
                stateData: [0.98, 0.95, 0.88, 0.86, 0.82, 0.8, 0.78, 0.74, 0.7, 0.66, 0.64, 0.6, 0.55, 0.5, 0.45, 0.35],
            },
            {
                id: 'pharmaShare',
                title: t(
                    'directionsPages.healthAccounts.regions.stateShare.pharmaTitle',
                    'Доли расходов на фармпрепараты 2022 г. (гос. и част.)'
                ),
                labels: [
                    'г. Астана',
                    'Актюбинская',
                    'ЗКО',
                    'ВКО',
                    'Карагандинская',
                    'г. Алматы',
                    'Алматинская',
                    'Костанайская',
                    'СКО',
                    'Шымкент',
                    'Кызылординская',
                    'Жамбылская',
                    'Актюбинская',
                    'Павлодарская',
                    'Мангистауская',
                    'Туркестанская',
                ],
                stateData: [0.88, 0.83, 0.8, 0.78, 0.75, 0.71, 0.68, 0.65, 0.62, 0.59, 0.56, 0.53, 0.5, 0.47, 0.44, 0.38],
            },
            {
                id: 'rehabShare',
                title: t(
                    'directionsPages.healthAccounts.regions.stateShare.rehabTitle',
                    'Доли расходов на реабилитацию 2022 г. (гос. и част.)'
                ),
                labels: [
                    'СКО',
                    'Актюбинская',
                    'Шымкент',
                    'ВКО',
                    'г. Астана',
                    'г. Алматы',
                    'Мангистауская',
                    'Атырауская',
                    'ЗКО',
                    'Жамбылская',
                    'Туркестанская',
                    'Карагандинская',
                    'Кызылординская',
                    'Алматинская',
                    'Павлодарская',
                    'Костанайская',
                ],
                stateData: [0.93, 0.92, 0.89, 0.85, 0.8, 0.76, 0.72, 0.69, 0.65, 0.6, 0.56, 0.52, 0.48, 0.44, 0.4, 0.36],
            },
        ],
        [t]
    );

    const stateShareOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${(context.raw * 100).toFixed(1)}%`,
                    },
                },
                title: {
                    display: false,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: (value) => `${(value * 100).toFixed(0)}%`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    suggestedMax: 1,
                },
                y: {
                    stacked: true,
                    ticks: { color: '#334155' },
                    grid: { display: false },
                },
            },
        }),
        []
    );

    const shareRegions = [
        'Туркестанская',
        'СКО',
        'Павлодарская',
        'Мангистауская',
        'Кызылординская',
        'Костанайская',
        'Карагандинская',
        'Жамбылская',
        'Шымкент',
        'г. Астана',
        'г. Алматы',
        'ВКО',
        'Атырауская',
        'Актюбинская',
        'Акмолинская',
        'ЗКО',
    ];

    const shareCategories = [
        { key: 'pharma', label: t('directionsPages.healthAccounts.regions.financing.datasets.pharma', 'Фарм'), color: '#0ea5e9' },
        { key: 'stationary', label: t('directionsPages.healthAccounts.regions.financing.datasets.stationary', 'Стационар'), color: '#2563eb' },
        { key: 'emergency', label: t('directionsPages.healthAccounts.regions.financing.datasets.emergency', 'Скорая'), color: '#fde047' },
        { key: 'rehab', label: t('directionsPages.healthAccounts.regions.financing.datasets.rehab', 'Реабилитация'), color: '#f97316' },
        { key: 'other', label: t('directionsPages.healthAccounts.regions.financing.datasets.other', 'Прочие'), color: '#6b7280' },
        { key: 'prevention', label: t('directionsPages.healthAccounts.regions.financing.datasets.prevention', 'Профилактика'), color: '#22c55e' },
        { key: 'home', label: t('directionsPages.healthAccounts.regions.financing.datasets.home', 'Домашний уход'), color: '#a855f7' },
        { key: 'long', label: t('directionsPages.healthAccounts.regions.financing.datasets.long', 'Долгосрочный уход'), color: '#8b5cf6' },
    ];

    const shareValues = {
        pharma: [0.101, 0.098, 0.198, 0.092, 0.105, 0.285, 0.256, 0.245, 0.233, 0.214, 0.174, 0.225, 0.189, 0.206, 0.188, 0.175],
        stationary: [0.34, 0.34, 0.292, 0.255, 0.325, 0.247, 0.228, 0.258, 0.233, 0.346, 0.333, 0.312, 0.234, 0.265, 0.231, 0.29],
        emergency: [0.082, 0.074, 0.056, 0.063, 0.059, 0.064, 0.067, 0.054, 0.052, 0.058, 0.061, 0.056, 0.054, 0.057, 0.055, 0.059],
        rehab: [0.053, 0.05, 0.052, 0.055, 0.05, 0.058, 0.052, 0.048, 0.051, 0.052, 0.045, 0.05, 0.048, 0.051, 0.05, 0.048],
        other: [0.12, 0.114, 0.112, 0.106, 0.118, 0.11, 0.118, 0.112, 0.108, 0.11, 0.123, 0.112, 0.119, 0.113, 0.111, 0.115],
        prevention: [0.11, 0.12, 0.11, 0.1, 0.11, 0.1, 0.11, 0.12, 0.11, 0.1, 0.11, 0.11, 0.12, 0.11, 0.109, 0.108],
        home: [0.08, 0.082, 0.081, 0.079, 0.076, 0.086, 0.088, 0.09, 0.08, 0.093, 0.095, 0.09, 0.089, 0.088, 0.087, 0.086],
        long: [0.094, 0.112, 0.097, 0.13, 0.087, 0.098, 0.101, 0.093, 0.137, 0.027, 0.029, 0.043, 0.107, 0.1, 0.129, 0.114],
    };

    const shareChartData = useMemo(
        () => ({
            labels: shareRegions,
            datasets: shareCategories.map((category) => ({
                label: category.label,
                data: shareValues[category.key] ?? [],
                backgroundColor: category.color,
                stack: 'medicalShare',
            })),
        }),
        [shareCategories]
    );

    const shareChartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${(context.raw * 100).toFixed(1)}%`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.financing.shareTitle',
                        'Доли мед.услуг от ТРЗ в разрезе регионов 2022 г.'
                    ),
                    color: '#0f172a',
                    font: { size: 16, weight: '600' },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: (value) => `${(value * 100).toFixed(0)}%`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    max: 1,
                },
                y: {
                    stacked: true,
                    ticks: { color: '#334155' },
                    grid: { display: false },
                },
            },
        }),
        [t]
    );

    const populationRegions = [
        { name: 'Алматинская область', population: 2_210_000, perCapitaTotal: 2_150_000, statePerCapita: 1_480_000, privatePerCapita: 670_000 },
        { name: 'город Алматы', population: 2_000_000, perCapitaTotal: 2_180_000, statePerCapita: 1_430_000, privatePerCapita: 750_000 },
        { name: 'город Астана', population: 1_350_000, perCapitaTotal: 2_120_000, statePerCapita: 1_450_000, privatePerCapita: 670_000 },
        { name: 'Туркестанская область', population: 2_050_000, perCapitaTotal: 1_320_000, statePerCapita: 1_060_000, privatePerCapita: 260_000 },
        { name: 'Карагандинская область', population: 1_130_000, perCapitaTotal: 1_540_000, statePerCapita: 1_240_000, privatePerCapita: 300_000 },
        { name: 'Восточно-Казахстанская область', population: 1_400_000, perCapitaTotal: 1_430_000, statePerCapita: 1_120_000, privatePerCapita: 310_000 },
        { name: 'Жамбылская область', population: 1_200_000, perCapitaTotal: 1_280_000, statePerCapita: 1_010_000, privatePerCapita: 270_000 },
        { name: 'город Шымкент', population: 1_200_000, perCapitaTotal: 1_260_000, statePerCapita: 980_000, privatePerCapita: 280_000 },
        { name: 'Актюбинская область', population: 915_000, perCapitaTotal: 1_080_000, statePerCapita: 860_000, privatePerCapita: 220_000 },
        { name: 'Кызылординская область', population: 840_000, perCapitaTotal: 1_040_000, statePerCapita: 820_000, privatePerCapita: 220_000 },
        { name: 'Костанайская область', population: 870_000, perCapitaTotal: 1_030_000, statePerCapita: 810_000, privatePerCapita: 220_000 },
        { name: 'Атырауская область', population: 665_000, perCapitaTotal: 1_240_000, statePerCapita: 950_000, privatePerCapita: 290_000 },
        { name: 'Мангистауская область', population: 720_000, perCapitaTotal: 1_210_000, statePerCapita: 920_000, privatePerCapita: 290_000 },
        { name: 'Павлодарская область', population: 750_000, perCapitaTotal: 1_180_000, statePerCapita: 900_000, privatePerCapita: 280_000 },
        { name: 'Западно-Казахстанская область', population: 690_000, perCapitaTotal: 1_150_000, statePerCapita: 880_000, privatePerCapita: 270_000 },
        { name: 'Северо-Казахстанская область', population: 550_000, perCapitaTotal: 980_000, statePerCapita: 740_000, privatePerCapita: 240_000 },
    ];

    const populationTotal = populationRegions.reduce((sum, region) => sum + region.population, 0);

    const populationChartData = useMemo(
        () => ({
            labels: populationRegions.map((region) => region.name),
            datasets: [
                {
                    type: 'bar',
                    label: t(
                        'directionsPages.healthAccounts.regions.population.totalLabel',
                        'Расходы на 1 жителя (тыс. тг.)'
                    ),
                    data: populationRegions.map((region) => Math.round(region.perCapitaTotal / 1_000)),
                    backgroundColor: '#38bdf8',
                    borderRadius: 6,
                    maxBarThickness: 34,
                    valueLabels: {
                        formatter: (value) => new Intl.NumberFormat('ru-RU').format(value),
                        offsetY: 18,
                        backgroundColor: 'rgba(37, 99, 235, 0.85)',
                        color: '#f8fafc',
                    },
                },
                {
                    type: 'line',
                    yAxisID: 'y1',
                    label: t(
                        'directionsPages.healthAccounts.regions.population.stateLabel',
                        'Гос. расходы (тыс. тг.)'
                    ),
                    data: populationRegions.map((region) => Math.round(region.statePerCapita / 1_000)),
                    borderColor: '#1d4ed8',
                    backgroundColor: '#1d4ed8',
                    borderWidth: 2,
                    tension: 0.25,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    valueLabels: {
                        formatter: (value) => `${value}`,
                        offsetY: 28,
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#f8fafc',
                    },
                },
                {
                    type: 'line',
                    yAxisID: 'y1',
                    label: t(
                        'directionsPages.healthAccounts.regions.population.privateLabel',
                        'Частные расходы (тыс. тг.)'
                    ),
                    data: populationRegions.map((region) => Math.round(region.privatePerCapita / 1_000)),
                    borderColor: '#f97316',
                    backgroundColor: '#f97316',
                    borderWidth: 2,
                    tension: 0.25,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    valueLabels: {
                        formatter: (value) => `${value}`,
                        offsetY: 28,
                        backgroundColor: 'rgba(249, 115, 22, 0.9)',
                        color: '#fff',
                    },
                },
            ],
        }),
        [populationRegions, t]
    );

    const populationChartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            context.dataset.type === 'line'
                                ? `${context.dataset.label}: ${new Intl.NumberFormat('ru-RU').format(
                                      context.raw
                                  )} тыс. тг.`
                                : `${context.dataset.label}: ${new Intl.NumberFormat('ru-RU').format(
                                      Math.round(context.raw)
                                  )} тг.`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.population.chartTitle',
                        'Расходы на 1 жителя по регионам 2022 г.'
                    ),
                    color: '#0f172a',
                    font: { size: 18, weight: '600' },
                    padding: { bottom: 16 },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#334155',
                        maxRotation: 45,
                        minRotation: 35,
                        font: { size: 11 },
                    },
                    grid: { display: false },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) =>
                            `${new Intl.NumberFormat('ru-RU').format(Math.round(value))}`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `${value}`,
                        color: '#334155',
                    },
                    grid: { drawOnChartArea: false },
                },
            },
        }),
        [t]
    );

    const financingModes = [
        {
            id: 'budget',
            label: t('directionsPages.healthAccounts.regions.financing.tabs.budget', 'Бюджет'),
            data: [191_000_000, 140_000_000, 134_000_000, 117_000_000, 109_000_000, 107_000_000, 74_000_000, 73_000_000, 65_000_000, 63_000_000, 58_000_000, 57_000_000, 55_000_000, 52_000_000, 47_000_000, 46_000_000, 45_000_000, 42_000_000],
        },
        {
            id: 'dms',
            label: t('directionsPages.healthAccounts.regions.financing.tabs.dms', 'ДМС'),
            data: [58_000_000, 50_000_000, 44_000_000, 39_000_000, 34_000_000, 32_000_000, 28_000_000, 25_000_000, 22_000_000, 20_000_000, 18_000_000, 17_000_000, 15_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 8_000_000],
        },
        {
            id: 'pocket',
            label: t('directionsPages.healthAccounts.regions.financing.tabs.pocket', 'Карманные'),
            data: [84_000_000, 78_000_000, 72_000_000, 68_000_000, 61_000_000, 55_000_000, 49_000_000, 44_000_000, 41_000_000, 38_000_000, 34_000_000, 30_000_000, 27_000_000, 24_000_000, 22_000_000, 20_000_000, 19_000_000, 17_000_000],
        },
        {
            id: 'osms',
            label: t('directionsPages.healthAccounts.regions.financing.tabs.osms', 'ОСМС'),
            data: [132_000_000, 118_000_000, 110_000_000, 100_000_000, 94_000_000, 88_000_000, 81_000_000, 76_000_000, 70_000_000, 66_000_000, 60_000_000, 56_000_000, 52_000_000, 50_000_000, 47_000_000, 44_000_000, 41_000_000, 39_000_000],
        },
        {
            id: 'enterprise',
            label: t('directionsPages.healthAccounts.regions.financing.tabs.enterprise', 'Предприятия'),
            data: [46_000_000, 42_000_000, 38_000_000, 34_000_000, 32_000_000, 30_000_000, 27_000_000, 24_000_000, 22_000_000, 20_000_000, 18_000_000, 16_000_000, 15_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_000_000],
        },
    ];

    const financingBreakdown = {
        budget: {
            pharma: [42_000_000, 36_000_000, 34_000_000, 32_000_000, 29_000_000, 28_000_000, 26_000_000, 24_000_000, 22_000_000, 20_000_000, 18_000_000, 17_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000],
            stationary: [58_000_000, 44_000_000, 40_000_000, 36_000_000, 32_000_000, 30_000_000, 28_000_000, 26_000_000, 24_000_000, 22_000_000, 21_000_000, 20_000_000, 19_000_000, 18_000_000, 17_000_000, 16_000_000, 15_000_000, 14_000_000],
            primary: [38_000_000, 32_000_000, 28_000_000, 24_000_000, 22_000_000, 20_000_000, 18_000_000, 16_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_000_000, 8_500_000, 8_000_000, 7_500_000],
            rehab: [12_000_000, 10_000_000, 9_000_000, 8_000_000, 7_500_000, 7_000_000, 6_500_000, 6_000_000, 5_600_000, 5_200_000, 4_800_000, 4_400_000, 4_100_000, 3_800_000, 3_500_000, 3_300_000, 3_100_000, 2_900_000],
            other: [41_000_000, 34_000_000, 32_000_000, 27_000_000, 25_000_000, 22_000_000, 21_000_000, 19_000_000, 18_000_000, 17_000_000, 16_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_500_000],
        },
        dms: {
            pharma: [18_000_000, 16_000_000, 14_000_000, 12_000_000, 11_000_000, 10_000_000, 9_500_000, 9_000_000, 8_500_000, 8_000_000, 7_500_000, 7_000_000, 6_500_000, 6_000_000, 5_500_000, 5_000_000, 4_600_000, 4_200_000],
            stationary: [24_000_000, 21_000_000, 18_000_000, 17_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_500_000, 9_000_000, 8_500_000, 8_000_000, 7_500_000, 7_000_000, 6_500_000, 6_000_000],
            primary: [8_000_000, 7_500_000, 7_000_000, 6_000_000, 5_500_000, 5_000_000, 4_800_000, 4_600_000, 4_300_000, 4_000_000, 3_800_000, 3_600_000, 3_400_000, 3_200_000, 3_000_000, 2_800_000, 2_600_000, 2_500_000],
            rehab: [4_000_000, 3_500_000, 3_200_000, 2_900_000, 2_700_000, 2_500_000, 2_300_000, 2_100_000, 1_900_000, 1_700_000, 1_600_000, 1_500_000, 1_400_000, 1_300_000, 1_200_000, 1_100_000, 1_000_000, 950_000],
            other: [4_000_000, 3_500_000, 3_300_000, 3_000_000, 2_800_000, 2_600_000, 2_400_000, 2_200_000, 2_000_000, 1_900_000, 1_800_000, 1_700_000, 1_600_000, 1_500_000, 1_400_000, 1_300_000, 1_200_000, 1_100_000],
        },
        pocket: {
            pharma: [32_000_000, 29_000_000, 26_000_000, 24_000_000, 22_000_000, 20_000_000, 18_500_000, 17_000_000, 15_500_000, 14_500_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_000_000, 8_200_000, 7_600_000, 7_000_000],
            stationary: [20_000_000, 18_000_000, 17_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_500_000, 9_000_000, 8_500_000, 8_000_000, 7_500_000, 7_000_000, 6_500_000, 6_000_000, 5_500_000],
            primary: [12_000_000, 11_000_000, 10_000_000, 9_000_000, 8_300_000, 7_600_000, 7_000_000, 6_600_000, 6_200_000, 5_800_000, 5_400_000, 5_000_000, 4_600_000, 4_200_000, 3_900_000, 3_700_000, 3_400_000, 3_200_000],
            rehab: [7_000_000, 6_400_000, 5_900_000, 5_400_000, 5_000_000, 4_600_000, 4_200_000, 3_900_000, 3_600_000, 3_300_000, 3_100_000, 2_900_000, 2_700_000, 2_500_000, 2_300_000, 2_100_000, 1_900_000, 1_800_000],
            other: [13_000_000, 11_500_000, 11_000_000, 10_000_000, 9_300_000, 8_500_000, 8_000_000, 7_500_000, 7_000_000, 6_500_000, 6_000_000, 5_600_000, 5_200_000, 4_800_000, 4_500_000, 4_200_000, 3_900_000, 3_600_000],
        },
        osms: {
            pharma: [36_000_000, 31_000_000, 29_000_000, 26_000_000, 24_000_000, 22_000_000, 21_000_000, 20_000_000, 19_000_000, 18_000_000, 17_000_000, 16_000_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_500_000],
            stationary: [48_000_000, 42_000_000, 38_000_000, 34_000_000, 31_000_000, 29_000_000, 27_000_000, 25_000_000, 23_000_000, 22_000_000, 21_000_000, 20_000_000, 19_000_000, 18_000_000, 17_000_000, 16_000_000, 15_000_000, 14_000_000],
            primary: [28_000_000, 25_000_000, 22_000_000, 20_000_000, 18_000_000, 16_500_000, 15_000_000, 14_000_000, 13_000_000, 12_000_000, 11_000_000, 10_000_000, 9_500_000, 9_000_000, 8_500_000, 8_000_000, 7_500_000, 7_000_000],
            rehab: [10_000_000, 9_000_000, 8_400_000, 7_800_000, 7_200_000, 6_800_000, 6_200_000, 5_800_000, 5_400_000, 5_000_000, 4_700_000, 4_400_000, 4_100_000, 3_900_000, 3_600_000, 3_400_000, 3_200_000, 3_000_000],
            other: [10_000_000, 9_000_000, 8_000_000, 7_000_000, 6_800_000, 6_400_000, 6_000_000, 5_600_000, 5_200_000, 4_900_000, 4_600_000, 4_300_000, 4_000_000, 3_800_000, 3_600_000, 3_400_000, 3_200_000, 3_000_000],
        },
        enterprise: {
            pharma: [12_000_000, 11_000_000, 10_000_000, 9_000_000, 8_200_000, 7_600_000, 7_000_000, 6_500_000, 6_000_000, 5_600_000, 5_200_000, 4_800_000, 4_500_000, 4_200_000, 4_000_000, 3_800_000, 3_600_000, 3_400_000],
            stationary: [14_000_000, 12_000_000, 11_000_000, 10_000_000, 9_200_000, 8_500_000, 7_800_000, 7_200_000, 6_800_000, 6_400_000, 6_000_000, 5_600_000, 5_300_000, 5_000_000, 4_600_000, 4_300_000, 4_000_000, 3_800_000],
            primary: [8_000_000, 7_200_000, 6_800_000, 6_200_000, 5_800_000, 5_400_000, 5_000_000, 4_600_000, 4_300_000, 4_000_000, 3_700_000, 3_400_000, 3_200_000, 3_000_000, 2_800_000, 2_600_000, 2_400_000, 2_200_000],
            rehab: [4_000_000, 3_600_000, 3_200_000, 2_900_000, 2_700_000, 2_500_000, 2_300_000, 2_100_000, 1_900_000, 1_800_000, 1_600_000, 1_500_000, 1_400_000, 1_300_000, 1_200_000, 1_100_000, 1_000_000, 950_000],
            other: [8_000_000, 7_200_000, 6_800_000, 6_200_000, 5_800_000, 5_400_000, 5_000_000, 4_600_000, 4_300_000, 4_000_000, 3_700_000, 3_400_000, 3_200_000, 3_000_000, 2_800_000, 2_600_000, 2_400_000, 2_200_000],
        },
    };

    const financingBarData = useMemo(() => {
        const selected = financingModes.find((mode) => mode.id === financingTab) ?? financingModes[0];
        return {
            labels: regionNames,
            datasets: [
                {
                    label: t(
                        'directionsPages.healthAccounts.regions.financing.financingLabel',
                        'Расходы по источнику финансирования'
                    ),
                    data: selected.data,
                    backgroundColor: '#0ea5e9',
                    borderRadius: 6,
                    valueLabels: {
                        formatter: (value) => `${(value / 1_000_000).toFixed(0)}M`,
                        offsetY: 18,
                        backgroundColor: 'rgba(15, 23, 42, 0.87)',
                        color: '#f8fafc',
                    },
                },
            ],
        };
    }, [financingTab, t]);

    const financingBarOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.financing.financingTitle',
                        'Расходы на медуслуги по виду финансирования в разрезе регионов 2022 г. (финансирование)'
                    ),
                    color: '#0f172a',
                    font: { size: 16, weight: '600' },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#334155',
                        maxRotation: 45,
                        minRotation: 35,
                        font: { size: 11 },
                    },
                    grid: { display: false },
                },
                y: {
                    ticks: {
                        callback: (value) => `${(value / 1_000_000).toFixed(0)}M`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                },
            },
        }),
        [t]
    );

    const financingServiceData = useMemo(() => {
        const serviceData = financingBreakdown[financingTab] ?? financingBreakdown.budget;
        const serviceKeys = Object.keys(serviceData);

        return {
            labels: regionNames,
            datasets: serviceKeys.map((key, index) => ({
                label:
                    key === 'pharma'
                        ? t('directionsPages.healthAccounts.regions.financing.datasets.pharma', 'Фарм')
                        : key === 'stationary'
                        ? t('directionsPages.healthAccounts.regions.financing.datasets.stationary', 'Стационар')
                        : key === 'primary'
                        ? t('directionsPages.healthAccounts.regions.financing.datasets.primary', 'АПП')
                        : key === 'rehab'
                        ? t('directionsPages.healthAccounts.regions.financing.datasets.rehab', 'Реабилитация')
                        : t('directionsPages.healthAccounts.regions.financing.datasets.other', 'Прочие'),
                data: serviceData[key],
                backgroundColor: ['#0ea5e9', '#2563eb', '#38bdf8', '#f97316', '#6366f1'][index % 5],
                borderRadius: 4,
                stack: 'serviceBreakdown',
            })),
        };
    }, [financingTab, t]);

    const financingServiceOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { boxWidth: 12, boxHeight: 12, font: { size: 11 } },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCompact(context.raw)} тенге`,
                    },
                },
                title: {
                    display: true,
                    text: t(
                        'directionsPages.healthAccounts.regions.financing.serviceTitle',
                        'Расходы на медуслуги по виду финансирования в разрезе регионов 2022 г. (мед.услуги)'
                    ),
                    color: '#0f172a',
                    font: { size: 16, weight: '600' },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#334155',
                        maxRotation: 45,
                        minRotation: 35,
                        font: { size: 11 },
                    },
                    grid: { display: false },
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: (value) => `${(value / 1_000_000).toFixed(0)}M`,
                        color: '#334155',
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                },
            },
        }),
        [t]
    );

    const tabs = [
        {
            id: 'expenses',
            label: t(
                'directionsPages.healthAccounts.regions.tabs.expenses',
                'Расходы на здравоохранение по регионам (НС-НР)'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="h-[460px]">
                            <Bar data={barWithTrendData} options={barWithTrendOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="h-[420px]">
                                <Bar data={functionsStackedData} options={functionsStackedOptions} />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="h-[420px]">
                                <Bar data={perCapitaData} options={perCapitaOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'placeholder2',
            label: t(
                'directionsPages.healthAccounts.regions.tabs.medicalAid',
                'Распределение по мед.помощи по регионам'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medicalAidCharts.map((chart) => (
                            <div key={chart.id} className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-slate-600 mb-4">
                                    {chart.title}
                                </h3>
                                <div className="h-[360px]">
                                    <Bar
                                        data={{
                                            labels: chart.labels,
                                            datasets: chart.datasets.map((dataset) => ({
                                                ...dataset,
                                                borderRadius: 4,
                                            })),
                                        }}
                                        options={medicalAidOptions}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'placeholder3',
            label: t(
                'directionsPages.healthAccounts.regions.tabs.financing',
                'Расходы на мед.услуги по виду финансирования по регионам'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="h-[450px]">
                            <Bar data={shareChartData} options={shareChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {financingModes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setFinancingTab(mode.id)}
                                    type="button"
                                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                                        financingTab === mode.id
                                            ? 'bg-slate-900 text-white shadow'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="h-[360px]">
                                <Bar data={financingBarData} options={financingBarOptions} />
                            </div>
                            <div className="h-[360px]">
                                <Bar data={financingServiceData} options={financingServiceOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'placeholder4',
            label: t(
                'directionsPages.healthAccounts.regions.tabs.stateShare',
                'Доли расходов гос/част по регионам'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stateShareCharts.map((chart) => (
                            <div key={chart.id} className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                                    {chart.title}
                                </h3>
                                <div className="h-[320px]">
                                    <Bar
                                        data={{
                                            labels: chart.labels,
                                            datasets: [
                                                {
                                                    label: t(
                                                        'directionsPages.healthAccounts.regions.stateShare.stateLabel',
                                                        'Государственные'
                                                    ),
                                                    data: chart.stateData,
                                                    backgroundColor: '#2563eb',
                                                    borderRadius: 4,
                                                    stack: 'share',
                                                },
                                                {
                                                    label: t(
                                                        'directionsPages.healthAccounts.regions.stateShare.privateLabel',
                                                        'Частные'
                                                    ),
                                                    data: chart.stateData.map((value) => 1 - value),
                                                    backgroundColor: '#1d4ed8',
                                                    borderRadius: 4,
                                                    stack: 'share',
                                                },
                                            ],
                                        }}
                                        options={stateShareOptions}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'placeholder5',
            label: t(
                'directionsPages.healthAccounts.regions.tabs.population',
                'Население РК в разрезе регионов'
            ),
            render: () => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),280px] gap-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="h-[480px]">
                                <Bar data={populationChartData} options={populationChartOptions} />
                            </div>
                        </div>
                        <aside className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm uppercase tracking-wide text-slate-500">
                                {t('directionsPages.healthAccounts.regions.population.totalTitle', 'Население РК')}
                            </p>
                            <p className="text-4xl font-bold text-slate-900 mt-2">
                                {new Intl.NumberFormat('ru-RU').format(populationTotal)}
                            </p>

                            <div className="mt-6 space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                {populationRegions.map((region) => (
                                    <label
                                        key={region.name}
                                        className="flex items-center gap-3 text-sm text-slate-700"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                                            checked={populationFilter === region.name}
                                            onChange={() =>
                                                setPopulationFilter((prev) =>
                                                    prev === region.name ? 'all' : region.name
                                                )
                                            }
                                        />
                                        <span className="flex flex-col">
                                            <span>{region.name}</span>
                                            <span className="text-xs text-slate-500">
                                                {new Intl.NumberFormat('ru-RU').format(region.population)}{' '}
                                                {t(
                                                    'directionsPages.healthAccounts.regions.population.personSuffix',
                                                    'чел.'
                                                )}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </aside>
                    </div>
                    {populationFilter !== 'all' && (
                        <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-900">
                            {t(
                                'directionsPages.healthAccounts.regions.population.filterHint',
                                'Выбран регион: {region}. Фильтрация визуально не применяется, данные представлены для справки.',
                                { region: populationFilter }
                            )}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const renderTabContent = () => {
        const tab = tabs.find((item) => item.id === activeTab);
        if (!tab) {
            return null;
        }

        if (tab.render) {
            return tab.render();
        }

        return (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                {t(
                    'directionsPages.healthAccounts.regions.tabs.inProgress',
                    'Содержимое вкладки находится в разработке'
                )}
            </div>
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
                                ? 'bg-sky-600 text-white shadow-md'
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

export default HealthAccountsRegions;


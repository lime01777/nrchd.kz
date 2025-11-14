import React, { useMemo } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Регистрируем необходимые элементы Chart.js один раз при загрузке модуля
ChartJS.register(ArcElement, Tooltip, Legend);

const HealthAccountsDashboard = ({ t }) => {
    // Набор исходных числовых значений дашборда (в тенге)
    const totals = {
        overall: 4042808855,
        current: 3871829196,
        capital: 170979659,
        stateCurrent: 2389999999,
        privateCurrent: 1481829197,
        totalPerCapita: 204543.8,
        currentPerCapita: 195893.2,
        overallGdpShare: 3.9,
        currentGdpShare: 3.7,
        capitalGdpShare: 0.2,
        stateGdpShare: 2.3,
        privateGdpShare: 1.4,
        directPaymentsShare: 30.9,
    };

    // Общий форматтер чисел с разделителями тысяч
    const formatNumber = (value, options = {}) =>
        new Intl.NumberFormat('ru-RU', options).format(value);

    // Данные для круговых диаграмм – мемоизируем, чтобы не пересоздавать при каждом рендере
    const totalVsCapitalChart = useMemo(
        () => ({
            labels: [
                t('directionsPages.healthAccounts.dashboard.charts.total.current', 'Текущие расходы'),
                t('directionsPages.healthAccounts.dashboard.charts.total.capital', 'Капитальные расходы'),
            ],
            datasets: [
                {
                    data: [totals.current, totals.capital],
                    backgroundColor: ['#f97316', '#a855f7'],
                    borderWidth: 0,
                },
            ],
        }),
        [t, totals.current, totals.capital]
    );

    const currentSplitChart = useMemo(
        () => ({
            labels: [
                t('directionsPages.healthAccounts.dashboard.charts.current.state', 'Государственные расходы'),
                t('directionsPages.healthAccounts.dashboard.charts.current.private', 'Частные расходы'),
            ],
            datasets: [
                {
                    data: [totals.stateCurrent, totals.privateCurrent],
                    backgroundColor: ['#2563eb', '#1e3a8a'],
                    borderWidth: 0,
                },
            ],
        }),
        [t, totals.stateCurrent, totals.privateCurrent]
    );

    // Общие настройки диаграмм: отключаем легенду для компактности и настраиваем тултип
    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        title: (context) => context[0].label,
                        label: (context) => {
                            const rawValue = context.raw;
                            const total = context.dataset.data.reduce((acc, item) => acc + item, 0);
                            const percentage = (rawValue / total) * 100;
                            return `${formatNumber(rawValue)} тенге · ${percentage.toFixed(1)}%`;
                        },
                    },
                    backgroundColor: 'rgba(17, 24, 39, 0.92)',
                    padding: 12,
                    cornerRadius: 8,
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    titleFont: {
                        size: 14,
                        weight: '700',
                        family: "'Inter', sans-serif",
                    },
                    bodyFont: {
                        size: 13,
                        weight: '500',
                        family: "'Inter', sans-serif",
                    },
                    displayColors: false,
                },
            },
            cutout: '62%',
            layout: {
                padding: 12,
            },
            hoverOffset: 16,
        }),
        [formatNumber]
    );

    // Массив карточек с процентами для более компактного рендера
    const percentageCards = [
        {
            title: t('directionsPages.healthAccounts.dashboard.cards.capitalGdp', 'Доля капитальных расходов на здравоохранение от ВВП'),
            value: `${totals.capitalGdpShare}%`,
            color: 'bg-violet-100 text-violet-900',
        },
        {
            title: t('directionsPages.healthAccounts.dashboard.cards.stateGdp', 'Доля государственных расходов от ВВП'),
            value: `${totals.stateGdpShare}%`,
            color: 'bg-violet-200 text-violet-900',
        },
        {
            title: t('directionsPages.healthAccounts.dashboard.cards.privateGdp', 'Доля частных расходов от ВВП'),
            value: `${totals.privateGdpShare}%`,
            color: 'bg-violet-100 text-violet-900',
        },
        {
            title: t('directionsPages.healthAccounts.dashboard.cards.directPayments', 'Доля прямых платежей от Текущих расходов на здравоохранение'),
            value: `${totals.directPaymentsShare}%`,
            color: 'bg-violet-200 text-violet-900',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Карточка: общие расходы */}
                <div className="xl:col-span-4 bg-rose-50 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-rose-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.overall.title', 'Общие расходы на здравоохранение')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-rose-900">
                        {formatNumber(totals.overall)}
                    </p>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="h-56 w-full max-w-sm">
                            {/* Диаграмма показывающая структуру общих расходов */}
                            <Pie data={totalVsCapitalChart} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Карточка: текущие расходы */}
                <div className="xl:col-span-4 bg-sky-50 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-sky-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.current.title', 'Текущие расходы на здравоохранение (ТРЗ)')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-sky-900">
                        {formatNumber(totals.current)}
                    </p>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="h-56 w-full max-w-sm">
                            {/* Диаграмма показывающая доли текущих расходов между секторами */}
                            <Doughnut data={currentSplitChart} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Правая колонка с дополнительными показателями */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-violet-100 rounded-2xl p-6 shadow-sm">
                        <p className="text-sm font-medium text-violet-700 uppercase tracking-wide">
                            {t('directionsPages.healthAccounts.dashboard.capital.title', 'Капитальные расходы на здравоохранение (КРЗ)')}
                        </p>
                        <p className="mt-3 text-4xl font-bold text-violet-900">
                            {formatNumber(totals.capital)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {percentageCards.map((card) => (
                            <div key={card.title} className={`rounded-2xl p-4 shadow-sm ${card.color}`}>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                                    {card.title}
                                </p>
                                <p className="mt-4 text-3xl font-bold">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Нижние карточки с показателями на душу населения и долями */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-rose-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-rose-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.gdpShareTotal.title', 'Доля общих расходов на здравоохранение от ВВП')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-rose-900">
                        {totals.overallGdpShare}%
                    </p>
                </div>
                <div className="bg-sky-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-sky-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.gdpShareCurrent.title', 'Доля текущих расходов на здравоохранение от ВВП')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-sky-900">
                        {totals.currentGdpShare}%
                    </p>
                </div>
                <div className="bg-rose-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-rose-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.perCapitaTotal.title', 'Общие расходы на здравоохранение на душу населения')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-rose-900">
                        {formatNumber(totals.totalPerCapita, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        })}
                    </p>
                </div>
                <div className="bg-sky-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-sky-700 uppercase tracking-wide">
                        {t('directionsPages.healthAccounts.dashboard.perCapitaCurrent.title', 'Текущие расходы на здравоохранение на душу населения')}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-sky-900">
                        {formatNumber(totals.currentPerCapita, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HealthAccountsDashboard;


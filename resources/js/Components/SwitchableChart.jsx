import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SwitchableChart = ({ t }) => {

    // Статистические данные за 11 месяцев 2025 года
    const statisticsData = {
        births: {
            total: `295 826 ${t('directionsPages.medicalStatistics.chart.units.people', 'чел.')}`,
            boys: '152 283',
            boysPercent: '51%', // Доля мальчиков
            girls: '143 543',
            girlsPercent: '49%', // Доля девочек
            twins: '3 119',
            triplets: '24',
            date: `${t('directionsPages.medicalStatistics.chart.births.datePrefix', 'Данные за')} 11 месяцев 2025 года`
        },
        discharged: {
            total: `3 132 593 ${t('directionsPages.medicalStatistics.chart.units.people', 'чел.')}`,
            totalds: `1 362 108 ${t('directionsPages.medicalStatistics.chart.units.people', 'чел.')}`,
            planned: '1 169 101', // Планово (круглосуточный стационар)
            plannedPercent: '37%', // Доля плановых
            emergency: '1 963 492', // Экстренно (круглосуточный стационар)
            emergencyPercent: '63%', // Доля экстренных
            date: `${t('directionsPages.medicalStatistics.chart.discharged.datePrefix', 'Данные за')} 11 месяцев 2025 года`
        },
        operations: {
            total: '824 500',
            planned: '372 458',
            plannedPercent: '45%', // Доля плановых операций
            emergency: '452 042',
            emergencyPercent: '55%', // Доля экстренных операций
            heartSurgery: '11 800',
            date: `${t('directionsPages.medicalStatistics.chart.operations.datePrefix', 'Данные за')} 11 месяцев 2025 года`
        },
        patients: {
            dynamicObservation: '3 820 266', // Пациенты на динамическом наблюдении (на дату 30.11.2025г.)
            alo: '1 797 009', // Пациенты на АЛО (за 9 месяцев 2025 года)
            dynamicObservationDate: 'на дату 30.11.2025г.',
            aloDate: 'за 9 месяцев 2025 года',
            date: `${t('directionsPages.medicalStatistics.chart.patients.datePrefix', 'Данные за')} 11 месяцев 2025 года`
        }
    };
    
    // Данные для графика посещений по специальностям
    const visitsData = {
        labels: ['01.2024', '02.2024', '03.2024', '04.2024', '05.2024', '06.2024', 
                 '07.2024', '08.2024', '09.2024', '10.2024', '11.2024', '12.2024'],
        datasets: [
            {
                label: t('directionsPages.medicalStatistics.chart.visits.cardiologist', 'Кардиолог'),
                data: [201573, 213414, 174273, 221026, 195119, 178255, 172210, 164894, 194624, 218235, 217230, 213503],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
            {
                label: t('directionsPages.medicalStatistics.chart.visits.neurologist', 'Невропатолог'),
                data: [352539, 408248, 347710, 492411, 439066, 390007, 354707, 337076, 377168, 419346, 409692, 362040],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
            {
                label: t('directionsPages.medicalStatistics.chart.visits.endocrinologist', 'Эндокринолог'),
                data: [225845, 311994, 269925, 371188, 331793, 265813, 227127, 193969, 238472, 272867, 277635, 246908],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
            },
            {
                label: t('directionsPages.medicalStatistics.chart.visits.therapist', 'Терапевт'),
                data: [600016, 644815, 496365, 629849, 531892, 482643, 490575, 448065, 519507, 583171, 482983, 425878],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    // Опции для графика посещений
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: t('directionsPages.medicalStatistics.chart.visits.title', 'Число посещений в ПМСП'),
                font: {
                    size: 16,
                }
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
            {/* Верхняя часть - статистические данные */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {/* Блок о родившихся */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">{t('directionsPages.medicalStatistics.chart.births.title', 'Число родившихся')}</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.births.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.births.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.births.boys', 'Мальчики')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.boys} <span className="text-lg text-gray-500">({statisticsData.births.boysPercent})</span></p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.births.girls', 'Девочки')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.girls} <span className="text-lg text-gray-500">({statisticsData.births.girlsPercent})</span></p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.births.twins', 'Двойни')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.twins}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.births.triplets', 'Тройни')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.triplets}</p>
                        </div>
                    </div>
                </div>
                
                {/* Блок о выбывших */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">{t('directionsPages.medicalStatistics.chart.discharged.title', 'Число пролеченных в круглосуточном стационаре')}</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.discharged.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.discharged.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.discharged.planned', 'Планово')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.discharged.planned} <span className="text-lg text-gray-500">({statisticsData.discharged.plannedPercent})</span></p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.discharged.emergency', 'Экстренно')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.discharged.emergency} <span className="text-lg text-gray-500">({statisticsData.discharged.emergencyPercent})</span></p>
                        </div>
                    </div>
                    <br />
                    <div className="mt-2">
                        <h3 className="text-xl font-bold mb-2 text-purple-800">{t('directionsPages.medicalStatistics.chart.discharged.dayTitle', 'Число пролеченных в дневном стационаре')}</h3>
                        <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.discharged.totalds}</p>
                        <p className="text-xs mb-4 text-gray-500">{statisticsData.discharged.date}</p>
                    </div>
                </div>
                
                {/* Блок об операциях */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">{t('directionsPages.medicalStatistics.chart.operations.title', 'Число оперированных')}</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.operations.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.operations.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.operations.planned', 'Планово')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.planned} <span className="text-lg text-gray-500">({statisticsData.operations.plannedPercent})</span></p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">{t('directionsPages.medicalStatistics.chart.operations.emergency', 'Экстренно')}</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.emergency} <span className="text-lg text-gray-500">({statisticsData.operations.emergencyPercent})</span></p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">{t('directionsPages.medicalStatistics.chart.operations.heartSurgery', 'из них операций на открытом сердце')}</p>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.heartSurgery}</p>
                    </div>
                </div>
                
                {/* Блок о пациентах */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-4 text-purple-800">{t('directionsPages.medicalStatistics.chart.patients.dynamicObservationTitle', 'Пациенты на динамическом наблюдении')}</h3>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.patients.dynamicObservation}</p>
                        <p className="text-xs text-gray-500">{statisticsData.patients.dynamicObservationDate}</p>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-4 text-purple-800">{t('directionsPages.medicalStatistics.chart.patients.aloTitle', 'Пациенты на АЛО')}</h3>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.patients.alo}</p>
                        <p className="text-xs text-gray-500">{statisticsData.patients.aloDate}</p>
                    </div>
                </div>
            </div>
            
            {/* Нижняя часть - график посещений */}
            <div className="h-[300px] mt-8 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <Line data={visitsData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SwitchableChart;

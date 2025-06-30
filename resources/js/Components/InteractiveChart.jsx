import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { t } from '@/Utils/TranslationHelper';
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
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const InteractiveChart = () => {
    // Get translations from page props
    const { translations } = usePage().props;

    // Состояние для хранения активного графика
    const [activeChart, setActiveChart] = useState('visits');

    // Данные для графика посещений ПМСП
    const visitsData = {
        labels: ['01.2024', '02.2024', '03.2024', '04.2024', '05.2024', '06.2024', '07.2024', '08.2024', '09.2024', '10.2024', '11.2024', '12.2024'],
        datasets: [
            {
                label: 'Кардиолог',
                data: [1200, 1350, 1100, 1400, 1250, 1300, 1150, 1200, 1350, 1400, 1300, 1250],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Невропатолог',
                data: [800, 850, 950, 1100, 900, 850, 800, 850, 900, 950, 900, 850],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Эндокринолог',
                data: [500, 550, 600, 650, 600, 550, 500, 450, 500, 550, 600, 550],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Терапевт',
                data: [1500, 1600, 1550, 1650, 1600, 1550, 1500, 1450, 1500, 1550, 1600, 1550],
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                tension: 0.4,
            },
        ],
    };

    // Данные для графика заболеваемости
    const diseasesData = {
        labels: ['01.2024', '02.2024', '03.2024', '04.2024', '05.2024', '06.2024', '07.2024', '08.2024', '09.2024', '10.2024', '11.2024', '12.2024'],
        datasets: [
            {
                label: 'Сердечно-сосудистые',
                data: [850, 900, 950, 1000, 950, 900, 850, 800, 850, 900, 950, 900],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Респираторные',
                data: [1200, 1500, 1300, 1100, 900, 800, 700, 800, 1000, 1200, 1300, 1400],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Эндокринные',
                data: [400, 420, 450, 470, 460, 450, 440, 430, 440, 450, 460, 450],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.4,
            },
        ],
    };

    // Данные для графика госпитализаций
    const hospitalizationsData = {
        labels: ['01.2024', '02.2024', '03.2024', '04.2024', '05.2024', '06.2024', '07.2024', '08.2024', '09.2024', '10.2024', '11.2024', '12.2024'],
        datasets: [
            {
                label: translations.common.chart_planned,
                data: [350, 380, 400, 420, 410, 400, 390, 380, 390, 400, 410, 400],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4,
            },
            {
                label: translations.common.chart_emergency,
                data: [150, 160, 170, 180, 170, 160, 150, 140, 150, 160, 170, 160],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
            },
        ],
    };

    // Опции для графиков
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: activeChart === 'visits' 
                    ? translations.common.chart_visits 
                    : activeChart === 'diseases' 
                        ? translations.common.chart_diseases 
                        : translations.common.chart_hospitalizations,
                font: {
                    size: 16,
                    weight: 'bold',
                    family: "'Inter', sans-serif"
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 6
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    // Определяем, какие данные использовать в зависимости от активного графика
    const chartData = activeChart === 'visits' 
        ? visitsData 
        : activeChart === 'diseases' 
            ? diseasesData 
            : hospitalizationsData;

    // Список доступных графиков
    const chartTypes = [
        { id: 'visits', name: translations.common.visits },
        { id: 'diseases', name: translations.common.diseases },
        { id: 'hospitalizations', name: translations.common.hospitalizations }
    ];

    return (
        <div className="bg-purple-50 p-6 rounded-lg">
            {/* Заголовок и вкладки для переключения графиков */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">{translations.common.medical_statistics}</h3>
                <div className="flex flex-wrap mt-4 md:mt-0">
                    {chartTypes.map((chart) => (
                        <button
                            key={chart.id}
                            onClick={() => setActiveChart(chart.id)}
                            className={`px-4 py-2 mr-2 mb-2 rounded-md text-sm font-medium transition-all ${
                                activeChart === chart.id
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-purple-700 hover:bg-purple-100'
                            }`}
                        >
                            {chart.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Контейнер для графика */}
            <div className="bg-white p-4 rounded-lg shadow-md h-80">
                <Line data={chartData} options={options} />
            </div>

            {/* Статистические данные под графиком */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeChart === 'visits' && (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Всего посещений</p>
                            <p className="text-2xl font-bold text-purple-700">24 680</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Кардиолог</p>
                            <p className="text-2xl font-bold text-teal-500">8 450</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Невропатолог</p>
                            <p className="text-2xl font-bold text-pink-500">6 230</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Терапевт</p>
                            <p className="text-2xl font-bold text-orange-500">10 000</p>
                        </div>
                    </>
                )}

                {activeChart === 'diseases' && (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Всего случаев</p>
                            <p className="text-2xl font-bold text-purple-700">15 420</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Сердечно-сосудистые</p>
                            <p className="text-2xl font-bold text-teal-500">5 230</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Респираторные</p>
                            <p className="text-2xl font-bold text-pink-500">7 890</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Эндокринные</p>
                            <p className="text-2xl font-bold text-blue-500">2 300</p>
                        </div>
                    </>
                )}

                {activeChart === 'hospitalizations' && (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Всего госпитализаций</p>
                            <p className="text-2xl font-bold text-purple-700">1 688</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Плановые</p>
                            <p className="text-2xl font-bold text-teal-500">912</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Экстренные</p>
                            <p className="text-2xl font-bold text-pink-500">716</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Операции на сердце</p>
                            <p className="text-2xl font-bold text-blue-500">675</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InteractiveChart;

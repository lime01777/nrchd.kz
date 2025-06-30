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

    // Статистические данные
    const statisticsData = {
        births: {
            total: '22 812 чел.',
            boys: '10 722',
            girls: '12 090',
            twins: '365',
            triplets: '29',
            pregravid: '10',
            date: 'Данные за май 2025 года'
        },
        discharged: {
            total: '1 406 627 чел.',
            discharged: '1 393 912',
            died: '12 715',
            date: 'Данные за май 2025 года'
        },
        operations: {
            total: '1688',
            planned: '912',
            emergency: '716',
            heartSurgery: '675',
            date: 'Данные за май 2025 года'
        },
        patients: {
            screening: '500',
            dynamicObservation: '1000',
            alo: '1000',
            date: 'Данные за май 2025 года'
        }
    };
    
    // Данные для графика посещений по специальностям
    const visitsData = {
        labels: ['01.2024', '02.2024', '03.2024', '04.2024', '05.2024', '06.2024', 
                 '07.2024', '08.2024', '09.2024', '10.2024', '11.2024', '12.2024'],
        datasets: [
            {
                label: 'Кардиолог',
                data: [201573, 213414, 174273, 221026, 195119, 178255, 172210, 164894, 194624, 218235, 217230, 213503],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Невропатолог',
                data: [352539, 408248, 347710, 492411, 439066, 390007, 354707, 337076, 377168, 419346, 409692, 362040],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Эндокринолог',
                data: [225845, 311994, 269925, 371188, 331793, 265813, 227127, 193969, 238472, 272867, 277635, 246908],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Терапевт',
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
                text: 'Число посещений в ПМСП',
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
                    <h3 className="text-xl font-bold mb-4 text-purple-800">ЧИСЛО РОДИВШИХСЯ</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.births.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.births.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Мальчики</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.boys}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Девочки</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.girls}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Двойни</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.twins}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Тройни</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.births.triplets}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Число женщин, прошедших прегравидарную подготовку</p>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.births.pregravid}</p>
                        <p className="text-xs text-gray-500">{statisticsData.births.date}</p>
                    </div>
                </div>
                
                {/* Блок о выбывших */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">ЧИСЛО ВЫБЫВШИХ</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.discharged.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.discharged.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Выписано</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.discharged.discharged}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Умерло</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.discharged.died}</p>
                        </div>
                    </div>
                </div>
                
                {/* Блок об операциях */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">ЧИСЛО ОПЕРИРОВАННЫХ</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.operations.total}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.operations.date}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Планово</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.planned}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1 text-gray-600">Экстренно</p>
                            <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.emergency}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">из них операций на открытом сердце</p>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.operations.heartSurgery}</p>
                    </div>
                </div>
                
                {/* Блок о пациентах */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">Число пациентов, прошедших скрининг</h3>
                    <p className="text-3xl font-bold mb-1 text-gray-900">{statisticsData.patients.screening}</p>
                    <p className="text-xs mb-4 text-gray-500">{statisticsData.patients.date}</p>
                    
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Число пациентов, взятых на динамическое наблюдение</p>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.patients.dynamicObservation}</p>
                        <p className="text-xs text-gray-500">{statisticsData.patients.date}</p>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Число пациентов на АЛО</p>
                        <p className="text-2xl font-bold text-gray-900">{statisticsData.patients.alo}</p>
                        <p className="text-xs text-gray-500">{statisticsData.patients.date}</p>
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

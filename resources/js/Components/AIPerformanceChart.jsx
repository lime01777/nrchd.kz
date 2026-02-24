import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

/**
 * Компонент радарной диаграммы производительности ИИ
 */
export default function AIPerformanceChart({ metrics = {}, title = 'Показатели эффективности' }) {
    // Стандартные медицинские метрики ИИ
    const labels = [
        'Чувствительность',
        'Специфичность',
        'Точность',
        'AUC',
        'Прогностичность (+)',
        'Прогностичность (-)',
    ];

    // Значения по умолчанию, если метрики не переданы
    const dataValues = [
        metrics.sensitivity || 0.92,
        metrics.specificity || 0.88,
        metrics.accuracy || 0.90,
        metrics.auc || 0.94,
        metrics.ppv || 0.85,
        metrics.npv || 0.95,
    ].map(val => val > 1 ? val / 100 : val); // Приводим к диапазону 0-1

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Значение',
                data: dataValues,
                backgroundColor: 'rgba(99, 68, 209, 0.2)', // Тот самый фиолетовый из дизайна
                borderColor: 'rgba(99, 68, 209, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(99, 68, 209, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 68, 209, 1)',
            },
            {
                label: 'Эталон',
                data: [1, 1, 1, 1, 1, 1], // Внешняя граница (максимум)
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
            }
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    stepSize: 0.2,
                    display: false // Скрываем цифры для чистоты
                },
                pointLabels: {
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif",
                        weight: '500'
                    },
                    color: '#6B7280'
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${(context.raw * 100).toFixed(1)}%`;
                    }
                }
            }
        },
        maintainAspectRatio: true,
        responsive: true,
    };

    return (
        <div className="w-full max-w-[300px] mx-auto">
            {title && <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">{title}</h4>}
            <div className="relative aspect-square">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
}

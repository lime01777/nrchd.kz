import React from 'react';
import ChartChlank from './ChartChlank';
import translationService from '@/services/TranslationService';

// Компонент для простых графиков (травмы и аккредитации)
const SimpleChart = ({ chartType }) => {
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    // Опции для графиков
    const chartOptions = {
        injuries: {
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
                    text: t('charts.injuries.title', 'Статистика производственных травм по отраслям'),
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
            elements: {
                line: {
                    tension: 0.4,
                    borderWidth: 2
                },
                point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 6
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
            }
        },
        accreditation: {
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
                    text: t('charts.accreditation.title', 'Количество аккредитованных организаций по регионам'),
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
            }
        }
    };

    // Данные для графиков
    const chartData = {
        injuries: {
            labels: ['Промышленность', 'Строительство', 'Транспорт', 'Сельское хозяйство', 'Здравоохранение', 'Образование'],
            datasets: [
                {
                    label: 'Тяжелые травмы',
                    data: [42, 38, 31, 25, 12, 8],
                    borderColor: 'rgb(220, 38, 38)',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    fill: true
                },
                {
                    label: 'Легкие травмы',
                    data: [120, 98, 85, 70, 45, 30],
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    fill: true
                },
                {
                    label: 'Смертельные случаи',
                    data: [8, 6, 5, 4, 1, 0],
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    fill: true
                }
            ]
        },
        accreditation: {
            type: 'bar',
            labels: ['Алматы', 'Астана', 'Шымкент', 'Карагандинская', 'ВКО', 'Алматинская', 'Акмолинская', 'Павлодарская'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Медицинские организации',
                    data: [78, 65, 48, 42, 38, 35, 28, 26],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                },
                {
                    type: 'bar',
                    label: 'Образовательные учреждения',
                    data: [45, 38, 30, 28, 25, 22, 18, 16],
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                }
            ]
        }
    };

    const currentChartData = chartData[chartType] || chartData.injuries;
    const currentChartOptions = chartOptions[chartType] || chartOptions.injuries;

    return (
        <ChartChlank 
            data={currentChartData} 
            options={currentChartOptions} 
        />
    );
};

export default SimpleChart;


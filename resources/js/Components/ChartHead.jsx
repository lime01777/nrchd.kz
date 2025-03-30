import React, { useState } from 'react';
import ChartChlank from './ChartChlank';

const Dashboard = ({ chartType = 'default' }) => {
    // Состояние для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Состояние для поиска
    const [searchTerm, setSearchTerm] = useState('');
    // Выбранный график
    const [selectedChart, setSelectedChart] = useState(chartType);

    // Примеры графиков (позже будут заменены на ссылки Power BI)
    const chartOptions = {
        default: {
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
                    text: 'Влияние производственных травм на мужскую смертность',
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
                    tension: 0.4, // делает линии более плавными
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
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        },
        
        // График производственных травм
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
                    text: 'Статистика производственных травм по отраслям',
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
        
        // График аккредитованных организаций
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
                    text: 'Количество аккредитованных организаций по регионам',
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
        default: {
            labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль'],
            datasets: [
                {
                    label: 'Смертность от травм',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: 'rgb(59, 130, 246)', // синий
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true
                },
                {
                    label: 'Количество травм',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: 'rgb(234, 88, 12)', // оранжевый
                    backgroundColor: 'rgba(234, 88, 12, 0.2)',
                    fill: true
                }
            ]
        },
        
        // Данные для графика травм
        injuries: {
            labels: ['Промышленность', 'Строительство', 'Транспорт', 'Сельское хозяйство', 'Здравоохранение', 'Образование'],
            datasets: [
                {
                    label: 'Тяжелые травмы',
                    data: [42, 38, 31, 25, 12, 8],
                    borderColor: 'rgb(220, 38, 38)', // красный
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    fill: true
                },
                {
                    label: 'Легкие травмы',
                    data: [120, 98, 85, 70, 45, 30],
                    borderColor: 'rgb(245, 158, 11)', // оранжевый
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
        
        // Данные для графика аккредитаций (столбчатый)
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

    // Список всех доступных графиков для поиска
    const availableCharts = [
        { id: 'default', name: 'Влияние производственных травм на мужскую смертность' },
        { id: 'injuries', name: 'Статистика производственных травм по отраслям' },
        { id: 'accreditation', name: 'Количество аккредитованных организаций по регионам' },
        { id: 'chart3', name: 'Сравнение смертности от сердечно-сосудистых заболеваний' },
        { id: 'chart4', name: 'Эффективность вакцинации от гриппа' },
        { id: 'chart5', name: 'Распространенность хронических заболеваний' }
    ];

    // Фильтрация графиков по поисковому запросу
    const filteredCharts = availableCharts.filter(chart =>
        chart.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Обработчик клика по графику для открытия модального окна
    const handleChartClick = () => {
        setIsModalOpen(true);
    };

    // Закрытие модального окна
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Выбор графика из списка
    const selectChart = (chartId) => {
        setSelectedChart(chartId);
        closeModal();
    };

    // Выбираем данные и опции в зависимости от типа графика
    const currentChartData = chartData[selectedChart] || chartData.default;
    const currentChartOptions = chartOptions[selectedChart] || chartOptions.default;

    return (
        <section className="text-gray-600 body-font">
            <div className="container mx-auto px-5">
                <div className="w-full">
                    <div 
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
                        onClick={handleChartClick}
                        style={{ height: '100%', minHeight: '300px' }}
                    >
                        <ChartChlank 
                            data={currentChartData} 
                            options={currentChartOptions} 
                        />
                    </div>
                    {!chartType && (
                        <div className="text-center mt-3 text-sm text-gray-500">
                            Нажмите на график для просмотра других статистических данных
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Заголовок и поиск */}
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-gray-800">Выбор статистических данных</h2>
                                <button 
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Поиск графиков..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Список графиков */}
                        <div className="overflow-y-auto flex-grow p-4">
                            {filteredCharts.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {filteredCharts.map((chart) => (
                                        <li key={chart.id} className="py-3">
                                            <button
                                                className={`w-full text-left px-4 py-2 rounded-md transition ${
                                                    selectedChart === chart.id
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => selectChart(chart.id)}
                                            >
                                                {chart.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Нет результатов по запросу "{searchTerm}"
                                </div>
                            )}
                        </div>

                        {/* Кнопки внизу */}
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100 transition"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Применить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Dashboard;

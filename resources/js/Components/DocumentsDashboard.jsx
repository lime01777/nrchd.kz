import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
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
    Filler,
} from 'chart.js';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/services/TranslationService';

// Регистрируем компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Универсальная функция перевода
const t = (key, fallback = '') => translationService.t(key, fallback);

/**
 * Интерактивная доска для отображения документов с фильтрами и графиками
 * @param {string} folder - Путь к папке с документами
 * @param {string} title - Заголовок доски
 */
export default function DocumentsDashboard({ folder = '', title = '' }) {
    // Состояния для фильтров
    const [selectedYear, setSelectedYear] = useState('');
    
    // Состояние для хранения количества документов по годам (для графика)
    const [documentsByYear, setDocumentsByYear] = useState({});
    
    // Список доступных годов (2010-2024)
    const availableYears = useMemo(() => {
        const years = [];
        for (let year = 2010; year <= 2024; year++) {
            years.push(year.toString());
        }
        return years;
    }, []);
    
    // Формируем путь к папке в зависимости от выбранного года
    const currentFolderPath = useMemo(() => {
        if (!folder) return '';
        
        const normalizedFolder = folder.replace(/\\/g, '/');
        
        // Если выбран год, добавляем его к пути папки
        if (selectedYear) {
            // Убираем завершающий слеш, если есть, и добавляем год
            const cleanFolder = normalizedFolder.replace(/\/$/, '');
            return `${cleanFolder}/${selectedYear}`;
        }
        
        // Если год не выбран, возвращаем базовую папку
        return normalizedFolder;
    }, [folder, selectedYear]);
    
    // Загружаем информацию о количестве документов по годам для графика
    useEffect(() => {
        const fetchYearCounts = async () => {
            if (!folder) return;
            
            try {
                const baseUrl = window.location.origin;
                const normalizedFolder = folder.replace(/\\/g, '/');
                const cleanFolder = normalizedFolder.replace(/\/$/, '');
                
                // Загружаем информацию о количестве документов в каждой папке года
                const yearCounts = {};
                
                // Загружаем данные для всех годов параллельно
                const yearPromises = availableYears.map(async (year) => {
                    try {
                        const params = new URLSearchParams();
                        params.append('folder', `${cleanFolder}/${year}`);
                        
                        const response = await axios.get(`${baseUrl}/api/files?${params.toString()}`);
                        
                        let count = 0;
                        if (Array.isArray(response.data)) {
                            response.data.forEach(section => {
                                if (section.files) count += section.files.length;
                                if (section.documents) count += section.documents.length;
                            });
                        } else if (response.data && response.data.files) {
                            count = response.data.files.length;
                        } else if (response.data && Array.isArray(response.data.documents)) {
                            count = response.data.documents.length;
                        }
                        
                        return { year, count };
                    } catch (err) {
                        console.warn(`Не удалось загрузить данные для года ${year}:`, err);
                        return { year, count: 0 };
                    }
                });
                
                const results = await Promise.all(yearPromises);
                results.forEach(({ year, count }) => {
                    yearCounts[year] = count;
                });
                
                // Обновляем данные для графика
                setDocumentsByYear(yearCounts);
            } catch (err) {
                console.error('Ошибка при загрузке статистики по годам:', err);
            }
        };
        
        fetchYearCounts();
    }, [folder, availableYears]);
    
    // Данные для графика по годам
    const yearChartData = useMemo(() => {
        // Показываем все годы, даже если в них 0 документов
        const sortedYears = availableYears;
        const counts = sortedYears.map(year => documentsByYear[year] || 0);
        
        return {
            labels: sortedYears,
            datasets: [
                {
                    label: 'Количество документов',
                    data: counts,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        };
    }, [documentsByYear, availableYears]);
    
    // Опции для графиков
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };
    
    // Текущие документы (загружаются из выбранной папки через SimpleFileDisplay)
    // Не нужно фильтровать, так как SimpleFileDisplay загружает документы из нужной папки
    
    return (
        <div className="space-y-6">
            {/* Заголовок */}
            {title && (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                </div>
            )}
            
            {/* Фильтры */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Фильтр по году */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('components.documentsDashboard.filterByYear', 'Фильтр по году')}
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{t('components.documentsDashboard.allYears', 'Выберите год')}</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Информация о выбранном годе */}
                <div className="mt-4 text-sm text-gray-600">
                    {selectedYear ? (
                        <span>
                            {t('components.documentsDashboard.showingDocumentsFor', 'Показаны документы за')} {selectedYear} {t('components.documentsDashboard.year', 'год')}
                            {documentsByYear[selectedYear] !== undefined && (
                                <span className="ml-2">
                                    ({documentsByYear[selectedYear]} {t('components.documentsDashboard.documents', 'документов')})
                                </span>
                            )}
                        </span>
                    ) : (
                        <span>{t('components.documentsDashboard.selectYear', 'Выберите год для просмотра документов')}</span>
                    )}
                </div>
            </div>
            
            {/* Графики */}
            <div className="grid grid-cols-1 gap-6">
                {/* График по годам */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {t('components.documentsDashboard.documentsByYear', 'Документы по годам')}
                    </h3>
                    <div className="h-64">
                        <Bar data={yearChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
            
            {/* Документы из выбранной папки года */}
            {selectedYear ? (
                <div>
                    <SimpleFileDisplay
                        folder={currentFolderPath}
                        title={t('components.documentsDashboard.documentsForYear', 'Документы за {year} год', { year: selectedYear })}
                        bgColor="bg-gray-50"
                        hideDownload={false}
                    />
                </div>
            ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                    <p>{t('components.documentsDashboard.selectYearToView', 'Выберите год из списка выше для просмотра документов')}</p>
                </div>
            )}
        </div>
    );
}


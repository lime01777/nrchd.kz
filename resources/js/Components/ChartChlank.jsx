import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Добавляем плагин Filler для поддержки опции fill
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend,
    Filler // Регистрируем плагин Filler
);

const ChartChlank = ({ data, options }) => {
    // Определяем тип графика на основе данных
    const isBarChart = data.datasets && data.datasets.some(dataset => dataset.type === 'bar');
    
    // Возвращаем соответствующий тип графика
    if (isBarChart) {
        return <Bar data={data} options={options} />;
    }
    
    return <Line data={data} options={options} />;
};

export default ChartChlank;
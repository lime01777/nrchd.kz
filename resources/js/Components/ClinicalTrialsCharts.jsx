import React from 'react';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import translationService from '@/services/TranslationService';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ClinicalTrialsCharts() {
  const t = (key, fallback = '') => translationService.t(key, fallback);

  // Данные для графика фаз клинических исследований
  const phasesData = {
    labels: [
      t('directionsPages.medicalScienceSubpages.clinical.charts.phases.bioequivalence', 'Исследование биоэквивалентности'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.phases.phase2', 'II фаза'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.phases.phase2_3', 'II/III фаза'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.phases.phase3', 'III фаза'),
    ],
    datasets: [
      {
        label: t('directionsPages.medicalScienceSubpages.clinical.charts.phases.label', 'Фазы клинических исследований'),
        data: [28.6, 14.3, 28.6, 28.6],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Синий
          'rgba(16, 185, 129, 0.8)', // Зеленый
          'rgba(251, 191, 36, 0.8)', // Желтый
          'rgba(239, 68, 68, 0.8)', // Красный
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Данные для графика статуса клинических исследований
  const statusData = {
    labels: [
      t('directionsPages.medicalScienceSubpages.clinical.charts.status.ongoing', 'Проводится'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.status.completed', 'Завершено'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.status.notStarted', 'Не начато'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.status.unknown', 'Неизвестно'),
    ],
    datasets: [
      {
        label: t('directionsPages.medicalScienceSubpages.clinical.charts.status.label', 'Количество исследований'),
        data: [2, 2, 2, 1],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Данные для графика терапевтических направлений
  const therapeuticAreasData = {
    labels: [
      t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.diagnostics', 'Диагностика'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.cardiology', 'Кардиология'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.oncology', 'Онкология'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.allergology', 'Аллергология'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.infectious', 'Инфекционные заболевания'),
    ],
    datasets: [
      {
        label: t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.label', 'Терапевтические направления'),
        data: [14.3, 14.3, 14.3, 28.6, 28.6],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', // Фиолетовый
          'rgba(236, 72, 153, 0.8)', // Розовый
          'rgba(59, 130, 246, 0.8)', // Синий
          'rgba(16, 185, 129, 0.8)', // Зеленый
          'rgba(251, 191, 36, 0.8)', // Желтый
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Данные для графика спонсорской структуры
  const sponsorData = {
    labels: [
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.usa', 'США'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.germany', 'Германия'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.kazakhstan', 'Казахстан'),
    ],
    datasets: [
      {
        label: t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.label', 'Спонсоры'),
        data: [14.3, 42.9, 42.9],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Общие опции для графиков
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.x} ${t('directionsPages.medicalScienceSubpages.clinical.charts.status.trials', 'исследований')}`;
            },
          },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  // Список спонсоров
  const sponsorsList = {
    germany: [
      'ROXALL Medizin GmbH',
      'Berlin-Chemie AG',
    ],
    usa: [
      'AbbVie Inc.',
    ],
    kazakhstan: [
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.nurMay', 'ТОО «НУР-МАЙ ФАРМАЦИЯ»'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.vivaPharm', 'ТОО «ВИВА ФАРМ»'),
      t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.industrialMicrobiology', 'ТОО «Промышленная микробиология»'),
    ],
  };

  return (
    <section className="text-gray-600 body-font pb-12 bg-white">
      <div className="container px-5 mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Заголовок секции */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('directionsPages.medicalScienceSubpages.clinical.charts.title', 'КЛИНИЧЕСКИЕ ИСПЫТАНИЯ В РЕСПУБЛИКЕ КАЗАХСТАН — 2025')}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              {t('directionsPages.medicalScienceSubpages.clinical.charts.subtitle', 'Данные по состоянию на 1 ноября')}
            </p>
          </div>

          {/* Общая информация */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 md:p-6 rounded-lg mb-6 md:mb-8">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              {t('directionsPages.medicalScienceSubpages.clinical.charts.generalInfo', 'В 2025 году в Республике Казахстан, по данным регистра НЦЭЛСИМИ, было выдано 7 разрешений на проведение клинических исследований')}
            </p>
          </div>

          {/* Сетка графиков */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* График фаз клинических исследований */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                {t('directionsPages.medicalScienceSubpages.clinical.charts.phases.title', 'Фазы клинических исследований:')}
              </h3>
              <div className="h-64 md:h-72">
                <Pie data={phasesData} options={pieOptions} />
              </div>
            </div>

            {/* График статуса клинических исследований */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                {t('directionsPages.medicalScienceSubpages.clinical.charts.status.title', 'Статус проведения клинических исследований (2025):')}
              </h3>
              <div className="h-64 md:h-72">
                <Bar data={statusData} options={barOptions} />
              </div>
            </div>

            {/* График терапевтических направлений */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                {t('directionsPages.medicalScienceSubpages.clinical.charts.therapeutic.title', 'Терапевтические направления:')}
              </h3>
              <div className="h-64 md:h-72">
                <Pie data={therapeuticAreasData} options={pieOptions} />
              </div>
            </div>

            {/* График спонсорской структуры */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                {t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.title', 'Спонсорская структура КИ в 2025 году включает как международные фармкомпании, так и локальных представителей')}
              </h3>
              
              {/* Контейнер с графиком и списком спонсоров */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
                {/* График */}
                <div className="flex-shrink-0 w-full lg:w-1/2 flex justify-center">
                  <div className="h-64 md:h-72 w-full max-w-xs">
                    <Doughnut data={sponsorData} options={doughnutOptions} />
                  </div>
                </div>
                
                {/* Список спонсоров */}
                <div className="flex-1 w-full lg:w-1/2 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      {t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.germany', 'Германия')}:
                    </h4>
                    <ul className="list-none pl-0 space-y-1 text-gray-700">
                      {sponsorsList.germany.map((sponsor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{sponsor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      {t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.usa', 'США')}:
                    </h4>
                    <ul className="list-none pl-0 space-y-1 text-gray-700">
                      {sponsorsList.usa.map((sponsor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{sponsor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      {t('directionsPages.medicalScienceSubpages.clinical.charts.sponsors.kazakhstan', 'Казахстан')}:
                    </h4>
                    <ul className="list-none pl-0 space-y-1 text-gray-700">
                      {sponsorsList.kazakhstan.map((sponsor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{sponsor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


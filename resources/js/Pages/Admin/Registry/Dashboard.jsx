import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import RegistryKazakhstanMap from '@/Components/RegistryKazakhstanMap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale
);

// --- Mock Data (Duplicated for Dashboard demo) ---
// --- Mock Data Removed ---

const dictStatus = {
    project: { label: 'Проект', color: '#f3f4f6' },
    pilot: { label: 'Пилот', color: '#dbeafe' },
    implementation: { label: 'Внедрение', color: '#dcfce7' },
    scaling: { label: 'Масштаб.', color: '#f3e8ff' },
    suspended: { label: 'Приостан.', color: '#fef9c3' },
    archive: { label: 'Архив', color: '#fee2e2' }
};

const dictDirections = {
    ai: 'ИИ',
    telemedicine: 'Телемедицина',
    teleradiology: 'Телерадиология',
    oncology: 'Онкология',
    diagnostics: 'Диагностика',
    lab: 'Лаборатория',
    rehab: 'Реабилитация',
    biotech: 'Биотехнологии',
    cardiology: 'Кардиология',
    ophthalmology: 'Офтальмология'
};

export default function RegistryDashboard({ registryData = [] }) {
    const dashboardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    // Helper to normalize data structure
    const mapToCamel = (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map(item => ({
            id: item.id,
            registryCode: item.registry_code || item.registryCode,
            validationDate: item.validation_date || item.validationDate,
            pilotingDate: item.piloting_date || item.pilotingDate,
            statusDate: item.status_date || item.statusDate,
            name: item.name,
            description: item.description,
            type: item.type,
            codeA: item.code_a || item.codeA,
            codeB: item.code_b || item.codeB,
            codeC: item.code_c || item.codeC,
            codeD: item.code_d || item.codeD,
            codeE: item.code_e || item.codeE,
            initiator: item.initiator,
            developer: item.developer,
            logoUrl: item.logo_url || item.logoUrl,
            pilotOrg: item.pilot_org || item.pilotOrg,
            appOrgs: item.app_orgs || item.appOrgs,
            revalidationDate: item.revalidation_date || item.revalidationDate,
            status: item.status,
            directions: item.directions || [],
            region: item.region,
            riskLevel: item.risk_level || item.riskLevel,
            autonomyLevel: item.autonomy_level || item.autonomyLevel,
            trl: item.trl,
            documents: item.documents || []
        }));
    };

    // --- STATISTICS CALCULATION ---
    const stats = useMemo(() => {
        const normalizedData = mapToCamel(registryData);

        // Auto-archive logic for KPI
        const currentDate = new Date();
        const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));

        const processedData = normalizedData.map(item => {
            let computedStatus = item.status;
            if (item.status === 'suspended' && item.statusDate) {
                const statusDate = new Date(item.statusDate);
                if (statusDate < oneYearAgo) {
                    computedStatus = 'archive';
                }
            }
            return { ...item, status: computedStatus };
        });

        const activeData = processedData.filter(i => i.status !== 'archive');
        const totalActive = activeData.length;

        // KPI-2: Status Distribution
        const statusCounts = {};
        activeData.forEach(item => {
            statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
        });

        // KPI-3: AI Share
        const aiItems = activeData.filter(i => i.codeA === 'A1' || i.codeA === 'A2');
        const autonomousAiItems = activeData.filter(i => i.codeA === 'A2');
        const aiShare = totalActive > 0 ? ((aiItems.length / totalActive) * 100).toFixed(1) : 0;

        // KPI-4: Top Directions
        const dirCounts = {};
        activeData.forEach(item => {
            item.directions.forEach(d => {
                dirCounts[d] = (dirCounts[d] || 0) + 1;
            });
        });
        const sortedDirs = Object.entries(dirCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // KPI-5: Revalidation
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        let revOverdue = 0;
        let revUpcoming = 0;
        let revOk = 0;

        activeData.forEach(item => {
            if (!item.revalidationDate) return;
            const rDate = new Date(item.revalidationDate);
            if (rDate < today) revOverdue++;
            else if (rDate <= next30Days) revUpcoming++;
            else revOk++;
        });

        // KPI-6: Geography (безопасная обработка null region)
        const regions = {};
        activeData.forEach(item => {
            const regionStr = item.region || '';
            if (!regionStr) return;
            // Split regions if comma separated
            const regs = regionStr.split(',').map(s => s.trim());
            regs.forEach(r => {
                if (!r || r === '-') return;
                regions[r] = (regions[r] || 0) + 1;
            });
        });

        return {
            totalActive,
            statusCounts,
            aiCount: aiItems.length,
            aiAutonomous: autonomousAiItems.length,
            aiShare,
            sortedDirs,
            revalidation: { overdue: revOverdue, upcoming: revUpcoming, ok: revOk },
            regions
        };
    }, [registryData]);


    // --- CHARTS CONFIG ---

    // Status Distribution (Doughnut)
    const statusChartData = {
        labels: Object.keys(stats.statusCounts).map(k => dictStatus[k]?.label || k),
        datasets: [{
            data: Object.values(stats.statusCounts),
            backgroundColor: [
                '#60a5fa', // blue-400
                '#34d399', // emerald-400
                '#c084fc', // purple-400
                '#facc15', // yellow-400
                '#f87171', // red-400
            ],
            borderWidth: 1
        }]
    };

    // Directions (Bar)
    const directionChartData = {
        labels: stats.sortedDirs.map(([k]) => dictDirections[k] || k),
        datasets: [{
            label: 'Количество проектов',
            data: stats.sortedDirs.map(([, v]) => v),
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        }]
    };

    // AI Share (Pie)
    const aiChartData = {
        labels: ['AI (A1+A2)', 'Без ИИ (A0)'],
        datasets: [{
            data: [stats.aiCount, stats.totalActive - stats.aiCount],
            backgroundColor: ['#8b5cf6', '#e5e7eb'],
        }]
    };

    // Speed (Line - Mock)
    const speedChartData = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [
            {
                label: 'Проект -> Пилот (мес)',
                data: [3.2, 3.0, 2.8, 2.5, 2.4, 2.2],
                borderColor: '#3b82f6',
                tension: 0.4
            },
            {
                label: 'Пилот -> Внедрение (мес)',
                data: [6.1, 5.8, 5.5, 5.2, 5.0, 4.8],
                borderColor: '#10b981',
                tension: 0.4
            }
        ]
    };

    const handlePrint = async () => {
        setIsExporting(true);
        const element = dashboardRef.current;
        const opt = {
            margin: 0.2,
            filename: 'kpi_dashboard_ptz.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };

        await html2pdf().set(opt).from(element).save();
        setIsExporting(false);
    };

    const handleExportCSV = () => {
        window.open(route('admin.registry.export', { format: 'csv' }), '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center no-print border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard KPI: Перечень технологий (ПТЗ)</h2>
                    <p className="text-gray-500 text-sm mt-1">Мониторинг ключевых показателей эффективности внедрения технологий</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} disabled={isExporting} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-sm hover:bg-gray-50 transition-colors shadow-sm text-gray-700 disabled:opacity-50">
                        {isExporting ? (
                            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        )}
                        {isExporting ? 'Генерация...' : 'Скачать PDF'}
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm hover:bg-blue-700 shadow-sm transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Экспорт (CSV)
                    </button>
                </div>
            </div>

            <div ref={dashboardRef} className="space-y-6 pb-4">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Всего технологий</div>
                            <div className="text-4xl font-extrabold text-blue-600 mt-2">{stats.totalActive}</div>
                        </div>
                        <div className="text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded mt-3 font-medium">+2 за месяц</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Доля ИИ (Class A)</div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl font-extrabold text-purple-600">{stats.aiShare}%</span>
                                <span className="text-sm text-gray-500">({stats.aiCount} шт.)</span>
                            </div>
                        </div>
                        <div className="text-xs text-purple-600 mt-1">Автономных (A2): <b>{stats.aiAutonomous}</b></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Ревалидация (30 дней)</div>
                            <div className="text-4xl font-extrabold text-orange-500 mt-2">{stats.revalidation.upcoming}</div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded font-medium">Просрочено: {stats.revalidation.overdue}</span>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">Норма: {stats.revalidation.ok}</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">География внедрения</div>
                            <div className="text-4xl font-extrabold text-indigo-600 mt-2">{Object.keys(stats.regions).length}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-3 truncate" title={Object.keys(stats.regions).join(', ')}>
                            {Object.keys(stats.regions).slice(0, 3).join(', ')}...
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Распределение по статусам</h3>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={statusChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Топ-5 Направлений</h3>
                        <div className="h-64">
                            <Bar
                                data={directionChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    indexAxis: 'y',
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Скорость внедрения (Динамика)</h3>
                        <div className="h-64">
                            <Line data={speedChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Пенетрация ИИ</h3>
                        <div className="h-64 flex justify-center">
                            <Pie data={aiChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>

                {/* Интерактивная карта Казахстана */}
                <RegistryKazakhstanMap registryData={registryData} />
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .bg-white { box-shadow: none !important; border: 1px solid #eee; }
                }
            `}</style>
        </div>
    );
}

RegistryDashboard.layout = page => <AdminLayout title="KPI Дашборд ПТЗ">{page}</AdminLayout>;

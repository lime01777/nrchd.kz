import React, { useState, useMemo } from 'react';

// --- Данные (Mock Data) ---
// --- Данные (Mock Data removed) ---
const initialRegistryData = [];


// --- Справочники (Enums) ---
const dictTypes = {
    digital: 'Цифровая',
    ai_software: 'ИИ/ПО',
    medical_device: 'Медицинское изделие',
    biomedical: 'Клеточная/биомедицинская',
    drug: 'Лекарственная',
    organizational: 'Организационная',
    combined: 'Комбинированная'
};

const dictStatus = {
    project: { label: 'Проект', color: 'bg-gray-100 text-gray-800' },
    pilot: { label: 'На пилоте', color: 'bg-blue-100 text-blue-800' },
    implementation: { label: 'На стадии внедрения', color: 'bg-green-100 text-green-800' },
    scaling: { label: 'Масштабирование', color: 'bg-purple-100 text-purple-800' },
    suspended: { label: 'Приостановлено', color: 'bg-yellow-100 text-yellow-800' },
    archive: { label: 'Архив', color: 'bg-red-100 text-red-800' }
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

const dictCodeA = {
    A0: 'A0 (без ИИ)',
    A1: 'A1 (с применением ИИ)',
    A2: 'A2 (автономное ИИ)'
};

const dictCodeB = {
    B1: 'B1 (профилактика/скрининг)',
    'B1.1': 'B1.1 (диагностика)',
    'B1.2': 'B1.2 (мониторинг)',
    'B1.3': 'B1.3 (лечение)',
    'B1.4': 'B1.4 (реабилитация)'
};

const dictCodeC = {
    C1: 'C1 (личный)',
    C2: 'C2 (домашний)',
    C3: 'C3 (первичный)',
    C4: 'C4 (вторичный)',
    C5: 'C5 (третичный/национальный)'
};

const dictCodeD = {
    D1: 'D1 (самостоятельное ПО (SaMD))',
    D2: 'D2 (модуль МИС)',
    D3: 'D3 (облачные сервисы)',
    D4: 'D4 (встроенные в оборудование)',
    D5: 'D5 (мобильные приложения)'
};

const dictCodeE = {
    E1: 'E1 (статические модели)',
    E2: 'E2 (адаптивные модели)',
    E3: 'E3 (самообучающиеся модели)'
};

const dictAutonomy = {
    low: 'Низкая автономность',
    medium: 'Средняя автономность',
    high: 'Высокая автономность'
};

// --- Модальное окно добавления записи ---
const AddRegistryModal = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        validationDate: '',
        pilotingDate: '',
        type: 'digital',
        codeA: 'A0',
        codeB: 'B1',
        codeC: 'C1',
        codeD: 'D1',
        codeE: 'E1',
        status: 'project',
        initiator: '',
        developer: '',
        logoUrl: '',
        description: '',
        directions: [],
        autonomyLevel: 'low'
    });

    const registryCode = useMemo(() => {
        return `${formData.codeA}–${formData.codeB}–${formData.codeC}–${formData.codeD}–${formData.codeE}`;
    }, [formData.codeA, formData.codeB, formData.codeC, formData.codeD, formData.codeE]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            registryCode,
            statusDate: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in-down my-8">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-gray-800">Добавить новую технологию</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Основная инфо */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Наименование</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Название технологии" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Дата валидации</label>
                            <input type="date" name="validationDate" value={formData.validationDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Дата пилотирования</label>
                            <input type="date" name="pilotingDate" value={formData.pilotingDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border-gray-300 rounded-lg text-sm" placeholder="Краткое описание..."></textarea>
                    </div>

                    {/* Классификация */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-blue-800">Классификация и Код</h4>
                            <span className="font-mono bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 text-sm font-bold">{registryCode}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <select name="codeA" value={formData.codeA} onChange={handleChange} className="text-xs border-gray-300 rounded">
                                {Object.keys(dictCodeA).map(k => <option key={k} value={k}>{dictCodeA[k]}</option>)}
                            </select>
                            <select name="codeB" value={formData.codeB} onChange={handleChange} className="text-xs border-gray-300 rounded">
                                {Object.keys(dictCodeB).map(k => <option key={k} value={k}>{dictCodeB[k]}</option>)}
                            </select>
                            <select name="codeC" value={formData.codeC} onChange={handleChange} className="text-xs border-gray-300 rounded">
                                {Object.keys(dictCodeC).map(k => <option key={k} value={k}>{dictCodeC[k]}</option>)}
                            </select>
                            <select name="codeD" value={formData.codeD} onChange={handleChange} className="text-xs border-gray-300 rounded">
                                {Object.keys(dictCodeD).map(k => <option key={k} value={k}>{dictCodeD[k]}</option>)}
                            </select>
                            <select name="codeE" value={formData.codeE} onChange={handleChange} className="text-xs border-gray-300 rounded">
                                {Object.keys(dictCodeE).map(k => <option key={k} value={k}>{dictCodeE[k]}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm">
                                {Object.entries(dictTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm">
                                {Object.entries(dictStatus).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Автономность</label>
                            <select name="autonomyLevel" value={formData.autonomyLevel} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm">
                                {Object.entries(dictAutonomy).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input name="initiator" value={formData.initiator} onChange={handleChange} placeholder="Инициатор" className="border-gray-300 rounded-lg text-sm" />
                        <input name="developer" value={formData.developer} onChange={handleChange} placeholder="Разработчик" className="border-gray-300 rounded-lg text-sm" />
                        <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="URL логотипа" className="border-gray-300 rounded-lg text-sm" />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Отмена</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Компонент ---
export default function HealthTechnologyRegistry({ registryData: externalData = [] }) {

    // Функция маппинга данных из БД (snake_case) в React (camelCase)
    const mapData = (data) => {
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
            appOrgs: item.app_orgs || item.appOrgs || [],
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

    const [registryData, setRegistryData] = useState(mapData(externalData));

    // Обновляем данные при изменении пропсов
    useMemo(() => {
        if (externalData && externalData.length > 0) {
            setRegistryData(mapData(externalData));
        } else {
            setRegistryData([]);
        }
    }, [externalData]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('active'); // active, suspended, archive
    const [filters, setFilters] = useState({
        status: '',
        direction: '',
        type: '',
        codeA: '',
        codeB: '',
        codeD: '',
        codeE: '',
        validationDateFrom: '',
        validationDateTo: '',
        pilotingDateFrom: '',
        pilotingDateTo: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [expandedId, setExpandedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [showFilters, setShowFilters] = useState(false);

    // --- Логика фильтрации и поиска ---
    const processedData = useMemo(() => {
        // Логика автоматического перемещения в архив
        // Те проекты, которые приостановлены больше года, автоматически направляются в архив
        const currentDate = new Date();
        const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));

        return registryData.map(item => {
            let computedStatus = item.status;
            if (item.status === 'suspended' && item.statusDate) {
                const statusDate = new Date(item.statusDate);
                if (statusDate < oneYearAgo) {
                    computedStatus = 'archive';
                }
            }
            return { ...item, status: computedStatus };
        });
    }, [registryData]);

    const filteredData = useMemo(() => {
        let data = [...processedData];

        // 1. Фильтрация по Tabs
        if (activeTab === 'active') {
            data = data.filter(item => item.status !== 'suspended' && item.status !== 'archive');
        } else if (activeTab === 'suspended') {
            data = data.filter(item => item.status === 'suspended');
        } else if (activeTab === 'archive') {
            data = data.filter(item => item.status === 'archive');
        }

        // Global Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.registryCode.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                item.developer.toLowerCase().includes(q) ||
                item.initiator.toLowerCase().includes(q) ||
                (item.pilotOrg && item.pilotOrg.toLowerCase().includes(q))
            );
        }

        // Specific Filters
        if (filters.status) data = data.filter(item => item.status === filters.status);
        if (filters.type) data = data.filter(item => item.type === filters.type);
        if (filters.codeA) data = data.filter(item => item.codeA === filters.codeA);
        if (filters.codeB) data = data.filter(item => item.codeB === filters.codeB);
        if (filters.codeD) data = data.filter(item => item.codeD === filters.codeD);
        if (filters.codeD) data = data.filter(item => item.codeD === filters.codeD);
        if (filters.codeE) data = data.filter(item => item.codeE === filters.codeE);

        // Date Filters
        if (filters.validationDateFrom) {
            data = data.filter(item => item.validationDate && item.validationDate >= filters.validationDateFrom);
        }
        if (filters.validationDateTo) {
            data = data.filter(item => item.validationDate && item.validationDate <= filters.validationDateTo);
        }
        if (filters.pilotingDateFrom) {
            data = data.filter(item => item.pilotingDate && item.pilotingDate >= filters.pilotingDateFrom);
        }
        if (filters.pilotingDateTo) {
            data = data.filter(item => item.pilotingDate && item.pilotingDate <= filters.pilotingDateTo);
        }

        if (filters.direction) data = data.filter(item => item.directions.includes(filters.direction));

        // Sorting
        if (sortConfig.key) {
            data.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                // Handle nulls always at bottom or top depending on logic, here simple comparison
                if (valA === null) return 1;
                if (valB === null) return -1;

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [searchQuery, filters, sortConfig, activeTab, processedData]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Handlers
    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedData.map(d => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset page on filter change
    };

    const handleExport = () => {
        const headers = ["ID", "Реестр. код", "Дата валидации", "Дата пилот.", "Наименование", "Тип", "Инициатор", "Разработчик", "Статус", "Направления", "Автономность"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + filteredData.map(e => {
                return [
                    e.id,
                    e.registryCode,
                    e.validationDate || "",
                    e.pilotingDate || "",
                    `"${(e.name || "").replace(/"/g, '""')}"`,
                    e.type,
                    `"${(e.initiator || "").replace(/"/g, '""')}"`,
                    `"${(e.developer || "").replace(/"/g, '""')}"`,
                    e.status,
                    `"${e.directions.join(', ')}"`,
                    dictAutonomy[e.autonomyLevel] || ""
                ].join(",");
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registry_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddEntry = (newData) => {
        const newEntry = {
            id: registryData.length + 1,
            ...newData,
            appOrgs: [], // Default empty
            documents: [], // Default empty
            riskLevel: 'low',
            autonomyLevel: 'low',
            trl: 1
        };
        setRegistryData([newEntry, ...registryData]);
        setIsAddModalOpen(false);
    };

    // Helper UI Components
    const SortIcon = ({ colKey }) => {
        if (sortConfig.key !== colKey) return <span className="text-gray-300 ml-1">⇅</span>;
        return <span className="text-blue-600 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    const DetailRow = ({ label, value, className = '' }) => (
        <div className={`grid grid-cols-1 sm:grid-cols-12 gap-2 border-b border-gray-100 py-2 sm:py-3 last:border-0 ${className}`}>
            <div className="font-semibold text-gray-700 sm:col-span-4 text-sm">{label}</div>
            <div className="text-gray-900 sm:col-span-8 text-sm break-words">{value || <span className="text-gray-400 italic">Не указано</span>}</div>
        </div>
    );

    return (
        <div className="container px-5 mx-auto mb-10 w-full" id="health-technology-registry">
            <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate3d(0, -10px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
      `}</style>

            {/* Header & Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-800">Перечень технологий здравоохранения</h2>
                    <div className="h-1 w-20 bg-blue-500 rounded mt-2"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-6 py-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('active')}
                >
                    Активные
                </button>
                <button
                    className={`px-6 py-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'suspended' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('suspended')}
                >
                    Приостановленные
                </button>
                <button
                    className={`px-6 py-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'archive' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('archive')}
                >
                    Архив
                </button>
                <button
                    className={`px-6 py-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'algorithm' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('algorithm')}
                >
                    Алгоритм
                </button>
            </div>

            {activeTab === 'algorithm' ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center animate-fade-in-down">
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Алгоритм включения в реестр</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Здесь будет размещена схема или описание алгоритма подачи заявки и включения технологии в реестр.
                    </p>
                </div>
            ) : (
                <>
                    {/* Controls: Search & Filter Toggle */}

                    {/* Controls: Search & Filter Toggle */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-grow max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Поиск по коду, названию, разработчику..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                                Фильтры
                            </button>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100 animate-fade-in-down">
                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                    <option value="">Все статусы</option>
                                    {Object.entries(dictStatus).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                                    <option value="">Все типы</option>
                                    {Object.entries(dictTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.direction} onChange={(e) => handleFilterChange('direction', e.target.value)}>
                                    <option value="">Все направления</option>
                                    {Object.entries(dictDirections).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.codeA} onChange={(e) => handleFilterChange('codeA', e.target.value)}>
                                    <option value="">Класс А (ИИ)</option>
                                    {Object.entries(dictCodeA).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.codeB} onChange={(e) => handleFilterChange('codeB', e.target.value)}>
                                    <option value="">Класс B (Функция)</option>
                                    {Object.entries(dictCodeB).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.codeD} onChange={(e) => handleFilterChange('codeD', e.target.value)}>
                                    <option value="">Класс D (Внедрение)</option>
                                    {Object.entries(dictCodeD).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <select className="form-select border-gray-300 rounded-md text-sm" value={filters.codeE} onChange={(e) => handleFilterChange('codeE', e.target.value)}>
                                    <option value="">Класс E (Обучаемость)</option>
                                    {Object.entries(dictCodeE).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>

                                <div className="hidden lg:block"></div> {/* Spacer */}

                                {/* Date Filters: Validation */}
                                <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                                    <label className="text-xs text-gray-500 font-semibold">Дата валидации</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            className="form-input border-gray-300 rounded-md text-sm w-full"
                                            value={filters.validationDateFrom}
                                            onChange={(e) => handleFilterChange('validationDateFrom', e.target.value)}
                                            title="С даты валидации"
                                        />
                                        <input
                                            type="date"
                                            className="form-input border-gray-300 rounded-md text-sm w-full"
                                            value={filters.validationDateTo}
                                            onChange={(e) => handleFilterChange('validationDateTo', e.target.value)}
                                            title="По дату валидации"
                                        />
                                    </div>
                                </div>

                                {/* Date Filters: Piloting */}
                                <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                                    <label className="text-xs text-gray-500 font-semibold">Дата пилотирования</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            className="form-input border-gray-300 rounded-md text-sm w-full"
                                            value={filters.pilotingDateFrom}
                                            onChange={(e) => handleFilterChange('pilotingDateFrom', e.target.value)}
                                            title="С даты пилотирования"
                                        />
                                        <input
                                            type="date"
                                            className="form-input border-gray-300 rounded-md text-sm w-full"
                                            value={filters.pilotingDateTo}
                                            onChange={(e) => handleFilterChange('pilotingDateTo', e.target.value)}
                                            title="По дату пилотирования"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Table */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-100">
                                    <th className="px-4 py-3 text-left">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" onChange={handleSelectAll} checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length} />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                                        № <SortIcon colKey="id" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('registryCode')}>
                                        Реестр. код <SortIcon colKey="registryCode" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('validationDate')}>
                                        Даты <SortIcon colKey="validationDate" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                                        Наименование
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Тип / Направление
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Участники
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                                        Статус <SortIcon colKey="status" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-5 py-8 text-center text-gray-500">
                                            По вашему запросу технологий не найдено
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr className={`border-b border-gray-100 transition-colors duration-200 ${expandedId === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                                <td className="px-4 py-4 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={selectedIds.includes(item.id)}
                                                        onChange={() => toggleSelection(item.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">{item.id}</td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="font-mono font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 whitespace-nowrap">
                                                        {item.registryCode}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-xs text-gray-700 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <div title="Дата валидации">
                                                            <span className="text-gray-400 mr-1">Вал:</span>
                                                            {item.validationDate || "-"}
                                                        </div>
                                                        <div title="Дата пилотирования">
                                                            <span className="text-gray-400 mr-1">Пил:</span>
                                                            {item.pilotingDate || "-"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                                    <div className="line-clamp-2" title={item.name}>
                                                        <button onClick={() => toggleExpand(item.id)} className="text-left hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-gray-600 border border-gray-200 px-1 rounded w-fit">{dictTypes[item.type] || item.type}</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.directions.slice(0, 2).map(d => (
                                                                <span key={d} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                                                                    {dictDirections[d]}
                                                                </span>
                                                            ))}
                                                            {item.directions.length > 2 && <span className="text-[10px] text-gray-400">+{item.directions.length - 2}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="text-xs text-gray-900 mb-0.5" title="Инициатор">Init: {item.initiator}</div>
                                                    <div className="text-xs text-gray-500" title="Разработчик">Dev: {item.developer}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full whitespace-nowrap ${dictStatus[item.status]?.color}`}>
                                                        {dictStatus[item.status]?.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-sm">
                                                    <button
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                        title="Подробнее"
                                                    >
                                                        <svg className={`w-5 h-5 transform transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* EXPANDED CARD VIEW */}
                                            {expandedId === item.id && (
                                                <tr>
                                                    <td colSpan="9" className="px-0 py-0 border-b border-gray-100 bg-white">
                                                        <div className="bg-gradient-to-b from-blue-50 to-white px-4 py-6 shadow-inner animate-fade-in-down border-l-4 border-blue-500">
                                                            <div className="max-w-6xl mx-auto space-y-6">

                                                                {/* HEADER BLOCK: Logo, Company, Name */}
                                                                <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl border border-blue-100 shadow-sm items-center md:items-start">
                                                                    <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 p-2">
                                                                        {item.logoUrl ? (
                                                                            <img src={item.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                                        ) : (
                                                                            <span className="text-gray-300 text-4xl font-bold">LOGO</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-grow space-y-2 text-center md:text-left">
                                                                        <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{item.developer}</div>
                                                                        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800">{item.name}</h3>
                                                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                                                            <span className={`px-2 py-0.5 rounded text-xs ${dictStatus[item.status]?.color}`}>{dictStatus[item.status]?.label}</span>
                                                                            <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-xs">{item.registryCode}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                                                    {/* Column 1: Passport & Description */}
                                                                    <div className="lg:col-span-2 space-y-6">
                                                                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                                                                Паспорт и описание
                                                                            </h3>
                                                                            <div className="space-y-1 mb-6">
                                                                                <DetailRow label="ID записи" value={item.id} />
                                                                                <DetailRow label="Реестровый код" value={<span className="font-mono text-blue-700 bg-blue-50 px-1 rounded">{item.registryCode}</span>} />
                                                                                <DetailRow label="Дата валидации" value={item.validationDate} />
                                                                                <DetailRow label="Дата пилотирования" value={item.pilotingDate} />
                                                                                <DetailRow label="Статус" value={<span className={`px-2 py-0.5 rounded text-xs ${dictStatus[item.status]?.color}`}>{dictStatus[item.status]?.label}</span>} />
                                                                                <DetailRow label="Направление" value={item.directions.map(d => dictDirections[d]).join(', ')} />
                                                                            </div>
                                                                            <div className="mt-4">
                                                                                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Краткое описание технологии</h4>
                                                                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                                                                                    {item.description}
                                                                                </p>
                                                                            </div>
                                                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <div className="font-semibold text-gray-700 text-sm">Тип технологии</div>
                                                                                    <div className="text-gray-900">{dictTypes[item.type]}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-semibold text-gray-700 text-sm">Уровень риска / TRL</div>
                                                                                    <div className="text-gray-900 flex flex-col gap-1 items-start">
                                                                                        <div className="flex gap-2">
                                                                                            <span className={`px-2 py-0.5 rounded text-xs ${item.riskLevel === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                                                {item.riskLevel === 'high' ? 'Высокий' : 'Низкий/Средний'}
                                                                                            </span>
                                                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">TRL {item.trl}</span>
                                                                                        </div>
                                                                                        <div className="text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mt-1" title="Степень независимости принятия решений">
                                                                                            {dictAutonomy[item.autonomyLevel] || 'Не указана'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                                                                Участники и применение
                                                                            </h3>
                                                                            <div className="space-y-1">
                                                                                <DetailRow label="Инициатор" value={item.initiator} />
                                                                                <DetailRow label="Разработчик" value={item.developer} />
                                                                                <DetailRow label="Пилотируемая организация" value={item.pilotOrg} />
                                                                                <DetailRow label="Организации применения" value={
                                                                                    <ul className="list-disc list-inside text-gray-600">
                                                                                        {item.appOrgs.length > 0 ? item.appOrgs.map((org, i) => <li key={i}>{org}</li>) : <li>Нет данных</li>}
                                                                                    </ul>
                                                                                } />
                                                                                <DetailRow label="Регион внедрения" value={item.region} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Column 2: Classification, Lifecycle, Docs */}
                                                                    <div className="space-y-6">
                                                                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                                                                Классификация
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 gap-4">
                                                                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                                                    <div className="text-xs text-gray-500 mb-1">Класс A (ИИ)</div>
                                                                                    <div className="font-semibold text-gray-800">{dictCodeA[item.codeA] || item.codeA}</div>
                                                                                </div>
                                                                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                                                    <div className="text-xs text-gray-500 mb-1">Класс B (Функционал)</div>
                                                                                    <div className="font-semibold text-gray-800">{dictCodeB[item.codeB] || item.codeB}</div>
                                                                                </div>
                                                                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                                                    <div className="text-xs text-gray-500 mb-1">Класс C (Контур)</div>
                                                                                    <div className="font-semibold text-gray-800">{item.codeC}</div>
                                                                                </div>
                                                                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                                                    <div className="text-xs text-gray-500 mb-1">Класс D (Форма внедрения)</div>
                                                                                    <div className="font-semibold text-gray-800">{dictCodeD[item.codeD] || item.codeD}</div>
                                                                                </div>
                                                                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                                                    <div className="text-xs text-gray-500 mb-1">Класс E (Обучаемость)</div>
                                                                                    <div className="font-semibold text-gray-800">{dictCodeE[item.codeE] || item.codeE}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                                                                                Жизненный цикл
                                                                            </h3>
                                                                            <DetailRow label="План. ревалидация" value={item.revalidationDate} className="!border-0" />
                                                                            {item.revalidationDate && new Date(item.revalidationDate) < new Date() && (
                                                                                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                                                    ⚠ Требуется ревалидация
                                                                                </div>
                                                                            )}
                                                                        </div>


                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            Показано {paginatedData.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} - {Math.min(page * itemsPerPage, filteredData.length)} из {filteredData.length}
                        </div>
                        <div className="flex gap-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 text-gray-600"
                            >
                                ←
                            </button>
                            <span className="px-3 py-1 border-t border-b bg-gray-50 text-gray-700">{page}</span>
                            <button
                                disabled={page === totalPages || totalPages === 0}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 text-gray-600"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </>
            )}

            <AddRegistryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddEntry}
            />
        </div>
    );
}


import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

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

// --- Модальное окно добавления/редактирования записи ---
const AddRegistryModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        name: '',
        validationDate: '',
        pilotingDate: '',
        statusDate: new Date().toISOString().split('T')[0],
        revalidationDate: '', // Дата ревалидации
        type: 'digital',
        codeA: 'A0',
        codeB: 'B1',
        codeC: 'C1',
        codeD: 'D1',
        codeE: 'E1',
        status: 'project',
        initiator: '',
        developer: '',
        pilotOrg: '',
        appOrgs: '', // Comma separated string
        region: '',
        description: '',
        directions: [],
        riskLevel: 'low',
        autonomyLevel: 'low',
        trl: 1,
        logoUrl: '',
        documents: []
    });

    // Load initial data if editing (future proofing, though currently only used for Add)
    useMemo(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                appOrgs: Array.isArray(initialData.appOrgs) ? initialData.appOrgs.join(', ') : initialData.appOrgs || '',
                documents: initialData.documents || []
            });
        }
    }, [initialData]);

    const registryCode = useMemo(() => {
        return `${formData.codeA}–${formData.codeB}–${formData.codeC}–${formData.codeD}–${formData.codeE}`;
    }, [formData.codeA, formData.codeB, formData.codeC, formData.codeD, formData.codeE]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDirectionChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentDirs = prev.directions || [];
            if (checked) {
                return { ...prev, directions: [...currentDirs, value] };
            } else {
                return { ...prev, directions: currentDirs.filter(d => d !== value) };
            }
        });
    };

    // Document handling
    const [newDoc, setNewDoc] = useState({ file: null, type: 'other', url: '', name: '' });
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await axios.post(route('admin.registry.upload'), data);
            setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
        } catch (err) {
            alert('Ошибка загрузки логотипа');
            console.error(err);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleDocUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingDoc(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await axios.post(route('admin.registry.upload'), data);
            setNewDoc(prev => ({
                ...prev,
                file: null,
                url: res.data.url,
                name: res.data.filename
            }));
        } catch (err) {
            alert('Ошибка загрузки документа');
            console.error(err);
        } finally {
            setUploadingDoc(false);
        }
    };

    const addDocument = () => {
        if (!newDoc.url) return;
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { name: newDoc.name, type: newDoc.type, url: newDoc.url }]
        }));
        setNewDoc({ file: null, type: 'other', url: '', name: '' });
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            appOrgs: typeof formData.appOrgs === 'string' ? formData.appOrgs.split(',').map(s => s.trim()).filter(Boolean) : formData.appOrgs,
            registryCode
        };
        onSave(processedData);
    };

    const tabs = [
        { id: 'general', label: 'Общее' },
        { id: 'classification', label: 'Классификация' },
        { id: 'details', label: 'Детали' },
        { id: 'participants', label: 'Участники' },
        { id: 'documents', label: 'Документы' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in-down my-8 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
                    <h3 className="text-lg font-bold text-gray-800">{initialData ? 'Редактировать технологию' : 'Создать карточку технологии'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                </div>

                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 px-6 shrink-0 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
                    {/* --- TAB: GENERAL --- */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Логотип компании</label>
                                    <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        {formData.logoUrl ? (
                                            <img src={formData.logoUrl} alt="Preview" className="h-20 w-20 object-contain bg-white rounded shadow-sm p-1" />
                                        ) : (
                                            <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                {uploadingLogo ? 'Загрузка...' : 'Нет лого'}
                                            </div>
                                        )}
                                        <div>
                                            <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploadingLogo} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-1" />
                                            <p className="text-xs text-gray-400">PNG, JPG, SVG до 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Наименование технологии <span className="text-red-500">*</span></label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" placeholder="Полное название" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата валидации</label>
                                    <input type="date" name="validationDate" value={formData.validationDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата пилотирования</label>
                                    <input type="date" name="pilotingDate" value={formData.pilotingDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата ревалидации (Жизненный цикл)</label>
                                    <input type="date" name="revalidationDate" value={formData.revalidationDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание <span className="text-red-500">*</span></label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full border-gray-300 rounded-lg text-sm p-2.5" placeholder="Подробное описание технологии, назначения и ключевых особенностей..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Направления (Паспорт)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {Object.entries(dictDirections).map(([key, label]) => (
                                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={key}
                                                checked={(formData.directions || []).includes(key)}
                                                onChange={handleDirectionChange}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: CLASSIFICATION --- */}
                    {activeTab === 'classification' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center mb-6">
                                <span className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Итоговый реестровый код</span>
                                <span className="font-mono text-3xl font-bold text-blue-700 bg-white px-6 py-3 rounded-lg shadow-sm border border-blue-200">{registryCode}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Код A (Применение ИИ)</label>
                                    <select name="codeA" value={formData.codeA} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.keys(dictCodeA).map(k => <option key={k} value={k}>{dictCodeA[k]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Код B (Назначение)</label>
                                    <select name="codeB" value={formData.codeB} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.keys(dictCodeB).map(k => <option key={k} value={k}>{dictCodeB[k]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Код C (Уровень)</label>
                                    <select name="codeC" value={formData.codeC} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.keys(dictCodeC).map(k => <option key={k} value={k}>{dictCodeC[k]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Код D (Тип ПО)</label>
                                    <select name="codeD" value={formData.codeD} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.keys(dictCodeD).map(k => <option key={k} value={k}>{dictCodeD[k]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Код E (Модель)</label>
                                    <select name="codeE" value={formData.codeE} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.keys(dictCodeE).map(k => <option key={k} value={k}>{dictCodeE[k]}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: DETAILS --- */}
                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Тип технологии <span className="text-red-500">*</span></label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.entries(dictTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Текущий статус <span className="text-red-500">*</span></label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        {Object.entries(dictStatus).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Уровень TRL (1-9)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="1" max="9" name="trl" value={formData.trl} onChange={handleChange} className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        <span className="font-bold text-lg text-blue-600 w-8 text-center">{formData.trl}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Регион внедрения</label>
                                    <input name="region" value={formData.region} onChange={handleChange} placeholder="Например: Астана, Алматы" className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Уровень риска</label>
                                    <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        <option value="low">Низкий (Class I)</option>
                                        <option value="medium">Средний (Class IIa/IIb)</option>
                                        <option value="high">Высокий (Class III)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Автономность ИИ</label>
                                    <select name="autonomyLevel" value={formData.autonomyLevel} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm p-2.5">
                                        <option value="low">Низкая</option>
                                        <option value="medium">Средняя</option>
                                        <option value="high">Высокая</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: PARTICIPANTS --- */}
                    {activeTab === 'participants' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Инициатор (Организация-заявитель)</label>
                                    <input name="initiator" value={formData.initiator} onChange={handleChange} placeholder="Например: МЗ РК" className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Разработчик (Vendor)</label>
                                    <input name="developer" value={formData.developer} onChange={handleChange} placeholder="Например: MedTech Solutions" className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Пилотирующая организация</label>
                                    <input name="pilotOrg" value={formData.pilotOrg} onChange={handleChange} placeholder="Организация, где проходит пилот" className="w-full border-gray-300 rounded-lg text-sm p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Организации применения</label>
                                    <textarea name="appOrgs" value={formData.appOrgs} onChange={handleChange} rows="3" placeholder="Перечислите через запятую..." className="w-full border-gray-300 rounded-lg text-sm p-2.5"></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Укажите список организаций, где технология уже внедрена.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: DOCUMENTS --- */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* List of documents */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Прикрепленные документы</h4>
                                {formData.documents.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400">
                                        Нет загруженных документов
                                    </div>
                                ) : (
                                    formData.documents.map((doc, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 p-2 rounded text-blue-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{doc.name}</div>
                                                    <div className="text-xs text-gray-500 uppercase">{doc.type}</div>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeDocument(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Document Form */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Добавить документ</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Файл</label>
                                        <input type="file" onChange={handleDocUpload} disabled={uploadingDoc} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-white rounded border border-gray-300" />
                                        {uploadingDoc && <p className="text-xs text-blue-500 mt-1">Загрузка файла...</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Тип</label>
                                        <select
                                            value={newDoc.type}
                                            onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                                            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="other">Другое</option>
                                            <option value="protocol">Протокол</option>
                                            <option value="approval">Одобрение</option>
                                            <option value="tech_passport">Тех. паспорт</option>
                                            <option value="report">Отчет</option>
                                            <option value="cert">Сертификат</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={addDocument}
                                    disabled={!newDoc.url || uploadingDoc}
                                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {uploadingDoc ? 'Загрузка...' : 'Добавить документ'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Buttons */}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-gray-200">Отмена</button>
                    <button onClick={handleSubmit} type="button" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Сохранить карточку</button>
                </div>
            </div>
        </div>
    );
};

// --- Компонент ---
export default function RegistryIndex({ initialRegistryData = [] }) {
    // --- Helpers for Case Conversion ---
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
            appOrgs: item.app_orgs || item.appOrgs || [],
            revalidationDate: item.revalidation_date || item.revalidationDate,
            status: item.status,
            directions: item.directions || [],
            region: item.region,
            riskLevel: item.risk_level || item.riskLevel,
            autonomyLevel: item.autonomy_level || item.autonomyLevel,
            trl: item.trl,
            documents: item.documents || [],
            createdAt: item.created_at || item.createdAt,
            updatedAt: item.updated_at || item.updatedAt
        }));
    };

    const mapToSnake = (item) => ({
        registry_code: item.registryCode,
        validation_date: item.validationDate,
        piloting_date: item.pilotingDate,
        status_date: item.statusDate,
        name: item.name,
        description: item.description,
        type: item.type,
        code_a: item.codeA,
        code_b: item.codeB,
        code_c: item.codeC,
        code_d: item.codeD,
        code_e: item.codeE,
        initiator: item.initiator,
        developer: item.developer,
        logo_url: item.logoUrl,
        pilot_org: item.pilotOrg,
        app_orgs: item.appOrgs,
        revalidation_date: item.revalidationDate,
        status: item.status,
        directions: item.directions,
        region: item.region,
        risk_level: item.riskLevel,
        autonomy_level: item.autonomyLevel,
        trl: item.trl,
        documents: Array.isArray(item.documents)
            ? item.documents.map(doc => ({
                name: doc.name,
                type: doc.type,
                url: doc.url
            }))
            : []
    });

    const [registryData, setRegistryData] = useState(mapToCamel(initialRegistryData));
    const [searchQuery, setSearchQuery] = useState('');

    // --- Print & History Handlers ---
    const handlePrintCard = (item) => {
        const printWindow = window.open('', '_blank');
        const content = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <title>Карточка технологии - ${item.name}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: sans-serif; -webkit-print-color-adjust: exact; }
                    @media print {
                        .no-print { display: none; }
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body class="bg-white p-8 max-w-4xl mx-auto">
                <div class="flex justify-between items-center border-b pb-4 mb-6">
                    <div class="flex items-center gap-4">
                        ${item.logoUrl ? `<img src="${item.logoUrl}" class="h-16 w-16 object-contain">` : '<div class="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">Нет лого</div>'}
                        <div>
                            <div class="text-sm text-gray-500 uppercase">${item.developer || 'Разработчик не указан'}</div>
                            <h1 class="text-2xl font-bold text-gray-900">${item.name}</h1>
                        </div>
                    </div>
                     <div class="text-right">
                        <div class="text-sm text-gray-500">Реестровый код</div>
                        <div class="font-mono text-lg font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded">${item.registryCode || '---'}</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">Паспорт проекта</h2>
                        <table class="w-full text-sm text-left">
                            <tr class="border-b"><td class="py-2 text-gray-500 w-1/2">Статус:</td><td class="py-2 font-medium">${dictStatus[item.status]?.label || item.status}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Тип:</td><td class="py-2 font-medium">${dictTypes[item.type] || item.type}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Дата валидации:</td><td class="py-2 font-medium">${item.validationDate || '-'}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Дата пилотирования:</td><td class="py-2 font-medium">${item.pilotingDate || '-'}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Направления:</td><td class="py-2 font-medium">${item.directions.map(d => dictDirections[d]).join(', ') || '-'}</td></tr>
                             <tr class="border-b"><td class="py-2 text-gray-500">Регион:</td><td class="py-2 font-medium">${item.region || '-'}</td></tr>
                        </table>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">Классификация</h2>
                         <table class="w-full text-sm text-left">
                            <tr class="border-b"><td class="py-2 text-gray-500 w-1/2">Класс A (ИИ):</td><td class="py-2 font-medium">${dictCodeA[item.codeA] || item.codeA}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Класс B (Функционал):</td><td class="py-2 font-medium">${dictCodeB[item.codeB] || item.codeB}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Класс C (Контур):</td><td class="py-2 font-medium">${item.codeC}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Класс D (Внедрение):</td><td class="py-2 font-medium">${dictCodeD[item.codeD] || item.codeD}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Класс E (Обучаемость):</td><td class="py-2 font-medium">${dictCodeE[item.codeE] || item.codeE}</td></tr>
                        </table>
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-gray-500 pl-3">Описание технологии</h2>
                    <div class="bg-gray-50 p-4 rounded text-sm text-gray-700 leading-relaxed text-justify border border-gray-100">
                        ${item.description || 'Описание отсутствует'}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-8">
                     <div>
                        <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-purple-500 pl-3">Участники</h2>
                         <table class="w-full text-sm text-left">
                            <tr class="border-b"><td class="py-2 text-gray-500 w-1/2">Инициатор:</td><td class="py-2 font-medium">${item.initiator || '-'}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Разработчик:</td><td class="py-2 font-medium">${item.developer || '-'}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Пилот. организация:</td><td class="py-2 font-medium">${item.pilotOrg || '-'}</td></tr>
                        </table>
                    </div>
                     <div>
                        <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-yellow-500 pl-3">Жизненный цикл</h2>
                         <table class="w-full text-sm text-left">
                            <tr class="border-b"><td class="py-2 text-gray-500 w-1/2">План. ревалидация:</td><td class="py-2 font-medium">${item.revalidationDate || '-'}</td></tr>
                            <tr class="border-b"><td class="py-2 text-gray-500">Уровень риска:</td><td class="py-2 font-medium">${item.riskLevel === 'high' ? 'Высокий' : 'Низкий/Средний'}</td></tr>
                             <tr class="border-b"><td class="py-2 text-gray-500">TRL:</td><td class="py-2 font-medium">${item.trl}</td></tr>
                        </table>
                    </div>
                </div>

                <div class="mb-8">
                     <h2 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-gray-400 pl-3">Документы</h2>
                     ${item.documents && item.documents.length > 0
                ? `<ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                            ${item.documents.map(d => `<li>${d.name} <span class="text-xs text-gray-400 uppercase ml-2">(${d.type})</span></li>`).join('')}
                           </ul>`
                : '<div class="text-sm text-gray-500 italic">Нет прикрепленных документов</div>'
            }
                </div>

                <div class="text-center text-xs text-gray-400 mt-12 border-t pt-4">
                    Сформировано из Перечня технологий здравоохранения РК • ${new Date().toLocaleDateString('ru-RU')}
                </div>
                
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const handleHistory = (item) => {
        const created = item.createdAt ? new Date(item.createdAt).toLocaleString('ru-RU') : 'Не известно';
        const updated = item.updatedAt ? new Date(item.updatedAt).toLocaleString('ru-RU') : 'Не известно';
        alert(`История изменений:\n\nСоздано: ${created}\nПоследнее обновление: ${updated}\n\nПолный журнал аудита будет доступен в следующих версиях.`);
    };
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        direction: '',
        type: '',
        codeA: '',
        codeB: '',
        codeD: '',
        codeE: '',
        dateFrom: '',
        dateTo: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [expandedId, setExpandedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [showFilters, setShowFilters] = useState(false);

    // Sync with props
    useMemo(() => {
        setRegistryData(mapToCamel(initialRegistryData));
    }, [initialRegistryData]);

    // --- Логика фильтрации и поиска ---
    const filteredData = useMemo(() => {
        let data = [...registryData];

        // Global Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(item =>
                (item.registryCode && item.registryCode.toLowerCase().includes(q)) ||
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.developer && item.developer.toLowerCase().includes(q)) ||
                (item.initiator && item.initiator.toLowerCase().includes(q)) ||
                (item.pilotOrg && item.pilotOrg.toLowerCase().includes(q))
            );
        }

        // Specific Filters
        if (filters.status) data = data.filter(item => item.status === filters.status);
        if (filters.type) data = data.filter(item => item.type === filters.type);
        if (filters.codeA) data = data.filter(item => item.codeA === filters.codeA);
        if (filters.codeB) data = data.filter(item => item.codeB === filters.codeB);
        if (filters.codeD) data = data.filter(item => item.codeD === filters.codeD);
        if (filters.codeE) data = data.filter(item => item.codeE === filters.codeE);

        // Date Range Filter
        if (filters.dateFrom) {
            data = data.filter(item => (item.validationDate || item.statusDate) >= filters.dateFrom);
        }
        if (filters.dateTo) {
            data = data.filter(item => (item.validationDate || item.statusDate) <= filters.dateTo);
        }

        if (filters.direction) data = data.filter(item => item.directions && item.directions.includes(filters.direction));

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
    }, [searchQuery, filters, sortConfig, registryData]);

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

    const handleExport = (format) => {
        if (format === 'csv') {
            const headers = ["ID", "Реестр. код", "Дата", "Наименование", "Тип", "Инициатор", "Разработчик", "Статус", "Направления"];
            const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + filteredData.map(e => {
                    return [
                        e.id,
                        e.registryCode,
                        e.date || "",
                        `"${(e.name || "").replace(/"/g, '""')}"`,
                        e.type,
                        `"${(e.initiator || "").replace(/"/g, '""')}"`,
                        `"${(e.developer || "").replace(/"/g, '""')}"`,
                        e.status,
                        `"${e.directions.join(', ')}"`
                    ].join(",");
                }).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "registry_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Mock export for PDF/XLS
            alert(`Экспорт в ${format.toUpperCase()} будет доступен после интеграции с бекендом.`);
        }
    };

    const [editingItem, setEditingItem] = useState(null);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsAddModalOpen(true);
    };

    const handleSave = (newData) => {
        setIsAddModalOpen(false);
        const payload = mapToSnake(newData);

        if (editingItem) {
            router.put(route('admin.registry.update', editingItem.id), payload, {
                onSuccess: () => {
                    setEditingItem(null);
                }
            });
        } else {
            router.post(route('admin.registry.store'), payload, {
                onSuccess: () => {
                    // Данные обновятся автоматически через Inertia props
                }
            });
        }
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingItem(null); // Reset editing state
    };

    // Add delete handler if needed
    const handleDelete = (id) => {
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
            router.delete(route('admin.registry.destroy', id));
        }
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
        <div className="w-full">
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
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('csv')}
                        className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1 transition-colors text-xs font-medium">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        CSV
                    </button>
                    <button
                        onClick={() => handleExport('xls')}
                        className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1 transition-colors text-xs font-medium">
                        <svg className="w-3 h-3 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        XLS
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1 transition-colors text-xs font-medium">
                        <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        PDF
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Добавить
                    </button>
                </div>
            </div>

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

                        <div className="flex flex-col sm:flex-row gap-2 col-span-1 md:col-span-2 lg:col-span-1">
                            <input
                                type="date"
                                className="form-input border-gray-300 rounded-md text-sm w-full"
                                placeholder="С даты"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                title="С даты внедрения"
                            />
                            <input
                                type="date"
                                className="form-input border-gray-300 rounded-md text-sm w-full"
                                placeholder="По дату"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                title="По дату внедрения"
                            />
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
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                                Дата внедр. <SortIcon colKey="date" />
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
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                    title="Редактировать"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => toggleExpand(item.id)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                    title="Подробнее"
                                                >
                                                    <svg className={`w-5 h-5 transform transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                            </div>
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
                                                                            <div className="text-xs text-gray-500 mb-1">Класс D (Внедрение)</div>
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

                                                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                        <span className="w-1 h-6 bg-gray-500 rounded-full"></span>
                                                                        Документы
                                                                    </h3>
                                                                    <div className="flex flex-col gap-2">
                                                                        {item.documents.length > 0 ? item.documents.map((doc, i) => (
                                                                            <a href="#" key={i} className="flex items-center gap-2 text-blue-600 hover:underline text-sm group">
                                                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                                                {doc.name}
                                                                            </a>
                                                                        )) : <span className="text-gray-400 text-sm">Нет документов</span>}
                                                                    </div>
                                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                                                        <button onClick={() => handlePrintCard(item)} className="text-xs text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">Печать карточки</button>
                                                                        <button onClick={() => handleHistory(item)} className="text-xs text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">История</button>
                                                                    </div>
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

            {/* Modal */}
            {isAddModalOpen && (
                <AddRegistryModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={handleSave}
                    initialData={editingItem}
                />
            )}
        </div>
    );
}

RegistryIndex.layout = page => <AdminLayout title="Перечень технологий здравоохранения">{page}</AdminLayout>;

import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function YouthHealthCentersIndex({ centers, regions, filters }) {
    const { flash = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region || '');
    const [selectedCenters, setSelectedCenters] = useState([]);
    
    // Применение фильтров
    const handleFilter = () => {
        router.get(route('admin.youth-health-centers.index'), {
            search: searchTerm,
            region: selectedRegion,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    // Сброс фильтров
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedRegion('');
        router.get(route('admin.youth-health-centers.index'));
    };
    
    // Выбор/снятие выбора всех центров
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCenters(centers.data.map(c => c.id));
        } else {
            setSelectedCenters([]);
        }
    };
    
    // Выбор/снятие выбора отдельного центра
    const handleSelectCenter = (id) => {
        if (selectedCenters.includes(id)) {
            setSelectedCenters(selectedCenters.filter(cid => cid !== id));
        } else {
            setSelectedCenters([...selectedCenters, id]);
        }
    };
    
    // Массовое удаление
    const handleBulkDelete = () => {
        if (selectedCenters.length === 0) {
            alert('Выберите центры для удаления');
            return;
        }
        
        if (confirm(`Вы уверены, что хотите удалить ${selectedCenters.length} центров?`)) {
            router.post(route('admin.youth-health-centers.bulk-destroy'), {
                ids: selectedCenters
            }, {
                preserveScroll: true,
                onSuccess: () => setSelectedCenters([])
            });
        }
    };
    
    // Переключение активности
    const handleToggleActive = (center) => {
        router.post(route('admin.youth-health-centers.toggle-active', center.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Управление МЦЗ" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Молодежные центры здоровья
                                </h2>
                                <Link
                                    href={route('admin.youth-health-centers.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    + Добавить МЦЗ
                                </Link>
                            </div>
                            
                            {/* Flash сообщения */}
                            {flash && flash.success && (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                                    {flash.success}
                                </div>
                            )}
                            
                            {/* Фильтры */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Поиск по названию, организации, адресу..."
                                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                                
                                <div>
                                    <select
                                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                    >
                                        <option value="">Все регионы</option>
                                        {regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFilter}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                    >
                                        Применить
                                    </button>
                                    <button
                                        onClick={handleResetFilters}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                                    >
                                        Сбросить
                                    </button>
                                </div>
                            </div>
                            
                            {/* Массовые действия */}
                            {selectedCenters.length > 0 && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-md flex justify-between items-center">
                                    <span className="text-sm text-gray-700">
                                        Выбрано центров: <strong>{selectedCenters.length}</strong>
                                    </span>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                                    >
                                        Удалить выбранные
                                    </button>
                                </div>
                            )}
                            
                            {/* Таблица МЦЗ */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedCenters.length === centers.data.length && centers.data.length > 0}
                                                    className="rounded"
                                                />
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">ID</th>
                                            <th className="py-3 px-4 border-b text-left">Название</th>
                                            <th className="py-3 px-4 border-b text-left">Организация</th>
                                            <th className="py-3 px-4 border-b text-left">Регион</th>
                                            <th className="py-3 px-4 border-b text-left">Адрес</th>
                                            <th className="py-3 px-4 border-b text-left">Координаты</th>
                                            <th className="py-3 px-4 border-b text-left">Статус</th>
                                            <th className="py-3 px-4 border-b text-left">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {centers.data.length > 0 ? (
                                            centers.data.map((center) => (
                                                <tr key={center.id} className={selectedCenters.includes(center.id) ? 'bg-blue-50' : ''}>
                                                    <td className="py-3 px-4 border-b">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCenters.includes(center.id)}
                                                            onChange={() => handleSelectCenter(center.id)}
                                                            className="rounded"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b">{center.id}</td>
                                                    <td className="py-3 px-4 border-b font-medium">{center.name}</td>
                                                    <td className="py-3 px-4 border-b text-sm">{center.organization}</td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {center.region}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b text-sm text-gray-600 max-w-xs truncate">
                                                        {center.address}
                                                    </td>
                                                    <td className="py-3 px-4 border-b text-xs text-gray-500">
                                                        {center.latitude}, {center.longitude}
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <button
                                                            onClick={() => handleToggleActive(center)}
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                center.is_active 
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            } transition cursor-pointer`}
                                                        >
                                                            {center.is_active ? 'Активен' : 'Неактивен'}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="flex space-x-3">
                                                            <Link
                                                                href={route('admin.youth-health-centers.edit', center.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 transition"
                                                            >
                                                                Редактировать
                                                            </Link>
                                                            
                                                            <Link
                                                                href={route('admin.youth-health-centers.destroy', center.id)}
                                                                method="delete"
                                                                as="button"
                                                                type="button"
                                                                className="text-red-600 hover:text-red-900 transition"
                                                                onClick={(e) => {
                                                                    if (!confirm('Вы уверены, что хотите удалить этот центр?')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                Удалить
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="py-8 px-4 border-b text-center text-gray-500">
                                                    {searchTerm || selectedRegion ? 'Центры не найдены' : 'Нет доступных центров здоровья'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Пагинация */}
                            {centers.links && centers.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {centers.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-md text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                preserveScroll
                                                preserveState
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                            
                            {/* Информация о количестве */}
                            <div className="mt-4 text-sm text-gray-600 text-center">
                                Показано {centers.from || 0} - {centers.to || 0} из {centers.total || 0} центров
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

YouthHealthCentersIndex.layout = page => <AdminLayout title="Управление МЦЗ">{page}</AdminLayout>;


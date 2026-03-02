import React, { useState, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Forms/TextInput';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import Modal from '@/Components/UI/Modal';

export default function GlossaryIndex({ terms, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [locale, setLocale] = useState(filters.locale || 'ru');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTerm, setCurrentTerm] = useState(null);

    const [formData, setFormData] = useState({
        term: '',
        locale: 'ru',
        case_sensitive: false,
        active: true,
    });

    // Handle search and filtering
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== filters.search || locale !== filters.locale) {
                router.get(
                    route('admin.glossary.index'),
                    { search, locale },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, locale]);

    const handleAddClick = () => {
        setFormData({ term: '', locale, case_sensitive: false, active: true });
        setIsAddModalOpen(true);
    };

    const handleEditClick = (termItem) => {
        setCurrentTerm(termItem);
        setFormData({
            term: termItem.term,
            locale: termItem.locale,
            case_sensitive: Boolean(termItem.case_sensitive),
            active: Boolean(termItem.active),
        });
        setIsEditModalOpen(true);
    };

    const submitAdd = async (e) => {
        e.preventDefault();
        try {
            await window.axios.post(route('admin.glossary.store'), formData);
            router.reload({ only: ['terms', 'stats'] });
            setIsAddModalOpen(false);
            alert('Термин успешно добавлен');
        } catch (error) {
            console.error(error);
            alert('Ошибка при добавлении термина: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
        }
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            await window.axios.put(route('admin.glossary.update', currentTerm.id), formData);
            router.reload({ only: ['terms', 'stats'] });
            setIsEditModalOpen(false);
            alert('Термин успешно обновлен');
        } catch (error) {
            console.error(error);
            alert('Ошибка при обновлении термина: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
        }
    };

    const deleteTerm = async (id) => {
        if (!confirm('Вы уверены, что хотите удалить этот термин?')) return;
        try {
            await window.axios.delete(route('admin.glossary.destroy', id));
            router.reload({ only: ['terms', 'stats'] });
        } catch (error) {
            alert('Ошибка при удалении');
        }
    };

    const toggleStatus = async (id) => {
        try {
            await window.axios.post(route('admin.glossary.toggle', id));
            router.reload({ only: ['terms', 'stats'] });
        } catch (error) {
            alert('Ошибка при изменении статуса');
        }
    };

    const importEmployees = async () => {
        if (!confirm('Вы уверены, что хотите импортировать ФИО всех сотрудников в глоссарий для текущего языка? Это предотвратит склонение ИИ-ассистентом имен сотрудников.')) return;
        try {
            const res = await window.axios.post(route('admin.glossary.import-employees'));
            alert(res.data.message);
            router.reload({ only: ['terms', 'stats'] });
        } catch (error) {
            alert('Ошибка: ' + (error.response?.data?.message || 'Не удалось импортировать'));
        }
    };

    return (
        <AdminLayout title="Глоссарий для ИИ">
            <Head title="Глоссарий для ИИ" />

            <div className="py-6 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Управление глоссарием ИИ</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Эти термины ИИ-помощники и анализаторы не должны изменять или переводить. Имена, специфичные термины и аббревиатуры.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button
                                onClick={importEmployees}
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm transition-colors"
                            >
                                Импорт ФИО сотрудников
                            </button>
                            <PrimaryButton onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
                                + Добавить термин
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Stats & Locale Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-200 bg-slate-50">
                            {[
                                { val: 'ru', label: 'Русский', count: stats.ru },
                                { val: 'kk', label: 'Казақша', count: stats.kk },
                                { val: 'en', label: 'English', count: stats.en }
                            ].map((tab) => (
                                <button
                                    key={tab.val}
                                    onClick={() => setLocale(tab.val)}
                                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${locale === tab.val
                                        ? 'border-blue-500 text-blue-700 bg-white'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {tab.label} <span className="ml-2 bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                        <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <TextInput
                                    type="text"
                                    className="pl-10 block w-full bg-slate-50 border-slate-200"
                                    placeholder="Поиск по терминам..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Термин</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Чувств. к регистру</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Статус</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {terms.data.length > 0 ? terms.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-800">{item.term}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.case_sensitive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {item.case_sensitive ? 'Да (строго)' : 'Нет (любой регистр)'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleStatus(item.id)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-colors focus:outline-none ${item.active
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                                    }`}
                                            >
                                                {item.active ? 'Активен' : 'Отключен'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3 text-slate-500">
                                            <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-900 font-bold transition-colors">Изменить</button>
                                            <button onClick={() => deleteTerm(item.id)} className="text-rose-600 hover:text-rose-900 font-bold transition-colors">Удалить</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            В глоссарии пока нет записей. Добавьте новые термины.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination links if multiple pages exist */}
                        {terms.links && terms.links.length > 3 && (
                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-center">
                                <div className="flex flex-wrap gap-1">
                                    {terms.links.map((link, key) => (
                                        link.url ? (
                                            <Link
                                                key={key}
                                                href={link.url}
                                                className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={key}
                                                className="px-3 py-1 rounded border border-transparent text-slate-400 text-sm"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Add */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <form onSubmit={submitAdd} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Добавить новый термин в глоссарий</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Термин или ФИО</label>
                            <TextInput
                                type="text"
                                className="w-full"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Язык (Локаль)</label>
                            <select
                                className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm"
                                value={formData.locale}
                                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                            >
                                <option value="ru">Русский</option>
                                <option value="kk">Казахский</option>
                                <option value="en">Английский</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="add_case"
                                checked={formData.case_sensitive}
                                onChange={(e) => setFormData({ ...formData, case_sensitive: e.target.checked })}
                                className="rounded border-gray-200 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="add_case" className="ml-2 block text-sm text-slate-700 font-bold">
                                Учитывать регистр (Case sensitive)
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="add_active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="rounded border-gray-200 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="add_active" className="ml-2 block text-sm text-slate-700 font-bold">
                                Активен сразу
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold bg-white hover:bg-slate-50">Отмена</button>
                        <PrimaryButton type="submit">Сохранить термин</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal for Edit */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Изменить термин</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Термин или ФИО</label>
                            <TextInput
                                type="text"
                                className="w-full"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Язык (Локаль)</label>
                            <select
                                className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm"
                                value={formData.locale}
                                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                            >
                                <option value="ru">Русский</option>
                                <option value="kk">Казахский</option>
                                <option value="en">Английский</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="edit_case"
                                checked={formData.case_sensitive}
                                onChange={(e) => setFormData({ ...formData, case_sensitive: e.target.checked })}
                                className="rounded border-gray-200 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="edit_case" className="ml-2 block text-sm text-slate-700 font-bold">
                                Учитывать регистр (Case sensitive)
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold bg-white hover:bg-slate-50">Отмена</button>
                        <PrimaryButton type="submit">Обновить термин</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

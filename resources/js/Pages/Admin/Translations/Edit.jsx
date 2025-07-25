import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Textarea from '@/Components/Textarea';
import { BsTranslate } from "react-icons/bs";

export default function TranslationEdit({ translation, groups }) {
    const { data, setData, put, processing, errors } = useForm({
        key: translation.key,
        group: translation.group,
        ru: translation.ru,
        en: translation.en || '',
        kk: translation.kk || '',
    });

    const [autoTranslating, setAutoTranslating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.translations.update', translation.id));
    };

    const handleAutoTranslate = (targetLang) => {
        if (confirm(`Автоматически перевести на ${targetLang === 'en' ? 'английский' : 'казахский'} с русского?`)) {
            setAutoTranslating(true);
            
            fetch(route('admin.translations.auto-translate-key', {
                id: translation.id,
                target_locale: targetLang,
            }))
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setData(targetLang, result.translation);
                    alert(`Перевод на ${targetLang === 'en' ? 'английский' : 'казахский'} успешно обновлен`);
                } else {
                    alert('Ошибка при автоматическом переводе: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при запросе перевода');
            })
            .finally(() => {
                setAutoTranslating(false);
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Редактирование перевода" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Редактирование перевода</h1>
                                <Link
                                    href={route('admin.translations.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Назад к списку
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="key" value="Ключ *" />
                                        <TextInput
                                            id="key"
                                            type="text"
                                            name="key"
                                            value={data.key}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('key', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.key} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="group" value="Группа *" />
                                        <div className="mt-1">
                                            <select
                                                id="group"
                                                name="group"
                                                value={data.group}
                                                onChange={(e) => setData('group', e.target.value)}
                                                className="w-full border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="">Выберите группу</option>
                                                {groups.map((group, index) => (
                                                    <option key={index} value={group}>
                                                        {group}
                                                    </option>
                                                ))}
                                                <option value="new_group">+ Создать новую группу</option>
                                            </select>
                                        </div>
                                        {data.group === 'new_group' && (
                                            <TextInput
                                                type="text"
                                                className="mt-2 block w-full"
                                                placeholder="Введите название новой группы"
                                                onChange={(e) => setData('group', e.target.value)}
                                                value=""
                                                autoFocus
                                            />
                                        )}
                                        <InputError message={errors.group} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="ru" value="Русский текст *" />
                                        <Textarea
                                            id="ru"
                                            name="ru"
                                            value={data.ru}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('ru', e.target.value)}
                                            required
                                            rows={3}
                                        />
                                        <InputError message={errors.ru} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center">
                                            <InputLabel htmlFor="en" value="Английский текст" />
                                            <button
                                                type="button"
                                                className="inline-flex items-center text-sm px-3 py-1 bg-green-600 border border-transparent rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-150"
                                                onClick={() => handleAutoTranslate('en')}
                                                disabled={autoTranslating || !data.ru}
                                            >
                                                <BsTranslate className="mr-1" />
                                                Автоперевод
                                            </button>
                                        </div>
                                        <Textarea
                                            id="en"
                                            name="en"
                                            value={data.en}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('en', e.target.value)}
                                            rows={3}
                                        />
                                        <InputError message={errors.en} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center">
                                            <InputLabel htmlFor="kk" value="Казахский текст" />
                                            <button
                                                type="button"
                                                className="inline-flex items-center text-sm px-3 py-1 bg-green-600 border border-transparent rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-150"
                                                onClick={() => handleAutoTranslate('kk')}
                                                disabled={autoTranslating || !data.ru}
                                            >
                                                <BsTranslate className="mr-1" />
                                                Автоперевод
                                            </button>
                                        </div>
                                        <Textarea
                                            id="kk"
                                            name="kk"
                                            value={data.kk}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('kk', e.target.value)}
                                            rows={3}
                                        />
                                        <InputError message={errors.kk} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Сохранение...' : 'Сохранить изменения'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

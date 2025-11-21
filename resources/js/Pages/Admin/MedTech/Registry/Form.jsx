import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function RegistryForm({ item = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name || '',
        description: item?.description || '',
        type: item?.type || '',
        application_area: item?.application_area || '',
        trl: item?.trl || '',
        status: item?.status || '',
        developer: item?.developer || '',
        pilot_sites: item?.pilot_sites || '',
        full_description: item?.full_description || '',
        order: item?.order || 0,
        is_active: item?.is_active ?? true,
    });

    const technologyTypes = [
        'Software',
        'Hardware',
        'Медицинское изделие',
        'Сервис',
        'Методика',
        'Другое',
    ];

    const statuses = [
        'Идея',
        'Экспертиза',
        'Пилот',
        'Апробация',
        'Внедрено',
    ];

    const submit = (e) => {
        e.preventDefault();
        if (item) {
            put(route('admin.medtech.registry.update', item.id));
        } else {
            post(route('admin.medtech.registry.store'));
        }
    };

    return (
        <AdminLayout title={item ? 'Редактировать запись реестра' : 'Создать запись реестра'}>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.registry')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к реестру технологий
                        </Link>
                    </div>
                    <form onSubmit={submit} className="space-y-6 bg-white shadow rounded-lg p-6">
                        <div>
                            <InputLabel htmlFor="name" value="Название технологии/проекта *" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Краткое описание" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="1-2 предложения для отображения в таблице"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="full_description" value="Полное описание" />
                            <textarea
                                id="full_description"
                                value={data.full_description}
                                onChange={(e) => setData('full_description', e.target.value)}
                                rows={5}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Полное описание для карточки технологии"
                            />
                            <InputError message={errors.full_description} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="type" value="Тип технологии" />
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Выберите тип</option>
                                    {technologyTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="application_area" value="Область применения" />
                                <TextInput
                                    id="application_area"
                                    type="text"
                                    value={data.application_area}
                                    onChange={(e) => setData('application_area', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="кардиология, онкология и т.д."
                                />
                                <InputError message={errors.application_area} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="trl" value="TRL (1-9)" />
                                <select
                                    id="trl"
                                    value={data.trl}
                                    onChange={(e) => setData('trl', e.target.value ? parseInt(e.target.value) : '')}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Выберите TRL</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.trl} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Статус" />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Выберите статус</option>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="developer" value="Разработчик" />
                                <TextInput
                                    id="developer"
                                    type="text"
                                    value={data.developer}
                                    onChange={(e) => setData('developer', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Организация/команда"
                                />
                                <InputError message={errors.developer} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="order" value="Порядок сортировки" />
                                <TextInput
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="pilot_sites" value="Пилотные площадки" />
                            <textarea
                                id="pilot_sites"
                                value={data.pilot_sites}
                                onChange={(e) => setData('pilot_sites', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Краткое указание пилотных площадок"
                            />
                            <InputError message={errors.pilot_sites} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                Активна
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route('admin.medtech.registry')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Отмена
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Сохранение...' : 'Сохранить'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}


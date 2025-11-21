import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PilotSiteForm({ pilotSite = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: pilotSite?.name || '',
        city: pilotSite?.city || '',
        region: pilotSite?.region || '',
        profile: pilotSite?.profile || '',
        description: pilotSite?.description || '',
        technologies: pilotSite?.technologies || '',
        order: pilotSite?.order || 0,
        is_active: pilotSite?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (pilotSite) {
            put(route('admin.medtech.pilot-sites.update', pilotSite.id));
        } else {
            post(route('admin.medtech.pilot-sites.store'));
        }
    };

    return (
        <AdminLayout title={pilotSite ? 'Редактировать пилотную площадку' : 'Создать пилотную площадку'}>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.pilot-sites')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к списку пилотных площадок
                        </Link>
                    </div>
                    <form onSubmit={submit} className="space-y-6 bg-white shadow rounded-lg p-6">
                        <div>
                            <InputLabel htmlFor="name" value="Название учреждения *" />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="city" value="Город" />
                                <TextInput
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.city} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="region" value="Регион" />
                                <TextInput
                                    id="region"
                                    type="text"
                                    value={data.region}
                                    onChange={(e) => setData('region', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.region} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="profile" value="Профиль" />
                                <TextInput
                                    id="profile"
                                    type="text"
                                    value={data.profile}
                                    onChange={(e) => setData('profile', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="кардиология, онкология и т.п."
                                />
                                <InputError message={errors.profile} className="mt-2" />
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
                            <InputLabel htmlFor="description" value="Краткое описание роли" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Описание роли площадки"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="technologies" value="Технологии/направления" />
                            <textarea
                                id="technologies"
                                value={data.technologies}
                                onChange={(e) => setData('technologies', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Какие технологии/направления пилотируются"
                            />
                            <InputError message={errors.technologies} className="mt-2" />
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
                                href={route('admin.medtech.pilot-sites')}
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


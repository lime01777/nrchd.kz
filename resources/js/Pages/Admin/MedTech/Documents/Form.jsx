import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function DocumentForm({ document = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: document?.title || '',
        description: document?.description || '',
        type: document?.type || '',
        file: null,
        order: document?.order || 0,
        is_active: document?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        if (document) {
            put(route('admin.medtech.documents.update', document.id));
        } else {
            post(route('admin.medtech.documents.store'));
        }
    };

    return (
        <AdminLayout title={document ? 'Редактировать документ' : 'Создать документ'}>
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('admin.medtech.documents')}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Назад к списку документов
                        </Link>
                    </div>
                    <form onSubmit={submit} className="space-y-6 bg-white shadow rounded-lg p-6">
                        <div>
                            <InputLabel htmlFor="title" value="Название документа *" />
                            <TextInput
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Описание" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Тип/категория" />
                            <TextInput
                                id="type"
                                type="text"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Правила, Методика, Приказ и др."
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="file" value={document ? 'Новый файл (оставьте пустым, чтобы не менять)' : 'Файл *'} />
                            <input
                                id="file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mt-1 block w-full"
                                required={!document}
                            />
                            <InputError message={errors.file} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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

                            <div className="flex items-center mt-6">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                    Активен
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route('admin.medtech.documents')}
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


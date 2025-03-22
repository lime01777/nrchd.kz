import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    accordion_id: '',
    page: '',
    order: 0,
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.document-categories.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Создание категории документов</h2>}
    >
      <Head title="Создание категории документов" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <InputLabel htmlFor="title" value="Название" />
                  <TextInput
                    id="title"
                    type="text"
                    name="title"
                    value={data.title}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                    required
                  />
                  <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="accordion_id" value="ID аккордеона" />
                  <TextInput
                    id="accordion_id"
                    type="text"
                    name="accordion_id"
                    value={data.accordion_id}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('accordion_id', e.target.value)}
                    required
                  />
                  <InputError message={errors.accordion_id} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="page" value="Страница" />
                  <TextInput
                    id="page"
                    type="text"
                    name="page"
                    value={data.page}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('page', e.target.value)}
                  />
                  <InputError message={errors.page} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="order" value="Порядок" />
                  <TextInput
                    id="order"
                    type="number"
                    name="order"
                    value={data.order}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('order', e.target.value)}
                  />
                  <InputError message={errors.order} className="mt-2" />
                </div>

                <div className="mb-4 flex items-center">
                  <Checkbox
                    name="is_active"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                  />
                  <InputLabel htmlFor="is_active" value="Активно" className="ml-2" />
                  <InputError message={errors.is_active} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                  <PrimaryButton className="ml-4" disabled={processing}>
                    Создать
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

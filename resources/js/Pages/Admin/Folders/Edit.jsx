import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ folder }) {
  const { data, setData, post, processing, errors } = useForm({
    title: folder.title || '',
    color: folder.color || 'bg-blue-200',
    colorsec: folder.colorsec || 'bg-blue-300',
    href: folder.href || '',
    order: folder.order || 0,
    is_active: folder.is_active,
  });

  const colorOptions = [
    { value: 'bg-blue-200', label: 'Синий' },
    { value: 'bg-green-200', label: 'Зеленый' },
    { value: 'bg-red-200', label: 'Красный' },
    { value: 'bg-yellow-200', label: 'Желтый' },
    { value: 'bg-purple-200', label: 'Фиолетовый' },
    { value: 'bg-pink-200', label: 'Розовый' },
    { value: 'bg-indigo-200', label: 'Индиго' },
    { value: 'bg-gray-200', label: 'Серый' },
  ];

  const colorSecOptions = [
    { value: 'bg-blue-300', label: 'Синий (темнее)' },
    { value: 'bg-green-300', label: 'Зеленый (темнее)' },
    { value: 'bg-red-300', label: 'Красный (темнее)' },
    { value: 'bg-yellow-300', label: 'Желтый (темнее)' },
    { value: 'bg-purple-300', label: 'Фиолетовый (темнее)' },
    { value: 'bg-pink-300', label: 'Розовый (темнее)' },
    { value: 'bg-indigo-300', label: 'Индиго (темнее)' },
    { value: 'bg-gray-300', label: 'Серый (темнее)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.folders.update', folder.id), {
      _method: 'put',
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Редактирование папки
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
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
            <InputLabel htmlFor="color" value="Основной цвет" />
            <select
              id="color"
              name="color"
              value={data.color}
              className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              onChange={(e) => setData('color', e.target.value)}
              required
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center">
              <div className={`${data.color} w-6 h-6 rounded-full mr-2`}></div>
              <span>Предпросмотр цвета</span>
            </div>
            <InputError message={errors.color} className="mt-2" />
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="colorsec" value="Дополнительный цвет" />
            <select
              id="colorsec"
              name="colorsec"
              value={data.colorsec}
              className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              onChange={(e) => setData('colorsec', e.target.value)}
              required
            >
              {colorSecOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center">
              <div className={`${data.colorsec} w-6 h-6 rounded-full mr-2`}></div>
              <span>Предпросмотр цвета</span>
            </div>
            <InputError message={errors.colorsec} className="mt-2" />
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="href" value="Ссылка (URL)" />
            <TextInput
              id="href"
              type="text"
              name="href"
              value={data.href}
              className="mt-1 block w-full"
              onChange={(e) => setData('href', e.target.value)}
            />
            <InputError message={errors.href} className="mt-2" />
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
              Сохранить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </>
  );
}

Edit.layout = page => <AdminLayout title="Редактирование папки">{page}</AdminLayout>;

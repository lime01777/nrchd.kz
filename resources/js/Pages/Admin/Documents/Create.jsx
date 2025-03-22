import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ categories }) {
  const { data, setData, post, processing, errors, progress } = useForm({
    category_id: '',
    description: '',
    file: null,
    order: 0,
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.documents.store'));
  };

  const handleFileChange = (e) => {
    setData('file', e.target.files[0]);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Загрузка документа
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <InputLabel htmlFor="category_id" value="Категория" />
            <select
              id="category_id"
              name="category_id"
              value={data.category_id}
              className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              onChange={(e) => setData('category_id', e.target.value)}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <InputError message={errors.category_id} className="mt-2" />
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="description" value="Описание" />
            <TextInput
              id="description"
              type="text"
              name="description"
              value={data.description}
              className="mt-1 block w-full"
              onChange={(e) => setData('description', e.target.value)}
              required
            />
            <InputError message={errors.description} className="mt-2" />
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="file" value="Файл" />
            <input
              id="file"
              type="file"
              name="file"
              className="mt-1 block w-full border p-2 rounded-md"
              onChange={handleFileChange}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
            </p>
            <InputError message={errors.file} className="mt-2" />
            
            {progress && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress.percentage}% загружено</p>
              </div>
            )}
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
              Загрузить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </>
  );
}

Create.layout = page => <AdminLayout title="Загрузка документа">{page}</AdminLayout>;

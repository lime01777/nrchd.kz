import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import ModernMediaUploader from '@/Components/ModernMediaUploader';

export default function TestImageUpload() {
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaChange = (newMedia) => {
    console.log('Test - изменение медиа:', newMedia);
    setMedia(newMedia);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Разделяем файлы и URL
      const imageFiles = [];
      const videoFiles = [];
      const urls = [];

      media.forEach(item => {
        if (item instanceof File) {
          const isVideo = item.type.startsWith('video/');
          if (isVideo) {
            videoFiles.push(item);
          } else {
            imageFiles.push(item);
          }
        } else if (typeof item === 'string') {
          urls.push(item);
        }
      });

      const formData = new FormData();
      formData.append('title', 'Тестовая новость');
      formData.append('content', 'Тестовое содержимое');
      formData.append('status', 'Черновик');
      formData.append('category[]', 'Общие');

      // Добавляем файлы
      imageFiles.forEach(file => {
        formData.append('image_files[]', file);
      });

      videoFiles.forEach(file => {
        formData.append('video_files[]', file);
      });

      // Добавляем URL
      urls.forEach(url => {
        formData.append('images[]', url);
      });

      console.log('Отправка тестовых данных:', {
        imageFiles: imageFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        videoFiles: videoFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        urls
      });

      const response = await fetch('/admin/news/test-form', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      console.log('Результат теста:', result);
      alert('Тест завершен! Проверьте консоль и логи.');

    } catch (error) {
      console.error('Ошибка теста:', error);
      alert('Ошибка при тестировании');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Тест загрузки изображений</h2>
            <Link
              href={route('admin.news')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
            >
              Назад к новостям
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Загрузка медиа-файлов</h3>
                <ModernMediaUploader
                  media={media}
                  setMedia={handleMediaChange}
                  maxFiles={5}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Текущие медиа-файлы:</h3>
                <div className="space-y-2">
                  {media.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <p><strong>Тип:</strong> {typeof item}</p>
                      <p><strong>Имя:</strong> {item instanceof File ? item.name : (typeof item === 'string' ? item : 'N/A')}</p>
                      <p><strong>Размер:</strong> {item instanceof File ? `${(item.size / 1024).toFixed(2)} KB` : 'N/A'}</p>
                      <p><strong>MIME тип:</strong> {item instanceof File ? item.type : 'N/A'}</p>
                    </div>
                  ))}
                  {media.length === 0 && (
                    <p className="text-gray-500">Нет загруженных файлов</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить тест'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

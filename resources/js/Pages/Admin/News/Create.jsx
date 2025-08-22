import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import MediaManager from '@/Components/FileManager/MediaManager';

const DEFAULT_CATEGORIES = [
  'Общие',
  'Аккредитация',
  'Обучение',
  'Конференции',
  'Методические материалы',
  'Исследования',
  'Анонсы',
];

export default function NewsCreate() {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
    category: [],
    status: 'Черновик',
    publish_date: new Date().toISOString().substr(0, 10),
    images: [],
    image_files: [],
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  // Обработка изменения категории
  const handleCategoryChange = (category, checked) => {
    let updated;
    if (checked) {
      updated = [...selectedCategories, category];
    } else {
      updated = selectedCategories.filter(cat => cat !== category);
    }
    setSelectedCategories(updated);
    setData('category', updated);
  };

  // Выбрать все категории
  const handleSelectAll = () => {
    setSelectedCategories(DEFAULT_CATEGORIES);
    setData('category', DEFAULT_CATEGORIES);
  };

  // Снять выбор со всех категорий
  const handleDeselectAll = () => {
    setSelectedCategories([]);
    setData('category', []);
  };

  // Обработка выбора изображений из библиотеки
  const handleImageSelect = (images) => {
    // Проверяем лимит файлов
    const totalImages = (data.image_files ? data.image_files.length : 0) + images.length;
    
    if (totalImages > 15) {
      alert(`Максимальное количество изображений: 15. У вас уже ${data.image_files ? data.image_files.length : 0} загруженных файлов.`);
      return;
    }
    
    const imageUrls = images.map(img => img.path);
    setSelectedImages(images);
    setData('images', imageUrls);
  };

  // Обработка загрузки файлов
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Проверяем лимит файлов
    const totalImages = (data.images ? data.images.length : 0) + (data.image_files ? data.image_files.length : 0) + files.length;
    
    if (totalImages > 15) {
      alert(`Максимальное количество изображений: 15. У вас уже ${data.images ? data.images.length : 0} изображений из библиотеки и ${data.image_files ? data.image_files.length : 0} загруженных файлов.`);
      return;
    }
    
    // Проверяем размер файлов
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`Следующие файлы превышают лимит 10MB: ${fileNames}`);
      return;
    }
    
    setData('image_files', files);
  };

  // Удаление изображения из библиотеки
  const removeLibraryImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newUrls = newImages.map(img => img.path);
    setSelectedImages(newImages);
    setData('images', newUrls);
  };

  // Удаление загруженного файла
  const removeUploadedFile = (index) => {
    const newFiles = data.image_files.filter((_, i) => i !== index);
    setData('image_files', newFiles);
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверки
    if (!data.title.trim()) {
      alert('Заполните заголовок');
      return;
    }

    if (!data.content.trim() || data.content.replace(/<[^>]*?>/g, '').trim().length < 10) {
      alert('Содержимое должно содержать минимум 10 символов');
      return;
    }

    if (data.category.length === 0) {
      alert('Выберите хотя бы одну категорию');
      return;
    }

    console.log('Отправка данных:', {
      title: data.title,
      content_length: data.content.length,
      categories: data.category,
      images_count: data.images.length,
      files_count: data.image_files.length,
      status: data.status
    });

    post(route('admin.news.store'));
  };

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Создание новости</h2>
            <Link
              href={route('admin.news')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к списку
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                {/* Заголовок */}
                <div className="sm:col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Заголовок *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      placeholder="Введите заголовок новости"
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Категории */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категории *</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Выбрать все
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Снять выбор
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {DEFAULT_CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => handleCategoryChange(category, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Содержимое */}
                <div className="sm:col-span-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Содержимое *
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="content"
                      id="content"
                      rows={10}
                      value={data.content}
                      onChange={(e) => setData('content', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      placeholder="Введите содержимое новости"
                    />
                  </div>
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                {/* Статус */}
                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Статус
                  </label>
                  <div className="mt-1">
                    <select
                      name="status"
                      id="status"
                      value={data.status}
                      onChange={(e) => setData('status', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Черновик">Черновик</option>
                      <option value="Опубликовано">Опубликовано</option>
                      <option value="Запланировано">Запланировано</option>
                    </select>
                  </div>
                </div>

                {/* Дата публикации */}
                <div className="sm:col-span-3">
                  <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700">
                    Дата публикации
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="publish_date"
                      id="publish_date"
                      value={data.publish_date}
                      onChange={(e) => setData('publish_date', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Изображения */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображения (до 15 файлов)
                    <span className="ml-2 text-sm text-gray-500">
                      {((data.images ? data.images.length : 0) + (data.image_files ? data.image_files.length : 0))}/15
                    </span>
                  </label>
                  
                  {/* Загрузка файлов */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Загрузить файлы (до 15 изображений, максимум 10MB каждое):
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {data.image_files && data.image_files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Загруженные файлы:</p>
                        <div className="space-y-1">
                          {data.image_files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeUploadedFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Удалить
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Библиотека изображений */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setShowMediaManager(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Выбрать из библиотеки
                    </button>
                    
                    {selectedImages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Выбранные изображения:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.path}
                                alt={image.name}
                                className="w-full h-24 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeLibraryImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="sm:col-span-6 flex justify-end space-x-3">
                  <Link
                    href={route('admin.news')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Отмена
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {processing ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Модальное окно библиотеки изображений */}
      {showMediaManager && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Библиотека изображений</h3>
              <button
                onClick={() => setShowMediaManager(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MediaManager
              onSelect={handleImageSelect}
              onClose={() => setShowMediaManager(false)}
              multiple={true}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
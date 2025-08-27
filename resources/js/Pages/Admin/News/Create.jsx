import React, { useState, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import MediaManager from '@/Components/FileManager/MediaManager';
import MediaSlider from '@/Components/MediaSlider';

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
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
    category: [],
    status: 'Черновик',
    publish_date: new Date().toISOString().substr(0, 10),
    media: [], // Унифицированное поле для всех медиа-файлов
    media_files: [], // Новые загружаемые файлы
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

  // Обработка выбора медиа из библиотеки
  const handleMediaSelect = (mediaItems) => {
    // Проверяем лимит файлов
    const totalMedia = (data.media ? data.media.length : 0) + (data.media_files ? data.media_files.length : 0) + mediaItems.length;
    
    if (totalMedia > 15) {
      alert(`Максимальное количество медиа-файлов: 15. У вас уже ${data.media ? data.media.length : 0} файлов из библиотеки и ${data.media_files ? data.media_files.length : 0} загруженных файлов.`);
      return;
    }
    
    const newMedia = mediaItems.map(item => ({
      path: item.path,
      type: item.type || (item.path.includes('.mp4') || item.path.includes('.avi') || item.path.includes('.mov') ? 'video' : 'image'),
      name: item.name || item.path.split('/').pop(),
      source: 'library'
    }));
    
    setData('media', [...(data.media || []), ...newMedia]);
  };

  // Обработка загрузки файлов через input
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  // Обработка drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  }, []);

  // Обработка файлов
  const processFiles = (files) => {
    // Проверяем лимит файлов
    const totalMedia = (data.media ? data.media.length : 0) + (data.media_files ? data.media_files.length : 0) + files.length;
    
    if (totalMedia > 15) {
      alert(`Максимальное количество медиа-файлов: 15. У вас уже ${data.media ? data.media.length : 0} файлов из библиотеки и ${data.media_files ? data.media_files.length : 0} загруженных файлов.`);
      return;
    }

    // Фильтруем и валидируем файлы
    const validFiles = files.filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB для видео
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
      
      if (file.size > maxSize) {
        alert(`Файл ${file.name} превышает лимит 50MB`);
        return false;
      }
      
      if (!imageTypes.includes(file.type) && !videoTypes.includes(file.type)) {
        alert(`Файл ${file.name} имеет неподдерживаемый тип`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setData('media_files', [...(data.media_files || []), ...validFiles]);
    }
  };

  // Удаление медиа-файла
  const removeMedia = (index, source) => {
    if (source === 'library') {
      const newMedia = data.media.filter((_, i) => i !== index);
      setData('media', newMedia);
    } else {
      const newFiles = data.media_files.filter((_, i) => i !== index);
      setData('media_files', newFiles);
    }
  };

  // Перемещение медиа-файлов
  const moveMedia = (fromIndex, toIndex, source) => {
    if (source === 'library') {
      const newMedia = [...data.media];
      const [movedItem] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, movedItem);
      setData('media', newMedia);
    } else {
      const newFiles = [...data.media_files];
      const [movedItem] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedItem);
      setData('media_files', newFiles);
    }
  };

  // Получение всех медиа для предварительного просмотра
  const getAllMedia = () => {
    const libraryMedia = data.media || [];
    const fileMedia = (data.media_files || []).map((file, index) => ({
      path: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
      source: 'file',
      fileIndex: index
    }));
    
    return [...libraryMedia, ...fileMedia];
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
      media_count: data.media.length,
      files_count: data.media_files.length,
      status: data.status
    });

    post(route('admin.news.store'));
  };

  const allMedia = getAllMedia();

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

                {/* Статус и дата */}
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

                {/* Медиа-файлы */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Медиа-файлы (до 15 файлов)
                    <span className="ml-2 text-sm text-gray-500">
                      {allMedia.length}/15
                    </span>
                  </label>
                  
                  {/* Drag & Drop зона */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Перетащите файлы сюда или{' '}
                        <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                          выберите файлы
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Поддерживаются изображения (JPG, PNG, GIF, WebP) и видео (MP4, AVI, MOV, WMV, FLV, WebM) до 50MB
                      </p>
                    </div>
                  </div>

                  {/* Библиотека медиа */}
                  <div className="mt-4">
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
                  </div>

                  {/* Предварительный просмотр слайдера */}
                  {allMedia.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Предварительный просмотр слайдера:</h4>
                      <MediaSlider 
                        media={allMedia}
                        className="w-full"
                        autoPlay={false}
                        interval={5000}
                      />
                    </div>
                  )}

                  {/* Список медиа-файлов */}
                  {allMedia.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Загруженные файлы:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {allMedia.map((media, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              {media.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <div className="text-center">
                                    <div className="text-2xl mb-1">🎥</div>
                                    <div className="text-xs text-gray-600">Видео</div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={media.path}
                                  alt={media.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            
                            {/* Индикатор типа */}
                            <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                              {media.type === 'video' ? '🎥' : '🖼️'}
                            </div>
                            
                            {/* Кнопка удаления */}
                            <button
                              type="button"
                              onClick={() => removeMedia(index, media.source)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            
                            {/* Название файла */}
                            <div className="mt-1 text-xs text-gray-600 truncate">
                              {media.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

      {/* Модальное окно библиотеки медиа */}
      {showMediaManager && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Библиотека медиа-файлов</h3>
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
              onSelect={handleMediaSelect}
              onClose={() => setShowMediaManager(false)}
              multiple={true}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
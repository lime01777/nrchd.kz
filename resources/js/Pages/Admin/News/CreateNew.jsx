import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/Admin/News/RichTextEditor';
import ModernMediaUploader from '@/Components/Admin/News/ModernMediaUploader';
import CategoryCheckboxes from '@/Components/Admin/News/CategoryCheckboxes';
import TagSelector from '@/Components/Admin/News/TagSelector';
import StatusSelector from '@/Components/Admin/News/StatusSelector';
import DateTimePicker from '@/Components/Admin/News/DateTimePicker';
import InputError from '@/Components/Forms/InputError';
import InputLabel from '@/Components/Forms/InputLabel';
import TextInput from '@/Components/Forms/TextInput';
import PrimaryButton from '@/Components/UI/PrimaryButton';

export default function NewsCreateNew({ availableCategories = [] }) {
  const [media, setMedia] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
    category: [],
    tags: [],
    status: 'draft',
    publish_date: '',
    media: [],
  });

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Преобразуем content в body для соответствия API
    const formData = {
      ...data,
      body: data.content || data.body || '', // Используем content как body
      images: media
    };
    
    // Удаляем content, если есть body
    if (formData.body && formData.content) {
      delete formData.content;
    }

    console.log('Отправка формы создания новости:', {
      title: formData.title,
      body_length: formData.body?.length || 0,
      category_count: formData.category?.length || 0,
      status: formData.status,
      media_count: media.length
    });

    post(route('admin.news.store'), {
      data: formData,
      onSuccess: () => {
        reset();
        setMedia([]);
      },
      onError: (errors) => {
        console.error('Ошибки валидации:', errors);
        // Показываем детальные ошибки в консоли для отладки
        if (errors) {
          Object.keys(errors).forEach(key => {
            console.error(`Ошибка в поле ${key}:`, errors[key]);
          });
        }
      },
      onFinish: () => {
        console.log('Запрос завершен');
      }
    });
  };

  // Обработка загрузки медиа
  const handleMediaUploaded = (newMedia) => {
    // Убеждаемся, что newMedia - это массив
    const mediaArray = Array.isArray(newMedia) ? newMedia : [newMedia];
    setMedia(prev => [...prev, ...mediaArray]);
    setData('images', [...media, ...mediaArray]);
  };

  // Обработка удаления медиа
  const handleMediaRemoved = (mediaId) => {
    const updatedMedia = media.filter(item => item.id !== mediaId);
    setMedia(updatedMedia);
    setData('images', updatedMedia);
  };

  // Обработка изменения статуса
  const handleStatusChange = (newStatus) => {
    setData('status', newStatus);
    
    // Если статус "scheduled", устанавливаем дату публикации
    if (newStatus === 'scheduled' && !data.publish_date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setData('publish_date', tomorrow.toISOString());
    }
    
    // Если статус "published", можно установить дату в прошлом
    if (newStatus === 'published' && !data.publish_date) {
      const now = new Date();
      setData('publish_date', now.toISOString());
    }
  };

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок страницы */}
          <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Создать новость</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Создайте новую новость с помощью современного редактора
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={route('admin.news.index')}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Назад к списку
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-2xl shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Скрыть' : 'Показать'} превью
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная форма */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Заголовок */}
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Заголовок</h2>
                  <div>
                    <InputLabel htmlFor="title" value="Заголовок новости *" />
                    <TextInput
                      id="title"
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      className="mt-1 block w-full text-lg"
                      placeholder="Введите заголовок новости..."
                      required
                      autoFocus
                    />
                    <InputError message={errors.title} className="mt-2" />
                    <p className="mt-2 text-xs text-gray-500">
                      Символов: {data.title.length} / 255
                    </p>
                  </div>
                </div>

                {/* Содержимое с TipTap редактором */}
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Содержимое</h2>
                  <div>
                    <InputLabel htmlFor="content" value="Текст новости *" />
                    <div className="mt-2">
                      <RichTextEditor
                        content={data.content}
                        onChange={(html) => setData('content', html)}
                        error={errors.content}
                        placeholder="Начните вводить текст новости..."
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Используйте панель инструментов для форматирования текста
                    </p>
                  </div>
                </div>

                {/* Медиа файлы */}
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Медиа файлы
                    {media.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">({media.length} файлов)</span>
                    )}
                  </h2>
                  <ModernMediaUploader
                    existingMedia={media}
                    onMediaUploaded={handleMediaUploaded}
                    onMediaRemoved={handleMediaRemoved}
                    maxFiles={20}
                  />
                  <InputError message={errors.media} className="mt-2" />
                </div>

                {/* Кнопки действий */}
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                  <div className="flex justify-between items-center">
                    <Link
                      href={route('admin.news.index')}
                      className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Отмена
                    </Link>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setData('status', 'draft');
                          setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
                        }}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50"
                      >
                        💾 Сохранить как черновик
                      </button>
                      <PrimaryButton 
                        disabled={processing}
                        className="px-6 py-3 text-sm font-medium rounded-2xl"
                      >
                        {processing ? '⏳ Публикуем...' : '🚀 Опубликовать'}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Боковая панель с настройками */}
            <div className="space-y-6">
              {/* Статус и дата публикации */}
              <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Публикация</h3>
                
                <div className="space-y-4">
                  <div>
                    <InputLabel value="Статус публикации" />
                    <StatusSelector
                      value={data.status}
                      onChange={handleStatusChange}
                      className="mt-2"
                    />
                    <InputError message={errors.status} className="mt-2" />
                  </div>

                  {(data.status === 'scheduled' || data.status === 'published') && (
                    <div>
                      <InputLabel value="Дата публикации" />
                      <DateTimePicker
                        value={data.publish_date}
                        onChange={(date) => setData('publish_date', date)}
                        className="mt-2"
                        minDate={data.status === 'scheduled' ? new Date() : null}
                        allowPast={data.status === 'published'}
                      />
                      <InputError message={errors.publish_date} className="mt-2" />
                      {data.status === 'published' && (
                        <p className="mt-1 text-xs text-gray-500">
                          💡 Можно установить дату в прошлом для публикации задним числом
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Категории */}
              <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Категории *
                </h3>
                <CategoryCheckboxes
                  selectedCategories={data.category}
                  onCategoriesChange={(categories) => setData('category', categories)}
                  availableCategories={availableCategories}
                  error={errors.category}
                />
              </div>

              {/* Теги */}
              <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Теги
                  <span className="text-gray-500 text-sm font-normal ml-2">(необязательно)</span>
                </h3>
                <TagSelector
                  selectedTags={data.tags}
                  onChange={(tags) => setData('tags', tags)}
                />
                <InputError message={errors.tags} className="mt-2" />
              </div>

              {/* Информация */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Подсказки</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Используйте редактор для форматирования текста</li>
                  <li>• Загрузите изображения или видео</li>
                  <li>• Первое изображение будет обложкой</li>
                  <li>• Можно запланировать публикацию</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Превью новости */}
          {showPreview && (
            <div className="mt-8 bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Превью новости</h2>
              
              {data.title && (
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h3>
              )}
              
              {data.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.category.map((cat, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              
              {media.length > 0 && media[0] && (
                <div className="mb-6">
                  {media[0].type === 'image' ? (
                    <img 
                      src={media[0].preview || media[0].path} 
                      alt="Обложка" 
                      className="w-full h-auto rounded-2xl shadow-md"
                    />
                  ) : (
                    <video 
                      src={media[0].preview || media[0].path} 
                      controls 
                      className="w-full h-auto rounded-2xl shadow-md"
                    />
                  )}
                </div>
              )}
              
              {data.content && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              )}
              
              {data.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {data.publish_date && (
                <div className="mt-4 text-sm text-gray-500">
                  📅 Дата публикации: {new Date(data.publish_date).toLocaleString('ru-RU')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


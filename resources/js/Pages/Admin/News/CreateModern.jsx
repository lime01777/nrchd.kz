import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import ModernMediaUploader from '@/Components/Admin/News/ModernMediaUploader';
import TagSelector from '@/Components/Admin/News/TagSelector';
import CategorySelector from '@/Components/Admin/News/CategorySelector';
import StatusSelector from '@/Components/Admin/News/StatusBadge';
import DateTimePicker from '@/Components/Admin/News/DateTimePicker';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Предустановленные категории и теги
const DEFAULT_CATEGORIES = [
  'Общие',
  'Аккредитация',
  'Обучение',
  'Конференции',
  'Методические материалы',
  'Исследования',
  'Анонсы',
  'Медицина',
  'Здравоохранение',
  'Технологии'
];

const POPULAR_TAGS = [
  'важное',
  'новости',
  'медицина',
  'здоровье',
  'исследования',
  'образование',
  'конференция',
  'технологии',
  'инновации',
  'лечение'
];

export default function CreateModern() {
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
    
    // Добавляем медиа к данным формы
    const formData = {
      ...data,
      media: media
    };

    post(route('admin.news.store'), {
      data: formData,
      onSuccess: () => {
        reset();
        setMedia([]);
      }
    });
  };

  // Обработка загрузки медиа
  const handleMediaUploaded = (newMedia) => {
    setMedia(prev => [...prev, ...newMedia]);
  };

  // Обработка удаления медиа
  const handleMediaRemoved = (mediaId) => {
    setMedia(prev => prev.filter(item => item.id !== mediaId));
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
  };

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Создать новость</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Заполните форму для создания новой новости
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={route('admin.news')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Назад к списку
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Скрыть' : 'Показать'} превью
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная форма */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Основная информация */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h2>
                  
                  <div className="space-y-4">
                    {/* Заголовок */}
                    <div>
                      <InputLabel htmlFor="title" value="Заголовок *" />
                      <TextInput
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Введите заголовок новости"
                        required
                      />
                      <InputError message={errors.title} className="mt-2" />
                    </div>

                    {/* Содержимое */}
                    <div>
                      <InputLabel htmlFor="content" value="Содержимое *" />
                      <Textarea
                        id="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="mt-1 block w-full"
                        rows={8}
                        placeholder="Введите содержимое новости"
                        required
                      />
                      <InputError message={errors.content} className="mt-2" />
                    </div>
                  </div>
                </div>

                {/* Медиа */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Медиа файлы</h2>
                  <ModernMediaUploader
                    existingMedia={media}
                    onMediaUploaded={handleMediaUploaded}
                    onMediaRemoved={handleMediaRemoved}
                    maxFiles={20}
                  />
                  <InputError message={errors.media} className="mt-2" />
                </div>

                {/* Кнопки действий */}
                <div className="flex justify-end space-x-3">
                  <Link
                    href={route('admin.news')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Отмена
                  </Link>
                  <PrimaryButton disabled={processing}>
                    {processing ? 'Сохранение...' : 'Создать новость'}
                  </PrimaryButton>
                </div>
              </form>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Статус и дата публикации */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Публикация</h2>
                
                <div className="space-y-4">
                  {/* Статус */}
                  <div>
                    <InputLabel htmlFor="status" value="Статус *" />
                    <StatusSelector
                      value={data.status}
                      onChange={handleStatusChange}
                      className="mt-1"
                    />
                    <InputError message={errors.status} className="mt-2" />
                  </div>

                  {/* Дата публикации */}
                  {data.status === 'scheduled' && (
                    <div>
                      <InputLabel value="Дата и время публикации *" />
                      <DateTimePicker
                        value={data.publish_date}
                        onChange={(value) => setData('publish_date', value)}
                        minDate={new Date()}
                        className="mt-1"
                      />
                      <InputError message={errors.publish_date} className="mt-2" />
                    </div>
                  )}
                </div>
              </div>

              {/* Категории */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Категории</h2>
                <CategorySelector
                  selectedCategories={data.category}
                  onCategoriesChange={(categories) => setData('category', categories)}
                  availableCategories={DEFAULT_CATEGORIES}
                  maxCategories={5}
                  placeholder="Выберите категории..."
                />
                <InputError message={errors.category} className="mt-2" />
              </div>

              {/* Теги */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Теги</h2>
                <TagSelector
                  selectedTags={data.tags}
                  onTagsChange={(tags) => setData('tags', tags)}
                  availableTags={POPULAR_TAGS}
                  maxTags={10}
                  placeholder="Добавить теги..."
                />
                <InputError message={errors.tags} className="mt-2" />
              </div>

              {/* Статистика */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Статистика</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Символов в заголовке:</span>
                    <span className="font-medium">{data.title.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Символов в тексте:</span>
                    <span className="font-medium">{data.content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Медиа файлов:</span>
                    <span className="font-medium">{media.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Категорий:</span>
                    <span className="font-medium">{data.category.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Тегов:</span>
                    <span className="font-medium">{data.tags.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Превью */}
          {showPreview && (
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Превью новости</h2>
              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {data.title || 'Заголовок новости'}
                </h1>
                <div className="text-gray-600 mb-4">
                  {data.content ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                  ) : (
                    'Содержимое новости...'
                  )}
                </div>
                {media.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Медиа файлы:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {media.map((item, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {item.type === 'video' ? (
                            <video src={item.path} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={item.path} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

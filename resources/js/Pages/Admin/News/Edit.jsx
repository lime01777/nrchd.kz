import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import Select from 'react-select';
import ImageGalleryUpload from '@/Components/ImageGalleryUpload';
import SimpleRichEditor from '@/Components/SimpleRichEditor';

const DEFAULT_CATEGORIES = [
  'Общие',
  'Аккредитация',
  'Обучение',
  'Конференции',
  'Методические материалы',
  'Исследования',
  'Анонсы',
];

export default function NewsEdit({ news = null }) {
  const isEditing = !!news;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, setData, post, put, processing, errors } = useForm({
    title: news?.title || '',
    category: Array.isArray(news?.category) ? news.category : (news?.category ? [news.category] : []),
    content: typeof news?.content === 'string' ? news.content : '',
    images: news?.images || [],
    main_image: news?.main_image || null,
    status: news?.status || 'Черновик',
    publishDate: news?.publishDate || new Date().toISOString().substr(0, 10),
  });

  const [categories, setCategories] = useState(() => {
    if (news?.category) {
      const arr = Array.isArray(news.category) ? news.category : [news.category];
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...arr]));
    }
    return DEFAULT_CATEGORIES;
  });
  const [selectedCategories, setSelectedCategories] = useState(Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []));
  const [newCategory, setNewCategory] = useState('');
  const [images, setImages] = useState(data.images);
  const [mainImage, setMainImage] = useState(data.main_image);

  // Категории для react-select
  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  const handleCategorySelect = (selected) => {
    const values = selected ? selected.map((opt) => opt.value) : [];
    setSelectedCategories(values);
    setData('category', values);
  };

  // Добавление новой категории
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      const updated = [...selectedCategories, newCategory];
      setSelectedCategories(updated);
      setData('category', updated);
      setNewCategory('');
    }
  };

  // Сохранение
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cat = data.category || [];
      
      // Проверка заголовка
      if (!data.title || data.title.trim().length === 0) {
        alert('Заполните заголовок');
        setIsSubmitting(false);
        return;
      }

      // Гарантируем массив для category
      if (!Array.isArray(data.category)) {
        setData('category', typeof data.category === 'string' ? [data.category] : []);
      }

      // Гарантируем строку для content
      if (typeof data.content !== 'string') {
        setData('content', String(data.content || ''));
      }

      // Гарантируем валидный статус
      if (!['Черновик', 'Опубликовано', 'Запланировано'].includes(data.status)) {
        setData('status', 'Черновик');
      }

      // Обработка изображений
      // Проверка, что изображения не пустые и могут быть загружены
      const validImages = images.filter(img => img && (typeof img === 'string' || (img instanceof File && img.size > 0)));
      
      // Важно! Добавляем изображения в данные формы
      setData('images', validImages);
      
      // Проверка главного изображения
      if (mainImage && (typeof mainImage === 'string' || (mainImage instanceof File && mainImage.size > 0))) {
        setData('main_image', mainImage);
      } else if (validImages.length > 0) {
        // Если главное изображение недействительно, используем первое доступное
        setData('main_image', validImages[0]);
        setMainImage(validImages[0]);
      } else {
        // Если нет действительных изображений, устанавливаем null
        setData('main_image', null);
      }

      // Проверка контента и категорий
      if (!data.content || data.content.replace(/<[^>]*?>/g, '').trim().length < 10) {
        alert('Содержимое должно содержать минимум 10 символов');
        setIsSubmitting(false);
        return;
      }
      if (cat.length === 0) {
        alert('Выберите хотя бы одну категорию');
        setIsSubmitting(false);
        return;
      }
      
      // Создаем FormData для корректной отправки файлов
      const formData = new FormData();
      
      // Добавляем все текстовые поля
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status', data.status);
      formData.append('publishDate', data.publishDate || '');
      
      // Добавляем категории как массив
      cat.forEach((category, index) => {
        formData.append(`category[${index}]`, category);
      });
      
      // Добавляем изображения как файлы или строки
      validImages.forEach((img, index) => {
        if (img instanceof File) {
          formData.append(`images[${index}]`, img);
        } else if (typeof img === 'string') {
          formData.append(`images[${index}]`, img);
        }
      });
      
      // Добавляем главное изображение
      if (mainImage instanceof File) {
        formData.append('main_image', mainImage);
      } else if (typeof mainImage === 'string') {
        formData.append('main_image', mainImage);
      }
      
      // Опции для запроса
      const options = {
        forceFormData: true, // Это важно для отправки файлов
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          // Сброс формы не нужен, так как Inertia перенаправит нас на другую страницу
        },
        onError: (errors) => {
          console.error('Ошибки валидации:', errors);
          setIsSubmitting(false);
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      };
      
      // Отправляем форму с FormData
      if (isEditing) {
        put(route('admin.news.update', news.id), formData, options);
      } else {
        post(route('admin.news.store'), formData, options);
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setIsSubmitting(false);
      alert('Произошла ошибка при отправке формы');
    }
  };

  // React Quill onChange
  const handleQuillChange = value => {
    setData('content', value);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Редактирование новости' : 'Создание новости'}
        </h2>
        <Link
          href={route('admin.news')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
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

              {/* Категории (react-select + добавление) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Категории *</label>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-2">
                  <div className="w-full sm:w-2/3">
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={categoryOptions.filter(opt => selectedCategories.includes(opt.value))}
                      onChange={handleCategorySelect}
                      classNamePrefix="react-select"
                      placeholder="Выберите категории..."
                      styles={{
                        control: (base) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: '#cbd5e1', boxShadow: 'none' }),
                        multiValue: (base) => ({ ...base, background: '#e0e7ff', color: '#3730a3' }),
                        option: (base, state) => ({ ...base, background: state.isFocused ? '#f3f4f6' : 'white', color: '#1e293b' })
                      }}
                    />
                  </div>
                  <div className="flex gap-2 items-center w-full sm:w-auto">
                  <input
                    type="text"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="Новая категория"
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button type="button" onClick={handleAddCategory} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Добавить</button>
              </div>
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Статус и дата публикации */}
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Статус *
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="Черновик">Черновик</option>
                    <option value="Опубликовано">Опубликовано</option>
                    <option value="Запланировано">Запланировано</option>
                  </select>
                </div>
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                  Дата публикации
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="publishDate"
                    id="publishDate"
                    value={data.publishDate}
                    onChange={(e) => setData('publishDate', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {errors.publishDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.publishDate}</p>
                )}
              </div>

              {/* Галерея изображений */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Галерея изображений (до 18)</label>
                <ImageGalleryUpload
                  images={images}
                  setImages={setImages}
                  mainImage={mainImage}
                  setMainImage={setMainImage}
                  max={18}
                />
              </div>

              {/* Содержимое (React Quill) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Содержимое *</label>
                <div className="bg-white rounded-lg shadow-sm min-h-[220px] transition-all">
                  <SimpleRichEditor
                    value={data.content}
                    onChange={handleQuillChange}
                    placeholder="Введите текст новости..."
                    minHeight="180px"
                  />
                </div>
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Минимум 10 символов</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={processing || isSubmitting}
            >
              {processing || isSubmitting ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Создать новость')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

NewsEdit.layout = page => <AdminLayout title="Редактирование новости">{page}</AdminLayout>;

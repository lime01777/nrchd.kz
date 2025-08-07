import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import AdvancedImageUploader from '@/Components/AdvancedImageUploader';
import SimpleRichEditor from '@/Components/SimpleRichEditor';

const DEFAULT_CATEGORIES = [
  'Общие',
  'Аккредитация',
  'Обучение',
  'Конференции',
  'Методические материалы',
  'Исследования',
  'Филиалы',
  'Анонсы событий',
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
  
  // Логирование данных новости при загрузке компонента
  useEffect(() => {
    if (news) {
      console.log('Загруженные данные новости:', {
        title: news.title,
        images: news.images,
        main_image: news.main_image
      });
    }
  }, [news]);

  const [categories, setCategories] = useState(() => {
    if (news?.category) {
      const arr = Array.isArray(news.category) ? news.category : [news.category];
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...arr]));
    }
    return DEFAULT_CATEGORIES;
  });
  const [selectedCategories, setSelectedCategories] = useState(Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []));
  const [newCategory, setNewCategory] = useState('');
  const [images, setImages] = useState(data.images || []);
  const [mainImage, setMainImage] = useState(data.main_image || null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Отладочная информация
  console.log('NewsEdit - данные новости:', {
    news,
    data,
    images: data.images,
    main_image: data.main_image,
    imagesType: typeof data.images,
    mainImageType: typeof data.main_image
  });

  // Инициализируем состояние изображений только один раз
  useEffect(() => {
    if (data.images && data.images.length > 0) {
      setImages(data.images);
    }
    if (data.main_image) {
      setMainImage(data.main_image);
    }
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  // Обработчик изменения изображений
  const handleImagesChange = (newImages) => {
    console.log('Изменение изображений:', newImages);
    setImages(newImages);
    
    // Разделяем файлы и URL
    const files = [];
    const urls = [];
    
    newImages.forEach(img => {
      if (img instanceof File) {
        files.push(img);
      } else if (typeof img === 'string') {
        urls.push(img);
      }
    });
    
    // Устанавливаем файлы в FormData
    setData('images', urls); // URL изображения
    setData('image_files', files); // Файлы для загрузки
  };

  // Обработчик изменения главного изображения
  const handleMainImageChange = (newMainImage) => {
    console.log('Изменение главного изображения:', newMainImage);
    setMainImage(newMainImage);
    setData('main_image', newMainImage);
  };

  // Обработчик изменения категорий через чекбоксы
  const handleCategoryChange = (category, checked) => {
    let updatedCategories;
    if (checked) {
      // Добавляем категорию
      updatedCategories = [...selectedCategories, category];
    } else {
      // Удаляем категорию
      updatedCategories = selectedCategories.filter(cat => cat !== category);
    }
    
    setSelectedCategories(updatedCategories);
    setData('category', updatedCategories);
  };

  // Добавление новой категории
  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    
    if (!trimmedCategory) {
      alert('Введите название категории');
      return;
    }
    
    if (categories.includes(trimmedCategory)) {
      alert('Такая категория уже существует');
      return;
    }
    
    if (trimmedCategory.length < 2) {
      alert('Название категории должно содержать минимум 2 символа');
      return;
    }
    
    if (trimmedCategory.length > 50) {
      alert('Название категории не должно превышать 50 символов');
      return;
    }
    
    const updatedCategories = [...categories, trimmedCategory];
    setCategories(updatedCategories);
    
    // Автоматически добавляем новую категорию в выбранные
    const updatedSelected = [...selectedCategories, trimmedCategory];
    setSelectedCategories(updatedSelected);
    setData('category', updatedSelected);
    
    setNewCategory('');
  };

  // Удаление категории из списка (если она не выбрана)
  const handleRemoveCategory = (categoryToRemove) => {
    // Подтверждение удаления
    if (!confirm(`Вы уверены, что хотите удалить категорию "${categoryToRemove}"?`)) {
      return;
    }
    
    // Удаляем из выбранных категорий
    const updatedSelected = selectedCategories.filter(cat => cat !== categoryToRemove);
    setSelectedCategories(updatedSelected);
    setData('category', updatedSelected);
    
    // Удаляем из общего списка категорий
    const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
    setCategories(updatedCategories);
  };

  // Выбрать все категории
  const handleSelectAll = () => {
    setSelectedCategories([...categories]);
    setData('category', [...categories]);
  };

  // Снять выбор со всех категорий
  const handleDeselectAll = () => {
    setSelectedCategories([]);
    setData('category', []);
  };

  // Инвертировать выбор
  const handleInvertSelection = () => {
    const newSelected = categories.filter(cat => !selectedCategories.includes(cat));
    setSelectedCategories(newSelected);
    setData('category', newSelected);
  };

  // Сохранение
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cat = data.category || [];
      
      // Отладочная информация о состоянии изображений перед отправкой формы
      console.log('Изображения перед отправкой:', {
        images: images,
        mainImage: mainImage,
        data_images: data.images,
        data_main_image: data.main_image
      });
      
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
      
      // Отладочная информация о финальных данных
      console.log('Финальные данные для отправки:', {
        title: data.title,
        content: data.content,
        category: data.category,
        status: data.status,
        publishDate: data.publishDate,
        images: data.images,
        main_image: data.main_image
      });
      
      // Опции для запроса
      const options = {
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
      
      // Отправляем форму через Inertia
      if (isEditing) {
        put(route('admin.news.update', news.id), options);
      } else {
        post(route('admin.news.store'), options);
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

              {/* Категории с чекбоксами */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Категории *</label>
                
                {/* Статистика выбранных категорий */}
                <div className="mb-3 p-2 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">
                      Выбрано: {selectedCategories.length} из {categories.length} категорий
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Выбрать все
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Снять выбор
                      </button>
                      <button
                        type="button"
                        onClick={handleInvertSelection}
                        className="text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        Инвертировать
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Список существующих категорий */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Существующие категории</h4>
                  
                  {/* Стандартные категории */}
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Стандартные категории</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.filter(cat => DEFAULT_CATEGORIES.includes(cat)).map((category) => (
                        <div key={category} className="flex items-center justify-between p-2 bg-white rounded border hover:border-blue-300 transition-colors">
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onChange={(e) => handleCategoryChange(category, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`category-${category}`} className="text-sm text-gray-700 flex-1 cursor-pointer">
                              {category}
                            </label>
                          </div>
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">Стандартная</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Пользовательские категории */}
                  {categories.filter(cat => !DEFAULT_CATEGORIES.includes(cat)).length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Пользовательские категории</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categories.filter(cat => !DEFAULT_CATEGORIES.includes(cat)).map((category) => (
                          <div key={category} className="flex items-center justify-between p-2 bg-white rounded border hover:border-blue-300 transition-colors">
                            <div className="flex items-center space-x-2 flex-1">
                              <input
                                type="checkbox"
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`category-${category}`} className="text-sm text-gray-700 flex-1 cursor-pointer">
                                {category}
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(category)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Удалить категорию"
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Добавление новой категории */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Добавить новую категорию</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Введите название новой категории"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!newCategory.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
                    >
                      Добавить
                    </button>
                  </div>
                  {newCategory.trim() && (
                    <p className="mt-2 text-xs text-gray-500">
                      Нажмите Enter или кнопку "Добавить" для создания категории "{newCategory}"
                    </p>
                  )}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Галерея изображений
                  <span className="text-xs text-gray-500 ml-2">
                    - Перетащите изображения или выберите из папки
                  </span>
                </label>
                <AdvancedImageUploader
                  images={images}
                  setImages={handleImagesChange}
                  mainImage={mainImage}
                  setMainImage={handleMainImageChange}
                  maxImages={18}
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

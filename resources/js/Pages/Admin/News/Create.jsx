import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import CompactImageGallery from '@/Components/CompactImageGallery';
import ModernContentEditor from '@/Components/ModernContentEditor';
import SimpleImageManager from '@/Components/FileManager/SimpleImageManager';

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
  // Добавляем состояние для отслеживания процесса отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    category: [],
    content: '',
    images: [],
    status: 'Черновик',
    publishDate: new Date().toISOString().substr(0, 10),
  });

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [images, setImages] = useState([]);

  // Обработчик изменения изображений
  const handleImagesChange = (newImages) => {
    console.log('Create - изменение изображений:', newImages);
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



  // Категории для выпадающего списка
  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  
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
    const allCategories = categories.map(cat => cat);
    setSelectedCategories(allCategories);
    setData('category', allCategories);
  };

  // Снять выбор со всех категорий
  const handleDeselectAll = () => {
    setSelectedCategories([]);
    setData('category', []);
  };

  // Инвертировать выбор
  const handleInvertSelection = () => {
    const inverted = categories.filter(cat => !selectedCategories.includes(cat));
    setSelectedCategories(inverted);
    setData('category', inverted);
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

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Сохранение
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cat = data.category || [];
      // Проверяем наличие минимум одной категории
      if (!data.title || data.title.trim().length === 0) {
        alert('Заполните заголовок');
        setIsSubmitting(false);
        return;
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
      
      // Подготавливаем данные для отправки
      const submitData = {
        title: data.title,
        content: data.content,
        status: data.status,
        publishDate: data.publishDate || '',
        category: cat,
        images: validImages.filter(img => typeof img === 'string'), // Только URL
        image_files: validImages.filter(img => img instanceof File) // Только файлы
      };
      
      console.log('Отправка формы с данными:', {
        title: data.title,
        content_length: data.content ? data.content.length : 0,
        categories: cat,
        images_count: validImages.length,
        status: data.status
      });

      // Отправляем форму с правильными данными
      post(route('admin.news.store'), submitData, { 
        preserveScroll: true,
        timeout: 60000, // Тайм-аут 60 секунд
        onStart: () => {
          console.log('Начинаем отправку формы...');
        },
        onProgress: (progress) => {
          console.log('Прогресс загрузки:', progress);
        },
        onSuccess: (response) => {
          console.log('Успешная отправка:', response);
          setIsSubmitting(false);
        },
        onError: (errors) => {
          console.error('Ошибки валидации:', errors);
          setIsSubmitting(false);
          
          // Показываем пользователю детали ошибки
          if (errors.error) {
            alert('Ошибка сохранения: ' + errors.error);
          } else {
            const errorMessages = Object.values(errors).flat();
            if (errorMessages.length > 0) {
              alert('Ошибки валидации:\n' + errorMessages.join('\n'));
            }
          }
        },
        onFinish: () => {
          // Этот колбэк выполнится всегда, независимо от успеха или ошибки
          console.log('Завершение отправки формы');
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setIsSubmitting(false);
    }
  };

  // React Quill onChange
  const handleQuillChange = value => {
    setData('content', value);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Создание новости</h2>
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
        <form onSubmit={handleSubmit} className="min-h-full">
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

              {/* Категории (выпадающий список с чекбоксами) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Категории *</label>
                <div className="relative category-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span className={selectedCategories.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedCategories.length > 0 
                        ? `Выбрано: ${selectedCategories.length} категорий` 
                        : 'Выберите категории...'
                      }
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        {/* Кнопки управления */}
                        <div className="flex gap-2 mb-3 pb-2 border-b border-gray-200">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Выбрать все
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Снять выбор
                          </button>
                          <button
                            type="button"
                            onClick={handleInvertSelection}
                            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                          >
                            Инвертировать
                          </button>
                        </div>
                        
                        {/* Список категорий */}
                        <div className="space-y-1">
                          {categoryOptions.map((category) => (
                            <label key={category.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.value)}
                                onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Добавление новой категории */}
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCategory}
                              onChange={e => setNewCategory(e.target.value)}
                              placeholder="Новая категория"
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button 
                              type="button" 
                              onClick={handleAddCategory} 
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                              Добавить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Галерея изображений
                  <span className="text-xs text-gray-500 ml-2">
                    - Добавьте до 10 изображений для слайдера
                  </span>
                </label>
                
                {/* Упрощенный файловый менеджер */}
                <SimpleImageManager
                  onSelect={(image) => {
                    const newImages = [...images, image.path];
                    handleImagesChange(newImages);
                  }}
                  selectedImages={images.map(img => ({ path: img }))}
                />
                
                {/* Текущие изображения */}
                <CompactImageGallery
                  images={images}
                  setImages={handleImagesChange}
                  maxImages={10}
                />
              </div>

              {/* Содержимое */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Содержимое *</label>
                <ModernContentEditor
                  value={data.content}
                  onChange={handleQuillChange}
                  placeholder="Начните писать содержимое новости..."
                  minHeight="320px"
                />
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
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={processing || isSubmitting}
            >
              {(processing || isSubmitting) ? 'Создание...' : 'Создать новость'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

NewsCreate.layout = page => <AdminLayout title="Создание новости">{page}</AdminLayout>; 
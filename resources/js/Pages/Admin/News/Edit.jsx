import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import ModernMediaUploader from '@/Components/ModernMediaUploader';
import ModernContentEditor from '@/Components/ModernContentEditor';
import MediaManager from '@/Components/FileManager/MediaManager';

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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [images, setImages] = useState(data.images || []);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Отладочная информация
  console.log('NewsEdit - данные новости:', {
    news,
    data,
    images: data.images,
    imagesType: typeof data.images
  });

  // Инициализируем состояние изображений только один раз
  useEffect(() => {
    if (data.images && data.images.length > 0) {
      setImages(data.images);
    }
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

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

  // Обработчик изменения изображений
  const handleImagesChange = (newImages) => {
    console.log('Edit - изменение изображений:', newImages);
    
    // Проверяем, что newImages является массивом
    const imagesArray = Array.isArray(newImages) ? newImages : [];
    setImages(imagesArray);
    
    // Разделяем файлы и URL
    const files = [];
    const urls = [];
    
    imagesArray.forEach(img => {
      if (img instanceof File) {
        files.push(img);
      } else if (typeof img === 'string' && img.trim().length > 0) {
        urls.push(img);
      }
    });
    
    console.log('Edit - разделенные файлы и URL:', { files, urls, totalImages: imagesArray.length });
    
    // Обновляем данные формы
    setData(prevData => ({
      ...prevData,
      images: urls,
      image_files: files
    }));
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
        data_images: data.images
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
      
      // Обработка изображений
      console.log('Состояние изображений перед валидацией:', {
        images: images,
        imagesLength: images ? images.length : 0,
        imagesType: typeof images
      });
      
      // Проверка, что изображения не пустые и могут быть загружены
      const validImages = images.filter(img => {
        const isValid = img && (typeof img === 'string' || (img instanceof File && img.size > 0));
        if (!isValid) {
          console.warn('Невалидное изображение:', img);
        }
        return isValid;
      });
      
      console.log('Валидные изображения:', validImages);
      
      // Разделяем изображения и видео
      const imageFiles = [];
      const videoFiles = [];
      const imageUrls = [];
      const videoUrls = [];
      
      validImages.forEach(img => {
        if (img instanceof File) {
          console.log('Добавляем файл:', img.name, img.size);
          if (img.type.startsWith('video/')) {
            videoFiles.push(img);
          } else {
            imageFiles.push(img);
          }
        } else if (typeof img === 'string') {
          console.log('Добавляем URL:', img);
          const extension = img.split('.').pop()?.toLowerCase();
          const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
          if (videoExtensions.includes(extension)) {
            videoUrls.push(img);
          } else {
            imageUrls.push(img);
          }
        }
      });
      
      console.log('Финальное разделение:', { imageFiles, videoFiles, imageUrls, videoUrls });
      
      // Подготавливаем данные для отправки
      const submitData = {
        title: data.title,
        content: data.content,
        status: data.status,
        publishDate: data.publishDate || '',
        category: cat,
        images: [...imageUrls, ...videoUrls]
      };

      // Добавляем файлы если есть
      if (imageFiles.length > 0) {
        submitData.image_files = imageFiles;
      }
      if (videoFiles.length > 0) {
        submitData.video_files = videoFiles;
      }
      
      // Отладочная информация о финальных данных
      console.log('Финальные данные для отправки:', submitData);
      
      // Опции для запроса
      const options = {
        preserveScroll: true,
        forceFormData: (imageFiles.length > 0 || videoFiles.length > 0), // Используем FormData только если есть файлы
        onSuccess: (page) => {
          console.log('Успешное сохранение:', page);
          setIsSubmitting(false);
        },
        onError: (errors) => {
          console.error('Ошибки валидации:', errors);
          setIsSubmitting(false);
          
          // Показываем конкретные ошибки пользователю
          const errorMessages = [];
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else {
              errorMessages.push(errors[key]);
            }
          });
          
          if (errorMessages.length > 0) {
            alert('Ошибки валидации:\n' + errorMessages.join('\n'));
          }
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      };
      
      // Отправляем форму через Inertia
      if (isEditing) {
        // Для редактирования используем PUT
        put(route('admin.news.update', news.id), submitData, options);
      } else {
        post(route('admin.news.store'), submitData, options);
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
                        
                        {/* Стандартные категории */}
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Стандартные категории</h5>
                          <div className="space-y-1">
                            {categories.filter(cat => DEFAULT_CATEGORIES.includes(cat)).map((category) => (
                              <label key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                                </div>
                                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">Стандартная</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Пользовательские категории */}
                        {categories.filter(cat => !DEFAULT_CATEGORIES.includes(cat)).length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Пользовательские категории</h5>
                            <div className="space-y-1">
                              {categories.filter(cat => !DEFAULT_CATEGORIES.includes(cat)).map((category) => (
                                <label key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedCategories.includes(category)}
                                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveCategory(category);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Удалить категорию"
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Добавление новой категории */}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCategory}
                              onChange={e => setNewCategory(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCategory();
                                }
                              }}
                              placeholder="Новая категория"
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button 
                              type="button" 
                              onClick={handleAddCategory} 
                              disabled={!newCategory.trim() || isAddingCategory}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              {isAddingCategory ? '...' : 'Добавить'}
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

              {/* Галерея медиа */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎥 Медиа галерея
                  <span className="text-xs text-gray-500 ml-2">
                    - Добавьте изображения или видео (до 10 файлов)
                  </span>
                </label>
                
                {/* Современный загрузчик медиа */}
                <ModernMediaUploader
                  media={images}
                  setMedia={handleImagesChange}
                  maxFiles={10}
                />
                
                {/* Медиа менеджер для выбора из библиотеки */}
                <div className="mt-4">
                  <MediaManager
                    onSelect={(mediaItem) => {
                      const newImages = [...images, mediaItem.path];
                      handleImagesChange(newImages);
                    }}
                    selectedMedia={images.map(img => ({ path: img }))}
                    maxFiles={10}
                  />
                </div>
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

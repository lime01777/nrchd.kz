import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
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
  const [media, setMedia] = useState([]);

  // Обработчик изменения медиа
  const handleMediaChange = (newMedia) => {
    console.log('Create - изменение медиа:', newMedia);
    console.log('Create - типы элементов:', newMedia.map(item => ({
      type: typeof item,
      isFile: item instanceof File,
      hasFile: item && item.file,
      name: item?.name || item?.file?.name,
      mimeType: item?.type || item?.file?.type,
      mediaType: item?.mediaType || item?.file?.mediaType,
      size: item?.size || item?.file?.size
    })));
    setMedia(newMedia);
    
    // Разделяем файлы и URL, а также изображения и видео
    const imageFiles = [];
    const videoFiles = [];
    const urls = [];
    
    newMedia.forEach(item => {
      console.log('Обработка элемента медиа:', {
        item: item,
        type: typeof item,
        isFile: item instanceof File,
        hasFile: item && item.file,
        name: item?.name || item?.file?.name,
        mimeType: item?.type || item?.file?.type,
        mediaType: item?.mediaType || item?.file?.mediaType
      });
    
    // Функция для определения типа файла
    const determineFileType = (file) => {
      const name = file.name || '';
      const type = file.type || '';
      const extension = name.split('.').pop()?.toLowerCase() || '';
      
      // Приоритет 1: MIME тип
      if (type.startsWith('video/')) {
        return 'video';
      } else if (type.startsWith('image/')) {
        return 'image';
      }
      
      // Приоритет 2: Расширение файла
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (videoExtensions.includes(extension)) {
        return 'video';
      } else if (imageExtensions.includes(extension)) {
        return 'image';
      }
      
      // Приоритет 3: По умолчанию считаем изображением
      console.warn('Неопределенный тип файла, считаем изображением:', name, type, extension);
      return 'image';
    };
    
    if (item instanceof File) {
      // Приоритет 1: Используем информацию о типе медиа, если она есть
      if (item.mediaType) {
        if (item.mediaType === 'video') {
          console.log('Добавляем видео файл (по mediaType):', item.name);
          videoFiles.push(item);
        } else {
          console.log('Добавляем изображение файл (по mediaType):', item.name);
          imageFiles.push(item);
        }
      } else {
        // Приоритет 2: Определяем тип файла по MIME типу и расширению
        const fileType = determineFileType(item);
        if (fileType === 'video') {
          console.log('Добавляем видео файл (по определению):', item.name);
          videoFiles.push(item);
        } else {
          console.log('Добавляем изображение файл (по определению):', item.name);
          imageFiles.push(item);
        }
      }
    } else if (item && item.file) {
      // Обработка объектов с файлами
      const file = item.file;
      
      // Приоритет 1: Используем информацию о типе медиа, если она есть
      if (file.mediaType) {
        if (file.mediaType === 'video') {
          console.log('Добавляем видео файл из объекта (по mediaType):', file.name);
          videoFiles.push(file);
        } else {
          console.log('Добавляем изображение файл из объекта (по mediaType):', file.name);
          imageFiles.push(file);
        }
      } else {
        // Приоритет 2: Определяем тип файла по MIME типу и расширению
        const fileType = determineFileType(file);
        if (fileType === 'video') {
          console.log('Добавляем видео файл из объекта (по определению):', file.name);
          videoFiles.push(file);
        } else {
          console.log('Добавляем изображение файл из объекта (по определению):', file.name);
          imageFiles.push(file);
        }
      }
    } else if (typeof item === 'string') {
      console.log('Добавляем URL:', item);
      urls.push(item);
    } else if (item && item.path) {
      console.log('Добавляем путь:', item.path);
      urls.push(item.path);
    } else {
      console.warn('Неизвестный тип элемента:', item);
    }
  });
    
    console.log('Create - разделение файлов и URL:', { 
      imageFiles, 
      videoFiles, 
      urls,
      totalFiles: imageFiles.length + videoFiles.length
    });
    
    // Устанавливаем данные в форму
    console.log('Create - устанавливаем данные в форму:', {
      urls,
      imageFiles: imageFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
      videoFiles: videoFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });
    
    setData('images', urls); // URL медиа
    setData('image_files', imageFiles); // Файлы изображений
    setData('video_files', videoFiles); // Файлы видео
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
      
      // Упрощенная обработка медиа (используем данные из handleMediaChange)
      console.log('Состояние медиа перед отправкой:', {
        media: media,
        data_images: data.images,
        data_image_files: data.image_files,
        data_video_files: data.video_files
      });
      
      // Дополнительная проверка файлов
      if (data.image_files && data.image_files.length > 0) {
        console.log('Детали файлов изображений:', data.image_files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          lastModified: file.lastModified,
          isValidSize: file.size <= 10 * 1024 * 1024, // 10MB
          isValidType: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
        })));
      }
      
      if (data.video_files && data.video_files.length > 0) {
        console.log('Детали файлов видео:', data.video_files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          lastModified: file.lastModified,
          isValidSize: file.size <= 50 * 1024 * 1024, // 50MB
          isValidType: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'].includes(file.type)
        })));
      }
      
      // Подготавливаем данные для отправки (позже добавим валидированные файлы)
      const submitData = {
        title: data.title,
        content: data.content,
        status: data.status,
        publishDate: data.publishDate || '',
        category: cat,
        images: data.images || []
      };

      // Валидация файлов на клиентской стороне
      const validImageFiles = [];
      const validVideoFiles = [];
      
      // Функция для определения типа файла
      const determineFileType = (file) => {
        const name = file.name || '';
        const type = file.type || '';
        const extension = name.split('.').pop()?.toLowerCase() || '';
        
        if (type.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
          return 'video';
        } else if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
          return 'image';
        }
        return 'unknown';
      };
      
      if (data.image_files && data.image_files.length > 0) {
        data.image_files.forEach(file => {
          const fileType = determineFileType(file);
          
          // Проверяем, что файл действительно изображение
          if (fileType === 'video') {
            console.warn('Видео файл попал в массив изображений, перемещаем:', file.name);
            validVideoFiles.push(file);
            return;
          }
          
          const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
          const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type);
          
          if (!isValidSize) {
            console.warn('Файл изображения превышает размер:', file.name, (file.size / (1024 * 1024)).toFixed(2) + ' MB');
          }
          if (!isValidType) {
            console.warn('Неподдерживаемый тип файла изображения:', file.name, file.type);
          }
          
          if (isValidSize && isValidType) {
            validImageFiles.push(file);
          } else {
            alert(`Файл "${file.name}" не прошел валидацию:\n${!isValidSize ? '- Размер превышает 10MB\n' : ''}${!isValidType ? '- Неподдерживаемый тип файла' : ''}`);
          }
        });
      }
      
      if (data.video_files && data.video_files.length > 0) {
        data.video_files.forEach(file => {
          const fileType = determineFileType(file);
          
          // Проверяем, что файл действительно видео
          if (fileType === 'image') {
            console.warn('Изображение попало в массив видео, перемещаем:', file.name);
            validImageFiles.push(file);
            return;
          }
          
          const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
          const isValidType = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'].includes(file.type);
          
          if (!isValidSize) {
            console.warn('Файл видео превышает размер:', file.name, (file.size / (1024 * 1024)).toFixed(2) + ' MB');
          }
          if (!isValidType) {
            console.warn('Неподдерживаемый тип файла видео:', file.name, file.type);
          }
          
          if (isValidSize && isValidType) {
            validVideoFiles.push(file);
          } else {
            alert(`Файл "${file.name}" не прошел валидацию:\n${!isValidSize ? '- Размер превышает 50MB\n' : ''}${!isValidType ? '- Неподдерживаемый тип файла' : ''}`);
          }
        });
      }
      
      // Добавляем только валидные файлы
      if (validImageFiles.length > 0) {
        submitData.image_files = validImageFiles;
      }
      if (validVideoFiles.length > 0) {
        submitData.video_files = validVideoFiles;
      }
      
      console.log('Отправка формы с данными:', {
        title: data.title,
        content_length: data.content ? data.content.length : 0,
        categories: cat,
        images_count: data.images ? data.images.length : 0,
        image_files_count: data.image_files ? data.image_files.length : 0,
        video_files_count: data.video_files ? data.video_files.length : 0,
        validImageFiles_count: validImageFiles.length,
        validVideoFiles_count: validVideoFiles.length,
        status: data.status
      });
      
      console.log('ФИНАЛЬНЫЕ ДАННЫЕ ДЛЯ ОТПРАВКИ:', {
        submitData,
        validImageFiles: validImageFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        validVideoFiles: validVideoFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        forceFormData: (validImageFiles.length > 0 || validVideoFiles.length > 0)
      });

      // Опции для запроса
      const options = {
        preserveScroll: true,
        // Принудительно используем FormData, если действительно есть файлы к отправке
        forceFormData: (validImageFiles.length > 0 || validVideoFiles.length > 0),
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
      // Отправляем форму с явно собранными данными, минуя состояние формы
      console.log('ОТПРАВКА ФОРМЫ:', {
        route: route('admin.news.store'),
        submitData,
        options,
        forceFormData: (validImageFiles.length > 0 || validVideoFiles.length > 0)
      });
      
      router.post(route('admin.news.store'), submitData, options);
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
                  media={media}
                  setMedia={handleMediaChange}
                  maxFiles={10}
                />
                
                {/* Медиа менеджер для выбора из библиотеки */}
                <div className="mt-4">
                  <MediaManager
                    onSelect={(mediaItem) => {
                      const newMedia = [...media, mediaItem];
                      handleMediaChange(newMedia);
                    }}
                    selectedMedia={media}
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
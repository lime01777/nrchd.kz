import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';

const DEFAULT_CATEGORIES = [
  'Общие',
  'Аккредитация',
  'Обучение',
  'Конференции',
  'Методические материалы',
  'Исследования',
  'Анонсы',
];

function isValidJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export default function NewsEdit({ news = null }) {
  const isEditing = !!news;
  const { data, setData, post, put, processing, errors } = useForm({
    title: news?.title || '',
    slug: news?.slug || '',
    category: Array.isArray(news?.category) ? news.category : (news?.category ? [news.category] : []),
    content: news?.content || '',
    image: null,
    status: news?.status || 'Черновик',
    publishDate: news?.publishDate || new Date().toISOString().substr(0, 10),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState(() => {
    // Если есть категории из новости, добавляем их к дефолтным
    if (news?.category) {
      const arr = Array.isArray(news.category) ? news.category : [news.category];
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...arr]));
    }
    return DEFAULT_CATEGORIES;
  });
  const [selectedCategories, setSelectedCategories] = useState(Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []));
  const [newCategory, setNewCategory] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);

  // Drag&Drop для изображения
  const handleImageDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setData('image', e.dataTransfer.files[0]);
      setImageFile(e.dataTransfer.files[0]);
    }
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setData('image', e.target.files[0]);
      setImageFile(e.target.files[0]);
    }
  };
  const handleRemoveImage = () => {
    setData('image', null);
    setImageFile(null);
    setImagePreview(null);
  };
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (isEditing && news.image) {
      setImagePreview(news.image);
    } else {
      setImagePreview(null);
    }
  }, [imageFile, isEditing, news]);

  useEffect(() => {
    if (!isEditing && data.title) {
      const slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setData('slug', slug);
    }
  }, [data.title, isEditing]);

  // TinyMCE value handler
  const handleContentChange = (content, editor) => {
    setData('content', content);
  };

  // Multi-select обработка
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
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

  // Категории для react-select
  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  const handleCategorySelect = (selected) => {
    const values = selected ? selected.map((opt) => opt.value) : [];
    setSelectedCategories(values);
    setData('category', values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData('category', selectedCategories);
    if (isEditing) {
      put(route('admin.news.update', news.id), { forceFormData: true });
    } else {
      post(route('admin.news.store'), { forceFormData: true });
    }
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
                  Заголовок
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
                  />
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Категории (react-select + добавление) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Категории</label>
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
                  Статус
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
                    required
                  />
                </div>
                {errors.publishDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.publishDate}</p>
                )}
              </div>

              {/* Загрузка изображения (drag&drop, превью, удаление) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative"
                  onDrop={handleImageDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById('image-upload-input').click()}
                  style={{ minHeight: '120px' }}
                >
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Превью" className="h-32 w-32 object-cover rounded-lg shadow" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); handleRemoveImage(); }}
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
                        title="Удалить изображение"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-blue-600 font-medium cursor-pointer">Загрузить файл</span>
                      <span className="text-xs text-gray-400">или перетащите сюда<br/>PNG, JPG, GIF до 10MB</span>
                    </div>
                  )}
                            <input 
                    id="image-upload-input"
                              type="file" 
                              accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Содержимое TinyMCE */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Содержимое</label>
                <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm p-2 min-h-[220px] focus-within:ring-2 focus-within:ring-blue-400 transition-all" style={{ boxShadow: '0 2px 8px 0 #e0e7ff' }}>
                  <Editor
                    apiKey={'ckt2ux657iu8ehiz8mhzuy8zxnec6kv9bra5dtuif75nwdoq'}
                    value={data.content}
                    init={{
                      height: 350,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help | image link',
                      content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
                      language: 'ru',
                      images_upload_url: '/api/editor-upload',
                      images_upload_handler: function (blobInfo, success, failure) {
                        const formData = new FormData();
                        formData.append('image', blobInfo.blob());
                        fetch('/api/editor-upload', {
                          method: 'POST',
                          body: formData
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (data.success && data.file && data.file.url) {
                              success(data.file.url);
                            } else {
                              failure('Ошибка загрузки');
                            }
                          })
                          .catch(() => failure('Ошибка загрузки'));
                      },
                    }}
                    onEditorChange={handleContentChange}
                  />
                </div>
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={processing}
            >
              {isEditing ? 'Сохранить изменения' : 'Создать новость'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

NewsEdit.layout = page => <AdminLayout title="Редактирование новости">{page}</AdminLayout>;

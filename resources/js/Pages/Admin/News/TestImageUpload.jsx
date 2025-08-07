import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import ImageGalleryUpload from '@/Components/ImageGalleryUpload';

export default function TestImageUpload() {
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
    images: [],
    main_image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Отправляем данные:', {
      title: data.title,
      content: data.content,
      images: data.images,
      main_image: data.main_image
    });
    
    post('/admin/news/test-upload');
  };

  return (
    <>
      <Head title="Тест загрузки изображений" />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Тест загрузки изображений</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Введите заголовок"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержимое
            </label>
            <textarea
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
              placeholder="Введите содержимое"
            />
          </div>
          
          <div>
            <ImageGalleryUpload
              images={images}
              setImages={setImages}
              mainImage={mainImage}
              setMainImage={setMainImage}
              max={5}
            />
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Отладочная информация:</h3>
            <pre className="text-sm">
              {JSON.stringify({
                images: images,
                mainImage: mainImage,
                data_images: data.images,
                data_main_image: data.main_image
              }, null, 2)}
            </pre>
          </div>
          
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {processing ? 'Отправка...' : 'Отправить тест'}
          </button>
        </form>
      </div>
    </>
  );
}

TestImageUpload.layout = page => <AdminLayout title="Тест загрузки изображений">{page}</AdminLayout>;

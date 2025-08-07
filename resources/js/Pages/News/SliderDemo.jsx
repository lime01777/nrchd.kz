import React from 'react';
import { Head } from '@inertiajs/react';
import NewsImageSlider from '@/Components/NewsImageSlider';
import NewsFirstImage from '@/Components/NewsFirstImage';
import News_chlank from '@/Components/News_chlank';
import News_chlank_simple from '@/Components/News_chlank_simple';

export default function SliderDemo() {
  // Тестовые данные для демонстрации
  const testImages = [
    '/img/news/news1.jpg',
    '/img/news/news2.jpg',
    '/img/news/news3.jpg',
    '/img/news/news4.jpg'
  ];

  const testNews = [
    {
      id: 1,
      title: 'Важные изменения в системе здравоохранения',
      description: 'Новые методики и практики в системе здравоохранения Казахстана',
      image: '/img/news/news1.jpg',
      images: testImages,
      date: '2025-01-15',
      slug: 'test-news-1'
    },
    {
      id: 2,
      title: 'Конференция по развитию медицинского образования',
      description: 'Состоялась ежегодная конференция по вопросам медицинского образования',
      image: '/img/news/news2.jpg',
      images: testImages.slice(0, 2),
      date: '2025-01-14',
      slug: 'test-news-2'
    },
    {
      id: 3,
      title: 'Новые технологии в диагностике',
      description: 'Внедрение современных технологий в диагностические процедуры',
      image: '/img/news/news3.jpg',
      images: [],
      date: '2025-01-13',
      slug: 'test-news-3'
    }
  ];

  return (
    <>
      <Head title="Демонстрация слайдера новостей" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Демонстрация слайдера новостей</h1>
        
        {/* Секция 1: Слайдер с множественными изображениями */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Слайдер с множественными изображениями</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Слайдер (3 сек)</h3>
              <div className="h-64">
                <NewsImageSlider 
                  images={testImages}
                  className="h-64"
                  height="256px"
                  showDots={true}
                  showCounter={true}
                  autoPlay={true}
                  interval={3000}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Слайдер (5 сек)</h3>
              <div className="h-64">
                <NewsImageSlider 
                  images={testImages}
                  className="h-64"
                  height="256px"
                  showDots={true}
                  showCounter={true}
                  autoPlay={true}
                  interval={5000}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Без автопрокрутки</h3>
              <div className="h-64">
                <NewsImageSlider 
                  images={testImages}
                  className="h-64"
                  height="256px"
                  showDots={true}
                  showCounter={true}
                  autoPlay={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Секция 2: Первое изображение */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Отображение первого изображения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Множественные изображения</h3>
              <div className="h-64">
                <NewsFirstImage 
                  images={testImages}
                  className="h-64"
                  height="256px"
                  alt="Тестовое изображение"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Одно изображение</h3>
              <div className="h-64">
                <NewsFirstImage 
                  images={testImages.slice(0, 1)}
                  className="h-64"
                  height="256px"
                  alt="Тестовое изображение"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Без изображений</h3>
              <div className="h-64">
                <NewsFirstImage 
                  images={[]}
                  className="h-64"
                  height="256px"
                  alt="Тестовое изображение"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Секция 3: Карточки новостей */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Карточки новостей</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testNews.map((news, index) => (
              <div key={news.id}>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {index === 0 ? 'Слайдер' : index === 1 ? 'Первое изображение' : 'Без изображений'}
                </h3>
                {index === 0 ? (
                  <News_chlank
                    date={new Date(news.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    description={news.title}
                    slug={news.slug}
                    image={news.image}
                    images={news.images}
                  />
                ) : (
                  <News_chlank_simple
                    date={new Date(news.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    description={news.title}
                    slug={news.slug}
                    image={news.image}
                    images={news.images}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Секция 4: Информация о компонентах */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Информация о компонентах</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">NewsImageSlider</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Автоматическая прокрутка каждые 3 секунды</li>
                <li>• Без стрелок управления</li>
                <li>• Индикаторы (точки) для навигации</li>
                <li>• Счетчик изображений (опционально)</li>
                <li>• Адаптивный дизайн</li>
                <li>• Обработка ошибок загрузки</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">NewsFirstImage</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Отображение первого изображения</li>
                <li>• Индикатор множественных изображений</li>
                <li>• Заглушка при отсутствии изображений</li>
                <li>• Обработка ошибок загрузки</li>
                <li>• Настраиваемая высота</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

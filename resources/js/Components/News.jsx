import React, { useState, useEffect } from 'react';
import News_chlank from './News_chlank';
import { Link } from '@inertiajs/react';
import Slider from 'react-slick';

// Импортируем CSS для слайдера
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function News() {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем последние 10 новостей из БД
    fetch('/api/latest-news?limit=10')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Получено новостей из БД:', data.length);
        setLatestNews(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке новостей:', error);
        // В случае ошибки используем тестовые данные
        const fallbackNews = [
          {
            id: 1,
            title: 'Важные изменения в системе здравоохранения',
            description: 'Новые методики и практики в системе здравоохранения Казахстана',
            image: '/img/news/news1.jpg',
            date: '2025-05-15',
            url: '/news/1'
          },
          {
            id: 2,
            title: 'Конференция по развитию медицинского образования',
            description: 'Состоялась ежегодная конференция по вопросам медицинского образования',
            image: '/img/news/news2.jpg',
            date: '2025-04-28',
            url: '/news/2'
          }
        ];
        setLatestNews(fallbackNews);
        setLoading(false);
      });
  }, []);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2" data-translate>Новости</h1>
                </div>
                <div className='flex'>
                <Link href={route('news')} className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105" data-translate>Все новости
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
                </div>
            </div>
            {loading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="mt-2">Загрузка новостей...</p>
                </div>
            ) : latestNews.length > 0 ? (
                <div className="relative news-slider-container">
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={1}
                        initialSlide={0}
                        autoplay={true}
                        autoplaySpeed={5000}
                        cssEase="linear"
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    initialSlide: 0
                                }
                            }
                        ]}
                        className="mx-2"
                        adaptiveHeight={false}
                        vertical={false}
                    >
                        {latestNews.slice(0, 10).map((news, index) => (
                            <div key={news.id || index} className="px-2">
                                <News_chlank
                                    date={new Date(news.publish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    description={news.title}
                                    slug={news.slug}
                                    image={news.image}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p>Нет доступных новостей</p>
                </div>
            )}
        </div>
    </section>
  )
}

export default News

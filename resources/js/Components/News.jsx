import React, { useState, useEffect, useMemo } from 'react';
import News_chlank from './News_chlank';
import { Link } from '@inertiajs/react';
import Slider from 'react-slick';
import translationService from '@/services/TranslationService';

// Импортируем CSS для слайдера
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Кастомные стили для слайдера новостей
const sliderStyles = `
  .news-slider-container .slick-slide {
    padding: 0 8px;
  }
  .news-slider-container .slick-list {
    margin: 0 -8px;
  }
  .news-slider-container .slick-dots {
    bottom: -50px;
  }
  .news-slider-container .slick-dots li button:before {
    font-size: 12px;
    color: #9CA3AF;
    opacity: 0.5;
  }
  .news-slider-container .slick-dots li.slick-active button:before {
    color: #2563EB;
    opacity: 1;
  }
  .news-slider-container .slick-prev,
  .news-slider-container .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
  }
  .news-slider-container .slick-prev {
    left: -50px;
  }
  .news-slider-container .slick-next {
    right: -50px;
  }
  .news-slider-container .slick-prev:before,
  .news-slider-container .slick-next:before {
    font-size: 40px;
    color: #2563EB;
    opacity: 0.8;
  }
  .news-slider-container .slick-prev:hover:before,
  .news-slider-container .slick-next:hover:before {
    opacity: 1;
  }
  @media (max-width: 1024px) {
    .news-slider-container .slick-prev {
      left: -30px;
    }
    .news-slider-container .slick-next {
      right: -30px;
    }
  }
  @media (max-width: 768px) {
    .news-slider-container .slick-prev,
    .news-slider-container .slick-next {
      display: none !important;
    }
  }
`;

function News() {
  // Функция для получения перевода
  const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем больше новостей для карусели (до 20 для плавной прокрутки)
    fetch('/api/latest-news?limit=20')
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
        ];
        setLatestNews(fallbackNews);
        setLoading(false);
      });
  }, []);

  // Мемоизируем обработанные новости, чтобы массивы изображений не пересоздавались
  const processedNews = useMemo(() => {
    return latestNews.map(news => ({
      ...news,
      processedImages: news.images || [news.image]
    }));
  }, [latestNews]);

  return (
    <>
      {/* Инъекция стилей для слайдера */}
      <style>{sliderStyles}</style>
      
      <section className="text-gray-600 body-font bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-5 py-16 mx-auto">
            {/* Заголовок секции */}
            <div className="flex flex-col sm:flex-row w-full justify-between items-center mb-12">
                <div className='mb-4 sm:mb-0'>
                    <h1 className="text-3xl sm:text-4xl font-bold title-font text-gray-900">{t('newsComponent.title')}</h1>
                </div>
                <div className='flex'>
                    <Link 
                        href={route('news.index')} 
                        className="cursor-pointer text-black bg-white border border-gray-300 inline-flex items-center rounded-xl px-6 py-3 transition-all duration-300 ease-in-out hover:bg-gray-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        {t('newsComponent.allNews')}
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2" className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">{t('newsComponent.loading')}</p>
                </div>
            ) : processedNews.length > 0 ? (
                /* Карусель-слайдер с новостями */
                <div className="relative news-slider-container pb-16">
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={600}
                        slidesToShow={Math.min(processedNews.length, 6)} // Показываем до 6 новостей
                        slidesToScroll={1}
                        initialSlide={0}
                        autoplay={true}
                        autoplaySpeed={4000}
                        cssEase="ease-in-out"
                        pauseOnHover={true}
                        arrows={true}
                        responsive={[
                            {
                                breakpoint: 1920,
                                settings: {
                                    slidesToShow: Math.min(processedNews.length, 6),
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true
                                }
                            },
                            {
                                breakpoint: 1536,
                                settings: {
                                    slidesToShow: Math.min(processedNews.length, 5),
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true
                                }
                            },
                            {
                                breakpoint: 1280,
                                settings: {
                                    slidesToShow: Math.min(processedNews.length, 4),
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true
                                }
                            },
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: Math.min(processedNews.length, 3),
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: Math.min(processedNews.length, 2),
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true,
                                    arrows: false
                                }
                            },
                            {
                                breakpoint: 640,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    dots: true,
                                    infinite: true,
                                    arrows: false
                                }
                            }
                        ]}
                    >
                        {processedNews.map((news, index) => (
                            <div key={news.id || index} className="px-2">
                                <News_chlank
                                    date={news.date || new Date(news.publish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    description={news.title}
                                    slug={news.slug}
                                    image={news.image}
                                    images={news.processedImages}
                                    external_url={news.external_url}
                                    type={news.type}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg">{t('newsComponent.noNews')}</p>
                </div>
            )}
        </div>
    </section>
    </>
  )
}

export default News

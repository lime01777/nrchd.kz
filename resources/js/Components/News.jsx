import React, { useState, useEffect } from 'react';
import News_chlank from './News_chlank';
import { Link } from '@inertiajs/react';

function News() {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем последние новости при монтировании компонента
    fetch('/api/latest-news')
      .then(response => response.json())
      .then(data => {
        setLatestNews(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке новостей:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
            <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">Новости</h1>
                </div>
                <div className='flex'>
                <Link href={route('news')} className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">Все новости
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
                </div>
            </div>
            <div className="flex flex-wrap -m-4">
                {loading ? (
                  <div className="p-4 w-full text-center">
                    <p>Загрузка новостей...</p>
                  </div>
                ) : latestNews.length > 0 ? (
                  latestNews.map((news, index) => (
                    <News_chlank 
                      key={news.id || index}
                      date={new Date(news.publish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      description={news.title}
                      slug={news.slug}
                    />
                  ))
                ) : (
                  <div className="p-4 w-full text-center">
                    <p>Нет доступных новостей</p>
                  </div>
                )}
            </div>
        </div>
    </section>
  )
}

export default News

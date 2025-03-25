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
        
        // Если API недоступен, используем статичные данные для демонстрации
        setLatestNews([
          {
            id: 1,
            title: 'Министерство здравоохранения Республики Казахстан провело конференцию по вопросам развития медицинского образования',
            publish_date: '2025-03-20',
            slug: 'conference-medical-education'
          },
          {
            id: 2,
            title: 'Новые клинические протоколы по лечению сердечно-сосудистых заболеваний утверждены в Казахстане',
            publish_date: '2025-03-18',
            slug: 'new-clinical-protocols'
          },
          {
            id: 3,
            title: 'Республиканский центр развития здравоохранения подписал меморандум о сотрудничестве с ВОЗ',
            publish_date: '2025-03-15',
            slug: 'memorandum-who'
          },
          {
            id: 4,
            title: 'Запущена новая программа повышения квалификации для медицинских работников',
            publish_date: '2025-03-10',
            slug: 'new-qualification-program'
          },
          {
            id: 5,
            title: 'Итоги международной конференции по цифровизации здравоохранения',
            publish_date: '2025-03-05',
            slug: 'digital-health-conference'
          },
          {
            id: 6,
            title: 'Обновлены стандарты аккредитации медицинских организаций',
            publish_date: '2025-03-01',
            slug: 'updated-accreditation-standards'
          }
        ]);
      });
  }, []);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">Новости</h1>
                </div>
                <div className='flex'>
                <Link href={route('news')} className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105">Все новости
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="mt-2">Загрузка новостей...</p>
                  </div>
                ) : latestNews.length > 0 ? (
                  latestNews.slice(0, 6).map((news, index) => (
                    <News_chlank 
                      key={news.id || index}
                      date={new Date(news.publish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      description={news.title}
                      slug={news.slug}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p>Нет доступных новостей</p>
                  </div>
                )}
            </div>
        </div>
    </section>
  )
}

export default News

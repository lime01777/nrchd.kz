import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head } from '@inertiajs/react';

/**
 * Страница со спикерами конференции
 * 
 * @returns {React.ReactElement} Страница со списком спикеров
 */
export default function Speakers() {
  // Данные о спикерах (в реальном проекте могут загружаться из API)
  const speakers = [
    {
      name: 'Айдар Жумагулов',
      title: 'Профессор',
      organization: 'Национальный научный центр развития здравоохранения',
      bio: 'Эксперт в области организации здравоохранения с более чем 20-летним опытом работы. Автор более 100 научных публикаций.',
      topic: 'Стратегическое развитие систем здравоохранения в Центральной Азии',
      image: '/storage/conference/speakers/speaker1.jpg'
    },
    {
      name: 'Жанна Калиева',
      title: 'Доктор медицинских наук',
      organization: 'Медицинский университет Астаны',
      bio: 'Специалист в области медицинского образования, разработчик инновационных образовательных программ для врачей.',
      topic: 'Трансформация медицинского образования: вызовы и возможности',
      image: '/storage/conference/speakers/speaker2.jpg'
    },
    {
      name: 'Джон Смит',
      title: 'Профессор',
      organization: 'Университет здравоохранения США',
      bio: 'Международный эксперт по организации здравоохранения, консультант ВОЗ и автор нескольких монографий.',
      topic: 'Мировые тренды в организации здравоохранения',
      image: '/storage/conference/speakers/speaker3.jpg'
    },
    {
      name: 'Мария Альварес',
      title: 'Доктор наук',
      organization: 'ВОЗ Европейское бюро',
      bio: 'Координатор программ по укреплению систем здравоохранения в странах Восточной Европы и Центральной Азии.',
      topic: 'Стратегии укрепления систем здравоохранения',
      image: '/storage/conference/speakers/speaker4.jpg'
    },
    {
      name: 'Алексей Цифров',
      title: 'Директор',
      organization: 'Центр цифровых медицинских технологий',
      bio: 'Эксперт в области цифровизации здравоохранения и телемедицины. Руководитель нескольких инновационных проектов.',
      topic: 'Телемедицина: возможности и барьеры внедрения',
      image: '/storage/conference/speakers/speaker5.jpg'
    },
    {
      name: 'Анна Казахстанова',
      title: 'Профессор',
      organization: 'Медицинский университет Астаны',
      bio: 'Специалист по симуляционному обучению в медицине, автор методик подготовки медицинских кадров.',
      topic: 'Симуляционные технологии в обучении клиническим навыкам',
      image: '/storage/conference/speakers/speaker6.jpg'
    }
  ];

  return (
    <ConferenceLayout title="Спикеры">
      <Head>
        <title>Спикеры - NRCHD Conference 2025</title>
        <meta name="description" content="Спикеры научно-практической конференции NRCHD 2025" />
      </Head>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
                На конференции NRCHD 2025 выступят ведущие эксперты из Казахстана и зарубежных стран, 
                которые поделятся своим опытом и знаниями в области развития здравоохранения.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200">
                    {/* В реальном проекте здесь будет изображение спикера */}
                    {/* <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" /> */}
                    
                    {/* Заглушка для демонстрации */}
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-blue-600 font-medium mb-1">{speaker.title}</p>
                    <p className="text-gray-600 mb-4">{speaker.organization}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">О спикере</h4>
                      <p className="text-gray-600">{speaker.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Тема доклада</h4>
                      <p className="text-gray-800 font-medium">{speaker.topic}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-3">Станьте спикером!</h3>
              <p className="mb-4">
                Если вы хотите выступить на конференции NRCHD 2025 с докладом, 
                заполните форму регистрации, выбрав тип участия "Спикер".
              </p>
              <a 
                href={route('conference.registration')} 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Зарегистрироваться как спикер
              </a>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function MedicalTourism() {
  const [selectedCity, setSelectedCity] = useState('astana');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Данные о городах
  const cities = {
    astana: {
      name: 'Астана',
      dates: '13-15 октября 2025',
      time: '18:00',
      venue: 'Президентский центр Республики Казахстан',
      color: 'from-blue-600 to-blue-800'
    },
    almaty: {
      name: 'Алматы',
      dates: '16-17 октября 2025',
      time: '18:00',
      venue: 'Место проведения уточняется',
      color: 'from-green-600 to-green-800'
    }
  };

  // Таймер обратного отсчета
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date('2025-10-13T18:00:00');
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentCity = cities[selectedCity];

  return (
    <>
      <Head title="Международная конференция по медицинскому туризму" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero секция с таймером */}
        <div className={`bg-gradient-to-r ${currentCity.color} text-white relative overflow-hidden`}>
          {/* Фоновые элементы */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Переключатель городов */}
              <div className="flex justify-center mb-12">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-2 flex">
                  {Object.entries(cities).map(([key, city]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCity(key)}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedCity === key
                          ? 'bg-white text-gray-800 shadow-lg'
                          : 'text-white hover:bg-white hover:bg-opacity-20'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Основной заголовок */}
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Медицинский туризм
                </h1>
                <h2 className="text-2xl md:text-3xl font-light mb-8 opacity-90">
                  Развитие медицинского туризма в Казахстане
                </h2>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                  <p className="text-xl font-semibold mb-2">{currentCity.dates}</p>
                  <p className="text-lg opacity-90">{currentCity.venue}</p>
                </div>
              </div>

              {/* Таймер обратного отсчета */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{value}</div>
                    <div className="text-sm uppercase tracking-wider opacity-80">
                      {unit === 'days' ? 'дней' : 
                       unit === 'hours' ? 'часов' : 
                       unit === 'minutes' ? 'минут' : 'секунд'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* О мероприятии */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">О мероприятии</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Первая международная конференция по медицинскому туризму представляет собой уникальную площадку 
                    для продвижения туристического потенциала Казахстана и укрепления международного имиджа страны.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Медицинский туризм - это ответственное и многогранное направление, требующее особого внимания, 
                    ведь речь идёт о здоровье людей.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8">
                  <blockquote className="text-lg italic mb-4">
                    «Мы видим большой потенциал в развитии медицинского туризма, особенно в высокотехнологичных отраслях… 
                    Готовы выстраивать устойчивые трансграничные связи для достижения прогресса в этой сфере.»
                  </blockquote>
                  <p className="text-sm text-gray-600 font-semibold">— Глава государства</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Статистика */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Масштаб мероприятия</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: '200', label: 'Делегатов', sublabel: 'из 45 стран' },
                  { number: '300', label: 'Специалистов', sublabel: 'из Казахстана' },
                  { number: '100', label: 'Организаций', sublabel: 'и партнеров' },
                  { number: '1000', label: 'Посетителей', sublabel: 'целевых' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Организаторы */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Организаторы</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Основные организаторы</h3>
                  <div className="space-y-4">
                    {[
                      'РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК',
                      'Министерство здравоохранения Республики Казахстан',
                      'РОО «Ассоциация организаторов в сфере охраны здоровья»',
                      'DeConsilior'
                    ].map((org, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-gray-700 font-medium">{org}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6">Организационный комитет</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold mb-1">Председатель:</div>
                      <div className="text-lg">Салидат Каирбекова</div>
                      <div className="text-sm opacity-80">Директор ННЦРЗ</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Заместители председателя:</div>
                      <div>Представители МЗ РК</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Регистрация */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Регистрация на конференцию</h2>
                <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    title: 'Участник',
                    price: '50,000 ₸',
                    description: 'Полный доступ к конференции',
                    features: ['Участие во всех сессиях', 'Доступ к выставке', 'Материалы конференции', 'Сертификат участника']
                  },
                  {
                    title: 'Спонсор',
                    price: '500,000 ₸',
                    description: 'Премиум пакет спонсора',
                    features: ['Все преимущества участника', 'Выставочный стенд', 'Презентация на пленарной сессии', 'Логотип в материалах'],
                    highlighted: true
                  },
                  {
                    title: 'Партнер',
                    price: '1,000,000 ₸',
                    description: 'Максимальный пакет',
                    features: ['Все преимущества спонсора', 'Приоритетное размещение', 'Эксклюзивные права', 'Персональный менеджер']
                  }
                ].map((pkg, index) => (
                  <div 
                    key={index} 
                    className={`bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 ${
                      pkg.highlighted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-4">{pkg.title}</h3>
                    <div className="text-4xl font-bold mb-2">{pkg.price}</div>
                    <p className="text-sm mb-6 opacity-90">{pkg.description}</p>
                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">Контактная информация</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="font-semibold mb-2">Email:</div>
                    <div className="text-lg">conference@nrchd.kz</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Телефон:</div>
                    <div className="text-lg">+7 (717) 2 76 85 00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg mb-4">
                © 2025 Национальный научный центр развития здравоохранения имени Салидат Каирбековой
              </p>
              <p className="text-sm text-gray-400">
                Международная конференция по медицинскому туризму в Казахстане
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

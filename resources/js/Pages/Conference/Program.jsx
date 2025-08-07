import React, { useState } from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Страница с программой международной конференции по медицинскому туризму
 * Отображает расписание мероприятий по дням и городам проведения
 * 
 * @returns {React.ReactElement} Страница программы конференции
 */
export default function Program() {
  // Состояние для переключения между городами
  const [selectedCity, setSelectedCity] = useState('astana'); // 'astana' или 'almaty'

  // Данные о программе конференции для Астаны (в реальном проекте могут загружаться из API)
  // Программа для Алматы
  const almatyProgramData = [
    // День 1 - 16 октября 2025 (Алматы)
    {
      time: '09:00 - 10:00',
      title: 'Регистрация участников',
      type: 'registration',
      description: 'Регистрация и выдача материалов участникам',
      day: '16 октября'
    },
    {
      time: '10:00 - 11:30',
      title: 'Выездные сессии: "Современные медицинские технологии в клиниках Алматы"',
      type: 'section',
      room: 'Медицинский центр "HealthCity"',
      description: 'Посещение ведущих клиник Алматы, демонстрация современного оборудования',
      day: '16 октября'
    },
    {
      time: '12:00 - 13:30',
      title: 'Панельная дискуссия: "Санаторно-курортное лечение в Казахстане"',
      type: 'plenary',
      room: 'Отель Rixos Almaty',
      description: 'Обсуждение потенциала и перспектив развития санаторно-курортного лечения в Казахстане',
      day: '16 октября',
      speakers: [
        { 
          name: 'Др. Нурлан Азизов', 
          organization: 'Ассоциация курортологов Казахстана', 
          topic: 'Природные лечебные факторы Казахстана и их применение в медицинском туризме' 
        },
        { 
          name: 'Галия Жанарбаева', 
          organization: 'Санаторий "Алатау"', 
          topic: 'Опыт работы с иностранными пациентами: практические рекомендации' 
        }
      ]
    },
    {
      time: '14:30 - 16:00',
      title: 'Выездные сессии: "Реабилитационная медицина в Казахстане"',
      type: 'section',
      room: 'Реабилитационный центр "RehabMed"',
      description: 'Посещение реабилитационных центров Алматы, знакомство с методиками реабилитации',
      day: '16 октября'
    },
    {
      time: '17:00 - 19:00',
      title: 'Культурная программа и деловой ужин',
      type: 'cultural',
      description: 'Ознакомление с казахской культурой и кухней, неформальное общение',
      day: '16 октября'
    },
    
    // День 2 - 17 октября 2025 (Алматы)
    {
      time: '09:30 - 11:00',
      title: 'Выездная сессия: "Инновационные технологии в медицине"',
      type: 'section',
      room: 'Казахский Национальный Медицинский Университет',
      description: 'Посещение инновационных лабораторий и исследовательских центров',
      day: '17 октября'
    },
    {
      time: '11:30 - 13:00',
      title: 'Круглый стол: "Образовательный туризм в медицине"',
      type: 'roundtable',
      room: 'Казахский Национальный Медицинский Университет',
      description: 'Обсуждение перспектив привлечения иностранных студентов и специалистов для обучения в Казахстане',
      day: '17 октября',
      speakers: [
        { name: 'Модератор: Ректор КазНМУ' },
        { name: 'Представители ведущих медицинских вузов Казахстана' },
        { name: 'Международные эксперты в области медицинского образования' }
      ]
    },
    {
      time: '14:00 - 15:30',
      title: 'Заключительная панельная дискуссия: "Будущее медицинского туризма в Казахстане"',
      type: 'plenary',
      room: 'Отель Rixos Almaty',
      description: 'Подведение итогов конференции, принятие резолюции, выработка дальнейших шагов',
      day: '17 октября',
      speakers: [
        { name: 'Представители Министерства здравоохранения РК' },
        { name: 'Представители Министерства туризма и спорта РК' },
        { name: 'Директор ННЦРЗ им. Салидат Каирбековой' },
        { name: 'Представители международных организаций медицинского туризма' }
      ]
    },
    {
      time: '16:00 - 17:00',
      title: 'Закрытие конференции',
      type: 'closing',
      room: 'Отель Rixos Almaty',
      description: 'Официальное закрытие конференции, вручение сертификатов участникам',
      day: '17 октября'
    }
  ];
  
  const astanaProgramData = [
    // День 1 - 13 октября 2025 (Астана)
    {
      time: '08:30 - 09:30',
      title: 'Регистрация участников',
      type: 'registration',
      description: 'Приветственный кофе, регистрация и выдача материалов участникам конференции',
      day: '13 октября'
    },
    {
      time: '09:30 - 10:15',
      title: 'Торжественное открытие конференции',
      type: 'opening',
      description: 'Приветственное слово от организаторов и официальных лиц',
      day: '13 октября',
      speakers: [
        { name: 'Министр здравоохранения РК' },
        { name: 'Руководитель ННЦРЗ им. Салидат Каирбековой' },
        { name: 'Представитель Министерства туризма и спорта РК' }
      ]
    },
    {
      time: '10:15 - 11:45',
      title: 'Пленарная сессия: "Глобальные тренды медицинского туризма"',
      type: 'plenary',
      description: 'Обзор мирового рынка медицинского туризма, ключевые тенденции и перспективы',
      day: '13 октября',
      speakers: [
        { 
          name: 'Доктор Майкл Джонсон', 
          organization: 'Международная ассоциация медицинского туризма (IAMT)', 
          topic: 'Медицинский туризм 2025: прогнозы и тренды' 
        },
        { 
          name: 'Профессор Ли Чжан', 
          organization: 'Азиатский альянс здравоохранения', 
          topic: 'Развитие медицинского туризма в странах Азии: уроки для Казахстана' 
        }
      ]
    },
    {
      time: '11:45 - 12:45',
      title: 'Перерыв на обед',
      type: 'break',
      day: '13 октября'
    },
    {
      time: '12:45 - 14:15',
      title: 'Параллельная сессия 1: "Международные стандарты качества и аккредитация"',
      type: 'section',
      room: 'Зал Азия',
      description: 'Обсуждение международных стандартов качества для медицинских организаций, обслуживающих иностранных пациентов',
      day: '13 октября',
      speakers: [
        { 
          name: 'Др. Джеймс Уилсон', 
          organization: 'Joint Commission International (JCI)', 
          topic: 'Стандарты JCI для медицинского туризма' 
        },
        { 
          name: 'Профессор Айгуль Жансеитова', 
          organization: 'Университет медицины Астаны', 
          topic: 'Путь казахстанских клиник к международной аккредитации' 
        }
      ]
    },
    {
      time: '12:45 - 14:15',
      title: 'Параллельная сессия 2: "Маркетинг и продвижение медицинского туризма"',
      type: 'section',
      room: 'Зал Европа',
      description: 'Стратегии продвижения услуг медицинских учреждений на международном рынке',
      day: '13 октября',
      speakers: [
        { 
          name: 'Сара Маркетинг', 
          organization: 'Международное агентство медицинского туризма', 
          topic: 'Цифровой маркетинг в медицинском туризме' 
        },
        { 
          name: 'Дамир Казыбаев', 
          organization: 'Национальная медицинская палата Казахстана', 
          topic: 'Брендинг Казахстана как направления медицинского туризма' 
        }
      ]
    },
    {
      time: '14:15 - 14:45',
      title: 'Кофе-брейк',
      type: 'break',
      day: '13 октября'
    },
    {
      time: '14:45 - 16:15',
      title: 'Круглый стол: "Государственная политика в сфере медицинского туризма"',
      type: 'roundtable',
      description: 'Обсуждение законодательных инициатив и государственных программ по развитию медицинского туризма',
      day: '13 октября',
      speakers: [
        { name: 'Модератор: Директор ННЦРЗ им. Салидат Каирбековой' },
        { name: 'Представители Министерства здравоохранения РК' },
        { name: 'Представители Министерства туризма и спорта РК' },
        { name: 'Представители медицинских организаций и частных клиник' }
      ]
    },
    {
      time: '16:15 - 17:30',
      title: 'Нетворкинг-сессия и приветственный коктейль',
      type: 'networking',
      description: 'Знакомство и неформальное общение с коллегами и потенциальными партнерами',
      day: '13 октября'
    },
    
    // День 2 - 14 октября 2025 (Астана)
    {
      time: '09:00 - 10:30',
      title: 'Пленарная сессия: "Инвестиционные возможности в секторе медицинского туризма"',
      type: 'plenary',
      description: 'Презентации инвестиционных проектов и возможностей для развития медицинского туризма',
      day: '14 октября',
      speakers: [
        { 
          name: 'Александр Инвесторов', 
          organization: 'KazHealth Investment Fund', 
          topic: 'Механизмы финансирования проектов в сфере медицинского туризма' 
        },
        { 
          name: 'Др. Роберт Ли', 
          organization: 'Global Medical Tourism Investments', 
          topic: 'Международный опыт частно-государственного партнерства в медицинском туризме' 
        }
      ]
    }
  ];

  /**
   * Определяет, какие данные программы использовать в зависимости от выбранного города
   */
  const currentProgramData = selectedCity === 'astana' ? astanaProgramData : almatyProgramData;
  
  /**
   * Рендерит элемент программы с соответствующим оформлением в зависимости от типа
   * @param {Object} item - элемент программы
   * @param {number} index - индекс элемента
   * @returns {React.ReactElement}
   */
  const renderProgramItem = (item, index) => {
    // Определяем стили для разных типов мероприятий
    let bgColor, borderColor, textClass;
    
    switch (item.type) {
      case 'registration':
      case 'break':
        bgColor = 'bg-gray-50';
        borderColor = 'border-gray-200';
        textClass = 'text-gray-700';
        break;
      case 'opening':
      case 'closing':
        bgColor = 'bg-blue-50';
        borderColor = 'border-blue-200';
        textClass = 'text-blue-800';
        break;
      case 'plenary':
        bgColor = 'bg-blue-100';
        borderColor = 'border-blue-300';
        textClass = 'text-blue-900';
        break;
      case 'section':
        bgColor = 'bg-white';
        borderColor = 'border-blue-200';
        textClass = 'text-gray-900';
        break;
      case 'roundtable':
        bgColor = 'bg-green-50';
        borderColor = 'border-green-200';
        textClass = 'text-green-900';
        break;
      default:
        bgColor = 'bg-white';
        borderColor = 'border-gray-200';
        textClass = 'text-gray-900';
    }

    return (
      <div key={index} className={`mb-4 rounded-lg border ${borderColor} ${bgColor} overflow-hidden`}>
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-1/5 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="font-bold text-blue-700">{item.time}</div>
            {item.room && <div className="text-sm mt-1 text-gray-600">Место: {item.room}</div>}
          </div>
          <div className="p-4 md:w-4/5">
            <h3 className={`text-lg font-semibold ${textClass}`}>{item.title}</h3>
            {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
            
            {item.speakers && item.speakers.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-gray-700">Спикеры:</h4>
                <ul className="mt-1 space-y-1">
                  {item.speakers.map((speaker, i) => (
                    <li key={i} className="text-gray-600">
                      <span className="font-medium">{speaker.name}</span>
                      {speaker.organization && <span>, {speaker.organization}</span>}
                      {speaker.topic && <div className="text-sm italic">{speaker.topic}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ConferenceLayout title="Программа">
      <Head>
        <title>Программа - Международная конференция по медицинскому туризму</title>
        <meta name="description" content="Подробная программа международной конференции по медицинскому туризму в Астане и Алматы, 13-17 октября 2025" />
      </Head>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Программа международной конференции по медицинскому туризму</h2>
              
              {/* Переключение между городами */}
              <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={() => setSelectedCity('astana')} 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedCity === 'astana' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Астана (13-15 октября)
                </button>
                <button 
                  onClick={() => setSelectedCity('almaty')} 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedCity === 'almaty' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Алматы (16-17 октября)
                </button>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">
                {selectedCity === 'astana' ? 
                  'Мероприятия в Астане пройдут в Президентском центре Республики Казахстан' : 
                  'Мероприятия в Алматы пройдут в ведущих медицинских учреждениях города'}
              </p>
              
              <div className="flex justify-center mb-8">
                <Link
                  href={`/storage/documents/Conference/${selectedCity === 'astana' ? 'program_astana' : 'program_almaty'}_ru.pdf`}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Скачать программу {selectedCity === 'astana' ? 'Астана' : 'Алматы'} (PDF)
                </Link>
              </div>
              
              {/* Список мероприятий */}
              <div className="space-y-4">
                {currentProgramData.map((item, index) => renderProgramItem(item, index))}
              </div>
              
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">Примечания:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>В программе возможны изменения. Актуальная информация будет доступна на сайте и в материалах конференции.</li>
                  <li>Для посещения выездных сессий в Алматы необходима предварительная регистрация.</li>
                  <li>Участникам конференции предоставляется трансфер между Астаной и Алматы.</li>
                  <li>Рабочие языки конференции: казахский, русский и английский. Будет обеспечен синхронный перевод.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}

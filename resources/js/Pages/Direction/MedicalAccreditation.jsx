import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};


// Компонент формы обратной связи
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Здесь будет логика отправки формы
    console.log('Form data:', formData);
    
    // Имитация отправки
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        message: ''
      });
      alert('Форма отправлена успешно!');
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Оставить заявку</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            ФИО *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Организация
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Сообщение
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition duration-300 w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-800">
          <span className="font-medium">Для получения коммерческого предложения нажмите на </span>
          <a href="/storage/documents/Услуги/Аккредитация/шаблон_заявки.docx" className="text-yellow-600 hover:text-yellow-800 font-bold" download>
            скачать шаблон заявки
          </a>
        </p>
      </div>
    </div>
  );
};

export default function MedicalAccreditation() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

  // Состояние для отслеживания, показывать ли описания
  const [showDescriptions, setShowDescriptions] = useState(false);
  
  // Данные о шагах процесса аккредитации
  const evaluationSteps = [
    {
      id: 1,
      title: "Бесплатная консультация по аккредитации",
      description: "Бесплатная телефонная консультация по вопросам аккредитации по номеру телефона 8 (7172) 648-951 (вн. 1000,1143,1127, 1046, 1064, 1014)" 
    },
    {
      id: 2,
      title: "Заявление на прохождение внешней комплексной оценки",
      description: "Инициирование процесса прохождения внешней комплексной оценки."
    },
    {
      id: 3,
      title: "Расчёт стоимости услуг",
      description: "Расчет стоимости производится индивидуально в зависимости от типа и размера организации."
    },
    {
      id: 4,
      title: "Заключение договора и оплата услуг",
      description: "Рассмотрение результатов внешней комплексной оценки комиссией по аккредитации. Принятие решения о выдаче свидетельства об аккредитации."
    },
    {
      id: 5,
      title: "Прохождение внешней комплексной оценки",
      description: "Прохождение внешней комплексной оценки. Эксперты проводят оценку на соответствие стандартам аккредитации непосредственно в медицинской организации."
    },
    {
        id: 6,
        title: "Свидетельство об аккредитации/мотивированный отказ",
        description: "Выдача свидетельства об аккредитации или мотивированный отказ. Свидетельство действительно в течение 3 лет."
      }
  ];
  
  // Обработчики событий для всплывающих подсказок
  const handleMouseEnter = () => {
    setShowDescriptions(true);
  };
  
  const handleMouseLeave = () => {
    setShowDescriptions(false);
  };

  return (
    <>
    <Head title="NNCRZ" meta={[{ name: 'description', content: 'Аккредитация медицинских организаций и образовательных программ в сфере здравоохранения.' }]} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <p className="tracking-wide leading-relaxed">
               Эффективность, доступность, качество и безопасность — важнейшие аспекты оказания медицинской помощи в Республике Казахстан. 
Основным оцениваемым показателем системы здравоохранения со стороны населения на сегодняшний день является качество медицинской помощи. 
Ключевым процессом оценки качества и безопасности оказываемых услуг выступает аккредитация медицинских организаций, подразумевающая под собой определение уровня соответствия установленным нормам и требованиям.
Аккредитация (внешняя комплексная оценка) медицинских организаций является добровольной процедурой, проводится вне зависимости от формы собственности и профиля медицинской организации и включает: 
                    </p>
                    <ul className='list-disc list-inside px-12 my-4'>
                        <li>Добровольное участие заявителя.</li>
                        <li>Самооценку на основе стандартов аккредитации и собственных нормативов.</li>
                        <li>Внешнюю оценку качества по установленным стандартам.</li>
                    </ul>
            </div>
        </div>
    </section>

    {/* Блок этапов аккредитации */}
    <section className="text-gray-700 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-12">Этапы подачи заявки</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-white p-6 rounded-lg shadow-md relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-3">
                      {step.id}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  
                  {showDescriptions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 z-10">
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
    </section>

    {/* Блок с направлениями */}
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Активные стандарты" 
                    description="Действующие стандарты аккредитации"
                    href={route('medical-accreditation.active-standards')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Архив стандартов" 
                    description="Архивные стандарты аккредитации"
                    href={route('medical-accreditation.standards-archive')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Руководства" 
                    description="Руководства по аккредитации"
                    href={route('medical-accreditation.guides')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Эксперты" 
                    description="Эксперты по аккредитации"
                    href={route('medical-accreditation.experts')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Комиссия" 
                    description="Комиссия по аккредитации"
                    href={route('medical-accreditation.commission')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Учебные материалы" 
                    description="Учебные материалы по аккредитации"
                    href={route('medical-accreditation.training-materials')}
                />
            </div>
        </div>
    </section>

    {/* Блок с формой обратной связи */}
    <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
            <div className="max-w-2xl mx-auto">
                <ContactForm />
            </div>
        </div>
    </section>
    </>
  );
}

MedicalAccreditation.layout = (page) => <LayoutDirection img="medicalaccreditation" h1={t('directions.medical_accreditation', 'Медицинская аккредитация')}>{page}</LayoutDirection>;

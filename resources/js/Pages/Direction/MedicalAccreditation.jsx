import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import News from '@/Components/News';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';

// Компонент формы аккредитации для связи с отделом
const AccreditationForm = () => {
  const [files, setFiles] = useState([]);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    alert('Форма отправлена');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">Свяжитесь с нами</h2>
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-2">
          <label htmlFor="orgName" className="block text-gray-700 text-xs font-medium mb-1">
            Полное наименование организации
          </label>
          <input 
            type="text" 
            id="orgName" 
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-xs font-medium mb-1">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-xs font-medium mb-1">
              Телефон
            </label>
            <input 
              type="tel" 
              id="phone" 
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
        </div>
        
        <div className="mb-2">
          <label htmlFor="message" className="block text-gray-700 text-xs font-medium mb-1">
            Сообщение
          </label>
          <textarea 
            id="message" 
            rows="2"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>
        
        <div className="flex items-center mb-2">
          <input 
            type="checkbox" 
            id="consent" 
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="consent" className="ml-2 block text-xs text-gray-700">
            Я согласен на обработку персональных данных
          </label>
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition duration-300 w-auto"
          >
            Отправить
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
    <Head title="NNCRZ" />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <p className="tracking-wide leading-relaxed">
                Эффективность, доступность, качество и безопасность — важнейшие аспекты оказания медицинской помощи в Республике Казахстан. 
Основным оцениваемым показателем системы здравоохранения со стороны населения на сегодняшний день является качество медицинской помощи. 
Ключевым процессом оценки качества и безопасности оказываемых услуг выступает аккредитация медицинских организаций, подразумевающая под собой определение уровня соответствия установленным нормам и требованиям.
Аккредитация (внешняя комплексная оценка) медицинских организаций является добровольной процедурой и проводится вне зависимости от формы собственности и профиля медицинской организации.
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
            
            {/* Карточки этапов */}
            <div 
                className="flex flex-wrap md:flex-nowrap justify-between mb-12"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {evaluationSteps.map((step, index) => (
                    <div 
                        key={step.id} 
                        className="w-full md:w-1/5 px-2 mb-6 md:mb-0"
                    >
                        <div 
                            className={`bg-white rounded-lg shadow-md overflow-hidden h-full ${showDescriptions ? 'shadow-lg' : ''}`}
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            {/* Верхняя часть карточки с номером */}
                            <div className="bg-yellow-200 p-4 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold">
                                    {step.id}
                                </div>
                            </div>
                            
                            {/* Содержимое карточки */}
                            <div className="p-4">
                                <h3 className="font-semibold text-center mb-2">{step.title}</h3>
                                
                                {/* Описание (появляется на всех карточках при наведении на любую) */}
                                <div 
                                    className="text-sm text-gray-600 overflow-hidden transition-all duration-300"
                                    style={{ 
                                        maxHeight: showDescriptions ? '200px' : '0',
                                        opacity: showDescriptions ? 1 : 0,
                                        marginTop: showDescriptions ? '8px' : '0'
                                    }}
                                >
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Стрелка для мобильных устройств */}
                        {index < evaluationSteps.length - 1 && (
                            <div className="flex justify-center md:hidden mt-2 mb-4">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Дополнительная информация */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Контактная информация</h3>
                <p className="text-gray-700">Для бесплатной консультации по аккредитации:</p>
                <p className="font-medium text-gray-800 mt-1">8 (7172) 648-951</p>
                <p className="text-gray-600 text-sm mt-1">Внутренние номера: 1000, 1143, 1127, 1046, 1064, 1014</p>
                <a href='https://wa.me/77472996410' className='text-blue-600 hover:underline flex items-center gap-1'>
                    <i className='fab fa-whatsapp text-green-500'></i> +7 747 299 6410
                </a>
                <a href='https://wa.me/77019825870' className='text-blue-600 hover:underline flex items-center gap-1'>
                    <i className='fab fa-whatsapp text-green-500'></i> +7 701 982 5870
                </a>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Наши специалисты готовы ответить на все ваши вопросы по процессу аккредитации и помочь с подготовкой необходимых документов.</p>
                </div>
            </div>
        </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
            <div className='flex md:flex-row flex-wrap'>
                <FolderChlank h1="Руководства" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.guides')} />
                <FolderChlank h1="Эксперты внешней оценки" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.experts')} />
                <FolderChlank h1="Обучающие материалы" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.training')} />
                <FolderChlank h1="Действующие стандарты и критерии аккредитации" color="bg-yellow-200"
                    colorsec="bg-yellow-300" href={route('accreditation.standards')} />
                <FolderChlank h1="Архив стандартов" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.archive')} />
                <FolderChlank h1="Акредитационная комиссия" color="bg-yellow-200"
                    colorsec="bg-yellow-300" href={route('accreditation.commission')} />
            </div>
        </div>
    </section>
    <News />
    
    {/* Секция с актуальным документом и формой запроса, разделенная 2/3 и 1/3 */}
    <section className="text-gray-600 body-font pb-12">
        <div className="container px-5 mx-auto">
            <div className="flex flex-wrap -mx-4">
                {/* Актуальный документ - 2/3 ширины */}
                <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
                    <div className="bg-yellow-100 p-6 rounded-lg shadow-md h-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Проверьте себя в списке аккредитованных медицинских организаций</h2>
                        <ActualFile 
                            folder="Accreditation/Reports" 
                            title="" 
                            bgColor="transparent"
                            autoOpen={true}
                            hideDownload={false}
                        />
                    </div>
                </div>
                
                {/* Форма запроса на аккредитацию - 1/3 ширины */}
                <div className="w-full lg:w-1/3 px-4">
                    <div className="h-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Запрос на аккредитацию</h2>
                        <AccreditationForm />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>

    </>
    
  )
}

MedicalAccreditation.layout = page => <LayoutDirection img="medicalaccreditation" h1="Аккредитация медицинских организаций">{page}</LayoutDirection>

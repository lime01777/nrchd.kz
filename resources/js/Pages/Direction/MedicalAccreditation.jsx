import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import News from '@/Components/News';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';

export default function MedicalAccreditation() {
  // Состояние для отслеживания, показывать ли описания
  const [showDescriptions, setShowDescriptions] = useState(false);
  
  // Данные о шагах процесса аккредитации
  const evaluationSteps = [
    {
      id: 1,
      title: "Заявка на оценку",
      description: "Подача заявления на прохождение внешней комплексной оценки. Заявка рассматривается в течение 5 рабочих дней."
    },
    {
      id: 2,
      title: "Договор утвержден",
      description: "Заключение договора и оплата услуг. Расчет стоимости производится индивидуально в зависимости от типа и размера организации."
    },
    {
      id: 3,
      title: "Исследование места",
      description: "Прохождение внешней комплексной оценки. Эксперты проводят оценку на соответствие стандартам аккредитации непосредственно в медицинской организации."
    },
    {
      id: 4,
      title: "Комиссия по аккредитации",
      description: "Рассмотрение результатов внешней комплексной оценки комиссией по аккредитации. Принятие решения о выдаче свидетельства об аккредитации."
    },
    {
      id: 5,
      title: "Объявление результатов",
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
                    Эффективность, доступность и безопасность — важнейшие аспекты развития здравоохранения в Республике
                    Казахстан. Для обеспечения этих стандартов в ННЦРЗ работает Департамент аккредитации. Аккредитация
                    медицинских организаций — ключевой инструмент для повышения качества медицинских услуг. Процесс
                    включает:
                    <ul className='list-disc list-inside px-12 my-4'>
                        <li>Добровольное участие заявителя.</li>
                        <li>Самооценку на основе стандартов аккредитации и собственных нормативов.</li>
                        <li>Внешнюю оценку качества по установленным стандартам.</li>
                    </ul>
                </p>
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
                            <div className="bg-gray-800 p-4 flex items-center justify-center">
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
                <p className="font-medium text-gray-800 mt-1">8 (7172) 570-951</p>
                <p className="text-gray-600 text-sm mt-1">Внутренние номера: 1000, 1143, 1127</p>
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
            </div>
        </div>
    </section>
    <News />
    <ActualFile 
        title="Проверьте себя в списке аккредитованных медицинских организаций" 
        folder="Accreditation/Reports" 
        bgColor="bg-yellow-100" 
    />
    </>
  )
}

MedicalAccreditation.layout = page => <LayoutDirection img="humanresources" h1="Аккредитация медицинских организаций">{page}</LayoutDirection>

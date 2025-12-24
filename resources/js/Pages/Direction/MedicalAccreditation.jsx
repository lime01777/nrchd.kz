import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
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
      alert('Заявка отправлена успешно!');
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('directionsPages.medicalAccreditation.contactForm.title')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('directionsPages.medicalAccreditation.contactForm.name')} *
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
            {t('directionsPages.medicalAccreditation.contactForm.email')} *
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
            {t('directionsPages.medicalAccreditation.contactForm.phone')}
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
            {t('directionsPages.medicalAccreditation.contactForm.organization')}
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
            {t('directionsPages.medicalAccreditation.contactForm.message')}
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
            {isSubmitting ? t('directionsPages.medicalAccreditation.contactForm.submitting') : t('directionsPages.medicalAccreditation.contactForm.submit')}
          </button>
        </div>
      </form>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-800">
          <span className="font-medium">{t('directionsPages.medicalAccreditation.contactForm.downloadInfo')} </span>
          <a href="/storage/documents/Услуги/Аккредитация/Заявка_образец.docx" className="text-yellow-600 hover:text-yellow-800 font-bold" download>
            {t('directionsPages.medicalAccreditation.contactForm.downloadLink')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default function MedicalAccreditation() {
    const { translations } = usePage().props;

  // Состояние для отображения, показывает какая карточка в hover состоянии (по id)
  const [hoveredStepId, setHoveredStepId] = useState(null);
  
  // Данные о этапах процесса аккредитации
  const evaluationSteps = [
    {
      id: 1,
      title: t('directionsPages.medicalAccreditation.step1Title'),
      description: t('directionsPages.medicalAccreditation.step1Description')
    },
    {
      id: 2,
      title: t('directionsPages.medicalAccreditation.step2Title'),
      description: t('directionsPages.medicalAccreditation.step2Description')
    },
    {
      id: 3,
      title: t('directionsPages.medicalAccreditation.step3Title'),
      description: t('directionsPages.medicalAccreditation.step3Description')
    },
    {
      id: 4,
      title: t('directionsPages.medicalAccreditation.step4Title'),
      description: t('directionsPages.medicalAccreditation.step4Description')
    },
    {
      id: 5,
      title: t('directionsPages.medicalAccreditation.step5Title'),
      description: t('directionsPages.medicalAccreditation.step5Description')
    },
    {
      id: 6,
      title: t('directionsPages.medicalAccreditation.step6Title'),
      description: t('directionsPages.medicalAccreditation.step6Description')
    }
  ];
  
  // Обработчики событий для подсказываний описаний
  const handleMouseEnter = (stepId) => {
    setHoveredStepId(stepId);
  };
  
  const handleMouseLeave = () => {
    setHoveredStepId(null);
  };

  return (
    <>
    <Head title={t('directionsPages.medicalAccreditation.title', 'Аккредитация')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <p className="tracking-wide leading-relaxed">
                    {t('directionsPages.medicalAccreditation.intro')}
                </p>
                <ul className='list-disc list-inside px-12 my-4'>
                    <li>{t('directionsPages.medicalAccreditation.benefitsItem1')}</li>
                    <li>{t('directionsPages.medicalAccreditation.benefitsItem2')}</li>
                    <li>{t('directionsPages.medicalAccreditation.benefitsItem3')}</li>
                </ul>
            </div>
        </div>
    </section>

    {/* Блок этапами аккредитации */}
    <section className="text-gray-700 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-12">{t('directionsPages.medicalAccreditation.stepsTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-white p-6 rounded-lg shadow-md relative"
                  onMouseEnter={() => handleMouseEnter(step.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-3">
                      {step.id}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  
                  {hoveredStepId === step.id && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 z-10">
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
    </section>

    {/* Блок с управлениями */}
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.activeStandards.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.activeStandards.description')}
                    href={route('accreditation.standards')}
                />
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.archive.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.archive.description')}
                    href={route('accreditation.archive')}
                />
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.guides.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.guides.description')}
                    href={route('accreditation.guides')}
                />
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.experts.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.experts.description')}
                    href={route('accreditation.experts')}
                />
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.commission.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.commission.description')}
                    href={route('accreditation.commission')}
                />
                <FolderChlank 
                    color="bg-yellow-200"
                    colorsec="bg-yellow-300"
                    title={t('directionsPages.medicalAccreditation.subfolders.training.title')} 
                    description={t('directionsPages.medicalAccreditation.subfolders.training.description')}
                    href={route('accreditation.training')}
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

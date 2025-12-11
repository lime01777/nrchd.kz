import React, { useState, useEffect } from 'react';
import ServicesChlank from './ServicesChlank';
import translationService from '@/services/TranslationService';

function Services() {
  const [currentLang, setCurrentLang] = useState(translationService.getLanguage());
  const [ showMore, setShowMore ] = useState(false);
  
  // Функция для получения перевода (зависит от currentLang)
  const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };
  
  // Обновляем язык при изменении
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(translationService.getLanguage());
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  // Массив зависит от currentLang, чтобы обновляться при смене языка
  const allServices = [
    { title: t('services.accreditation'), bgcolor: "bg-yellow-200", url: "services.accreditation" },
    { title: t('services.adsEvaluation'), bgcolor: "bg-rose-100", url: "services.adsEvaluation" },
    { title: t('services.healthTechAssessment'), bgcolor: "bg-violet-100", url: "services.healthTechAssessment" },
    { title: t('services.drugExpertise'), bgcolor: "bg-yellow-100", url: "services.drugExpertise" },
    { title: t('services.educationPrograms'), bgcolor: "bg-blue-100", url: "services.educationPrograms" },
    { title: t('services.medicalExpertise'), bgcolor: "bg-green-100", url: "services.medicalExpertise" },
    { title: t('services.training'), bgcolor: "bg-teal-100", url: "services.training" },
    { title: t('services.postAccreditationMonitoring'), bgcolor: "bg-amber-100", url: "services.postAccreditationMonitoring" },
  ];

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className="flex flex-row w-full justify-between mb-10">
                <div className='flex'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('servicesComponent.title')}</h1>
                </div>
            </div>
            <div className="flex flex-wrap -m-4">
                {allServices.slice(0, 3).map((service, index) => (
                  <ServicesChlank key={index} title={service.title} bgcolor={service.bgcolor} url={service.url} />
                ))}
            </div>
            
            {/* Скрытые услуги */}
            <div className={`flex flex-wrap -mx-4 mt-4 transition-all duration-500 delay-75 ease-in-out overflow-hidden ${ showMore
                ? "md:max-h-[1000px] max-h-[1500px]" : "max-h-0" }`}>
                {allServices.slice(3).map((service, index) => (
                  <ServicesChlank key={index} title={service.title} bgcolor={service.bgcolor} url={service.url} />
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <button onClick={()=> setShowMore(!showMore)}
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                    rounded-xl px-4 py-3 sm:px-6 sm:py-3 text-sm sm:text-base transition-all duration-150 ease-in min-h-[44px] min-w-[120px] justify-center"
                    >
                    {showMore ? t('servicesComponent.hide') : t('servicesComponent.showAll')}
                </button>
            </div>
        </div>
    </section>
  )
}

export default Services
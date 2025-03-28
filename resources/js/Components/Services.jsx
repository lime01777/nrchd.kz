import React, { useState } from 'react';
import ServicesChlank from './ServicesChlank';

function Services() {
  const allServices = [
    { title: "Аккредитация медицинских организаций и организаций здравоохранения", bgcolor: "bg-yellow-200", url: "services.accreditation" },
    { title: "Оценка рекламных материалов", bgcolor: "bg-rose-100", url: "services.adsEvaluation" },
    { title: "Оценка технологий здравоохранения", bgcolor: "bg-violet-100", url: "services.healthTechAssessment" },
    { title: "Экспертиза лекарственных средств", bgcolor: "bg-yellow-100", url: "services.drugExpertise" },
    { title: "Экспертиза научно-образовательных программ дополнительного образования", bgcolor: "bg-blue-100", url: "services.educationPrograms" },
    { title: "Научно-медицинская экспертиза", bgcolor: "bg-green-100", url: "services.medicalExpertise" },
    { title: "Организация и проведение обучающих циклов по дополнительному и неформальному образованию ЦМОП", bgcolor: "bg-teal-100", url: "services.training" },
    { title: "Постаккредитационный мониторинг", bgcolor: "bg-amber-100", url: "services.postAccreditationMonitoring" },
  ];

  const [ showMore, setShowMore ] = useState(false);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className="flex flex-row w-full justify-between mb-10">
                <div className='flex'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">Услуги</h1>
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
                    rounded-xl p-3 transition-all duration-150 ease-in"
                    >
                    {showMore ? "Скрыть услуги" : "Все услуги"}
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    </section>
  )
}

export default Services
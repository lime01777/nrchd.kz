import React, { useState, useEffect } from 'react';
import DirectionsChlank from './DirectionsChlank';
import { router } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

const Directions = () => {
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
    const allDirections = [
        { imgname: 1, title: t('directions.medical_education'), bgcolor: "bg-green-100", bgborder: "border-green-200", url: "medical.education", hasRoute: true, path: "/medical-education"},
        { imgname: 2, title: t('directions.human_resources'), bgcolor: "bg-rose-100", bgborder: "border-rose-200", url: "human.resources", hasRoute: true, path: "/human-resources"},
        { imgname: 3, title: t('directions.electronic_health'), bgcolor: "bg-fuchsia-100", bgborder: "border-fuchsia-200", url: "electronic.health", hasRoute: true, path: "/electronic-health"},
        { imgname: 4, title: t('directions.medical_accreditation'), bgcolor: "bg-yellow-100", bgborder: "border-yellow-200", url: "medical.accreditation", hasRoute: true, path: "/medical-accreditation"},
        { imgname: 5, title: t('directions.health_rate'), bgcolor: "bg-violet-100", bgborder: "border-violet-200", url: "services.healthTechAssessment", hasRoute: true, path: "/health-tech-assessment"},
        { imgname: 6, title: t('directions.clinical_protocols'), bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "clinical.protocols", hasRoute: true, path: "/clinical-protocols"},
        { imgname: 7, title: t('directions.strategic_initiatives'), bgcolor: "bg-green-100", bgborder: "border-green-200", url: "strategic.initiatives", hasRoute: true, path: "/strategic-initiatives"},
        { imgname: 8, title: t('directions.medical_rating'), bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "medical.rating", hasRoute: true, path: "/medical-rating"},
        { imgname: 9, title: t('directions.medical_science'), bgcolor: "bg-gray-100", bgborder: "border-gray-200", url: "medical.science", hasRoute: true, path: "/medical-science"},
        { imgname: 8, title: t('directions.bioethics'), bgcolor: "bg-indigo-100", bgborder: "border-indigo-200", url: "bioethics", hasRoute: true, path: "/bioethics"},
        { imgname: 10, title: t('directions.drug_policy'), bgcolor: "bg-yellow-100", bgborder: "border-yellow-200", url: "drug.policy", hasRoute: true, path: "/drug-policy"},
        { imgname: 12, title: t('directions.primary_healthcare'), bgcolor: "bg-green-100", bgborder: "border-green-200", url: "primary.healthcare", hasRoute: true, path: "/primary-healthcare"},
        { imgname: 13, title: t('directions.health_accounts'), bgcolor: "bg-purple-200", bgborder: "border-purple-200", url: "health.accounts", hasRoute: true, path: "/health-accounts"},
        { imgname: 6, title: t('directions.medical_statistics'), bgcolor: "bg-teal-100", bgborder: "border-teal-200", url: "medical.statistics", hasRoute: true, path: "/medical-statistics"},
        { imgname: 3, title: t('directions.direction_tech_competence'), bgcolor: "bg-orange-100", bgborder: "border-orange-200", url: "direction.tech.competence", hasRoute: true, path: "/direction/tech-competence"},
        { imgname: 16, title: t('directions.center_prevention'), bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "center.prevention", hasRoute: true, path: "/center-prevention"},
        { imgname: 4, title: t('directions.quality_commission'), bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "quality.commission", hasRoute: true, path: "/quality-commission"},
        { imgname: 7, title: t('directions.medical_tourism'), bgcolor: "bg-green-100", bgborder: "border-green-200", url: "medical.tourism", hasRoute: true, path: "/medical-tourism"}
    ];

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('directionsComponent.title')}</h1>
                </div>
            </div>
            <div className="flex flex-wrap -m-4">
                {allDirections.slice(0, 6).map((direction, index) =>(
                <DirectionsChlank key={index} imgname={direction.imgname} title={direction.title}
                    bgcolor={direction.bgcolor} bgborder={direction.bgborder} url={direction.url} hasRoute={direction.hasRoute} path={direction.path} />
                ))}
            </div>
            {/* Скрытые направления */}
            <div className={`flex flex-wrap -mx-4 mt-4 transition-all duration-500 delay-75 ease-in-out overflow-hidden ${ showMore
                ? "md:max-h-[1000px] max-h-[1500px]" : "max-h-0" }`}>
                {allDirections.slice(6).map((direction, index) => (
                <DirectionsChlank key={index} imgname={direction.imgname} title={direction.title}
                    bgcolor={direction.bgcolor} bgborder={direction.bgborder} url={direction.url} hasRoute={direction.hasRoute} path={direction.path} />
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <button onClick={()=> setShowMore(!showMore)}
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                    rounded-xl p-3 transition-all duration-150 ease-in"
                    >
                    {showMore ? t('directionsComponent.hide') : t('directionsComponent.showAll')}
                </button>
            </div>
        </div>
    </section>
  );
}

export default Directions
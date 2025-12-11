import { Link, usePage } from '@inertiajs/react';
import React, {useState, useEffect} from 'react';
import DirectionsSubLinks from './DirectionsSubLinks';
import LanguageSwitcher from './LanguageSwitcher';
import ImprovedLanguageSwitcher from './ImprovedLanguageSwitcher';
// Импортируем новый сервис переводов
import translationService from '@/services/TranslationService';

export default function Header({ isBranchPage = false }) {
    const { auth } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [accessibilityMode, setAccessibilityMode] = useState(false);
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    const branchesSubLinks = [
        { title: t('branches.astana'), url: "branches.astana" },
        { title: t('branches.almaty'), url: "branches.almaty" },
        { title: t('branches.abay'), url: "branches.abay" },
        { title: t('branches.akmola'), url: "branches.akmola" },
        { title: t('branches.aktobe'), url: "branches.aktobe" },
        { title: t('branches.almatyregion'), url: "branches.almatyregion" },
        { title: t('branches.atyrau'), url: "branches.atyrau" },
        { title: t('branches.east'), url: "branches.east" },
        { title: t('branches.zhambyl'), url: "branches.zhambyl" },
        { title: t('branches.zhetisu'), url: "branches.zhetisu" },
        { title: t('branches.west'), url: "branches.west" },
        { title: t('branches.karaganda'), url: "branches.karaganda" },
        { title: t('branches.kostanay'), url: "branches.kostanay" },
        { title: t('branches.kyzylorda'), url: "branches.kyzylorda" },
        { title: t('branches.mangistau'), url: "branches.mangistau" },
        { title: t('branches.pavlodar'), url: "branches.pavlodar" },
        { title: t('branches.north'), url: "branches.north" },
        { title: t('branches.turkestan'), url: "branches.turkestan" },
        { title: t('branches.ulytau'), url: "branches.ulytau" },
        { title: t('branches.shymkent'), url: "branches.shymkent" }
    ];

    const allDirectionsSubLinks = [
        { title: t('directions.medical_education'), url: "medical.education"},
        { title: t('directions.human_resources'), url: "human.resources"},
        { title: t('directions.electronic_health'), url: "electronic.health"},
        { title: t('directions.medical_accreditation'), url: "medical.accreditation"},
        { title: t('directions.health_rate'), url: "health.rate"},
        { title: t('directions.clinical_protocols'), url: "clinical.protocols"},
        { title: t('directions.strategic_initiatives'), url: "strategic.initiatives"},
        { title: t('directions.medical_rating'), url: "medical.rating"},
        { title: t('directions.medical_science'), url: "medical.science"},
        { title: t('directions.bioethics'), url: "bioethics" },
        { title: t('directions.drug_policy'), url: "drug.policy"},
        { title: t('directions.primary_healthcare'), url: "primary.healthcare"},
        { title: t('directions.health_accounts'), url: "health.accounts"},
        { title: t('directions.medical_statistics'), url: "medical.statistics"},
        { title: t('directions.direction_tech_competence'), url: "direction.tech.competence" },
        { title: t('directions.center_prevention'), url: "center.prevention" },
        { title: t('directions.medical_tourism'), url: "medical.tourism" },
        { title: t('directions.quality_commission'), url: "quality.commission" },
    ];

    const allAboutCentreSubLinks = [
        { title: t('aboutCenter.about'), url: "about.centre"},
        { title: t('aboutCenter.leader'), url: "salidat.kairbekova"},
        { title: t('aboutCenter.vacancies'), url: "vacancy.jobs"},
        { title: t('aboutCenter.faq'), url: "about.faq"},
        { title: t('aboutCenter.contacts'), url: "about.contacts"},
        { title: t('aboutCenter.partners'), url: "about.partners"},
    ];

    const allServicesSubLinks = [
        { title: t('services.training'), url: "services.training" },
        { title: t('services.adsEvaluation'), url: "services.adsEvaluation" },
        { title: t('services.healthTechAssessment'), url: "services.healthTechAssessment" },
        { title: t('services.drugExpertise'), url: "services.drugExpertise" },
        { title: t('services.educationPrograms'), url: "services.educationPrograms" },
        { title: t('services.medicalExpertise'), url: "services.medicalExpertise" },
        { title: t('services.accreditation'), url: "services.accreditation" },
        { title: t('services.postAccreditationMonitoring'), url: "services.postAccreditationMonitoring" },
    ];


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        
        // Check if accessibility mode was previously enabled
        const savedAccessibilityMode = localStorage.getItem('accessibilityMode');
        if (savedAccessibilityMode === 'true') {
            setAccessibilityMode(true);
            document.body.classList.add('accessibility-mode');
        }
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    
    // Toggle accessibility mode
    const toggleAccessibilityMode = () => {
        const newMode = !accessibilityMode;
        setAccessibilityMode(newMode);
        
        if (newMode) {
            document.body.classList.add('accessibility-mode');
            localStorage.setItem('accessibilityMode', 'true');
        } else {
            document.body.classList.remove('accessibility-mode');
            localStorage.setItem('accessibilityMode', 'false');
        }
    };
  // Определяем классы фона в зависимости от состояния прокрутки и типа страницы
  const getBackgroundClass = () => {
    if (isScrolled) {
      return "bg-white shadow-md";
    } else if (isBranchPage) {
      // Полупрозрачный белый фон для страниц филиалов (20% непрозрачности)
      return "bg-white/20 backdrop-blur-sm";
    } else {
      return "bg-transparent";
    }
  };

  return (
    <header className={`fixed top-0 text-gray-600 font-medium body-font z-50 w-full ease-in duration-150 ${getBackgroundClass()}`}>
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <Link href={route('home')}
                className="hidden lg:flex title-font font-medium items-start text-gray-900 mb-4 md:mb-0 max-w-[280px]">
            <span className="text-sm uppercase leading-tight">
                <span className="block">{t('header.siteNameLine1', 'НАЦИОНАЛЬНЫЙ НАУЧНЫЙ ЦЕНТР')}</span>
                <span className="block">{t('header.siteNameLine2', 'РАЗВИТИЯ ЗДРАВООХРАНЕНИЯ ИМ. САЛИДАТ КАИРБЕКОВОЙ')}</span>
            </span>
            </Link>
            <nav className="hidden md:ml-auto md:mr-auto lg:flex flex-wrap items-center text-base justify-center">
                <div className="relative group mr-8">
                    {/* Кнопка  */}
                    <button className="group-hover:text-gray-900 focus:outline-none flex items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t('header.directions')}
                    </button>

                    {/* Контейнер для двойного меню */}
                    <div className="fixed left-1/2 -translate-x-1/2 transform mt-8 bg-white border-[1px] border-gray-300 shadow-lg rounded-xl py-2 z-50 
    transition-all duration-150 ease-in-out opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible flex"
                        style={{ transformOrigin: "top center" }}>
                        {/* Первое меню */}
                        <ul className="w-96 py-2 border-r border-gray-100">
                            {allDirectionsSubLinks.slice(0, Math.ceil(allDirectionsSubLinks.length / 2)).map((directionsublink, index) =>(
                            <DirectionsSubLinks key={index} title={directionsublink.title} url={directionsublink.url} />

                            ))}
                        </ul>

                        {/* Второе меню */}
                        <ul className="w-96 py-2">
                            {allDirectionsSubLinks.slice(Math.ceil(allDirectionsSubLinks.length / 2)).map((directionsublink, index) =>(
                            <DirectionsSubLinks key={index} title={directionsublink.title} url={directionsublink.url} />
                            ))}

                        </ul>
                    </div>

                    {/* Увеличенная зона интерактивности */}
                    <div className="absolute inset-0 -top-8 -bottom-8 cursor-pointer"></div>
                </div>



                <div className="relative group mr-8">
                    <button className="group-hover:text-gray-900 focus:outline-none flex items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t('header.services')}
                    </button>

                    {/* Контейнер для "Услуги" меню */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-8 bg-white border border-gray-300 shadow-lg rounded-xl py-2 z-50 
            transition-all duration-150 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible"
                        style={{ transformOrigin: "top center" }}>
                        {/* Меню */}
                        <ul className="w-96 py-2">
                            {allServicesSubLinks.map((centresublink, index) => (
                            <DirectionsSubLinks key={index} title={centresublink.title} url={centresublink.url} />
                            ))}
                        </ul>
                    </div>
                    {/* Увеличенная зона интерактивности */}
                    <div className="absolute inset-0 -top-8 -bottom-8 cursor-pointer"></div>

                </div>


                <div className="relative group mr-8">
                    <button className="group-hover:text-gray-900 focus:outline-none flex items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t('header.aboutCenter')}
                    </button>

                    {/* Контейнер для "О центре" меню */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-8 bg-white border border-gray-300 shadow-lg rounded-xl py-2 z-50 
            transition-all duration-150 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible"
                        style={{ transformOrigin: "top center" }}>
                        {/* Меню */}
                        <ul className="w-96 py-2">
                            {allAboutCentreSubLinks.map((centresublink, index) => (
                            <DirectionsSubLinks key={index} title={centresublink.title} url={centresublink.url} />
                            ))}
                        </ul>
                    </div>
                    {/* Увеличенная зона интерактивности */}
                    <div className="absolute inset-0 -top-8 -bottom-8 cursor-pointer"></div>

                </div>

                {/* Филиалы */}
                <div className="relative group mr-8">
                    <button className="group-hover:text-gray-900 focus:outline-none flex items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t('header.branches')}
                    </button>

                    {/* Контейнер для двойного меню */}
                    <div className="fixed left-1/2 -translate-x-1/2 transform mt-8 bg-white border-[1px] border-gray-300 shadow-lg rounded-xl py-2 z-50 
    transition-all duration-150 ease-in-out opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible flex"
                        style={{ transformOrigin: "top center" }}>
                        {/* Первое меню */}
                        <ul className="w-96 py-2 border-r border-gray-100">
                            {branchesSubLinks.slice(0, Math.ceil(branchesSubLinks.length / 2)).map((link, index) => (
                            <DirectionsSubLinks key={index} title={link.title} url={link.url} />
                            ))}
                        </ul>

                        {/* Второе меню */}
                        <ul className="w-96 py-2">
                            {branchesSubLinks.slice(Math.ceil(branchesSubLinks.length / 2)).map((link, index) => (
                            <DirectionsSubLinks key={index} title={link.title} url={link.url} />
                            ))}
                        </ul>
                    </div>
                    
                    {/* Увеличенная зона интерактивности */}
                    <div className="absolute inset-0 -top-8 -bottom-8 cursor-pointer"></div>
                </div>


                {/* Пункт меню Новости */}
                <Link href={route('news.index')} className="mr-8 hover:text-gray-900 flex items-center cursor-pointer">
                    {t('header.news')}
                </Link>

                {/* Кнопка Медицинский туризм */}
                <Link 
                    href={route('medical.tourism')} 
                    className="mr-8 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 animate-bg-blink"
                    style={{
                        animation: 'bgBlink 2s ease-in-out infinite'
                    }}
                >
                    {t('header.medicalTourism')}
                </Link>

                <a className="mr-8 hover:text-gray-900"></a>
            </nav>
            <div className='hidden lg:flex flex-wrap items-end justify-end'>
                {auth?.user && (
                    <Link
                        href={route('admin.dashboard')}
                        className="mx-1 inline-flex items-center py-1 px-3 focus:outline-none text-sm text-gray-900 mt-4 md:mt-0 transition-all ease-in duration-150 hover:text-blue-600"
                    >
                        <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t('header.admin')}
                    </Link>
                )}
                {/* Новый улучшенный переключатель языков */}
                <ImprovedLanguageSwitcher />
                {/* Кнопка версии для слабовидящих (десктоп) */}
                <button
                    className={`mx-1 inline-flex items-center ${accessibilityMode ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600'} border border-gray-300 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-xs mt-4 md:mt-0`}
                    onClick={toggleAccessibilityMode}
                    title={t('header.accessibilityMode')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            {/* Бургер-меню (мобильная версия) */}
            <div className="lg:hidden flex justify-between w-full items-center">
                <Link href={route('home')} className="flex font-medium items-start text-gray-900 mb-4 md:mb-0 max-w-[calc(100%-60px)]">
                <span className="text-[10px] xs:text-xs sm:text-sm uppercase leading-tight break-words" data-translate>{t('header.siteName')}</span>
                </Link>
                <button onClick={()=> setMenuOpen(!menuOpen)}
                    className="text-gray-900 focus:outline-none content-center mb-4 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Toggle menu"
                    >
                    {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    )}
                </button>
            </div>
            {/* Мобильное меню на полный экран */}
            <div className={`fixed inset-0 bg-white text-gray-800 flex flex-col items-start justify-start transform
                transition-transform duration-300 ${ menuOpen ? "translate-x-0" : "-translate-x-full" } z-50`}>
                <button onClick={()=> setMenuOpen(false)}
                    className="absolute top-5 right-5 text-gray-800 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
                    aria-label="Close menu"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <nav className="flex flex-col items-start w-full px-4 py-12 space-y-6 text-lg sm:text-xl overflow-y-auto flex-1 pb-24">
                    {/* Направления - выпадающий список */}
                    <div className="w-full">
                        <button 
                            onClick={() => setDropdownOpen(dropdownOpen === 'directions' ? null : 'directions')}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 min-h-[44px] py-2">
                            <span>{t('header.directions')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'directions' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'directions' && (
                            <div className="w-full mt-3 space-y-1 text-sm sm:text-base border-l-2 border-gray-200 pl-4 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pb-4">
                                {allDirectionsSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>
                                            {link.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Услуги - выпадающий список */}
                    <div className="w-full">
                        <button 
                            onClick={() => setDropdownOpen(dropdownOpen === 'services' ? null : 'services')}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 min-h-[44px] py-2">
                            <span>{t('header.services')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'services' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'services' && (
                            <div className="w-full mt-3 space-y-1 text-sm sm:text-base border-l-2 border-gray-200 pl-4 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pb-4">
                                {allServicesSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>
                                            {link.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* О центре - выпадающий список */}
                    <div className="w-full">
                        <button 
                            onClick={() => setDropdownOpen(dropdownOpen === 'about' ? null : 'about')}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 min-h-[44px] py-2">
                            <span>{t('header.aboutCenter')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'about' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'about' && (
                            <div className="w-full mt-3 space-y-1 text-sm sm:text-base border-l-2 border-gray-200 pl-4 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pb-4">
                                {allAboutCentreSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>
                                            {link.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Филиалы - выпадающий список */}
                    <div className="w-full">
                        <button 
                            onClick={() => setDropdownOpen(dropdownOpen === 'branches' ? null : 'branches')}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 min-h-[44px] py-2">
                            <span>{t('header.branches')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'branches' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'branches' && (
                            <div className="w-full mt-3 space-y-1 text-sm sm:text-base border-l-2 border-gray-200 pl-4 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pb-4">
                                {branchesSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>
                                            {link.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Новости */}
                    <div className="w-full">
                        <button 
                            onClick={() => {
                                setMenuOpen(false);
                                window.location.href = route('news.index');
                            }}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 min-h-[44px]">
                            <span>{t('header.news')}</span>
                        </button>
                    </div>

                    {/* Медицинский туризм */}
                    <div className="w-full">
                        <Link 
                            href={route('medical.tourism')}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 px-4 py-3 border border-gray-300 rounded-md bg-transparent hover:bg-gray-50/50 transition-all duration-200 min-h-[44px]"
                            style={{
                                animation: 'bgBlink 2s ease-in-out infinite'
                            }}
                        >
                            <span>{t('header.medicalTourism')}</span>
                        </Link>
                    </div>
                </nav>
                
                {/* Языки и админ-панель - закреплены внизу */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 w-full z-10">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {/* Улучшенный переключатель языков для мобильной версии - открывается вверх */}
                        <ImprovedLanguageSwitcher openUpwards={true} />
                        
                        {/* Кнопка версии для слабовидящих (мобильная) */}
                        <button 
                            className={`px-3 py-2 rounded text-sm font-medium border min-w-[44px] min-h-[44px] flex items-center justify-center ${accessibilityMode ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-600 border-blue-500'}`}
                            onClick={toggleAccessibilityMode}
                            title={t('header.accessibilityMode')}
                            aria-label={t('header.accessibilityMode')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Admin panel link */}
                    {auth?.user && (
                        <Link
                            href={route('admin.dashboard')}
                            className="flex items-center py-2 px-3 focus:outline-none text-gray-800 hover:text-blue-600 min-h-[44px] text-sm sm:text-base"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="hidden sm:inline">{t('header.admin')}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </header>
    );
}
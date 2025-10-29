import { Link, usePage } from '@inertiajs/react';
import React, {useState, useEffect} from 'react';
import DirectionsSubLinks from './DirectionsSubLinks';
import LanguageSwitcher from './LanguageSwitcher';
import ImprovedLanguageSwitcher from './ImprovedLanguageSwitcher';
// Импортируем новый быстрый сервис переводов
import TranslationService from '../Services/SimpleFastTranslationService';

export default function Header() {
    const { auth, translations } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [accessibilityMode, setAccessibilityMode] = useState(false);
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    const branchesSubLinks = [
        { title: t('branchesSubLinks.astana', "г. Астана"), url: "branches.astana" },
        { title: t('branchesSubLinks.almaty', "г. Алматы"), url: "branches.almaty" },
        { title: t('branchesSubLinks.abay', "Абайская область"), url: "branches.abay" },
        { title: t('branchesSubLinks.akmola', "Акмолинская область"), url: "branches.akmola" },
        { title: t('branchesSubLinks.aktobe', "Актюбинская область"), url: "branches.aktobe" },
        { title: t('branchesSubLinks.almatyregion', "Алматинская область"), url: "branches.almatyregion" },
        { title: t('branchesSubLinks.atyrau', "Атырауская область"), url: "branches.atyrau" },
        { title: t('branchesSubLinks.east', "Восточно-Казахстанская область"), url: "branches.east" },
        { title: t('branchesSubLinks.zhambyl', "Жамбылская область"), url: "branches.zhambyl" },
        { title: t('branchesSubLinks.zhetisu', "Жетысуская область"), url: "branches.zhetisu" },
        { title: t('branchesSubLinks.west', "Западно-Казахстанская область"), url: "branches.west" },
        { title: t('branchesSubLinks.karaganda', "Карагандинская область"), url: "branches.karaganda" },
        { title: t('branchesSubLinks.kostanay', "Костанайская область"), url: "branches.kostanay" },
        { title: t('branchesSubLinks.kyzylorda', "Кызылординская область"), url: "branches.kyzylorda" },
        { title: t('branchesSubLinks.mangistau', "Мангистауская область"), url: "branches.mangistau" },
        { title: t('branchesSubLinks.pavlodar', "Павлодарская область"), url: "branches.pavlodar" },
        { title: t('branchesSubLinks.north', "Северо-Казахстанская область"), url: "branches.north" },
        { title: t('branchesSubLinks.turkestan', "Туркестанская область"), url: "branches.turkestan" },
        { title: t('branchesSubLinks.ulytau', "Улытауская область"), url: "branches.ulytau" },
        { title: t('branchesSubLinks.shymkent', "г. Шымкент"), url: "branches.shymkent" }
    ];

    const allDirectionsSubLinks = [
        { title: t('directionsSubLinks.medical_education', "Медицинское образование"), url: "medical.education"},
        { title: t('directionsSubLinks.human_resources', "Кадровые ресурсы здравоохранения"), url: "human.resources"},
        { title: t('directionsSubLinks.electronic_health', "Цифровое здравоохранение"), url: "electronic.health"},
        { title: t('directionsSubLinks.medical_accreditation', "Аккредитация"), url: "medical.accreditation"},
        { title: t('directionsSubLinks.health_rate', "Оценка технологий здравоохранения"), url: "health.rate"},
        { title: t('directionsSubLinks.clinical_protocols', "Клинические протоколы"), url: "clinical.protocols"},
        { title: t('directionsSubLinks.strategic_initiatives', "Стратегические инициативы и международное сотрудничество"), url: "strategic.initiatives"},
        { title: t('directionsSubLinks.medical_rating', "Рейтинг медицинских организаций"), url: "medical.rating"},
        { title: t('directionsSubLinks.medical_science', "Медицинская наука"), url: "medical.science"},
        { title: t('directionsSubLinks.bioethics', "Центральная комиссия по биоэтике"), url: "bioethics" },
        { title: t('directionsSubLinks.drug_policy', "Лекарственная политика"), url: "drug.policy"},
        { title: t('directionsSubLinks.primary_healthcare', "Первичная медико-санитарная помощь"), url: "primary.healthcare"},
        { title: t('directionsSubLinks.health_accounts', "Национальные счета здравоохранения"), url: "health.accounts"},
        { title: t('directionsSubLinks.medical_statistics', "Медицинская статистика"), url: "medical.statistics"},
        { title: t('directionsSubLinks.direction_tech_competence', "Отраслевой центр технологических компетенций"), url: "direction.tech.competence" },
        { title: t('directionsSubLinks.center_prevention', "Центр профилактики и укрепления здоровья"), url: "center.prevention" },
        { title: t('directionsSubLinks.medical_tourism', "Медицинский туризм"), url: "medical.tourism" },
        { title: "Объединенная комиссия по качеству медицинских услуг", url: "quality.commission" },
    ];

    const allAboutCentreSubLinks = [
        { title: "О Центре", url: "about.centre"},
        { title: "Салидат Каирбекова", url: "salidat.kairbekova"},
        { title: "Вакансии", url: "vacancy.jobs"},
        { title: "Вопросы и ответы", url: "about.faq"},
        { title: "Контактная информация", url: "about.contacts"},
        { title: "Партнеры", url: "about.partners"},
        
    ];

    const allServicesSubLinks = [
        { title: "Организация и проведение обучающих циклов по дополнительному и неформальному образованию", url: "services.training" },
        { title: "Оценка рекламных материалов", url: "services.adsEvaluation" },
        { title: "Оценка технологий здравоохранения", url: "services.healthTechAssessment" },
        { title: "Экспертиза лекарственных средств", url: "services.drugExpertise" },
        { title: "Экспертиза научно-образовательных программ дополнительного образования", url: "services.educationPrograms" },
        { title: "Научно-медицинская экспертиза", url: "services.medicalExpertise" },
        { title: "Аккредитация медицинских организаций и организаций здравоохранения", url: "services.accreditation" },
        { title: "Постаккредитационный мониторинг", url: "services.postAccreditationMonitoring" },
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
  return (
    <header className={`fixed top-0 text-gray-600 font-medium body-font z-50 w-full ease-in duration-150 ${ isScrolled
        ? "bg-white shadow-md" : "bg-transparent" }`}>
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <Link href={route('home')}
                className="hidden lg:flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="text-sm uppercase">национальный научный центр развития <br />здравоохранения им.
                салидат
                каирбековой</span>
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
                        Направления
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
                        Услуги
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
                        О центре
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
                        Филиалы
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
                <Link href={route('news')} className="mr-8 hover:text-gray-900 flex items-center cursor-pointer">
                    Новости
                </Link>

                {/* Кнопка Медицинский туризм */}
                <Link 
                    href={route('medical.tourism')} 
                    className="mr-8 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 animate-bg-blink"
                    style={{
                        animation: 'bgBlink 2s ease-in-out infinite'
                    }}
                >
                    Медицинский туризм
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
                        Админ
                    </Link>
                )}
                {/* Новый улучшенный переключатель языков */}
                <ImprovedLanguageSwitcher />
                {/* Кнопка версии для слабовидящих (десктоп) */}
                <button
                    className={`mx-1 inline-flex items-center ${accessibilityMode ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600'} border border-gray-300 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-xs mt-4 md:mt-0`}
                    onClick={toggleAccessibilityMode}
                    title="Версия для слабовидящих"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            {/* Бургер-меню (мобильная версия) */}
            <div className="lg:hidden flex justify-between w-full">
                <Link href={route('home')} className="flex font-medium items-start text-gray-900 mb-4 md:mb-0">
                <span className="text-xs uppercase leading-tight" data-translate>национальный научный центр развития <br />здравоохранения им. салидат каирбековой</span>
                </Link>
                <button onClick={()=> setMenuOpen(!menuOpen)}
                    className="text-gray-900 focus:outline-none content-center mb-4"
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
                transition-transform duration-300 ${ menuOpen ? "translate-x-0" : "-translate-x-full" } z-50 overflow-y-auto`}>
                <button onClick={()=> setMenuOpen(false)}
                    className="absolute top-5 right-5 text-gray-800 hover:text-gray-600"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <nav className="flex flex-col items-start w-full px-4 py-12 space-y-6 text-xl overflow-y-auto max-h-[80vh]">
                    {/* Направления - выпадающий список */}
                    <div className="w-full">
                        <button 
                            onClick={() => setDropdownOpen(dropdownOpen === 'directions' ? null : 'directions')}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2">
                            <span>Направления</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'directions' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'directions' && (
                            <div className="w-full mt-3 space-y-1 text-base border-l-2 border-gray-200 pl-4 max-h-[50vh] overflow-y-auto pb-4">
                                {allDirectionsSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
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
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2">
                            <span>Услуги</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'services' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'services' && (
                            <div className="w-full mt-3 space-y-1 text-base border-l-2 border-gray-200 pl-4 max-h-[50vh] overflow-y-auto pb-4">
                                {allServicesSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
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
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2">
                            <span>О центре</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'about' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'about' && (
                            <div className="w-full mt-3 space-y-1 text-base border-l-2 border-gray-200 pl-4 max-h-[50vh] overflow-y-auto pb-4">
                                {allAboutCentreSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
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
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2">
                            <span>Филиалы</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform ${dropdownOpen === 'branches' ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen === 'branches' && (
                            <div className="w-full mt-3 space-y-1 text-base border-l-2 border-gray-200 pl-4 max-h-[50vh] overflow-y-auto pb-4">
                                {branchesSubLinks.map((link, index) => (
                                    <div key={index} className="py-2 border-b border-gray-100">
                                        <Link href={route(link.url)} className="block w-full text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
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
                                window.location.href = route('news');
                            }}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2">
                            <span>Новости</span>
                        </button>
                    </div>

                    {/* Медицинский туризм */}
                    <div className="w-full">
                        <Link 
                            href={route('medical.tourism')}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 mb-2 px-4 py-2 border border-gray-300 rounded-md bg-transparent hover:bg-gray-50/50 transition-all duration-200"
                            style={{
                                animation: 'bgBlink 2s ease-in-out infinite'
                            }}
                        >
                            <span>Медицинский туризм</span>
                        </Link>
                    </div>
                </nav>
                
                {/* Языки и админ-панель */}
                <div className="flex items-center space-x-2 ml-4">
                    {/* Улучшенный переключатель языков для мобильной версии */}
                    <ImprovedLanguageSwitcher />
                        
                        {/* Кнопка версии для слабовидящих (мобильная) */}
                        <button 
                            className={`px-2 py-1 rounded text-sm font-medium border ${accessibilityMode ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-600 border-blue-500'}`}
                            onClick={toggleAccessibilityMode}
                            title="Версия для слабовидящих"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Кнопка очистки кэша переводов удалена */}
                    
                    {/* Admin panel link */}
                    {auth?.user && (
                        <Link
                            href={route('admin.dashboard')}
                            className="flex items-center py-1 px-3 ml-2 focus:outline-none text-gray-800 hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Админ
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
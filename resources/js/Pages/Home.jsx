import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import News from '@/Components/News';
import Directions from '@/Components/Directions';
import Services from '@/Components/Services';
import BannerCatalog from '@/Components/BannerCatalog';
import Sponsors from '@/Components/Sponsors';
import Footer from '@/Components/Footer';
import translationService from '@/services/TranslationService';
import HealthAccountsDashboard from '@/Pages/Direction/HealthAccounts/HealthAccountsDashboard';
import HealthAccountsRegions from '@/Pages/Direction/HealthAccounts/HealthAccountsRegions';
import SwitchableChart from '@/Components/SwitchableChart';
import {
    MacroIndicatorsChart,
    CurrentExpensesFSChart,
    CurrentExpensesHCChart,
    CurrentExpensesHFChart,
    CurrentExpensesHPChart,
    GovernmentExpensesTotalChart,
    GovernmentExpensesPercentChart,
    GovernmentExpensesHCChart,
    GovernmentExpensesHPChart,
} from '@/Components/HealthAccountsCharts';

// Компонент для графиков на главной странице (вынесен за пределы Home, чтобы состояние не сбрасывалось)
const HomeCharts = () => {
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChart, setSelectedChart] = useState('medicalStatistics'); // По умолчанию медицинская статистика

    // Структура с категориями графиков
    const chartCategories = [
        {
            id: 'medicalStatistics',
            name: t('home.reports.categories.medicalStatistics', 'Медицинская статистика'),
            reports: [
                { 
                    id: 'medicalStatistics', 
                    name: t('home.reports.medicalStatistics', 'Медицинская статистика'),
                    type: 'report'
                }
            ]
        },
        {
            id: 'healthAccounts',
            name: t('home.reports.categories.healthAccounts', 'Национальные счета здравоохранения'),
            reports: [
                { 
                    id: 'dashboard', 
                    name: t('home.reports.dashboard', 'Дашборд с ключевыми финансовыми показателями'),
                    type: 'report'
                },
                { 
                    id: 'macro', 
                    name: t('home.reports.macro', 'Макро показатели РК 2010-2022'),
                    type: 'chart'
                },
                { 
                    id: 'currentFS', 
                    name: t('home.reports.currentFS', 'Текущие расходы на здравоохранение (FS)'),
                    type: 'chart'
                },
                { 
                    id: 'currentHC', 
                    name: t('home.reports.currentHC', 'Текущие расходы на здравоохранение (HC)'),
                    type: 'chart'
                },
                { 
                    id: 'currentHF', 
                    name: t('home.reports.currentHF', 'Текущие расходы на здравоохранение (HF)'),
                    type: 'chart'
                },
                { 
                    id: 'currentHP', 
                    name: t('home.reports.currentHP', 'Текущие расходы на здравоохранение (HP)'),
                    type: 'chart'
                },
                { 
                    id: 'govTotal', 
                    name: t('home.reports.govTotal', 'Государственные расходы - Итоги'),
                    type: 'chart'
                },
                { 
                    id: 'govPercent', 
                    name: t('home.reports.govPercent', 'Государственные расходы - Процент от ТРЗ'),
                    type: 'chart'
                },
                { 
                    id: 'govHC', 
                    name: t('home.reports.govHC', 'Государственные расходы HC'),
                    type: 'chart'
                },
                { 
                    id: 'govHP', 
                    name: t('home.reports.govHP', 'Государственные расходы HP'),
                    type: 'chart'
                },
                // Региональные графики - Расходы на здравоохранение по регионам
                { 
                    id: 'regionExpenses', 
                    name: t('home.reports.regionExpenses', 'Расходы на здравоохранение по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFunctions', 
                    name: t('home.reports.regionFunctions', 'Расходы на здравоохранение по функциям'),
                    type: 'chart'
                },
                { 
                    id: 'regionPerCapita', 
                    name: t('home.reports.regionPerCapita', 'Расходы на здравоохранение на душу населения'),
                    type: 'chart'
                },
                // Региональные графики - Распределение по мед.помощи
                { 
                    id: 'regionStationary', 
                    name: t('home.reports.regionStationary', 'Расходы на стационар по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionPrimary', 
                    name: t('home.reports.regionPrimary', 'Расходы на АПП по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionPharma', 
                    name: t('home.reports.regionPharma', 'Расходы на фармпрепараты по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionRehab', 
                    name: t('home.reports.regionRehab', 'Расходы на реабилитацию по регионам'),
                    type: 'chart'
                },
                // Региональные графики - Расходы по виду финансирования
                { 
                    id: 'regionShare', 
                    name: t('home.reports.regionShare', 'Доли мед.услуг от ТРЗ по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingBudget', 
                    name: t('home.reports.regionFinancingBudget', 'Расходы по виду финансирования (Бюджет) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingDMS', 
                    name: t('home.reports.regionFinancingDMS', 'Расходы по виду финансирования (ДМС) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingPocket', 
                    name: t('home.reports.regionFinancingPocket', 'Расходы по виду финансирования (Карманные) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingOSMS', 
                    name: t('home.reports.regionFinancingOSMS', 'Расходы по виду финансирования (ОСМС) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingEnterprise', 
                    name: t('home.reports.regionFinancingEnterprise', 'Расходы по виду финансирования (Предприятия) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionFinancingService', 
                    name: t('home.reports.regionFinancingService', 'Расходы по виду финансирования по мед.услугам по регионам'),
                    type: 'chart'
                },
                // Региональные графики - Доли расходов гос/част
                { 
                    id: 'regionStateShareStationary', 
                    name: t('home.reports.regionStateShareStationary', 'Доли расходов на стационар (гос/част) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionStateSharePrimary', 
                    name: t('home.reports.regionStateSharePrimary', 'Доли расходов на АПП (гос/част) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionStateSharePharma', 
                    name: t('home.reports.regionStateSharePharma', 'Доли расходов на фармпрепараты (гос/част) по регионам'),
                    type: 'chart'
                },
                { 
                    id: 'regionStateShareRehab', 
                    name: t('home.reports.regionStateShareRehab', 'Доли расходов на реабилитацию (гос/част) по регионам'),
                    type: 'chart'
                },
                // Региональные графики - Население
                { 
                    id: 'regionPopulation', 
                    name: t('home.reports.regionPopulation', 'Расходы на 1 жителя по регионам'),
                    type: 'chart'
                }
            ]
        }
    ];

    // Список всех доступных графиков (для поиска)
    const availableReports = chartCategories.flatMap(category => category.reports);

        // Фильтрация категорий и отчетов по поисковому запросу
        const filteredCategories = chartCategories.map(category => ({
            ...category,
            reports: category.reports.filter(report =>
                report.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(category => category.reports.length > 0);
        
        const filteredReports = availableReports.filter(report =>
            report.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Обработчик клика по графику для открытия модального окна
        const handleChartClick = () => {
            setIsModalOpen(true);
        };

        // Закрытие модального окна
        const closeModal = () => {
            setIsModalOpen(false);
            setSearchTerm('');
        };

        // Выбор отчета из списка
        const selectReport = (reportId) => {
            setSelectedChart(reportId);
            closeModal();
        };

        // Рендер графика/отчета
        const renderChart = (chartId) => {
            switch (chartId) {
                case 'macro':
                    return (
                        <div className="h-80">
                            <MacroIndicatorsChart t={t} />
                        </div>
                    );
                case 'currentFS':
                    return (
                        <div className="h-80">
                            <CurrentExpensesFSChart t={t} />
                        </div>
                    );
                case 'currentHC':
                    return (
                        <div className="h-80">
                            <CurrentExpensesHCChart t={t} />
                        </div>
                    );
                case 'currentHF':
                    return (
                        <div className="h-80">
                            <CurrentExpensesHFChart t={t} />
                        </div>
                    );
                case 'currentHP':
                    return (
                        <div className="h-80">
                            <CurrentExpensesHPChart t={t} />
                        </div>
                    );
                case 'govTotal':
                    return (
                        <div className="h-80">
                            <GovernmentExpensesTotalChart t={t} />
                        </div>
                    );
                case 'govPercent':
                    return (
                        <div className="h-80">
                            <GovernmentExpensesPercentChart t={t} />
                        </div>
                    );
                case 'govHC':
                    return (
                        <div className="h-80">
                            <GovernmentExpensesHCChart t={t} />
                        </div>
                    );
                case 'govHP':
                    return (
                        <div className="h-80">
                            <GovernmentExpensesHPChart t={t} />
                        </div>
                    );
                case 'dashboard':
                    return <HealthAccountsDashboard t={t} />;
                case 'medicalStatistics':
                    return <SwitchableChart t={t} />;
                // Региональные графики
                case 'regionExpenses':
                case 'regionFunctions':
                case 'regionPerCapita':
                case 'regionStationary':
                case 'regionPrimary':
                case 'regionPharma':
                case 'regionRehab':
                case 'regionShare':
                case 'regionFinancingBudget':
                case 'regionFinancingDMS':
                case 'regionFinancingPocket':
                case 'regionFinancingOSMS':
                case 'regionFinancingEnterprise':
                case 'regionFinancingService':
                case 'regionStateShareStationary':
                case 'regionStateSharePrimary':
                case 'regionStateSharePharma':
                case 'regionStateShareRehab':
                case 'regionPopulation':
                    return <HealthAccountsRegions t={t} chartId={chartId} />;
                default:
                    return <SwitchableChart t={t} />;
            }
        };

        return (
            <section className="text-gray-600 body-font py-16 bg-gray-50">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">
                        {t('home.statistics.title', 'Статистика и аналитика')}
                    </h2>
                    
                    {/* Один график */}
                    <div className="w-full">
                        <div 
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={handleChartClick}
                        >
                            {renderChart(selectedChart)}
                        </div>
                    </div>
                </div>

                {/* Модальное окно выбора отчетов */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Заголовок и поиск */}
                            <div className="p-4 border-b">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {t('home.reports.modal.title', 'Выбор статистических данных')}
                                    </h2>
                                    <button 
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('home.reports.modal.search', 'Поиск графиков и отчетов...')}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Список отчетов с категориями */}
                            <div className="overflow-y-auto flex-grow p-4">
                                {filteredCategories.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredCategories.map((category) => (
                                            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                                </div>
                                                <ul className="divide-y divide-gray-100">
                                                    {category.reports.map((report) => {
                                                        const isSelected = selectedChart === report.id;
                                                        return (
                                                            <li key={report.id} className="py-2">
                                                                <button
                                                                    className={`w-full text-left px-6 py-2 rounded-md transition ${
                                                                        isSelected
                                                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                                            : 'hover:bg-gray-50'
                                                                    }`}
                                                                    onClick={() => selectReport(report.id)}
                                                                >
                                                                    <span className="font-medium text-sm">{report.name}</span>
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {t('home.reports.modal.noResults', 'Нет результатов по запросу')} "{searchTerm}"
                                    </div>
                                )}
                            </div>

                            {/* Кнопки внизу */}
                            <div className="p-4 border-t bg-gray-50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100 transition"
                                >
                                    {t('home.reports.modal.cancel', 'Отмена')}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    {t('home.reports.modal.apply', 'Применить')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
    };

export default function Home() {
    // Используем новый сервис переводов
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    // Определяем слайды для hero секции
    const heroSlides = [
        {
            id: 1,
            title: t('home.hero.slide1.title'),
            subtitle: t('home.hero.slide1.subtitle'),
            buttonText: t('home.hero.slide1.button'),
            buttonLink: route('medical.tourism'),
            image: "/img/HeroImg/medical-tourism.png"
        },
        {
            id: 2,
            title: t('home.hero.slide2.title'),
            subtitle: t('home.hero.slide2.subtitle'),
            buttonText: t('home.hero.slide2.button'),
            buttonLink: route('clinical.protocols'),
            image: "/img/HeroImg/clinicalprotocols.png"
        },
        {
            id: 3,
            title: t('home.hero.slide3.title'),
            subtitle: t('home.hero.slide3.subtitle'),
            buttonText: t('home.hero.slide3.button'),
            buttonLink: route('medical.statistics'),
            image: "/img/HeroImg/home-hero.png"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const slideDuration = 8000; // 8 секунд на слайд (3 сек печатания + 3 сек пауза + 2 сек переход)
        const typingDuration = 3000; // 3 секунды печатания
        const buttonDelay = 3200; // Кнопка появляется через 3.2 секунды (после завершения печатания)

        // Сброс состояния при смене слайда
        setIsTyping(true);
        setShowButton(false);

        // Анимация печатания
        const typingTimer = setTimeout(() => {
            setIsTyping(false);
        }, typingDuration);

        // Показ кнопки (после завершения печатания)
        const buttonTimer = setTimeout(() => {
            setShowButton(true);
        }, buttonDelay);

        // Переход к следующему слайду (зацикленный слайдер между двумя слайдами)
        const slideTimer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, slideDuration);

        return () => {
            clearTimeout(typingTimer);
            clearTimeout(buttonTimer);
            clearTimeout(slideTimer);
        };
    }, [currentSlide, heroSlides.length]);
    
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    // Компонент для анимации печатания
    const TypewriterText = ({ text, isTyping, className }) => {
        const [displayText, setDisplayText] = useState('');
        const [currentIndex, setCurrentIndex] = useState(0);
        const [isComplete, setIsComplete] = useState(false);

        useEffect(() => {
            // Сброс при смене текста
            setDisplayText('');
            setCurrentIndex(0);
            setIsComplete(false);
        }, [text]);

        useEffect(() => {
            if (isTyping && currentIndex < text.length) {
                const timer = setTimeout(() => {
                    setDisplayText(text.slice(0, currentIndex + 1));
                    setCurrentIndex(currentIndex + 1);
                }, 50); // Скорость печатания

                return () => clearTimeout(timer);
            } else if (!isTyping && currentIndex < text.length) {
                // Если печатание закончилось, но текст не полный - допечатать
                setDisplayText(text);
                setCurrentIndex(text.length);
                setIsComplete(true);
            } else if (!isTyping && currentIndex >= text.length) {
                // Если печатание закончилось и текст полный
                setIsComplete(true);
            }
        }, [isTyping, currentIndex, text]);

        return (
            <span className={className}>
                {displayText}
                {isTyping && currentIndex < text.length && !isComplete && (
                    <span className="animate-pulse">|</span>
                )}
            </span>
        );
    };

    return (
        <>
            <Head title={t('center_name', "РГП на ПХВ 'ННЦРЗ им.Салидат Каирбековой' МЗ РК")}
      description={t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты.')}
      meta={[
        { name: 'description', content: t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты.') },
        { name: 'keywords', content: 'ННЦРЗ, Национальный научный центр развития здравоохранения, Салидат Каирбекова, МЗ РК, здравоохранение Казахстан, РГП на ПХВ, услуги, документы, новости, медицина' },
        { name: 'og:title', content: t('center_name', "РГП на ПХВ ННЦРЗ им.Салидат Каирбековой МЗ РК") },
        { name: 'og:description', content: t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан.') },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: t('center_name', "ННЦРЗ им.Салидат Каирбековой") },
        { name: 'og:locale', content: 'kz_KZ' }
      ]}
    >
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Убрать дефолтную белую стрелку */
            .slick-prev:before,
            .slick-next:before {
                content: none !important;
            }
            
            /* Убрать белую полоску сбоку */
            body {
                overflow-x: hidden !important;
            }
            
            /* Убрать возможные белые полоски в hero секции */
            .hero-section {
                width: 100% !important;
                overflow: hidden !important;
            }
        `}</style>
    </Head>
            <Header />
            
            {/* Main Hero Slider */}
            <section className="relative h-screen bg-transparent hero-section">
                {/* Фоновое изображение с анимацией */}
                <div className="absolute inset-0 overflow-hidden">
                    {heroSlides.map((slide, index) => (
                        <img 
                            key={slide.id}
                                                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                                        index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'
                                    }`}
                            alt={`hero-${slide.id}`} 
                            src={slide.image} 
                            style={{ 
                                minHeight: '100vh',
                                minWidth: '100%'
                            }}
                            onError={(e) => {
                                console.error(`Ошибка загрузки изображения: ${slide.image}`);
                                e.target.src = '/img/HeroImg/home-hero.png'; // Fallback изображение
                            }}
                            onLoad={() => {
                                console.log(`Изображение загружено: ${slide.image}`);
                            }}
                        />
                    ))}
                </div>
                
                                {/* Контент с анимацией */}
                <div className="absolute inset-0 flex items-center justify-start z-20">
                    <div className="container mx-auto px-5 flex items-center justify-start w-full">
                        <div className="lg:w-1/2 lg:pl-24 md:pl-16 flex flex-col items-start text-left bg-transparent px-4">
                        {heroSlides.map((slide, index) => (
                            <div 
                                key={slide.id}
                                className={`transition-all duration-1000 ease-in-out w-full flex flex-col items-start ${
                                    index === currentSlide 
                                        ? 'opacity-100 transform translate-x-0 relative pointer-events-auto' 
                                        : 'opacity-0 transform translate-x-8 absolute inset-0 pointer-events-none'
                                }`}
                            >
                                {/* Заголовок */}
                                <h1 className={`title-font sm:text-4xl text-3xl mb-8 font-semibold drop-shadow-lg ${
                                    slide.id === 1 || slide.id === 2 
                                        ? 'text-black' 
                                        : 'text-white'
                                }`}>
                                    <TypewriterText 
                                        text={slide.title} 
                                        isTyping={index === currentSlide && isTyping}
                                        className=""
                                    />
                                </h1>
                                
                                {/* Подзаголовок */}
                                <p className={`text-xl leading-relaxed mb-10 max-w-2xl drop-shadow-lg ${
                                    slide.id === 1 || slide.id === 2 
                                        ? 'text-black' 
                                        : 'text-white'
                                }`}>
                                    <TypewriterText 
                                        text={slide.subtitle} 
                                        isTyping={index === currentSlide && isTyping}
                                        className=""
                                    />
                                </p>
                                
                                {/* Кнопка */}
                                {index === currentSlide && showButton && (
                                    <Link 
                                        href={slide.buttonLink} 
                                        className={`inline-flex items-center backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 hover:shadow-xl transition-all duration-500 shadow-lg border-2 cursor-pointer z-[9999] relative pointer-events-auto select-none hover:z-[10000] ${
                                            slide.id === 1 
                                                ? 'bg-green-600/80 border-green-500/50 hover:bg-green-600/95 hover:border-green-500/80 hover:shadow-2xl' // Медицинский туризм - зеленый
                                                : slide.id === 2 
                                                    ? 'bg-green-600/80 border-green-500/50 hover:bg-green-600/95 hover:border-green-500/80 hover:shadow-2xl' // Клинические протоколы - зеленый
                                                    : 'bg-purple-700/80 border-purple-600/50 hover:bg-purple-700/95 hover:border-purple-600/80 hover:shadow-2xl' // Национальный доклад - темно-фиолетовый
                                        }`}
                                        style={{ animation: 'fadeIn 0.8s ease-in-out' }}
                                        onClick={(e) => {
                                            console.log('Кнопка нажата:', slide.buttonText, 'Ссылка:', slide.buttonLink);
                                            // Предотвращаем всплытие события
                                            e.stopPropagation();
                                        }}
                                        onMouseEnter={(e) => {
                                            console.log('Кнопка наведена:', slide.buttonText);
                                        }}
                                    >
                                        {slide.buttonText}
                                        <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </section>
            <News />
            <Directions />
            <Services />
            <BannerCatalog />
            <HomeCharts />
            <Sponsors />
            <Footer />
        </>
    );
}

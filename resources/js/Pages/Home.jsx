import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import News from '@/Components/News';
import Directions from '@/Components/Directions';
import Services from '@/Components/Services';
import BannerCatalog from '@/Components/BannerCatalog';
import Sponsors from '@/Components/Sponsors';
import Footer from '@/Components/Footer';
import ChartHead from '@/Components/ChartHead';
import translationService from '@/services/TranslationService';

export default function Home() {
    // Используем новый сервис переводов
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

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

        // Переход к следующему слайду
        const slideTimer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, slideDuration);

        return () => {
            clearTimeout(typingTimer);
            clearTimeout(buttonTimer);
            clearTimeout(slideTimer);
        };
    }, [currentSlide]);

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
    
    // Создаем специальный компонент для графиков на главной странице
    const HomeCharts = () => {
        return (
            <section className="text-gray-600 body-font py-16 bg-gray-50">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">{t('home.statistics.title')}</h2>
                    
                    <div className="flex flex-wrap -mx-4">
                        {/* График травм */}
                        <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="h-80">
                                    <ChartHead 
                                        chartType="injuries" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* График аккредитаций */}
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="h-80">
                                    <ChartHead 
                                        chartType="accreditation" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    
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
                                                    ? 'bg-green-600/80 border-green-500/50 hover:bg-green-600/95 hover:border-green-500/80 hover:shadow-2xl' // Конференция - зеленый
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

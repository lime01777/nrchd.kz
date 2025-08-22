import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import News from '@/Components/News';
import Directions from '@/Components/Directions';
import Services from '@/Components/Services';
import BannerCatalog from '@/Components/BannerCatalog';
import ChartHead from '@/Components/ChartHead';
import Sponsors from '@/Components/Sponsors';
import Footer from '@/Components/Footer';
import ConferenceBanner from '@/Components/ConferenceBanner';
import React from 'react';



export default function Home({ auth, laravelVersion, phpVersion }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
    
    // Создаем специальный компонент для графиков на главной странице
    const HomeCharts = () => {
        return (
            <section className="text-gray-600 body-font py-16 bg-gray-50">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">{t('statistics', 'Статистика и аналитика')}</h2>
                    
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

    return (
        <>
            <Head title={t('center_name', "РГП на ПХВ 'ННЦРЗ им.Салидат Каирбековой' МЗ РК")}
      description={t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты.')}
      meta={[
        { name: 'description', content: t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты.') },
        { name: 'keywords', content: 'ННЦРЗ, Национальный научный центр развития здравоохранения, Салидат Каирбекова, МЗ РК, здравоохранение Казахстан, РГП на ПХВ, услуги, документы, новости, медицина' },
        { name: 'og:title', content: t('center_name', "РГП на ПХВ ННЦРЗ им.Салидат Каирбековой МЗ РК") },
        { name: 'og:description', content: t('center_name', 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой МЗ РК.') },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: t('center_name', "ННЦРЗ им.Салидат Каирбековой") },
        { name: 'og:locale', content: 'kz_KZ' }
      ]}
    />
            <Header />
            
            {/* Main Hero */}
            <section className="text-gray-600 body-font">
                <div className="container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="w-full">
                        <img className="absolute inset-0 w-full h-full object-cover" alt="hero" src="./img/slide.png" />
                        <div
                            className="absolute lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-semibold text-gray-900">{t('center_name', 'Национальный научный центр развития здравоохранения им. Салидат Каирбековой')}</h1>
                        </div>
                    </div>
                </div>
            </section>
            <News />
            <ConferenceBanner />
            <Directions />
            <Services />
            <BannerCatalog />
            <HomeCharts />
            <Sponsors />
            <Footer />
        </>
    );
}

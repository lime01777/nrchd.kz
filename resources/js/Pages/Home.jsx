import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import News from '@/Components/News';
import Directions from '@/Components/Directions';
import Services from '@/Components/Services';
import BannerCatalog from '@/Components/BannerCatalog';
import ChartHead from '@/Components/ChartHead';
import Sponsors from '@/Components/Sponsors';
import Footer from '@/Components/Footer';
import React from 'react';

// Создаем специальный компонент для графиков на главной странице
const HomeCharts = () => {
    return (
        <section className="text-gray-600 body-font py-16 bg-gray-50">
            <div className="container mx-auto px-5">
                <h2 className="text-3xl font-bold mb-12 text-gray-800">Статистика и аналитика</h2>
                
                <div className="flex flex-wrap -mx-4">
                    {/* График травм */}
                    <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                            <div className="h-80">
                                {/* Здесь будет график травм */}
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
                                {/* Здесь будет график аккредитаций */}
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

export default function Home({ auth, laravelVersion, phpVersion }) {
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
            <Head title="РГП на ПХВ ''ННЦРЗ им.Салидат Каирбековой'' МЗ РК"
      description="Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты."
      meta={[
        { name: 'description', content: 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой Министерства здравоохранения Республики Казахстан. Новости, направления, услуги, документы, контакты.' },
        { name: 'keywords', content: 'ННЦРЗ, Национальный научный центр развития здравоохранения, Салидат Каирбекова, МЗ РК, здравоохранение Казахстан, РГП на ПХВ, услуги, документы, новости, медицина' },
        { name: 'og:title', content: 'РГП на ПХВ ННЦРЗ им.Салидат Каирбековой МЗ РК' },
        { name: 'og:description', content: 'Официальный сайт РГП на ПХВ Национального научного центра развития здравоохранения имени Салидат Каирбековой МЗ РК.' },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'ННЦРЗ им.Салидат Каирбековой' },
        { name: 'og:locale', content: 'ru_RU' }
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
                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-semibold text-gray-900">Национальный
                                доклад 
                                <br className="hidden lg:inline-block" />о развитии здравоохранения  
                            </h1>
                            <div className="flex justify-center">
                                <Link href="/direction/medical-statistics" 
                                    className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded-xl text-lg shadow-lg mt-3">Посмотреть национальный доклад здравоохранения</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <News />
            <Directions />
            <Services />
            <BannerCatalog />
            {/* Заменяем один ChartHead на наш новый компонент с двумя графиками */}
            <HomeCharts />
            <Sponsors />
            <Footer />
            
            {/* Закомментированный код
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                        </header>
                    </div>
                </div>
            </div>
            */}
        </>
    );
}

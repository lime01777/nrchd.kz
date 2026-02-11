import React from 'react';
import Header from '@/Components/Sections/Header';
import HeroNews from '@/Components/Sections/HeroNews';
import Footer from '@/Components/Sections/Footer';
import ScrollToTop from '@/Components/ScrollToTop';

/**
 * Общий лейаут для публичных страниц новостей.
 * Добавляет хедер, хиро-блок и аккуратные отступы вокруг контента.
 */
export default function LayoutNews({ children, img = null, h1, renderCustomHero = null }) {
    return (
        <>
            <Header />

            {/* Верхний хиро-блок + отступ от хедера */}
            {typeof renderCustomHero === 'function'
                ? renderCustomHero()
                : <HeroNews img={img} h1={h1} />}

            {/* Основной контент с равномерными полями */}
            <section className="bg-white py-12 text-gray-700 sm:py-16 lg:py-20">
                <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </section>

            <Footer />
            <ScrollToTop />
        </>
    );
}

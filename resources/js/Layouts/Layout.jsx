import React from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import HeroNews from '@/Components/HeroNews';

/**
 * Базовый публичный лейаут с хедером, опциональным героем и футером.
 * @param {object} props
 * @param {React.ReactNode} props.children Основной контент страницы.
 * @param {string|null} [props.heroImage=null] Обложка для блока Hero.
 * @param {string|null} [props.heroTitle=null] Заголовок для Hero.
 */
export default function Layout({ children, heroImage = null, heroTitle = null }) {
    return (
        <>
            {/* Верхняя навигация */}
            <Header />

            {/* Герой отображаем только если есть данные */}
            {(heroImage || heroTitle) && (
                <HeroNews img={heroImage} h1={heroTitle} />
            )}

            {/* Основной контент */}
            <main className="min-h-screen bg-white">
                {children}
            </main>

            {/* Подвал */}
            <Footer />
        </>
    );
}


import React from 'react';
import Header from '@/Components/Header';
import HeroNews from '@/Components/HeroNews';
import Footer from '@/Components/Footer';

export default function LayoutNews({ children, img, h1 }) {
  console.log('children:', children);
  return (
    <>
      <Header />
      <HeroNews img={img} h1={h1} />
      <section className="text-gray-600 body-font">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </section>
      <Footer />
    </>
  );
}

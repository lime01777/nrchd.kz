import React from 'react';
import Header from '@/Components/Header';
import Hero from '@/Components/Hero';
import Footer from '@/Components/Footer';

export default function LayoutBranch({ 
  children, 
  img, 
  h1, 
  useGif = false, // Параметр для использования GIF
  overlay = true  // Параметр для управления полупрозрачным оверлеем
}) {
  return (
    <>
      <Header />
      <Hero 
        img={img} 
        h1={h1} 
        useGif={false}
        useVideo={false} // Явно отключаем видео в этом макете
        overlay={overlay} 
      />
      <section className="text-gray-600 body-font">
        {children}
      </section>
      <Footer />
    </>
  )
}

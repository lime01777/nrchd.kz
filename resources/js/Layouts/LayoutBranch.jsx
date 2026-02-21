import React from 'react';
import Header from '@/Components/Sections/Header';
import Hero from '@/Components/Sections/Hero';
import Footer from '@/Components/Sections/Footer';
import ScrollToTop from '@/Components/ScrollToTop';

export default function LayoutBranch({ 
  children, 
  img, 
  h1, 
  useGif = false, // Параметр для использования GIF
  overlay = true,  // Параметр для управления полупрозрачным оверлеем
  branchFolder = null // Папка территориального департамента для использования изображений из BranchImg
}) {
  return (
    <>
      <Header isBranchPage={true} />
      <Hero 
        img={img} 
        h1={h1} 
        useGif={false}
        useVideo={false} // Явно отключаем видео в этом макете
        overlay={overlay}
        branchFolder={branchFolder} // Передаем branchFolder в Hero
      />
      <section className="text-gray-600 body-font">
        {children}
      </section>
      <Footer />
      <ScrollToTop />
    </>
  )
}

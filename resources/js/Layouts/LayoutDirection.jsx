import React from 'react';
import Header from '@/Components/Header';
import Hero from '@/Components/Hero';
import Footer from '@/Components/Footer';

export default function LayoutDirection({ 
  children, 
  img, 
  h1, 
  useGif = false, // Параметр для использования GIF
  useVideo = false, // Новый параметр для использования видео
  videoFormat = 'mp4', // Формат видео (по умолчанию mp4)
  overlay = true  // Параметр для управления полупрозрачным оверлеем
}) {
  // Мы не можем использовать одновременно GIF и видео, поэтому если оба параметра true, приоритет у видео
  const finalUseGif = useVideo ? false : useGif;
  
  return (
    <>
      <Header />
      <Hero 
        img={img} 
        h1={h1} 
        useGif={finalUseGif}
        useVideo={useVideo}
        videoFormat={videoFormat}
        overlay={overlay} 
      />
      <section className="text-gray-600 body-font">
        {children}
      </section>
      <Footer />
    </>
  )
}

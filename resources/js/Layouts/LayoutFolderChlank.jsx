import React from 'react';
import { Link } from '@inertiajs/react';
import Footer from '@/Components/Sections/Footer';
import Header from '@/Components/Sections/Header';
import HeroFolder from '@/Components/Sections/HeroFolder';
import ScrollToTop from '@/Components/ScrollToTop';

export default function LayoutFolderChlank({ 
  children, 
  bgColor, 
  h1, 
  parentRoute, 
  parentName, 
  heroBgColor = 'bg-red-100',
  buttonBgColor = 'bg-red-100', 
  buttonHoverBgColor = 'hover:bg-red-200',
  buttonBorderColor = 'border-red-200'
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroFolder 
        parentRoute={parentRoute} 
        parentName={parentName} 
        h1={h1} 
        bgColor={heroBgColor} 
        buttonBgColor={buttonBgColor} 
        buttonHoverBgColor={buttonHoverBgColor}
        buttonBorderColor={buttonBorderColor}
      />
        <main className={`flex-grow  ${bgColor}`}>
        {children}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

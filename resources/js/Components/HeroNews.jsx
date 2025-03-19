import React from 'react';

export default function HeroNews({ img, h1 }) {
  return (
    <div className="relative bg-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white text- mix-blend-multiply opacity-60"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">{h1}</h1>
      </div>
    </div>
  );
}
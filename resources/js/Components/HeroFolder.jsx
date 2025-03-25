import React from 'react';
import { Link } from '@inertiajs/react';

function HeroFolder({ parentRoute, parentName, h1, bgColor = 'bg-red-100', buttonBgColor = 'bg-red-100', buttonHoverBgColor = 'hover:bg-red-200', buttonBorderColor = 'border-red-200' }) {
  return (
    /* Main Hero */
    <section className={`text-gray-600 body-font relative h-[50vh] ${bgColor}`}>
      <div className="container mx-auto px-5 py-12 h-full flex flex-col justify-between">
        {parentRoute && parentName && (
          <div className="absolute top-[25%] left-[10%]">
            <Link 
              href={parentRoute} 
              className={`cursor-pointer text-black inline-flex items-center p-3 ${buttonBgColor} ${buttonHoverBgColor} ${buttonBorderColor} rounded-lg transition-all duration-300`}
            >
              <svg 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2"
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              {parentName}
            </Link>
          </div>
        )}
        
        <div className="absolute bottom-[20%] left-[10%]">
          <h1 className="text-6xl font-bold text-gray-900">{h1}</h1>
        </div>
      </div>
    </section>
  );
}

export default HeroFolder;
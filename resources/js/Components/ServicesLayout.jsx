import React from 'react';
import { Link } from '@inertiajs/react';

function ServicesLayout({ title, img, children }) {
  return (
    <div className="relative">
      {/* Main Header Section with yellow background */}
      <section className="bg-yellow-100 text-gray-800 body-font relative">
        <div className="container mx-auto px-5 py-24">
          <div className="w-full mb-12">
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="#" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 inline-flex items-center"
              >
                Подать заявку
              </Link>
              <Link 
                href="#" 
                className="bg-transparent hover:bg-blue-100 text-blue-500 border border-blue-500 px-6 py-3 rounded-md font-medium transition-all duration-300 inline-flex items-center"
              >
                Подробнее
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white text-gray-600 body-font">
        <div className="container mx-auto px-5 py-12">
          {children}
        </div>
      </section>
    </div>
  )
}

export default ServicesLayout

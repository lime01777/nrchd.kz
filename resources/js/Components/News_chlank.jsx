import React from 'react'
import { Link } from '@inertiajs/react';

function News_chlank({ date, description, slug }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex flex-col p-6 h-full">
            <div className="flex-grow">
                <p className="text-gray-500 text-sm mb-2">{date}</p>
                <h2 className="text-gray-900 text-lg font-medium mb-4 line-clamp-3 h-[4.5rem]" title={description}>
                    {description}
                </h2>
                {slug ? (
                  <Link 
                    href={route('news.show', slug)} 
                    className="mt-auto text-black inline-flex items-center border-gray-300 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    Читать новость
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                ) : (
                  <a className="mt-auto text-black inline-flex items-center border-gray-300 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                    Читать новость
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                )}
            </div>
        </div>
    </div>
  )
}

export default News_chlank
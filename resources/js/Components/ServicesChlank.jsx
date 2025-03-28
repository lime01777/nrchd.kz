import React from 'react'
import { Link } from '@inertiajs/react'

function ServicesChlank({title, bgcolor, url}) {
  return (
    <div className="p-4 lg:w-1/3 w-full">
        <div className={`h-full ${bgcolor} border-b-8 bg-opacity-75 px-8 py-10 rounded-lg overflow-hidden text-left relative flex flex-col justify-between`}>
            <h1 className="title-font sm:text-xl text-lg font-medium text-gray-900 mb-3 line-clamp-3">{title}</h1>
            <Link href={route(url)} 
                className="cursor-pointer mt-3 text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 w-fit">Перейти
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
            </Link>
        </div>
    </div>
  )
}

export default ServicesChlank
import React from 'react';
import { Link } from '@inertiajs/react';

function FolderChlank({ h1, color, colorsec, href }) {
  return (
    <div className="relative  md:w-1/3 w-full p-4 mt-12">
        <div className={`absolute -top-4 left-36 ${colorsec} w-48 h-8 rounded-tr-lg -z-50`}></div>
        <div className={`absolute -top-4 ${color} w-48 h-8 rounded-t-lg`}></div>
        <div className={`flex flex-col ${color} p-8 h-[250px] text-left content-between justify-between rounded-b-lg rounded-tr-lg shadow-lg`}>
            <div className='flex'>
                <h1 className="font-medium leading-relaxed mb-3">{h1}</h1>
            </div>
            <div className="flex mt-4 justify-between">
                {href ? (
                    <Link
                        href={href}
                        className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                        Открыть
                    </Link>
                ) : (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                        Открыть
                    </a>
                )}
            </div>
        </div>
    </div>
  )
}

export default FolderChlank
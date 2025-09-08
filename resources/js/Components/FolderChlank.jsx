import React from 'react';
import { Link } from '@inertiajs/react';

function FolderChlank({ 
  title, 
  description, 
  href, 
  icon, 
  h1, 
  color = "bg-blue-500", 
  colorsec = "bg-blue-600" 
}) {
  // Поддержка как новых пропсов (title, description, icon), так и старых (h1, color, colorsec)
  const displayTitle = title || h1;
  const displayColor = color;
  const displayColorSec = colorsec;
  
  return (
    <div className="relative md:w-1/3 w-full p-4 mt-12">
        <div className={`absolute -top-4 left-36 ${displayColorSec} w-48 h-8 rounded-tr-lg -z-50`}></div>
        <div className={`absolute -top-4 ${displayColor} w-48 h-8 rounded-t-lg`}></div>
        <div className={`flex flex-col ${displayColor} p-8 h-[250px] text-left content-between justify-between rounded-b-lg rounded-tr-lg shadow-lg`}>
            <div className='flex flex-col'>
                {icon && (
                  <div className="text-2xl mb-2">{icon}</div>
                )}
                <h1 className="font-medium leading-relaxed mb-3">{displayTitle}</h1>
                {description && (
                  <p className="text-sm opacity-90 leading-relaxed">{description}</p>
                )}
            </div>
            <div className="flex mt-4 justify-between">
                {href ? (
                    <Link
                        href={href}
                        className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                        Открыть
                    </Link>
                ) : (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                        Открыть
                    </a>
                )}
            </div>
        </div>
    </div>
  )
}

export default FolderChlank
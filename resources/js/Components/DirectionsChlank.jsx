import { Link } from '@inertiajs/react'
import React from 'react'

function DirectionsChlank({ title, bgcolor, bgborder, imgname, url, hasRoute, path }) {
  return (
    <div className="lg:w-1/3 md:w-1/2 w-full p-4 min-w-[280px] sm:min-w-0">
      {hasRoute ? (
        <Link href={route(url)}>      
          <div className={`flex flex-row border ${bgcolor} ${bgborder} p-4 sm:p-6 rounded-lg h-full min-h-[120px]`}>
              <div
                  className="w-1/2 content-center items-center flex justify-center">
                      <img className='mx-auto h-3/4 max-h-fit w-auto object-cover object-center max-w-full' src={`./img/CategoryDist/${imgname}.png`} alt="" />
              </div>
              <div className='w-1/2 align-middle content-center flex items-center'>
              <h2 className="text-base sm:text-lg text-gray-900 font-semibold break-words">{title}</h2>
              </div>
          </div>
        </Link>
      ) : (
        <a href={path || '#'} className="cursor-pointer">      
          <div className={`flex flex-row border ${bgcolor} ${bgborder} p-4 sm:p-6 rounded-lg h-full min-h-[120px]`}>
              <div
                  className="w-1/2 content-center items-center flex justify-center">
                      <img className='mx-auto h-3/4 max-h-fit w-auto object-cover object-center max-w-full' src={`./img/CategoryDist/${imgname}.png`} alt="" />
              </div>
              <div className='w-1/2 align-middle content-center flex items-center'>
              <h2 className="text-base sm:text-lg text-gray-900 font-semibold break-words">{title}</h2>
              </div>
          </div>
        </a>
      )}
    </div>
  )
}

export default DirectionsChlank
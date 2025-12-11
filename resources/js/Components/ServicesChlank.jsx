import React from 'react'
import { Link } from '@inertiajs/react'
import translationService from '@/services/TranslationService'

function ServicesChlank({title, bgcolor, url}) {
  const t = (key, fallback = '') => translationService.t(key, fallback);

  return (
    <div className="p-4 lg:w-1/3 w-full min-w-[280px] sm:min-w-0">
        <div className={`h-full ${bgcolor} border-b-8 bg-opacity-75 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 rounded-lg overflow-hidden text-left relative flex flex-col justify-between`}>
            <h1 className="title-font sm:text-xl text-base sm:text-lg font-medium text-gray-900 mb-3 line-clamp-3 break-words">{title}</h1>
            <Link href={route(url)} 
                className="cursor-pointer mt-3 text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-2.5 sm:p-3 w-fit min-h-[44px]">{t('common.goTo')}
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
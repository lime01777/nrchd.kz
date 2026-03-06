import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

function FolderChlank({
  title,
  description,
  href,
  icon,
  h1,
  color = "bg-blue-500",
  colorsec = "bg-blue-600",
  subfolders = []
}) {
  // Состояние для реактивности при смене языка
  const [buttonText, setButtonText] = useState('');

  // Обновление текста кнопки при изменении языка
  useEffect(() => {
    const updateButtonText = () => {
      setButtonText(translationService.t('common.open', 'Открыть'));
    };

    updateButtonText();
    window.addEventListener('languageChanged', updateButtonText);

    return () => {
      window.removeEventListener('languageChanged', updateButtonText);
    };
  }, []);

  // Поддержка как новых пропсов (title, description, icon), так и старых (h1, color, colorsec)
  const displayTitle = title || h1;
  const displayColor = color;
  const displayColorSec = colorsec;

  return (
    <div className="relative md:w-1/3 w-full p-4 mt-12">
      <div className={`absolute -top-4 left-24 md:left-36 ${displayColorSec} w-36 md:w-48 h-8 rounded-tr-lg -z-50`}></div>
      <div className={`absolute -top-4 ${displayColor} w-36 md:w-48 h-8 rounded-t-lg`}></div>
      <div className={`flex flex-col ${displayColor} p-8 min-h-[250px] text-left content-between justify-between rounded-b-lg rounded-tr-lg shadow-lg`}>
        <div className='flex flex-col'>
          {icon && (
            <div className="text-2xl mb-2">{icon}</div>
          )}
          <h1 className="font-medium leading-relaxed mb-3">{displayTitle}</h1>
          {description && (
            <p className="text-sm opacity-90 leading-relaxed">{description}</p>
          )}

          {subfolders && subfolders.length > 0 && (
            <div className="flex flex-col gap-2 mt-4 z-10 w-full flex-grow">
              {subfolders.map((sf, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white bg-opacity-40 rounded-lg hover:bg-opacity-80 hover:shadow transition-all text-gray-900 overflow-hidden relative group">
                  <svg className="w-5 h-5 flex-shrink-0 text-emerald-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  </svg>
                  {sf.href ? (
                    <Link href={sf.href} className="text-sm font-medium w-full z-10 after:absolute after:inset-0 line-clamp-2">
                      {sf.title}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium w-full line-clamp-2">{sf.title}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {(!subfolders || subfolders.length === 0) && (
          <div className="flex mt-4 justify-between">
            {href ? (
              <Link
                href={href}
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                {buttonText}
              </Link>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                {buttonText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FolderChlank
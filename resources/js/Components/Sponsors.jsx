import React, { useState, useEffect } from 'react';
import SponsorsChlank from './SponsorsChlank';
import translationService from '@/services/TranslationService';

function Sponsors() {
  const [currentLang, setCurrentLang] = useState(translationService.getLanguage());
  
  // Функция для получения перевода
  const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
  };
  
  // Обновляем язык при изменении
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(translationService.getLanguage());
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('partnersComponent.title')}</h1>
                </div>

            </div>
            <div className="flex flex-wrap -m-4">
                <SponsorsChlank description={t('sponsors.partner1', 'Казахстанский Национальный Университет Медицинских Исследований')} />
                <SponsorsChlank description={t('sponsors.partner2', 'Ассоциация медицинских работников стран Евразии')} />
                <SponsorsChlank description={t('sponsors.partner3', 'Национальный холдинг "Медицинский исследовательский институт"')} />
                <SponsorsChlank description={t('sponsors.partner4', 'Национальный холдинг "Медицинский исследовательский институт"')} />
                <SponsorsChlank description={t('sponsors.partner5', 'Казахстанский Национальный Университет Медицинских Исследований')} />
                <SponsorsChlank description={t('sponsors.partner6', 'Казахстанский Национальный Университет Медицинских Исследований')} />
            </div>
        </div>
    </section>
  )
}

export default Sponsors

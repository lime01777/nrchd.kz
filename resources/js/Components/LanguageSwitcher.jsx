import React, { useState, useEffect } from 'react';
import languageManager from '@/Utils/LanguageManager';

function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize with language from LanguageManager
  useEffect(() => {
    // Получаем текущий язык из менеджера
    const initialLang = languageManager.getCurrentLanguage();
    setCurrentLang(initialLang);
    
    // Инициализируем LanguageManager при первой загрузке
    if (!languageManager.initialized) {
      languageManager.init();
    }
  }, []);

  const handleLanguageChange = async (lang) => {
    console.log(`[LanguageSwitcher] Button clicked: ${lang}, current language: ${currentLang}`);
    if (lang === currentLang) return;
    
    try {
      // Update UI state
      setIsTranslating(true);
      
      // Компактный индикатор перевода в углу экрана
      const indicator = document.createElement('div');
      indicator.textContent = `Переключение на ${lang}...`;
      indicator.style.position = 'fixed';
      indicator.style.top = '50px';
      indicator.style.right = '10px';
      indicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
      indicator.style.color = 'white';
      indicator.style.padding = '10px';
      indicator.style.borderRadius = '5px';
      indicator.style.zIndex = '9999';
      document.body.appendChild(indicator);
      
      // Используем language manager для смены языка всего сайта
      await languageManager.switchLanguage(lang);
      
      // Обновляем состояние компонента после смены языка
      setCurrentLang(lang);
      
      // Удаляем индикатор после завершения
      setTimeout(() => {
        document.body.removeChild(indicator);
      }, 1000);
      
    } catch (error) {
      console.error('[LanguageSwitcher] Translation error:', error);
      alert(`Ошибка при переводе: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => handleLanguageChange('en')} 
        className={`lang-btn py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 ${currentLang === 'en' ? 'bg-blue-100 font-medium' : ''}`}
        disabled={isTranslating}
      >
        EN
      </button>
      <button 
        onClick={() => handleLanguageChange('ru')} 
        className={`lang-btn py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 ${currentLang === 'ru' ? 'bg-blue-100 font-medium' : ''}`}
        disabled={isTranslating}
      >
        RU
      </button>
      <button 
        onClick={() => handleLanguageChange('kz')} 
        className={`lang-btn py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 ${currentLang === 'kz' ? 'bg-blue-100 font-medium' : ''}`}
        disabled={isTranslating}
      >
        KZ
      </button>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0; }
          50% { width: 50%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default LanguageSwitcher;

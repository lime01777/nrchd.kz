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
    
    // Создаем индикатор перевода за пределами блока try-catch
    const indicator = document.createElement('div');
    indicator.id = 'language-switch-indicator';
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
    
    // Добавляем таймаут безопасности, чтобы при любой ошибке индикатор исчез
    const safetyTimeout = setTimeout(() => {
      try {
        const existingIndicator = document.getElementById('language-switch-indicator');
        if (existingIndicator && existingIndicator.parentNode) {
          existingIndicator.parentNode.removeChild(existingIndicator);
        }
        setIsTranslating(false);
      } catch (e) {}
    }, 8000); // 8 секунд максимум для перевода
    
    try {
      // Update UI state
      setIsTranslating(true);
      
      // Используем language manager для смены языка всего сайта
      // Устанавливаем таймаут для предотвращения бесконечного ожидания
      const translationPromise = Promise.race([
        languageManager.switchLanguage(lang),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Таймаут перевода. Попробуйте еще раз.')), 7000)
        )
      ]);
      
      await translationPromise;
      
      // Обновляем состояние компонента после смены языка
      setCurrentLang(lang);
      
    } catch (error) {
      console.error('[LanguageSwitcher] Translation error:', error);
      // Отображаем сообщение об ошибке только если не таймаут
      if (!error.message.includes('Таймаут')) {
        alert(`Ошибка при переводе: ${error.message}`);
      } else {
        alert(`Перевод не удался из-за таймаута. Попробуйте обновить страницу и попытаться снова.`);
      }
      
      // Восстанавливаем видимость элементов, которые могли быть скрыты
      const hiddenElements = document.querySelectorAll('[style*="display: none"]');
      hiddenElements.forEach(el => {
        if (el.getAttribute('data-translation-hidden')) {
          el.style.display = '';
          el.removeAttribute('data-translation-hidden');
        }
      });
      
      // Возвращаемся к предыдущему языку
      languageManager.revertToLastLanguage();
    } finally {
      // Очищаем таймаут безопасности
      clearTimeout(safetyTimeout);
      
      // Удаляем индикатор после завершения
      try {
        const existingIndicator = document.getElementById('language-switch-indicator');
        if (existingIndicator && existingIndicator.parentNode) {
          existingIndicator.parentNode.removeChild(existingIndicator);
        }
      } catch (e) {}
      
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

import React, { useState, useEffect } from 'react';
import { translatePage } from '@/Utils/translator';

function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize with saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const handleLanguageChange = async (lang) => {
    console.log(`[LanguageSwitcher] Button clicked: ${lang}, current language: ${currentLang}`);
    if (lang === currentLang) return;
    
    // Update UI state
    setCurrentLang(lang);
    setIsTranslating(true);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
    
    try {
      // Add a direct visual indicator for debugging
      const debugIndicator = document.createElement('div');
      debugIndicator.textContent = `Translating to ${lang}...`;
      debugIndicator.style.position = 'fixed';
      debugIndicator.style.top = '50px';
      debugIndicator.style.right = '10px';
      debugIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
      debugIndicator.style.color = 'white';
      debugIndicator.style.padding = '10px';
      debugIndicator.style.borderRadius = '5px';
      debugIndicator.style.zIndex = '9999';
      document.body.appendChild(debugIndicator);
      
      // Log to console
      console.log(`[LanguageSwitcher] Translating page to ${lang} from ${currentLang}`);
      
      // Show loading indicator
      document.body.classList.add('translating');
      
      // Direct fetch to translation API for simplicity
      const result = await fetch('/api/test-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          source: currentLang,
          target: lang,
          text: 'Test translation'
        })
      });
      
      const response = await result.json();
      console.log('[LanguageSwitcher] API test response:', response);
      
      // If API test succeeded, call the full translation function
      if (response.success) {
        await translatePage(lang);
      } else {
        alert(`Translation API error: ${response.message || 'Unknown error'}`); 
      }
      
      // Remove debug indicator
      setTimeout(() => {
        document.body.removeChild(debugIndicator);
      }, 2000);
      
    } catch (error) {
      console.error('[LanguageSwitcher] Translation error:', error);
      alert(`Translation error: ${error.message}`);
    } finally {
      setIsTranslating(false);
      document.body.classList.remove('translating');
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

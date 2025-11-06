import React, { createContext, useContext, useState, useEffect } from 'react';
import translationService from '../services/TranslationService';

// Создаем контекст для переводов
const TranslationContext = createContext();

/**
 * Provider для переводов
 */
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguage());
  const [isChanging, setIsChanging] = useState(false);

  // Функция для изменения языка
  const changeLanguage = (lang) => {
    if (lang === currentLanguage) return;
    
    setIsChanging(true);
    const success = translationService.setLanguage(lang);
    
    if (success) {
      setCurrentLanguage(lang);
      
      // Перезагружаем страницу для применения нового языка
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      setIsChanging(false);
    }
  };

  // Функция для получения перевода
  const t = (key, fallback) => {
    return translationService.t(key, fallback);
  };

  // Функция для получения секции переводов
  const getSection = (section) => {
    return translationService.getSection(section);
  };

  // Устанавливаем язык при первой загрузке
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getSection,
    isChanging
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

/**
 * Хук для использования переводов в компонентах
 */
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
};

export default TranslationContext;


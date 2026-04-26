import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // 1. Check local storage
    const savedLang = localStorage.getItem('pdf_masters_tool_lang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      // 2. Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('pdf_masters_tool_lang', newLang);
      
      // Update document direction for RTL languages like Arabic
      document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Fallback to path string if not found
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, languages: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { useState, useCallback } from 'react';

export default function useLanguage(defaultLang = 'en') {
  const [language, setLanguage] = useState(defaultLang);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  
  const t = useCallback((englishText, swahiliText) => {
    if (language === 'sw' && swahiliText) {
      return swahiliText;
    }
    return englishText;
  }, [language]);

  return { language, setLanguage, toggleLanguage, t };
}
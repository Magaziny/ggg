"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.tk;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tk");

  useEffect(() => {
    const savedLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lang="))
      ?.split("=")[1] as Language;
    
    if (savedLang && (savedLang === "tk" || savedLang === "ru")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`; // 1 year
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

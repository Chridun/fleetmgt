import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { I18nManager } from "react-native";
import { i18n, initializeLanguage, setLanguage as setI18nLanguage, isRTL, SUPPORTED_LANGUAGES } from "./i18n";

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  isRTL: boolean;
  t: (key: string, options?: Record<string, any>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLanguage().then((lang) => {
      setLanguageState(lang);
      setIsLoading(false);
    });
  }, []);

  const setLanguage = (code: string) => {
    setI18nLanguage(code);
    setLanguageState(code);
    
    const rtl = isRTL(code);
    if (I18nManager.isRTL !== rtl) {
      I18nManager.forceRTL(rtl);
    }
  };

  const t = (key: string, options?: Record<string, any>): string => {
    return i18n.t(key, options);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL: isRTL(language),
        t,
        isLoading,
      }}
    >
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

export { SUPPORTED_LANGUAGES };

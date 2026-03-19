import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { portalTranslations, PORTAL_LANGUAGE_STORAGE_KEY, type PortalLanguage } from './translations';

interface PortalLanguageContextValue {
  language: PortalLanguage;
  locale: string;
  setLanguage: (language: PortalLanguage) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const PortalLanguageContext = createContext<PortalLanguageContextValue | undefined>(undefined);

function getStoredLanguage(): PortalLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const stored = window.localStorage.getItem(PORTAL_LANGUAGE_STORAGE_KEY);
  return stored === 'el' ? 'el' : 'en';
}

export function PortalLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<PortalLanguage>(() => getStoredLanguage());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PORTAL_LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const value = useMemo<PortalLanguageContextValue>(() => {
    const t = (key: string, variables?: Record<string, string | number>) => {
      const template = portalTranslations[language][key] ?? portalTranslations.en[key] ?? key;
      if (!variables) {
        return template;
      }
      return Object.entries(variables).reduce((result, [token, tokenValue]) => {
        return result.replaceAll(`{${token}}`, String(tokenValue));
      }, template);
    };

    return {
      language,
      locale: language === 'el' ? 'el-GR' : 'en-GB',
      setLanguage: setLanguageState,
      t,
    };
  }, [language]);

  return <PortalLanguageContext.Provider value={value}>{children}</PortalLanguageContext.Provider>;
}

export function usePortalLanguage() {
  const context = useContext(PortalLanguageContext);
  if (!context) {
    throw new Error('usePortalLanguage must be used within PortalLanguageProvider');
  }
  return context;
}

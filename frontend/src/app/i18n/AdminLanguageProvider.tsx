import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ADMIN_LANGUAGE_STORAGE_KEY, adminTranslations, type AdminLanguage } from './adminTranslations';

interface AdminLanguageContextValue {
  language: AdminLanguage;
  setLanguage: (language: AdminLanguage) => void;
  t: (key: string) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | undefined>(undefined);

function getStoredLanguage(): AdminLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const stored = window.localStorage.getItem(ADMIN_LANGUAGE_STORAGE_KEY);
  return stored === 'el' ? 'el' : 'en';
}

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>(() => getStoredLanguage());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_LANGUAGE_STORAGE_KEY, language);
      window.dispatchEvent(new CustomEvent('cloudon-admin-language-changed', { detail: language }));
      document.documentElement.lang = language === 'el' ? 'el' : 'en';
    }
  }, [language]);

  const value = useMemo<AdminLanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (key: string) => adminTranslations[language][key] ?? adminTranslations.en[key] ?? key,
  }), [language]);

  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
  }
  return context;
}

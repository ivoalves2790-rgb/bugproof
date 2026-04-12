"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import en from "./translations/en.json";
import es from "./translations/es.json";

export type Locale = "en" | "es";

const translations: Record<Locale, Record<string, string>> = { en, es };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("bugproof:language") as Locale) || "en";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("bugproof:language", newLocale);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = translations[locale]?.[key] || translations.en[key] || key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const { t } = useContext(LanguageContext);
  return t;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

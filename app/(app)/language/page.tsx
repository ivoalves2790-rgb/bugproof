"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Locale } from "@/lib/i18n/use-language";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Español", flag: "ES" },
];

export default function LanguagePage() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();

  function handleSelect(code: Locale) {
    setLocale(code);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("language.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("language.subtitle")}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              locale === lang.code
                ? "border-terminal-green bg-terminal-green/5"
                : "border-border bg-surface hover:border-terminal-green/50 hover:bg-surface-2"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-terminal-green text-sm font-bold text-terminal-green">
              {lang.flag}
            </span>
            <span className="text-sm font-medium">{lang.label}</span>
            {locale === lang.code && (
              <span className="ml-auto text-terminal-green">&#10003;</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

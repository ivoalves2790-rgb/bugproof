"use client";

import { useT } from "@/lib/i18n/use-language";

export function SkipToContent() {
  const t = useT();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-terminal-green focus:px-4 focus:py-2 focus:text-background focus:text-sm"
    >
      {t("common.skipToContent")}
    </a>
  );
}

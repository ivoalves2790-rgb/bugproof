"use client";

import { useT } from "@/lib/i18n/use-language";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  return (
    <div className="mx-auto max-w-lg p-6 text-center" role="alert">
      <h2 className="text-xl font-bold text-terminal-red">{t("common.somethingWrong")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("common.unexpectedError")}
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-terminal-green px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        {t("common.tryAgain")}
      </button>
    </div>
  );
}

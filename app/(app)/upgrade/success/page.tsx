"use client";

import { useEffect, useState } from "react";
import { usePremium } from "@/lib/hooks/use-premium";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/use-language";

export default function UpgradeSuccessPage() {
  const t = useT();
  const { isPremium, refresh } = usePremium();
  const router = useRouter();
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (isPremium) {
      setPolling(false);
      return;
    }

    // Poll for premium status (webhook may take a moment)
    const interval = setInterval(async () => {
      await refresh();
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPremium, refresh]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      {isPremium ? (
        <>
          <div className="mb-4 text-5xl text-terminal-green glow-green">
            {"++"}
          </div>
          <h1 className="text-xl font-bold">{t("upgrade.success.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("upgrade.success.desc")}
          </p>
          <Button className="mt-8" onClick={() => router.push("/dashboard")}>
            {t("upgrade.success.start")}
          </Button>
        </>
      ) : polling ? (
        <>
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-terminal-green border-t-transparent" />
          <h1 className="text-xl font-bold">{t("upgrade.success.activating")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("upgrade.success.activatingDesc")}
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">{t("upgrade.success.received")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("upgrade.success.receivedDesc")}
          </p>
          <Button className="mt-8" onClick={() => refresh()}>
            {t("upgrade.success.checkAgain")}
          </Button>
        </>
      )}
    </div>
  );
}

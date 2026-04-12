"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePremium } from "@/lib/hooks/use-premium";
import Link from "next/link";
import { useT } from "@/lib/i18n/use-language";

export default function UpgradePage() {
  const t = useT();
  const { isPremium } = usePremium();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  if (isPremium) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-5xl text-terminal-green">&#10003;</div>
        <h1 className="text-xl font-bold">{t("upgrade.alreadyPremium")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("upgrade.alreadyPremiumDesc")}
        </p>
        <Link href="/settings" className="mt-6 text-sm text-terminal-green hover:underline">
          {t("upgrade.backToSettings")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("upgrade.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("upgrade.subtitle")}
        </p>
      </div>

      <Card variant="glow" className="mx-auto max-w-sm">
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold text-terminal-green">{t("upgrade.price")}</div>
          <p className="text-xs text-muted-foreground">{t("upgrade.oneTime")}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-terminal-green">&#10003;</span>
            <span className="text-sm">{t("upgrade.noAds")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-terminal-green">&#10003;</span>
            <span className="text-sm">{t("upgrade.offlineAccess")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-terminal-green">&#10003;</span>
            <span className="text-sm">{t("upgrade.installApp")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-terminal-green">&#10003;</span>
            <span className="text-sm">{t("upgrade.supportIndie")}</span>
          </div>
        </div>

        <Button
          className="mt-8 w-full"
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? t("upgrade.redirecting") : t("upgrade.upgradeNow")}
        </Button>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/settings" className="text-xs text-muted-foreground hover:text-terminal-green">
          &larr; {t("upgrade.backToSettings")}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { usePremium } from "@/lib/hooks/use-premium";
import { useT, useLanguage } from "@/lib/i18n/use-language";
import type { Locale } from "@/lib/i18n/use-language";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { isPremium } = usePremium();
  const t = useT();
  const { locale, setLocale } = useLanguage();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("settings.title")}
        </h1>
      </div>

      <div className="space-y-4">
        {/* Premium status */}
        {isPremium ? (
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-terminal-green">&#10003;</span>
              <div>
                <h3 className="font-semibold text-terminal-green">{t("settings.premiumActive")}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("settings.premiumDesc")}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Link href="/upgrade" className="block">
            <Card variant="glow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t("settings.goPremium")}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("settings.premiumPitch")}
                  </p>
                </div>
                <span className="text-sm font-bold text-terminal-green">
                  {t("settings.upgrade")} &rarr;
                </span>
              </div>
            </Card>
          </Link>
        )}

        {/* Language */}
        <Card>
          <h3 className="font-semibold">{t("settings.language")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.languageDesc")}
          </p>
          <div className="mt-3 flex gap-2">
            {(["en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  locale === code
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : "border-border bg-surface hover:border-terminal-green/50"
                }`}
              >
                {code === "en" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">{t("settings.account")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.accountDesc")}
          </p>
          <div className="mt-4">
            <Button variant="danger" onClick={handleSignOut}>
              {t("settings.signOut")}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">{t("settings.appInfo")}</h3>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="text-terminal-amber">{t("settings.version")}:</span> 1.0.0
            </p>
            <p>
              <span className="text-terminal-amber">{t("settings.build")}:</span> Next.js PWA
            </p>
            <p>
              <span className="text-terminal-amber">{t("settings.offline")}:</span>{" "}
              {isPremium ? t("settings.offlineEnabled") : t("settings.offlinePremium")}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">{t("settings.installApp")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.installDesc")}
            {!isPremium && t("settings.installPremiumNote")}
          </p>
          <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{t("settings.howToInstall")}</p>
            <ul className="mt-1 space-y-1">
              <li>
                <span className="text-terminal-green">iOS:</span> Tap the share
                button, then &quot;Add to Home Screen&quot;
              </li>
              <li>
                <span className="text-terminal-green">Android:</span> Tap the
                menu, then &quot;Install app&quot;
              </li>
              <li>
                <span className="text-terminal-green">Desktop:</span> Click the
                install icon in the address bar
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

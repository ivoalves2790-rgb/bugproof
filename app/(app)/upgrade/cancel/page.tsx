"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/use-language";

export default function UpgradeCancelPage() {
  const t = useT();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 text-4xl text-muted-foreground">{"{ }"}</div>
      <h1 className="text-xl font-bold">{t("upgrade.cancel.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("upgrade.cancel.desc")}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard">
          <Button>{t("upgrade.cancel.back")}</Button>
        </Link>
        <Link href="/upgrade">
          <Button variant="secondary">{t("upgrade.cancel.viewPlans")}</Button>
        </Link>
      </div>
    </div>
  );
}

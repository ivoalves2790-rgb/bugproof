"use client";

import { useProgressStats } from "@/lib/progress/use-progress";
import { useT } from "@/lib/i18n/use-language";

export function DashboardStats() {
  const { totalCompleted, totalXP } = useProgressStats();
  const streak = Math.min(totalCompleted, 7);
  const t = useT();

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="text-2xl font-bold text-xp-gold">{totalXP}</div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.totalXP")}</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="text-2xl font-bold text-streak-orange">{streak}</div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.dayStreak")}</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="text-2xl font-bold text-terminal-green">{totalCompleted}</div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.completed")}</div>
      </div>
    </div>
  );
}

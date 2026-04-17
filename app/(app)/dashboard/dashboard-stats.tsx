"use client";

import { useProgressStats } from "@/lib/progress/use-progress";
import { useT } from "@/lib/i18n/use-language";
import { NumberTicker } from "@/components/motion/NumberTicker";

export function DashboardStats() {
  const { totalCompleted, totalXP } = useProgressStats();
  const streak = Math.min(totalCompleted, 7);
  const t = useT();

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="text-2xl font-bold text-xp-gold tabular-nums">
          <NumberTicker value={totalXP} duration={1.1} />
        </div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.totalXP")}</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-streak-orange tabular-nums">
          <span className="flame-flicker" aria-hidden>🔥</span>
          <NumberTicker value={streak} duration={0.7} />
        </div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.dayStreak")}</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-3 text-center">
        <div className="text-2xl font-bold text-terminal-green tabular-nums">
          <NumberTicker value={totalCompleted} duration={0.9} />
        </div>
        <div className="text-[10px] text-muted-foreground">{t("dashboard.completed")}</div>
      </div>
    </div>
  );
}

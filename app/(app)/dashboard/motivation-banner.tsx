"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, DASHBOARD_MESSAGES, STREAK_MESSAGES } from "@/lib/motivation/messages";
import { useProgressStats } from "@/lib/progress/use-progress";

export function MotivationBanner() {
  const { locale } = useLanguage();
  const { totalCompleted } = useProgressStats();
  const streak = Math.min(totalCompleted, 7);

  const [message] = useState(() => {
    if (streak >= 2) {
      return getRandomMessage(STREAK_MESSAGES, locale, { streak });
    }
    return getRandomMessage(DASHBOARD_MESSAGES, locale);
  });

  return (
    <div className="mb-4 rounded-lg border border-terminal-red/30 bg-terminal-red/10 px-4 py-3">
      <p className="text-xs font-semibold text-terminal-red leading-relaxed">
        {message}
      </p>
    </div>
  );
}

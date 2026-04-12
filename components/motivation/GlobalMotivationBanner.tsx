"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, DASHBOARD_MESSAGES, COURSE_PAGE_MESSAGES, TEACHING_MESSAGES, EXERCISE_START_MESSAGES } from "@/lib/motivation/messages";

const ALL_MESSAGES = [
  ...DASHBOARD_MESSAGES,
  ...COURSE_PAGE_MESSAGES,
  ...TEACHING_MESSAGES,
  ...EXERCISE_START_MESSAGES,
];

export function GlobalMotivationBanner() {
  const { locale } = useLanguage();
  const [message] = useState(() => getRandomMessage(ALL_MESSAGES, locale));

  return (
    <div className="mb-4 rounded-lg border border-terminal-red/30 bg-terminal-red/10 px-4 py-3">
      <p className="text-xs font-semibold text-terminal-red leading-relaxed">
        {message}
      </p>
    </div>
  );
}

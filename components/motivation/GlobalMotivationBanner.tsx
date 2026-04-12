"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, DASHBOARD_MESSAGES, COURSE_PAGE_MESSAGES, TEACHING_MESSAGES, EXERCISE_START_MESSAGES, UNIT_PAGE_MESSAGES } from "@/lib/motivation/messages";

const ALL_MESSAGES = [
  ...DASHBOARD_MESSAGES,
  ...COURSE_PAGE_MESSAGES,
  ...TEACHING_MESSAGES,
  ...EXERCISE_START_MESSAGES,
  ...UNIT_PAGE_MESSAGES,
];

export function GlobalMotivationBanner() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [message, setMessage] = useState(() => getRandomMessage(ALL_MESSAGES, locale));

  // Change message on every page navigation
  useEffect(() => {
    setMessage(getRandomMessage(ALL_MESSAGES, locale));
  }, [pathname, locale]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-4 rounded-lg border border-terminal-red/40 bg-terminal-red/10 px-4 py-3 shadow-[0_0_12px_rgba(255,70,70,0.15)] animate-[pulse-glow_3s_ease-in-out_infinite]"
      >
        <p className="text-xs font-bold text-terminal-red leading-relaxed tracking-wide">
          {message}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

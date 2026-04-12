"use client";

import { useState, useEffect } from "react";
import { IconHeart, IconFlame, IconStar } from "@/components/ui/Icons";

interface TopBarProps {
  hearts: number;
  streak: number;
  xp: number;
}

export function TopBar({ hearts: defaultHearts, streak: defaultStreak, xp: defaultXP }: TopBarProps) {
  const [hearts, setHearts] = useState(defaultHearts);
  const [streak, setStreak] = useState(defaultStreak);
  const [xp, setXP] = useState(defaultXP);

  useEffect(() => {
    const savedXP = parseInt(localStorage.getItem("bugproof:totalXP") || "0", 10);
    if (savedXP > 0) setXP(savedXP);

    // Count total completed lessons for streak estimation
    let totalCompleted = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("progress:")) {
        const completed: string[] = JSON.parse(localStorage.getItem(key) || "[]");
        totalCompleted += completed.length;
      }
    }
    if (totalCompleted > 0) {
      setStreak(Math.min(totalCompleted, 7)); // Rough streak based on activity
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-surface px-4 md:pl-60">
      {/* Mobile logo - only shown on mobile */}
      <div className="flex items-center gap-1 md:hidden">
        <span className="text-lg font-bold text-terminal-green glow-green">{">"}</span>
        <span className="font-bold">bug</span>
        <span className="font-bold text-terminal-green">proof</span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5">
          <IconFlame size={18} className={streak > 0 ? "text-streak-orange" : "text-muted"} />
          <span className="text-sm font-semibold tabular-nums">
            {streak}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5">
          <IconHeart size={18} className={hearts > 0 ? "text-heart-red" : "text-muted"} />
          <span className="text-sm font-semibold tabular-nums">
            {hearts}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5">
          <IconStar size={18} className="text-xp-gold" />
          <span className="text-sm font-semibold tabular-nums">
            {xp}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { IconHeart, IconFlame, IconStar } from "@/components/ui/Icons";
import { APP_VERSION } from "@/lib/version";

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
    // Fetch real stats from the API instead of scanning localStorage
    async function fetchStats() {
      try {
        const [heartsRes] = await Promise.all([
          fetch("/api/hearts"),
        ]);
        if (heartsRes.ok) {
          const heartsData = await heartsRes.json();
          setHearts(heartsData.hearts ?? defaultHearts);
        }
      } catch {
        // Silently use defaults on failure
      }

      // Read cached XP and streak from localStorage (single key, not scan)
      const savedXP = parseInt(localStorage.getItem("bugproof:totalXP") || "0", 10);
      if (savedXP > 0) setXP(savedXP);

      const savedStreak = parseInt(localStorage.getItem("bugproof:streak") || "0", 10);
      if (savedStreak > 0) setStreak(savedStreak);
    }

    fetchStats();
  }, [defaultHearts]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-surface px-4 md:pl-60" role="banner">
      {/* Mobile logo - only shown on mobile */}
      <div className="flex items-baseline gap-2 md:hidden">
        <img src="/icons/icon-192.svg" alt="Bugproof" width={24} height={24} className="rounded self-center" />
        <span className="font-bold">bug<span className="text-terminal-green">proof</span></span>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums" aria-label="App version">
          {APP_VERSION}
        </span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Stats */}
      <nav className="flex items-center gap-4" aria-label="User stats">
        {/* Streak */}
        <div className="flex items-center gap-1.5" aria-label={`${streak} day streak`}>
          <IconFlame size={18} className={streak > 0 ? "text-streak-orange" : "text-muted"} />
          <span className="text-sm font-semibold tabular-nums">
            {streak}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5" aria-label={`${hearts} hearts remaining`}>
          <IconHeart size={18} className={hearts > 0 ? "text-heart-red" : "text-muted"} />
          <span className="text-sm font-semibold tabular-nums">
            {hearts}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5" aria-label={`${xp} experience points`}>
          <IconStar size={18} className="text-xp-gold" />
          <span className="text-sm font-semibold tabular-nums">
            {xp}
          </span>
        </div>
      </nav>
    </header>
  );
}

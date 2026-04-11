"use client";

import { IconHeart, IconFlame, IconStar } from "@/components/ui/Icons";

interface TopBarProps {
  hearts: number;
  streak: number;
  xp: number;
}

export function TopBar({ hearts, streak, xp }: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:pl-60">
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

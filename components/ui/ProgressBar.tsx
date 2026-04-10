"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "green" | "amber" | "red" | "gold" | "blue";
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const colorStyles = {
  green: "bg-terminal-green shadow-[0_0_8px_rgba(0,255,65,0.3)]",
  amber: "bg-terminal-amber shadow-[0_0_8px_rgba(255,176,0,0.3)]",
  red: "bg-terminal-red shadow-[0_0_8px_rgba(255,51,51,0.3)]",
  gold: "bg-xp-gold shadow-[0_0_8px_rgba(255,215,0,0.3)]",
  blue: "bg-terminal-blue shadow-[0_0_8px_rgba(77,166,255,0.3)]",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "green",
  showLabel = false,
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(percentage)}%</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-3",
          sizeStyles[size]
        )}
      >
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", colorStyles[color])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full", colorStyles[color])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

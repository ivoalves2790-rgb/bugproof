import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "green" | "amber" | "red" | "purple" | "blue";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-muted-foreground border-border",
  green: "bg-terminal-green/10 text-terminal-green border-terminal-green/30",
  amber: "bg-terminal-amber/10 text-terminal-amber border-terminal-amber/30",
  red: "bg-terminal-red/10 text-terminal-red border-terminal-red/30",
  purple: "bg-terminal-purple/10 text-terminal-purple border-terminal-purple/30",
  blue: "bg-terminal-blue/10 text-terminal-blue border-terminal-blue/30",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({ title, children, className }: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-green" />
        </div>
        {title && (
          <span className="ml-2 text-xs text-muted-foreground truncate">
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-0">{children}</div>
    </div>
  );
}

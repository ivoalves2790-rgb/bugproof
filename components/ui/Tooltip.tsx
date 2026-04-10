"use client";

import { cn } from "@/lib/utils/cn";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
}

export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow((s) => !s)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-foreground shadow-xl",
              "max-w-[280px] w-max",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

"use client";

import { cn } from "@/lib/utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-terminal-green text-background hover:bg-terminal-green-dim active:bg-terminal-green-dim/80 glow-green",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:border-terminal-green hover:text-terminal-green",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-surface-2",
  danger:
    "bg-terminal-red/10 text-terminal-red border border-terminal-red/30 hover:bg-terminal-red/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-mono font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

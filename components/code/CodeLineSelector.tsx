"use client";

import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalWindow } from "./TerminalWindow";
import { highlightLine } from "@/lib/utils/syntax-highlight";
import type { CodeLine } from "@/lib/types/content.types";

interface CodeLineSelectorProps {
  code: CodeLine[];
  language: string;
  title?: string;
  selectedLine: number | null;
  correctLine: number;
  revealed: boolean;
  onSelect: (line: number) => void;
  className?: string;
}

export function CodeLineSelector({
  code,
  language,
  title,
  selectedLine,
  correctLine,
  revealed,
  onSelect,
  className,
}: CodeLineSelectorProps) {
  const displayTitle = title || `main.${language}`;

  function getLineState(line: number) {
    if (revealed) {
      if (line === correctLine) return "correct";
      if (line === selectedLine && line !== correctLine) return "buggy";
      return "idle";
    }
    if (line === selectedLine) return "selected";
    return "idle";
  }

  return (
    <TerminalWindow title={displayTitle} className={className}>
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed">
          {code.map((codeLine) => {
            const state = getLineState(codeLine.line);

            return (
              <motion.div
                key={codeLine.line}
                onClick={() => !revealed && onSelect(codeLine.line)}
                className={cn(
                  "code-line -mx-4 flex cursor-pointer px-4 py-0.5",
                  "rounded-sm transition-colors",
                  state === "idle" && "border-l-2 border-transparent",
                  state === "selected" && "selected",
                  state === "correct" && "correct",
                  state === "buggy" && "buggy",
                  revealed && "cursor-default"
                )}
                whileHover={!revealed ? { backgroundColor: "rgba(0, 255, 65, 0.06)" } : {}}
                whileTap={!revealed ? { scale: 0.995 } : {}}
                layout
              >
                <span className="mr-4 inline-block w-6 select-none text-right text-muted">
                  {codeLine.line}
                </span>
                <code className="flex-1 whitespace-pre text-foreground">
                  {highlightLine(codeLine.text, language)}
                </code>

                {/* State indicators */}
                <AnimatePresence>
                  {state === "selected" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="ml-2 flex-shrink-0 text-terminal-green"
                    >
                      &larr;
                    </motion.span>
                  )}
                  {revealed && state === "correct" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 flex-shrink-0 text-terminal-green glow-green"
                    >
                      [BUG]
                    </motion.span>
                  )}
                  {revealed && state === "buggy" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 flex-shrink-0 text-terminal-red glow-red"
                    >
                      [WRONG]
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </pre>
      </div>
    </TerminalWindow>
  );
}

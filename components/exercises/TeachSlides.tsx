"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import type { TeachBlock } from "@/lib/types/content.types";
import { GlossaryHighlighter } from "@/components/glossary/GlossaryHighlighter";

interface TeachSlidesProps {
  blocks: TeachBlock[];
  onComplete: () => void;
}

export function TeachSlides({ blocks, onComplete }: TeachSlidesProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const block = blocks[current];
  const isLast = current === blocks.length - 1;
  const isFirst = current === 0;

  function goNext() {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  }

  function goBack() {
    if (!isFirst) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Progress dots */}
      <div className="mb-6 flex items-center justify-center gap-1.5">
        {blocks.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-terminal-green"
                : i < current
                  ? "w-1.5 bg-terminal-green/50"
                  : "w-1.5 bg-surface-3"
            )}
          />
        ))}
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="min-h-[200px]"
        >
          <TeachBlockRenderer block={block} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        {!isFirst && (
          <Button variant="ghost" size="sm" onClick={goBack}>
            <IconChevronLeft size={16} />
            Back
          </Button>
        )}
        <div className="flex-1" />
        <Button onClick={goNext} size="md">
          {isLast ? "Start Exercise" : "Next"}
          {!isLast && <IconChevronRight size={16} />}
        </Button>
      </div>

      {/* Skip link */}
      <button
        onClick={onComplete}
        className="mt-4 text-center text-xs text-muted hover:text-muted-foreground"
      >
        Skip to exercise →
      </button>
    </div>
  );
}

function TeachBlockRenderer({ block }: { block: TeachBlock }) {
  switch (block.type) {
    case "analogy":
      return (
        <div className="rounded-xl border border-terminal-amber/30 bg-terminal-amber/5 p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-terminal-amber">
            💡 Think of it this way
          </div>
          {block.title && (
            <h3 className="mb-2 text-lg font-bold">{block.title}</h3>
          )}
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={block.body} />
          </p>
        </div>
      );

    case "text":
      return (
        <div>
          {block.title && (
            <h3 className="mb-3 text-lg font-bold">{block.title}</h3>
          )}
          <div className="text-sm leading-relaxed text-muted-foreground">
            <RichText text={block.body} />
          </div>
        </div>
      );

    case "code_example":
      return (
        <div>
          {block.title && (
            <h3 className="mb-3 text-lg font-bold">{block.title}</h3>
          )}
          <div className="overflow-hidden rounded-lg border border-border bg-[#0c0c0c]">
            {/* Terminal chrome */}
            <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-terminal-red/60" />
              <div className="h-2 w-2 rounded-full bg-terminal-amber/60" />
              <div className="h-2 w-2 rounded-full bg-terminal-green/60" />
              {block.language && (
                <span className="ml-2 text-[10px] text-muted">
                  {block.language}
                </span>
              )}
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
              <code>{block.code}</code>
            </pre>
          </div>
          {block.annotation && (
            <p className="mt-2 text-xs text-muted-foreground italic">
              {block.annotation}
            </p>
          )}
        </div>
      );

    case "key_takeaway":
      return (
        <div className="rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-terminal-green">
            ✓ Key Takeaway
          </div>
          <p className="text-sm font-medium leading-relaxed text-terminal-green">
            <RichText text={block.body} />
          </p>
        </div>
      );
  }
}

/**
 * Simple rich text renderer — handles **bold**, `code`, and numbered lists.
 * No external markdown library needed.
 */
function RichText({ text }: { text: string }) {
  // Split by newlines first for list handling
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Numbered list item (e.g., "1. Stage — pick files")
        const listMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (listMatch) {
          return (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="flex-shrink-0 text-terminal-green font-bold">
                {listMatch[1]}.
              </span>
              <span>
                <InlineRich text={listMatch[2]} />
              </span>
            </div>
          );
        }

        // Bullet list item
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="flex-shrink-0 text-terminal-green">•</span>
              <span>
                <InlineRich text={trimmed.slice(2)} />
              </span>
            </div>
          );
        }

        // Regular line
        return (
          <span key={i}>
            <InlineRich text={line} />
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

/** Handles **bold** and `code` inline formatting */
function InlineRich({ text }: { text: string }) {
  // Split on **bold** and `code` patterns
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-surface-3 px-1 py-0.5 text-terminal-green text-xs"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <GlossaryHighlighter key={i} text={part} />;
      })}
    </>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import glossaryData from "@/content/glossary.json";
import { GlossaryModal } from "./GlossaryModal";

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

const glossary = glossaryData as GlossaryEntry[];

// Build a lookup map: lowercase term → entry
const termMap = new Map<string, GlossaryEntry>();
for (const entry of glossary) {
  termMap.set(entry.term.toLowerCase(), entry);
  // Also add without parenthetical: "Pull Request (PR)" → "pull request"
  const withoutParens = entry.term.replace(/\s*\(.*?\)\s*/g, "").trim();
  if (withoutParens !== entry.term) {
    termMap.set(withoutParens.toLowerCase(), entry);
  }
  // Add abbreviations: "XSS (Cross-Site Scripting)" → "xss"
  const abbrev = entry.term.match(/^(\w+)\s*\(/);
  if (abbrev) {
    termMap.set(abbrev[1].toLowerCase(), entry);
  }
}

// Sort terms by length (longest first) to match "merge conflict" before "merge"
const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

// Build regex that matches any glossary term (word-boundary aware)
const termRegex = new RegExp(
  `\\b(${sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

interface GlossaryHighlighterProps {
  text: string;
  className?: string;
}

export function GlossaryHighlighter({ text, className }: GlossaryHighlighterProps) {
  const [activeEntry, setActiveEntry] = useState<GlossaryEntry | null>(null);

  const handleOpenRelated = useCallback((termId: string) => {
    const entry = glossary.find((e) => e.id === termId);
    if (entry) setActiveEntry(entry);
  }, []);

  // Split text into segments: plain text and highlighted terms
  const segments = useMemo(() => {
    const result: { text: string; entry?: GlossaryEntry }[] = [];
    let lastIndex = 0;

    const matches = [...text.matchAll(termRegex)];
    const seen = new Set<string>(); // Only highlight first occurrence of each term

    for (const match of matches) {
      const matchText = match[0];
      const matchIndex = match.index!;
      const termLower = matchText.toLowerCase();

      if (seen.has(termLower)) continue;
      seen.add(termLower);

      const entry = termMap.get(termLower);
      if (!entry) continue;

      // Add preceding plain text
      if (matchIndex > lastIndex) {
        result.push({ text: text.slice(lastIndex, matchIndex) });
      }

      result.push({ text: matchText, entry });
      lastIndex = matchIndex + matchText.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex) });
    }

    // If no matches, return original text
    if (result.length === 0) {
      result.push({ text });
    }

    return result;
  }, [text]);

  return (
    <>
      <span className={className}>
        {segments.map((seg, i) =>
          seg.entry ? (
            <button
              key={i}
              onClick={() => setActiveEntry(seg.entry!)}
              className="text-terminal-green underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer"
            >
              {seg.text}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </span>

      <GlossaryModal
        entry={activeEntry}
        onClose={() => setActiveEntry(null)}
        onOpenRelated={handleOpenRelated}
      />
    </>
  );
}

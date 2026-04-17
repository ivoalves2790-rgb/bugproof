"use client";

import { TerminalWindow } from "./TerminalWindow";
import { highlightLine } from "@/lib/utils/syntax-highlight";
import type { CodeLine } from "@/lib/types/content.types";

interface CodeBlockProps {
  code: CodeLine[];
  language: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ code, language, title, className }: CodeBlockProps) {
  const displayTitle = title || `main.${language}`;

  return (
    <TerminalWindow title={displayTitle} className={className}>
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed">
          {code.map((codeLine) => (
            <div key={codeLine.line} className="flex">
              <span className="mr-4 inline-block w-6 select-none text-right text-muted">
                {codeLine.line}
              </span>
              <code className="flex-1 whitespace-pre text-foreground">
                {highlightLine(codeLine.text, language)}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </TerminalWindow>
  );
}

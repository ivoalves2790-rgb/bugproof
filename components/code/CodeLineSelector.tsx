"use client";

import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalWindow } from "./TerminalWindow";
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

// Same highlight logic as CodeBlock but simplified for this context
function highlightSimple(text: string, language: string): React.ReactNode[] {
  const jsKeywords =
    /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|finally|new|delete|typeof|instanceof|void|this|class|extends|import|export|default|from|async|await|yield|of|in|true|false|null|undefined|console|require)\b/g;
  const pythonKeywords =
    /\b(def|class|return|if|elif|else|for|while|try|except|finally|raise|import|from|as|with|yield|lambda|pass|break|continue|and|or|not|is|in|True|False|None|print|self|async|await)\b/g;
  const bashKeywords =
    /\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|chmod|chown|sudo|apt|yum|brew|npm|npx|git|docker|curl|wget|exit|export|source|if|then|else|fi|for|do|done|while|case|esac|function)\b/g;

  const map: Record<string, RegExp> = {
    js: jsKeywords,
    javascript: jsKeywords,
    typescript: jsKeywords,
    ts: jsKeywords,
    python: pythonKeywords,
    py: pythonKeywords,
    bash: bashKeywords,
    sh: bashKeywords,
  };

  const lang = language.toLowerCase();

  // Full-line comment check
  const isComment =
    (["js", "javascript", "typescript", "ts"].includes(lang) && /^\s*\/\//.test(text)) ||
    (["python", "py", "bash", "sh"].includes(lang) && /^\s*#/.test(text));

  if (isComment) {
    return [<span key={0} className="text-muted">{text}</span>];
  }

  const regex = map[lang];
  if (!regex) return [<span key={0}>{text}</span>];

  const tokens: React.ReactNode[] = [];
  const re = new RegExp(regex.source, "g");
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;

  // Highlight strings
  const stringParts: { start: number; end: number }[] = [];
  const strRe = /(["'`])(?:(?!\1|\\).|\\.)*?\1/g;
  let sm: RegExpExecArray | null;
  while ((sm = strRe.exec(text)) !== null) {
    stringParts.push({ start: sm.index, end: sm.index + sm[0].length });
  }

  function isInString(idx: number): boolean {
    return stringParts.some((sp) => idx >= sp.start && idx < sp.end);
  }

  // Process strings first, then keywords in non-string sections
  let cursor = 0;
  for (const sp of stringParts) {
    if (sp.start > cursor) {
      const seg = text.slice(cursor, sp.start);
      tokens.push(...keywordHighlight(seg, re, k));
      k += seg.length;
    }
    tokens.push(
      <span key={`s-${k++}`} className="text-terminal-amber">
        {text.slice(sp.start, sp.end)}
      </span>
    );
    cursor = sp.end;
  }
  if (cursor < text.length) {
    const seg = text.slice(cursor);
    tokens.push(...keywordHighlight(seg, re, k));
  }

  return tokens;
}

function keywordHighlight(text: string, baseRegex: RegExp, startKey: number): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const re = new RegExp(baseRegex.source, "g");
  let last = 0;
  let k = startKey;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      tokens.push(<span key={`p-${k++}`}>{text.slice(last, m.index)}</span>);
    }
    tokens.push(
      <span key={`kw-${k++}`} className="text-terminal-green">
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    tokens.push(<span key={`p-${k++}`}>{text.slice(last)}</span>);
  }
  return tokens;
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
                  {highlightSimple(codeLine.text, language)}
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

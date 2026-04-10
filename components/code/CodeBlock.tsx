"use client";

import { cn } from "@/lib/utils/cn";
import { TerminalWindow } from "./TerminalWindow";
import type { CodeLine } from "@/lib/types/content.types";

interface CodeBlockProps {
  code: CodeLine[];
  language: string;
  title?: string;
  className?: string;
}

// Simple regex-based syntax highlighting for common languages
function highlightLine(text: string, language: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const jsKeywords =
    /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|finally|new|delete|typeof|instanceof|void|this|class|extends|import|export|default|from|async|await|yield|of|in|true|false|null|undefined|console|require)\b/g;

  const pythonKeywords =
    /\b(def|class|return|if|elif|else|for|while|try|except|finally|raise|import|from|as|with|yield|lambda|pass|break|continue|and|or|not|is|in|True|False|None|print|self|async|await)\b/g;

  const bashKeywords =
    /\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|chmod|chown|sudo|apt|yum|brew|npm|npx|git|docker|curl|wget|exit|export|source|if|then|else|fi|for|do|done|while|case|esac|function)\b/g;

  const keywordMap: Record<string, RegExp> = {
    js: jsKeywords,
    javascript: jsKeywords,
    typescript: jsKeywords,
    ts: jsKeywords,
    jsx: jsKeywords,
    tsx: jsKeywords,
    python: pythonKeywords,
    py: pythonKeywords,
    bash: bashKeywords,
    sh: bashKeywords,
    shell: bashKeywords,
    zsh: bashKeywords,
  };

  const lang = language.toLowerCase();

  // Check for full-line comment first
  const commentPatterns: Record<string, RegExp> = {
    js: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    javascript: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    typescript: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    ts: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    jsx: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    tsx: /^\s*(\/\/.*|\/\*.*\*\/)$/,
    python: /^\s*#.*/,
    py: /^\s*#.*/,
    bash: /^\s*#.*/,
    sh: /^\s*#.*/,
    shell: /^\s*#.*/,
    zsh: /^\s*#.*/,
  };

  const commentPattern = commentPatterns[lang];
  if (commentPattern && commentPattern.test(remaining)) {
    return [
      <span key={0} className="text-muted">
        {remaining}
      </span>,
    ];
  }

  // Inline comment detection
  const inlineCommentIndex = findInlineCommentStart(remaining, lang);

  let mainPart = remaining;
  let commentPart = "";
  if (inlineCommentIndex >= 0) {
    mainPart = remaining.slice(0, inlineCommentIndex);
    commentPart = remaining.slice(inlineCommentIndex);
  }

  // Tokenize the main part
  const keywordRegex = keywordMap[lang];

  if (keywordRegex) {
    // Build a combined regex: strings, keywords, and rest
    const combinedPattern =
      /(["'`])(?:(?!\1|\\).|\\.)*?\1/g;

    let lastIndex = 0;
    const parts: { start: number; end: number; type: "string" }[] = [];

    // Find strings first
    let match: RegExpExecArray | null;
    const stringRegex = new RegExp(combinedPattern.source, "g");
    while ((match = stringRegex.exec(mainPart)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: "string" });
    }

    // Now process the text segment by segment
    lastIndex = 0;
    for (const part of parts) {
      // Process text before this string
      if (part.start > lastIndex) {
        const segment = mainPart.slice(lastIndex, part.start);
        tokens.push(...highlightKeywords(segment, keywordRegex, key));
        key += segment.length;
      }
      // Add the string
      tokens.push(
        <span key={`str-${key}`} className="text-terminal-amber">
          {mainPart.slice(part.start, part.end)}
        </span>
      );
      key++;
      lastIndex = part.end;
    }

    // Process remaining text after last string
    if (lastIndex < mainPart.length) {
      const segment = mainPart.slice(lastIndex);
      tokens.push(...highlightKeywords(segment, keywordRegex, key));
      key += segment.length;
    }
  } else {
    tokens.push(
      <span key={key++}>{mainPart}</span>
    );
  }

  // Add inline comment
  if (commentPart) {
    tokens.push(
      <span key={`comment-${key}`} className="text-muted">
        {commentPart}
      </span>
    );
  }

  return tokens;
}

function highlightKeywords(
  text: string,
  keywordRegex: RegExp,
  startKey: number
): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;

  // Reset regex state
  const regex = new RegExp(keywordRegex.source, "g");
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }
    tokens.push(
      <span key={`kw-${key++}`} className="text-terminal-green">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push(
      <span key={`t-${key++}`}>{text.slice(lastIndex)}</span>
    );
  }

  return tokens;
}

function findInlineCommentStart(text: string, lang: string): number {
  const jsLangs = ["js", "javascript", "typescript", "ts", "jsx", "tsx"];
  const hashLangs = ["python", "py", "bash", "sh", "shell", "zsh"];

  let inString = false;
  let stringChar = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (ch === "\\" && i + 1 < text.length) {
        i++; // skip escaped character
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (jsLangs.includes(lang) && ch === "/" && text[i + 1] === "/") {
      return i;
    }
    if (hashLangs.includes(lang) && ch === "#") {
      return i;
    }
  }

  return -1;
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

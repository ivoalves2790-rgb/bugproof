import React from "react";

const JS_KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|finally|new|delete|typeof|instanceof|void|this|class|extends|import|export|default|from|async|await|yield|of|in|true|false|null|undefined|console|require)\b/g;

const PYTHON_KEYWORDS =
  /\b(def|class|return|if|elif|else|for|while|try|except|finally|raise|import|from|as|with|yield|lambda|pass|break|continue|and|or|not|is|in|True|False|None|print|self|async|await)\b/g;

const BASH_KEYWORDS =
  /\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|chmod|chown|sudo|apt|yum|brew|npm|npx|git|docker|curl|wget|exit|export|source|if|then|else|fi|for|do|done|while|case|esac|function)\b/g;

const KEYWORD_MAP: Record<string, RegExp> = {
  js: JS_KEYWORDS,
  javascript: JS_KEYWORDS,
  typescript: JS_KEYWORDS,
  ts: JS_KEYWORDS,
  jsx: JS_KEYWORDS,
  tsx: JS_KEYWORDS,
  python: PYTHON_KEYWORDS,
  py: PYTHON_KEYWORDS,
  bash: BASH_KEYWORDS,
  sh: BASH_KEYWORDS,
  shell: BASH_KEYWORDS,
  zsh: BASH_KEYWORDS,
};

const JS_LANGS = ["js", "javascript", "typescript", "ts", "jsx", "tsx"];
const HASH_LANGS = ["python", "py", "bash", "sh", "shell", "zsh"];

function isFullLineComment(text: string, lang: string): boolean {
  if (JS_LANGS.includes(lang) && /^\s*(\/\/.*|\/\*.*\*\/)$/.test(text)) return true;
  if (HASH_LANGS.includes(lang) && /^\s*#/.test(text)) return true;
  return false;
}

function findInlineCommentStart(text: string, lang: string): number {
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (ch === "\\" && i + 1 < text.length) {
        i++;
        continue;
      }
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (JS_LANGS.includes(lang) && ch === "/" && text[i + 1] === "/") return i;
    if (HASH_LANGS.includes(lang) && ch === "#") return i;
  }

  return -1;
}

function highlightKeywordsInSegment(
  text: string,
  keywordRegex: RegExp,
  startKey: number
): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const re = new RegExp(keywordRegex.source, "g");
  let last = 0;
  let k = startKey;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      tokens.push(React.createElement("span", { key: `t-${k++}` }, text.slice(last, m.index)));
    }
    tokens.push(
      React.createElement("span", { key: `kw-${k++}`, className: "text-terminal-green" }, m[0])
    );
    last = m.index + m[0].length;
  }

  if (last < text.length) {
    tokens.push(React.createElement("span", { key: `t-${k++}` }, text.slice(last)));
  }

  return tokens;
}

/**
 * Shared syntax highlighting function used by both CodeBlock and CodeLineSelector.
 */
export function highlightLine(text: string, language: string): React.ReactNode[] {
  const lang = language.toLowerCase();

  // Full-line comment
  if (isFullLineComment(text, lang)) {
    return [React.createElement("span", { key: 0, className: "text-muted" }, text)];
  }

  // Split inline comment
  const inlineCommentIndex = findInlineCommentStart(text, lang);
  let mainPart = text;
  let commentPart = "";
  if (inlineCommentIndex >= 0) {
    mainPart = text.slice(0, inlineCommentIndex);
    commentPart = text.slice(inlineCommentIndex);
  }

  const tokens: React.ReactNode[] = [];
  let key = 0;
  const keywordRegex = KEYWORD_MAP[lang];

  if (keywordRegex) {
    // Find strings
    const stringParts: { start: number; end: number }[] = [];
    const strRe = /(["'`])(?:(?!\1|\\).|\\.)*?\1/g;
    let sm: RegExpExecArray | null;
    while ((sm = strRe.exec(mainPart)) !== null) {
      stringParts.push({ start: sm.index, end: sm.index + sm[0].length });
    }

    let cursor = 0;
    for (const sp of stringParts) {
      if (sp.start > cursor) {
        const seg = mainPart.slice(cursor, sp.start);
        tokens.push(...highlightKeywordsInSegment(seg, keywordRegex, key));
        key += seg.length;
      }
      tokens.push(
        React.createElement(
          "span",
          { key: `str-${key}`, className: "text-terminal-amber" },
          mainPart.slice(sp.start, sp.end)
        )
      );
      key++;
      cursor = sp.end;
    }

    if (cursor < mainPart.length) {
      const seg = mainPart.slice(cursor);
      tokens.push(...highlightKeywordsInSegment(seg, keywordRegex, key));
      key += seg.length;
    }
  } else {
    tokens.push(React.createElement("span", { key: key++ }, mainPart));
  }

  if (commentPart) {
    tokens.push(
      React.createElement("span", { key: `comment-${key}`, className: "text-muted" }, commentPart)
    );
  }

  return tokens;
}

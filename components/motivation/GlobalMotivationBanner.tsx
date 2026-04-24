"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, DASHBOARD_MESSAGES, COURSE_PAGE_MESSAGES, TEACHING_MESSAGES, EXERCISE_START_MESSAGES, UNIT_PAGE_MESSAGES } from "@/lib/motivation/messages";

const ALL_MESSAGES = [
  ...DASHBOARD_MESSAGES,
  ...COURSE_PAGE_MESSAGES,
  ...TEACHING_MESSAGES,
  ...EXERCISE_START_MESSAGES,
  ...UNIT_PAGE_MESSAGES,
];

type AnimStyle = "typewriter" | "glitch" | "matrix" | "scanline";
const ANIM_STYLES: AnimStyle[] = ["typewriter", "glitch", "matrix", "scanline"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function GlobalMotivationBanner() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [animStyle, setAnimStyle] = useState<AnimStyle>("typewriter");
  const [key, setKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    setMessage(getRandomMessage(ALL_MESSAGES, locale));
    setAnimStyle(pickRandom(ANIM_STYLES));
    setKey((k) => k + 1);
  }, [pathname, locale]);

  // Reserve layout space on SSR/first paint, then fill after mount to avoid
  // a hydration mismatch from random message/style selection.
  return (
    <div className="mb-4 rounded-lg border border-terminal-red/40 bg-terminal-red/10 px-4 py-3 overflow-hidden relative min-h-[2.25rem]">
      {mounted && (
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {animStyle === "typewriter" && <TypewriterText text={message} />}
            {animStyle === "glitch" && <GlitchText text={message} />}
            {animStyle === "matrix" && <MatrixText text={message} />}
            {animStyle === "scanline" && <ScanlineText text={message} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

/** Typewriter — types out char by char with blinking cursor */
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <p className="text-xs font-bold text-terminal-red leading-relaxed tracking-wide font-mono">
      {displayed}
      <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>_</span>
    </p>
  );
}

/** Glitch — brief CRT flicker then settles */
function GlitchText({ text }: { text: string }) {
  const [phase, setPhase] = useState<"glitch" | "settle">("glitch");

  useEffect(() => {
    setPhase("glitch");
    const t = setTimeout(() => setPhase("settle"), 400);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <p
      className={`text-xs font-bold text-terminal-red leading-relaxed tracking-wide ${
        phase === "glitch" ? "animate-[glitch-text_0.1s_steps(2)_4]" : ""
      }`}
    >
      {text}
    </p>
  );
}

/** Matrix — characters randomly reveal one by one */
function MatrixText({ text }: { text: string }) {
  const indices = useMemo(() => {
    const arr = Array.from({ length: text.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [text]);

  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    setRevealedSet(new Set());
    let step = 0;
    const batchSize = Math.max(1, Math.ceil(text.length / 20));
    const interval = setInterval(() => {
      step++;
      const count = Math.min(step * batchSize, indices.length);
      setRevealedSet(new Set(indices.slice(0, count)));
      if (count >= indices.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text, indices]);

  return (
    <p className="text-xs font-bold leading-relaxed tracking-wide font-mono">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={revealedSet.has(i) ? "text-terminal-red" : "text-terminal-red/10"}
          style={{ transition: "color 0.15s ease" }}
        >
          {char}
        </span>
      ))}
    </p>
  );
}

/** Scanline — green line sweeps down revealing text */
function ScanlineText({ text }: { text: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let frame: number;
    const start = performance.now();
    const duration = 600;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <div className="relative">
      <p className="text-xs font-bold text-terminal-red leading-relaxed tracking-wide"
        style={{
          clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
        }}
      >
        {text}
      </p>
      {progress < 1 && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-terminal-green shadow-[0_0_8px_rgba(0,255,100,0.8)]"
          style={{ left: `${progress * 100}%` }}
        />
      )}
    </div>
  );
}

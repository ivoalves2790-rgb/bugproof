"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onDone?: () => void;
}

export function Typewriter({
  text,
  speed = 24,
  delay = 0,
  className,
  showCursor = false,
  onDone,
}: TypewriterProps) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : "");
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setOut(text);
      setDone(true);
      onDone?.();
      return;
    }
    setOut("");
    setDone(false);
    let i = 0;
    let tid: ReturnType<typeof setTimeout>;
    const start = () => {
      const tick = () => {
        i += 1;
        setOut(text.slice(0, i));
        if (i < text.length) {
          tid = setTimeout(tick, speed);
        } else {
          setDone(true);
          onDone?.();
        }
      };
      tid = setTimeout(tick, speed);
    };
    const startId = setTimeout(start, delay);
    return () => {
      clearTimeout(startId);
      clearTimeout(tid);
    };
    // onDone is intentionally excluded — callers pass inline fns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, delay, reduce]);

  return (
    <span className={className}>
      {out}
      {showCursor && !done && <span className="cursor-blink">_</span>}
    </span>
  );
}

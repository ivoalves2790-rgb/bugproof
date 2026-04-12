"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/code/CodeBlock";
import { evaluateSwipeCard, type SwipeCardResult } from "@/lib/engine/exercise-evaluator";
import type { SwipeToJudgeExercise, SwipeCard } from "@/lib/types/content.types";
import { useT } from "@/lib/i18n/use-language";
import { GlossaryHighlighter } from "@/components/glossary/GlossaryHighlighter";

interface SwipeToJudgeProps {
  exercise: SwipeToJudgeExercise;
  onComplete: (result: { score: number; total: number }) => void;
}

type CardState = "idle" | "swiping" | "feedback";

interface CardFeedback {
  result: SwipeCardResult;
  swipedRight: boolean;
}

const SWIPE_THRESHOLD = 80;

export function SwipeToJudge({ exercise, onComplete }: SwipeToJudgeProps) {
  const t = useT();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("idle");
  const [feedback, setFeedback] = useState<CardFeedback | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const cards = exercise.cards;
  const currentCard = cards[currentIndex] as SwipeCard | undefined;

  function handleJudge(swipeRight: boolean) {
    if (!currentCard || cardState !== "idle") return;

    const result = evaluateSwipeCard(swipeRight, currentCard);
    const newScore = score + (result.correct ? 1 : 0);

    setFeedback({ result, swipedRight: swipeRight });
    setScore(newScore);
    setCardState("feedback");
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) {
      setCompleted(true);
      onComplete({ score: score, total: cards.length });
      return;
    }

    setCurrentIndex(nextIndex);
    setFeedback(null);
    setCardState("idle");
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-8"
      >
        <div className="text-center">
          <p className="text-4xl font-bold text-terminal-green glow-green">
            {score}/{cards.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {score === cards.length
              ? t("swipe.perfect")
              : score >= cards.length * 0.7
                ? t("swipe.good")
                : t("swipe.tryAgain")}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {t("swipe.card")} {currentIndex + 1} {t("swipe.of")} {cards.length}
        </span>
        <span>
          {t("swipe.score")}: <span className="text-terminal-green">{score}</span>
        </span>
      </div>

      {/* Card stack area */}
      <div className="relative min-h-[280px]">
        {/* Background card peek */}
        {currentIndex + 1 < cards.length && (
          <div className="absolute inset-x-2 top-2 rounded-xl border border-border bg-surface-2 p-4 opacity-40">
            <div className="h-4 w-3/4 rounded bg-surface-3" />
            <div className="mt-2 h-3 w-1/2 rounded bg-surface-3" />
          </div>
        )}

        {/* Current card */}
        <AnimatePresence mode="wait">
          {currentCard && cardState !== "feedback" && (
            <SwipeableCard
              key={currentCard.id}
              card={currentCard}
              onSwipe={handleJudge}
            />
          )}

          {/* Feedback overlay */}
          {cardState === "feedback" && feedback && currentCard && (
            <motion.div
              key={`feedback-${currentCard.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {/* Card content (static) */}
              <div
                className={cn(
                  "rounded-xl border p-4",
                  feedback.result.correct
                    ? "border-terminal-green/30 bg-terminal-green/5"
                    : "border-terminal-red/30 bg-terminal-red/5"
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      feedback.result.correct
                        ? "text-terminal-green glow-green"
                        : "text-terminal-red glow-red"
                    )}
                  >
                    {feedback.result.correct ? "CORRECT" : "WRONG"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {feedback.swipedRight ? "(You said: good)" : "(You said: bad)"}
                  </span>
                </div>

                <p className="text-sm text-foreground">{currentCard.content}</p>

                {currentCard.codeExample && (
                  <div className="mt-3">
                    <CodeBlock
                      code={currentCard.codeExample.split("\n").map((text, i) => ({
                        line: i + 1,
                        text,
                        isBuggy: false,
                      }))}
                      language={currentCard.codeLanguage || "js"}
                    />
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="mb-1 text-xs font-semibold text-terminal-amber">
                  EXPLANATION
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.result.explanation}
                </p>
              </div>

              <Button onClick={handleNext} size="md" className="w-full">
                {currentIndex + 1 >= cards.length ? "See Results" : "Next Card"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop buttons - hidden when showing feedback */}
      {cardState === "idle" && (
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            onClick={() => handleJudge(false)}
          >
            &#x1F44E;
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => handleJudge(true)}
          >
            &#x1F44D;
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Swipeable card sub-component ---

interface SwipeableCardProps {
  card: SwipeCard;
  onSwipe: (swipedRight: boolean) => void;
}

function SwipeableCard({ card, onSwipe }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Swipe direction indicators
  const leftIndicatorOpacity = useTransform(x, [-120, -40, 0], [1, 0, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 40, 120], [0, 0, 1]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    currentX.current = 0;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - startX.current;
      const deltaY = Math.abs(e.clientY - startY.current);

      // If vertical movement is greater, don't swipe
      if (deltaY > Math.abs(deltaX) && Math.abs(deltaX) < 10) return;

      currentX.current = deltaX;
      x.set(deltaX);
    },
    [x]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (Math.abs(currentX.current) > SWIPE_THRESHOLD) {
      onSwipe(currentX.current > 0);
    } else {
      // Snap back
      x.set(0);
    }
  }, [x, onSwipe]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: currentX.current > 0 ? 300 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ x, rotate, opacity }}
      className="swipe-card relative rounded-xl border border-border bg-surface p-4"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe direction overlays */}
      <motion.div
        style={{ opacity: leftIndicatorOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-lg border border-terminal-red bg-terminal-red/10 px-3 py-1 text-sm font-bold text-terminal-red"
      >
        BAD
      </motion.div>
      <motion.div
        style={{ opacity: rightIndicatorOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-lg border border-terminal-green bg-terminal-green/10 px-3 py-1 text-sm font-bold text-terminal-green"
      >
        GOOD
      </motion.div>

      {/* Card content */}
      <div className="mt-6">
        <p className="text-sm text-foreground leading-relaxed"><GlossaryHighlighter text={card.content} /></p>

        {card.codeExample && (
          <div className="mt-3">
            <CodeBlock
              code={card.codeExample.split("\n").map((text, i) => ({
                line: i + 1,
                text,
                isBuggy: false,
              }))}
              language={card.codeLanguage || "js"}
            />
          </div>
        )}
      </div>

      {/* Swipe hint */}
      <p className="mt-4 text-center text-[10px] text-muted">
        Swipe or use buttons below
      </p>
    </motion.div>
  );
}

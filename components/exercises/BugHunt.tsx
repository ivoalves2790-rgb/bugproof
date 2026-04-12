"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { CodeLineSelector } from "@/components/code/CodeLineSelector";
import { evaluateBugHunt, type BugHuntResult } from "@/lib/engine/exercise-evaluator";
import type { BugHuntExercise } from "@/lib/types/content.types";
import { useT } from "@/lib/i18n/use-language";

type BugHuntState = "selecting_line" | "selecting_fix" | "feedback" | "complete";

interface BugHuntProps {
  exercise: BugHuntExercise;
  onComplete: (result: { correct: boolean; xpEarned: number }) => void;
}

const stageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export function BugHunt({ exercise, onComplete }: BugHuntProps) {
  const t = useT();
  const [state, setState] = useState<BugHuntState>("selecting_line");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);
  const [result, setResult] = useState<BugHuntResult | null>(null);

  function handleLineSelect(line: number) {
    if (state !== "selecting_line") return;
    setSelectedLine(line);
  }

  function handleConfirmLine() {
    if (selectedLine === null) return;
    setState("selecting_fix");
  }

  function handleSelectFix(fixId: string) {
    if (state !== "selecting_fix") return;
    setSelectedFix(fixId);

    const evalResult = evaluateBugHunt(selectedLine!, fixId, exercise);
    setResult(evalResult);
    setState("feedback");
  }

  function handleContinue() {
    if (!result) return;
    setState("complete");
    onComplete({
      correct: result.correct,
      xpEarned: result.correct ? 1 : 0,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground"
      >
        <span className="text-terminal-green glow-green">&gt;</span>{" "}
        {exercise.prompt}
      </motion.div>

      {/* Code display */}
      <CodeLineSelector
        code={exercise.code}
        language={exercise.language}
        selectedLine={selectedLine}
        correctLine={exercise.correctBuggyLine}
        revealed={state === "feedback" || state === "complete"}
        onSelect={handleLineSelect}
      />

      <AnimatePresence mode="wait">
        {/* Stage: selecting line */}
        {state === "selecting_line" && (
          <motion.div key="selecting-line" {...stageTransition} className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {t("bugHunt.tapLine")}
            </p>
            {selectedLine !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button onClick={handleConfirmLine} size="md">
                  {t("bugHunt.confirmLine")} {selectedLine}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stage: selecting fix */}
        {state === "selecting_fix" && (
          <motion.div key="selecting-fix" {...stageTransition} className="flex flex-col gap-3">
            <p className="text-sm text-foreground">
              <span className="text-terminal-amber glow-amber">?</span>{" "}
              How would you fix this?
            </p>
            <div className="flex flex-col gap-2">
              {exercise.fixes.map((fix, index) => (
                <motion.button
                  key={fix.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleSelectFix(fix.id)}
                  className={cn(
                    "w-full rounded-lg border border-border bg-surface p-3 text-left text-sm transition-all",
                    "hover:border-terminal-green hover:bg-surface-2",
                    "active:scale-[0.98]",
                    selectedFix === fix.id && "border-terminal-green bg-surface-2"
                  )}
                >
                  <span className="mr-2 text-muted">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-foreground">{fix.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stage: feedback */}
        {state === "feedback" && result && (
          <motion.div key="feedback" {...stageTransition} className="flex flex-col gap-4">
            {/* Result banner */}
            <div
              className={cn(
                "rounded-lg border p-4",
                result.correct
                  ? "border-terminal-green/30 bg-terminal-green/5"
                  : "border-terminal-red/30 bg-terminal-red/5"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-lg font-bold",
                    result.correct ? "text-terminal-green glow-green" : "text-terminal-red glow-red"
                  )}
                >
                  {result.correct ? "CORRECT" : "INCORRECT"}
                </span>
              </div>

              {!result.lineCorrect && (
                <p className="mt-2 text-xs text-muted-foreground">
                  The bug was on line {exercise.correctBuggyLine}, not line {selectedLine}.
                </p>
              )}
              {result.lineCorrect && !result.fixCorrect && (
                <p className="mt-2 text-xs text-muted-foreground">
                  You found the right line, but the fix was wrong.
                </p>
              )}
            </div>

            {/* Explanation */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="mb-1 text-xs font-semibold text-terminal-amber">
                EXPLANATION
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <Button onClick={handleContinue} size="lg" className="w-full">
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import type { TerminalSimExercise } from "@/lib/types/content.types";

interface TerminalSimulatorProps {
  exercise: TerminalSimExercise;
  onComplete: (score: number) => void;
}

interface TerminalLine {
  type: "prompt" | "output" | "error" | "success" | "instruction";
  text: string;
}

export function TerminalSimulator({ exercise, onComplete }: TerminalSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = exercise.steps[currentStep];

  useEffect(() => {
    // Show initial instruction
    setLines([
      { type: "instruction", text: exercise.steps[0].instruction },
    ]);
  }, [exercise]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  function normalizeCommand(cmd: string): string {
    return cmd.trim().replace(/\s+/g, " ").replace(/['"]/g, (m) => m === "'" ? '"' : m);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!step || completed) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    const normalizedInput = normalizeCommand(trimmed);
    const normalizedExpected = normalizeCommand(step.expectedCommand);
    const alternatives = step.acceptAlternatives.map(normalizeCommand);

    const isCorrect =
      normalizedInput === normalizedExpected ||
      alternatives.some((alt) => normalizedInput === alt);

    const newLines: TerminalLine[] = [
      ...lines,
      { type: "prompt", text: `${exercise.initialDirectory} $ ${trimmed}` },
    ];

    if (isCorrect) {
      if (step.output) {
        newLines.push({ type: "output", text: step.output });
      }
      newLines.push({ type: "success", text: "Correct!" });

      const nextStep = currentStep + 1;
      if (nextStep < exercise.steps.length) {
        newLines.push({
          type: "instruction",
          text: exercise.steps[nextStep].instruction,
        });
        setCurrentStep(nextStep);
      } else {
        newLines.push({
          type: "success",
          text: exercise.completionMessage,
        });
        setCompleted(true);
      }
      setAttempts(0);
    } else {
      setAttempts((a) => a + 1);
      setTotalAttempts((t) => t + 1);

      if (attempts >= 1) {
        newLines.push({
          type: "error",
          text: `Hint: ${step.hint}`,
        });
      } else {
        newLines.push({
          type: "error",
          text: "Not quite. Try again.",
        });
      }
    }

    setLines(newLines);
    setInput("");
  }

  function handleComplete() {
    const maxAttempts = exercise.steps.length; // 1 attempt per step = perfect
    const score = Math.max(
      0,
      Math.round(((maxAttempts * 2 - totalAttempts) / (maxAttempts * 2)) * 100)
    );
    onComplete(score);
  }

  return (
    <div>
      {/* Terminal window */}
      <div className="overflow-hidden rounded-xl border border-border bg-[#0c0c0c]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-terminal-red/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-terminal-amber/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-terminal-green/60" />
          <span className="ml-2 text-xs text-muted">
            {exercise.initialDirectory}
          </span>
        </div>

        {/* Output area */}
        <div
          ref={scrollRef}
          className="max-h-[400px] min-h-[200px] overflow-y-auto p-3 font-mono text-sm"
        >
          {/* Initial files */}
          {exercise.initialFiles && lines.length <= 1 && (
            <div className="mb-2 text-muted-foreground">
              <span className="text-terminal-amber">Files: </span>
              {exercise.initialFiles.join("  ")}
            </div>
          )}

          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "whitespace-pre-wrap py-0.5",
                line.type === "prompt" && "text-foreground",
                line.type === "output" && "text-muted-foreground",
                line.type === "error" && "text-terminal-amber",
                line.type === "success" && "text-terminal-green",
                line.type === "instruction" &&
                  "mt-2 rounded bg-terminal-green/5 p-2 text-terminal-green"
              )}
            >
              {line.text}
            </motion.div>
          ))}

          {/* Input line */}
          {!completed && (
            <form onSubmit={handleSubmit} className="mt-1 flex items-center">
              <span className="text-terminal-green">
                {exercise.initialDirectory} ${" "}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-foreground outline-none ml-1"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <span className="cursor-blink text-terminal-green">|</span>
            </form>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex items-center gap-2">
        {exercise.steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < currentStep
                ? "bg-terminal-green"
                : i === currentStep && !completed
                  ? "bg-terminal-green/30"
                  : completed
                    ? "bg-terminal-green"
                    : "bg-surface-3"
            )}
          />
        ))}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Button className="w-full" onClick={handleComplete}>
            Continue
          </Button>
        </motion.div>
      )}
    </div>
  );
}

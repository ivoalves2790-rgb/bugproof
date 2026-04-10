"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { evaluateIncidentResponse, type IncidentResponseResult } from "@/lib/engine/exercise-evaluator";
import type { IncidentResponseExercise, IncidentNode } from "@/lib/types/content.types";

interface IncidentResponseProps {
  exercise: IncidentResponseExercise;
  onComplete: (result: { score: number; maxScore: number }) => void;
}

interface ChoiceMade {
  nodeId: string;
  choiceId: string;
}

export function IncidentResponse({ exercise, onComplete }: IncidentResponseProps) {
  const [currentNodeId, setCurrentNodeId] = useState(exercise.startNode);
  const [choicesMade, setChoicesMade] = useState<ChoiceMade[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [result, setResult] = useState<IncidentResponseResult | null>(null);
  const [completed, setCompleted] = useState(false);
  const typingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentNode = exercise.nodes[currentNodeId] as IncidentNode | undefined;

  // Typing effect for narrative text
  useEffect(() => {
    if (!currentNode) return;

    const fullText = currentNode.narrative;
    let charIndex = 0;

    setDisplayedText("");
    setIsTyping(true);
    setShowChoices(false);

    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }

    typingInterval.current = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex >= fullText.length) {
        if (typingInterval.current) {
          clearInterval(typingInterval.current);
          typingInterval.current = null;
        }
        setIsTyping(false);
        // Small delay before showing choices
        setTimeout(() => setShowChoices(true), 300);
      }
    }, 18);

    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
    };
  }, [currentNodeId, currentNode]);

  function skipTyping() {
    if (!currentNode) return;
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
      typingInterval.current = null;
    }
    setDisplayedText(currentNode.narrative);
    setIsTyping(false);
    setTimeout(() => setShowChoices(true), 100);
  }

  function handleChoice(choiceId: string) {
    if (!currentNode) return;

    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const newChoices = [...choicesMade, { nodeId: currentNodeId, choiceId }];
    setChoicesMade(newChoices);

    const nextNode = exercise.nodes[choice.nextNode];

    if (nextNode?.isEnd) {
      // Evaluate and show final result
      const evalResult = evaluateIncidentResponse(newChoices, exercise);
      setResult(evalResult);
      setCurrentNodeId(choice.nextNode);

      // Trigger typing for the end node narrative, then show results
      setTimeout(() => {
        setCompleted(true);
        onComplete({ score: evalResult.score, maxScore: evalResult.maxScore });
      }, 500);
    } else {
      setCurrentNodeId(choice.nextNode);
    }
  }

  // Final summary screen
  if (completed && result) {
    const percentage = result.percentage;
    const endNode = exercise.nodes[currentNodeId];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6"
      >
        {/* End node narrative */}
        {endNode && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {endNode.narrative}
            </p>
          </div>
        )}

        {/* Score */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className={cn(
              "text-5xl font-bold",
              percentage >= 80
                ? "text-terminal-green glow-green"
                : percentage >= 50
                  ? "text-terminal-amber glow-amber"
                  : "text-terminal-red glow-red"
            )}
          >
            {percentage}%
          </div>
          <p className="text-sm text-muted-foreground">
            {result.score} / {result.maxScore} points
          </p>
        </div>

        {/* Feedback */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-1 text-xs font-semibold text-terminal-amber">DEBRIEF</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.feedback}
          </p>
        </div>

        {/* Path taken */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold text-terminal-green">
            YOUR PATH
          </p>
          <div className="flex flex-wrap gap-1">
            {result.path.map((nodeId, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="rounded bg-surface-2 px-2 py-0.5 text-xs text-muted-foreground">
                  {nodeId}
                </span>
                {idx < result.path.length - 1 && (
                  <span className="text-muted">&rarr;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentNode) {
    return (
      <div className="p-4 text-sm text-terminal-red">
        Error: Node &quot;{currentNodeId}&quot; not found in exercise data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-terminal-green">[INCIDENT]</span>
        <span>Step {choicesMade.length + 1}</span>
        {choicesMade.length > 0 && (
          <span className="ml-auto text-muted">
            {choicesMade.length} decision{choicesMade.length === 1 ? "" : "s"} made
          </span>
        )}
      </div>

      {/* Narrative text with typing effect */}
      <motion.div
        key={currentNodeId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-lg border border-border bg-surface p-4"
        onClick={isTyping ? skipTyping : undefined}
      >
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
          {displayedText}
          {isTyping && (
            <span className="cursor-blink ml-0.5 inline-block h-4 w-1.5 bg-terminal-green align-text-bottom" />
          )}
        </p>
        {isTyping && (
          <p className="mt-2 text-[10px] text-muted">Tap to skip</p>
        )}
      </motion.div>

      {/* Choices */}
      <AnimatePresence>
        {showChoices && !currentNode.isEnd && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.08 }}
            className="flex flex-col gap-2"
          >
            {currentNode.choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleChoice(choice.id)}
                className={cn(
                  "w-full rounded-lg border border-border bg-surface p-3 text-left text-sm",
                  "transition-all hover:border-terminal-green hover:bg-surface-2",
                  "active:scale-[0.98]"
                )}
              >
                <span className="mr-2 text-terminal-green">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-foreground">{choice.text}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

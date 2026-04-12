"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import assessmentData from "@/content/assessment.json";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { AssessmentAnswer } from "@/lib/types/user.types";
import { useT } from "@/lib/i18n/use-language";

const questions = assessmentData.questions;

export default function AssessmentQuizPage() {
  const router = useRouter();
  const t = useT();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  function handleSelect(optionId: string) {
    if (showFeedback) return;
    setSelectedOption(optionId);

    const correctOption = question.options.find((o) => o.isCorrect);
    const isCorrect = optionId === correctOption?.id;

    const answer: AssessmentAnswer = {
      questionId: question.id,
      selectedAnswer: optionId,
      correct: isCorrect,
    };

    setAnswers((prev) => [...prev, answer]);
    setShowFeedback(true);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const encoded = btoa(JSON.stringify(answers));
      sessionStorage.setItem("assessmentAnswers", JSON.stringify(answers));
      window.location.href = "/assessment/results#" + encoded;
    }
  }

  const correctOption = question.options.find((o) => o.isCorrect);

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar value={progress} size="sm" color="green" />
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Question */}
          <h2 className="text-lg font-semibold">{question.text}</h2>

          {/* Context (jargon explanation) */}
          {question.context && (
            <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
              <span className="text-terminal-amber">Context: </span>
              {question.context}
            </div>
          )}

          {/* Options */}
          <div className="mt-6 space-y-2">
            {question.options.map((option) => {
              let borderColor = "border-border";
              let bgColor = "bg-surface";

              if (showFeedback) {
                if (option.id === correctOption?.id) {
                  borderColor = "border-terminal-green";
                  bgColor = "bg-terminal-green/5";
                } else if (option.id === selectedOption) {
                  borderColor = "border-terminal-red";
                  bgColor = "bg-terminal-red/5";
                }
              } else if (option.id === selectedOption) {
                borderColor = "border-terminal-green/50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full rounded-lg border ${borderColor} ${bgColor} p-3 text-left text-sm transition-all hover:border-terminal-green/30 disabled:cursor-default`}
                >
                  <span className="mr-2 text-muted">{option.id}.</span>
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="rounded-lg bg-surface-2 p-3 text-sm">
                <p className="font-semibold text-terminal-green">
                  {selectedOption === correctOption?.id
                    ? t("assessment.correct")
                    : t("assessment.notQuite")}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {question.explanation}
                </p>
              </div>

              <Button className="mt-4 w-full" onClick={handleNext}>
                {currentIndex < questions.length - 1
                  ? t("assessment.next")
                  : t("assessment.seeResults")}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

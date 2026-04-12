"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { IconX, IconHeart } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Lesson } from "@/lib/types/content.types";
import { TeachSlides } from "@/components/exercises/TeachSlides";
import { useT, useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, COMPLETION_MESSAGES } from "@/lib/motivation/messages";

interface LessonPlayerProps {
  courseSlug: string;
  unitSlug: string;
  lessonSlug: string;
  onComplete: (score: number, xpEarned: number) => void;
  onExit: () => void;
}

type Phase = "loading" | "teaching" | "exercising" | "completed";

export function LessonPlayer({
  courseSlug,
  unitSlug,
  lessonSlug,
  onComplete,
  onExit,
}: LessonPlayerProps) {
  const t = useT();
  const { locale } = useLanguage();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [motivation] = useState(() => getRandomMessage(COMPLETION_MESSAGES, locale));
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadLesson() {
      try {
        const locale = localStorage.getItem("bugproof:language") || "en";
        let data: Lesson | null = null;

        // Try locale-specific content first
        if (locale !== "en") {
          try {
            const localeModule = await import(
              `@/content/${courseSlug}/lessons-${locale}/${lessonSlug}.json`
            );
            data = localeModule.default as Lesson;
          } catch {
            // Fall back to English
          }
        }

        if (!data) {
          const lessonModule = await import(
            `@/content/${courseSlug}/lessons/${lessonSlug}.json`
          );
          data = lessonModule.default as Lesson;
        }

        setLesson(data);
        setPhase(data.teach && data.teach.length > 0 ? "teaching" : "exercising");
      } catch {
        setError(t("lesson.comingSoon"));
        setPhase("loading");
      }
    }
    loadLesson();
  }, [courseSlug, lessonSlug, t]);

  function handleTeachComplete() {
    setPhase("exercising");
  }

  function handleExerciseComplete(exerciseScore: number) {
    setScore(exerciseScore);
    setPhase("completed");
  }

  // --- Loading ---
  if (phase === "loading" && !error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-terminal-green border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("lesson.loading")}</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error || !lesson) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-4xl">{"{ }"}</div>
        <h2 className="text-lg font-bold">{t("lesson.comingSoon")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || t("lesson.notWritten")}
        </p>
        <Button variant="secondary" className="mt-4" onClick={onExit}>
          {t("lesson.goBack")}
        </Button>
      </div>
    );
  }

  // --- Completed ---
  if (phase === "completed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 text-5xl text-terminal-green glow-green">
          {score >= 80 ? "++" : score >= 50 ? "+" : "~"}
        </div>
        <h2 className="text-xl font-bold">
          {score >= 80 ? t("lesson.excellent") : score >= 50 ? t("lesson.goodJob") : t("lesson.keepPracticing")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("lesson.scored", { score })}
        </p>
        <div className="mt-6 flex items-center gap-2 text-xp-gold">
          <span className="text-2xl font-bold xp-float">
            +{lesson.xpReward} XP
          </span>
        </div>
        <p className="mt-4 max-w-xs text-xs text-terminal-green/80 italic">
          {motivation}
        </p>
        <Button className="mt-6" onClick={() => onComplete(score, lesson.xpReward)}>
          {t("lesson.continue")}
        </Button>
      </motion.div>
    );
  }

  // --- Teaching phase ---
  if (phase === "teaching" && lesson.teach && lesson.teach.length > 0) {
    return (
      <div>
        {/* Lesson header */}
        <div className="mb-6 flex items-center gap-3">
          <button onClick={onExit} className="text-muted-foreground hover:text-foreground">
            <IconX size={20} />
          </button>
          <div className="flex-1">
            <ProgressBar value={25} size="sm" color="green" />
          </div>
          <div className="rounded bg-terminal-green/10 px-2 py-0.5 text-[10px] font-medium text-terminal-green">
            {t("lesson.learn")}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="mb-4 text-lg font-bold">{lesson.title}</h2>
        </motion.div>

        <TeachSlides blocks={lesson.teach} onComplete={handleTeachComplete} />
      </div>
    );
  }

  // --- Exercising phase ---
  return (
    <div>
      {/* Lesson header */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onExit} className="text-muted-foreground hover:text-foreground">
          <IconX size={20} />
        </button>
        <div className="flex-1">
          <ProgressBar value={50} size="sm" color="green" />
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded bg-terminal-amber/10 px-2 py-0.5 text-[10px] font-medium text-terminal-amber">
            {t("lesson.practice")}
          </div>
          <div className="flex items-center gap-1">
            <IconHeart size={16} className="text-heart-red" />
            <span className="text-xs font-semibold">3</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h2 className="text-lg font-bold">{lesson.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{lesson.intro}</p>
      </motion.div>

      {/* Exercise */}
      <ExerciseDispatch lesson={lesson} onComplete={handleExerciseComplete} />
    </div>
  );
}

function ExerciseDispatch({
  lesson,
  onComplete,
}: {
  lesson: Lesson;
  onComplete: (score: number) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let mod: any;
      switch (lesson.type) {
        case "bug_hunt":
          mod = await import("@/components/exercises/BugHunt");
          setComp(() => mod.BugHunt);
          break;
        case "swipe_to_judge":
          mod = await import("@/components/exercises/SwipeToJudge");
          setComp(() => mod.SwipeToJudge);
          break;
        case "incident_response":
          mod = await import("@/components/exercises/IncidentResponse");
          setComp(() => mod.IncidentResponse);
          break;
        case "terminal_sim":
          mod = await import("@/components/exercises/TerminalSimulator");
          setComp(() => mod.TerminalSimulator);
          break;
        case "prompt_challenge":
        case "code_review":
        case "architecture_decision":
          // New exercise types — coming in Phase 2
          break;
      }
    }
    load();
  }, [lesson.type]);

  if (!Comp) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-terminal-green border-t-transparent" />
      </div>
    );
  }

  return (
    <Comp
      exercise={lesson.exercise}
      onComplete={(result: Record<string, number | boolean> | number) => {
        if (typeof result === "number") {
          onComplete(result);
        } else if (result && typeof result.score === "number") {
          const total =
            (typeof result.total === "number" ? result.total : 0) ||
            (typeof result.maxScore === "number" ? result.maxScore : 0) ||
            1;
          onComplete(Math.round(((result.score as number) / total) * 100));
        } else if (result && typeof result.correct === "boolean") {
          onComplete(result.correct ? 100 : 0);
        } else {
          onComplete(0);
        }
      }}
    />
  );
}

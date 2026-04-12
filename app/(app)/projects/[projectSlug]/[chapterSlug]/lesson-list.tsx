"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/use-language";

interface LessonInfo {
  slug: string;
  title: string;
  type: string;
  difficulty: number;
}

interface ChapterLessonListProps {
  projectSlug: string;
  chapterSlug: string;
  lessons: LessonInfo[];
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
}

export function ChapterLessonList({
  projectSlug,
  chapterSlug,
  lessons,
  typeColors,
  typeLabels,
}: ChapterLessonListProps) {
  const t = useT();

  function getDifficultyLabel(difficulty: number): string {
    const map: Record<number, string> = {
      1: t("difficulty.easy"),
      2: t("difficulty.medium"),
      3: t("difficulty.hard"),
    };
    return map[difficulty] || t("difficulty.easy");
  }

  function getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      bug_hunt: t("type.bugHunt"),
      swipe_to_judge: t("type.swipe"),
      incident_response: t("type.scenario"),
      terminal_sim: t("type.terminal"),
      prompt_challenge: t("type.prompt"),
      code_review: t("type.review"),
      architecture_decision: t("type.decide"),
    };
    return map[type] || type;
  }
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const key = `progress:${projectSlug}:${chapterSlug}`;
    const completed: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    setCompletedSlugs(completed);
  }, [projectSlug, chapterSlug]);

  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isCompleted = completedSlugs.includes(lesson.slug);

        return (
          <Link
            key={lesson.slug}
            href={`/projects/${projectSlug}/${chapterSlug}/${lesson.slug}`}
            className="block"
          >
            <div
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                isCompleted
                  ? "border-terminal-green/30 bg-terminal-green/5 hover:border-terminal-green"
                  : "border-terminal-green/50 bg-surface hover:border-terminal-green hover:bg-surface-2"
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : "border-terminal-green text-terminal-green"
                }`}
              >
                {isCompleted ? (
                  <span className="text-xs">&#10003;</span>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{lesson.title}</h3>
                <span className="text-[10px] text-muted">
                  {getDifficultyLabel(lesson.difficulty)} &middot;{" "}
                  {lesson.difficulty === 1 ? "10" : lesson.difficulty === 2 ? "15" : "20"} XP
                </span>
              </div>

              <span
                className={`text-[10px] font-medium ${typeColors[lesson.type] || "text-muted"}`}
              >
                {getTypeLabel(lesson.type)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/use-language";

interface ChapterInfo {
  slug: string;
  title: string;
  order: number;
  phase: string;
  lessonSlugs: string[];
}

interface ChapterListProps {
  projectSlug: string;
  chapters: ChapterInfo[];
  totalChapters: number;
  phaseEmojis: Record<string, string>;
}

export function ChapterList({
  projectSlug,
  chapters,
  totalChapters,
  phaseEmojis,
}: ChapterListProps) {
  const t = useT();
  const [chapterProgress, setChapterProgress] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const progress: Record<string, string[]> = {};
    for (const chapter of chapters) {
      const key = `progress:${projectSlug}:${chapter.slug}`;
      const completed: string[] = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      progress[chapter.slug] = completed;
    }
    setChapterProgress(progress);
  }, [projectSlug, chapters]);

  function isChapterCompleted(chapter: ChapterInfo): boolean {
    const completed = chapterProgress[chapter.slug] || [];
    return (
      chapter.lessonSlugs.length > 0 &&
      chapter.lessonSlugs.every((slug) => completed.includes(slug))
    );
  }

  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => {
        const completed = isChapterCompleted(chapter);

        return (
          <Link
            key={chapter.slug}
            href={`/projects/${projectSlug}/${chapter.slug}`}
            className="block"
          >
            <div
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                completed
                  ? "border-terminal-green/30 bg-terminal-green/5 hover:border-terminal-green"
                  : "border-terminal-green/50 bg-surface hover:bg-surface-2"
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  completed
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : "border-terminal-green text-terminal-green"
                }`}
              >
                {completed ? (
                  <span className="text-xs">&#10003;</span>
                ) : (
                  phaseEmojis[chapter.phase] || chapter.order
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{chapter.title}</h3>
                <span className="text-[10px] text-muted">
                  {t("chapter.chapter")} {chapter.order} {t("chapter.of")} {totalChapters}
                </span>
              </div>

              {!completed && (
                <span className="text-[10px] font-medium text-terminal-green">
                  {index === 0 ? t("chapter.start") : t("chapter.go")}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

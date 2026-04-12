"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProject, getChapter } from "@/lib/content/loader";
import Link from "next/link";
import { ChapterLessonList } from "./lesson-list";
import { useLanguage } from "@/lib/i18n/use-language";

const typeColors: Record<string, string> = {
  bug_hunt: "text-terminal-red",
  swipe_to_judge: "text-terminal-amber",
  incident_response: "text-terminal-blue",
  terminal_sim: "text-terminal-green",
  prompt_challenge: "text-terminal-cyan",
  code_review: "text-terminal-red",
  architecture_decision: "text-terminal-blue",
};

// typeLabels kept for prop compatibility; the client component now translates internally
const typeLabels: Record<string, string> = {};

interface LessonInfo {
  slug: string;
  title: string;
  type: string;
  difficulty: number;
}

interface ChapterData {
  order: number;
  title: string;
  description: string;
  lessons: LessonInfo[];
}

export default function ChapterPage() {
  const params = useParams<{ projectSlug: string; chapterSlug: string }>();
  const { projectSlug, chapterSlug } = params;
  const { locale, t } = useLanguage();

  const project = getProject(projectSlug, locale);
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChapter() {
      const ch = await getChapter(projectSlug, chapterSlug, locale);
      if (ch) {
        setChapter({
          order: ch.order,
          title: ch.title,
          description: ch.description,
          lessons: ch.lessons.map((l) => ({
            slug: l.slug,
            title: l.title,
            type: l.type,
            difficulty: l.difficulty,
          })),
        });
      }
      setLoading(false);
    }
    loadChapter();
  }, [projectSlug, chapterSlug, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">{t("lesson.loading")}</div>
      </div>
    );
  }

  if (!project || !chapter) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Chapter not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${projectSlug}`}
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; {project.title}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-xl font-bold">
            Ch. {chapter.order}: {chapter.title}
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {chapter.description}
        </p>
      </div>

      {/* Lesson list */}
      <ChapterLessonList
        projectSlug={projectSlug}
        chapterSlug={chapterSlug}
        lessons={chapter.lessons}
        typeColors={typeColors}
        typeLabels={typeLabels}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProject, getFullProject, getAllChapters } from "@/lib/content/loader";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ChapterList } from "./chapter-list";
import { useLanguage } from "@/lib/i18n/use-language";

const phaseEmojis: Record<string, string> = {
  planning: "1",
  "tech-stack": "2",
  setup: "3",
  building: "4",
  database: "5",
  "auth-security": "6",
  testing: "7",
  deployment: "8",
  scaling: "9",
};

interface ChapterWithLessons {
  slug: string;
  title: string;
  order: number;
  phase: string;
  lessonSlugs: string[];
}

interface ProjectData {
  title: string;
  difficulty: string;
  longDescription: string;
  chapterCount: number;
  chapters: ChapterWithLessons[];
}

export default function ProjectPage() {
  const params = useParams<{ projectSlug: string }>();
  const projectSlug = params.projectSlug;
  const { locale, t } = useLanguage();

  const projectIndex = getProject(projectSlug, locale);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const project = await getFullProject(projectSlug);
      if (!project) {
        setLoading(false);
        return;
      }

      const fullChapters = await getAllChapters(projectSlug, locale);
      const chapterLessonMap = new Map(
        fullChapters.map((ch) => [ch.slug, ch.lessons.map((l) => l.slug)])
      );
      const chapterTitleMap = new Map(
        fullChapters.map((ch) => [ch.slug, ch.title])
      );

      const chaptersWithLessons = project.chapters.map((ch) => ({
        slug: ch.slug,
        title: chapterTitleMap.get(ch.slug) || ch.title,
        order: ch.order,
        phase: ch.phase,
        lessonSlugs: chapterLessonMap.get(ch.slug) || [],
      }));

      setProjectData({
        title: projectIndex?.title || project.title,
        difficulty: project.difficulty,
        longDescription: projectIndex?.description || project.longDescription,
        chapterCount: project.chapters.length,
        chapters: chaptersWithLessons,
      });
      setLoading(false);
    }
    loadProject();
  }, [projectSlug, locale, projectIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">{t("lesson.loading")}</div>
      </div>
    );
  }

  if (!projectData || !projectIndex) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Project not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/projects"
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; {t("projects.title")}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-xl font-bold">{projectData.title}</h1>
          <Badge
            variant={
              projectData.difficulty === "beginner"
                ? "green"
                : projectData.difficulty === "intermediate"
                  ? "amber"
                  : "red"
            }
          >
            {projectData.difficulty}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {projectData.longDescription}
        </p>
      </div>

      {/* Chapter path */}
      <ChapterList
        projectSlug={projectSlug}
        chapters={projectData.chapters}
        totalChapters={projectData.chapterCount}
        phaseEmojis={phaseEmojis}
      />
    </div>
  );
}

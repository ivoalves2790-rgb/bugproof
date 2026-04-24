"use client";

import { useEffect, useState } from "react";
import { getProjects, getProject, getFullProject, getAllChapters } from "@/lib/content/loader";
import { DashboardStats } from "./dashboard-stats";
import { ContinueCard } from "./continue-card";
import { DashboardProjects } from "./dashboard-projects";
import { useLanguage } from "@/lib/i18n/use-language";

interface ChapterForCard {
  slug: string;
  title: string;
  order: number;
  lessonCount: number;
}

export default function DashboardPage() {
  const { locale } = useLanguage();
  const projects = getProjects(locale);
  const taskManager = getProject("task-manager", locale);

  const [chaptersForCard, setChaptersForCard] = useState<ChapterForCard[]>([
    { slug: "planning", title: "Planning Your App", order: 1, lessonCount: 5 },
  ]);

  useEffect(() => {
    async function loadChapters() {
      const taskManagerProject = await getFullProject("task-manager");
      const taskManagerChapters = await getAllChapters("task-manager", locale);

      if (taskManagerProject) {
        const chapters = taskManagerProject.chapters.map((ch) => {
          const full = taskManagerChapters.find((c) => c.slug === ch.slug);
          return {
            slug: ch.slug,
            title: full ? full.title : ch.title,
            order: ch.order,
            lessonCount: full ? full.lessons.length : 0,
          };
        });
        setChaptersForCard(chapters);
      }
    }
    loadChapters();
  }, [locale]);

  const projectsForList = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    difficulty: p.difficulty,
    color: p.color,
    chapterCount: p.chapterCount,
    estimatedHours: p.estimatedHours,
  }));

  return (
    <div>
      <ContinueCard
        projectSlug="task-manager"
        projectTitle={taskManager?.title ?? "Task Manager"}
        chapters={chaptersForCard}
      />
      <DashboardStats />
      <DashboardProjects projects={projectsForList} />
    </div>
  );
}

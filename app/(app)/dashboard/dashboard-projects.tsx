"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/use-language";
import courses from "@/content/courses.json";

const COURSE_COUNT = courses.length;

interface ProjectInfo {
  slug: string;
  title: string;
  difficulty: string;
  color: string;
  chapterCount: number;
  estimatedHours: number;
}

export function DashboardProjects({ projects }: { projects: ProjectInfo[] }) {
  const t = useT();

  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("dashboard.projects")}</h2>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-terminal-green"
          >
            {t("dashboard.viewAll")} &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {projects.map((project, index) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <Card variant="interactive">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ backgroundColor: `${project.color}20`, color: project.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{project.title}</h3>
                      <Badge
                        variant={project.difficulty === "beginner" ? "green" : "amber"}
                      >
                        {t(`difficulty.${project.difficulty}`)}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {project.chapterCount} {t("projects.chapters")} &middot; ~{project.estimatedHours}h
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/courses"
          className="block rounded-lg border border-border bg-surface p-4 text-center transition-all hover:border-terminal-green/50 hover:bg-surface-2"
        >
          <h3 className="text-sm font-semibold">{t("dashboard.referenceLibrary")}</h3>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {t("dashboard.referenceDesc", { count: COURSE_COUNT })}
          </p>
        </Link>
      </div>
    </>
  );
}

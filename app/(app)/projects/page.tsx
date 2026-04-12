"use client";

import { getProjects } from "@/lib/content/loader";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/lib/i18n/use-language";


export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const projects = getProjects(locale);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("projects.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("projects.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block"
          >
            <Card variant="interactive">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: `${project.color}20`, color: project.color }}
                >
                  {project.difficulty === "beginner" ? "1" : project.difficulty === "intermediate" ? "2" : "3"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge
                      variant={
                        project.difficulty === "beginner"
                          ? "green"
                          : project.difficulty === "intermediate"
                            ? "amber"
                            : "red"
                      }
                    >
                      {project.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted">
                    {project.chapterCount} {t("projects.chapters")} &middot; {project.lessonCount} {t("projects.lessons")} &middot; ~{project.estimatedHours}h
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

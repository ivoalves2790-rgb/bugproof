import { getCourse, getUnit } from "@/lib/content/loader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconCheckCircle, IconLock } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

const typeColors: Record<string, string> = {
  bug_hunt: "text-terminal-red",
  swipe_to_judge: "text-terminal-amber",
  incident_response: "text-terminal-blue",
  terminal_sim: "text-terminal-green",
};

const typeLabels: Record<string, string> = {
  bug_hunt: "Bug Hunt",
  swipe_to_judge: "Swipe",
  incident_response: "Incident",
  terminal_sim: "Terminal",
};

export default async function UnitPage({
  params,
}: {
  params: Promise<{ courseSlug: string; unitSlug: string }>;
}) {
  const { courseSlug, unitSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const unit = await getUnit(courseSlug, unitSlug);

  // Use real lessons if unit loaded, otherwise placeholder
  const lessons = unit
    ? unit.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        type: l.type,
        difficulty: l.difficulty,
        completed: false,
      }))
    : [
        { slug: "lesson-1", title: "Introduction", type: "swipe_to_judge" as const, difficulty: 1 as const, completed: false },
        { slug: "lesson-2", title: "Core Concept", type: "bug_hunt" as const, difficulty: 2 as const, completed: false },
        { slug: "lesson-3", title: "Practice", type: "terminal_sim" as const, difficulty: 1 as const, completed: false },
        { slug: "lesson-4", title: "Scenario", type: "incident_response" as const, difficulty: 2 as const, completed: false },
        { slug: "lesson-5", title: "Review", type: "swipe_to_judge" as const, difficulty: 1 as const, completed: false },
        { slug: "lesson-6", title: "Challenge", type: "bug_hunt" as const, difficulty: 3 as const, completed: false },
      ];

  const unitTitle = unit
    ? unit.title
    : unitSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const difficultyLabels: Record<number, string> = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/courses/${courseSlug}`}
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; Back to {course.title}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-xl font-bold">{unitTitle}</h1>
          {unit?.tier && (
            <Badge
              variant={
                unit.tier === "beginner"
                  ? "green"
                  : unit.tier === "intermediate"
                    ? "amber"
                    : "red"
              }
            >
              {unit.tier}
            </Badge>
          )}
        </div>
        {unit && (
          <p className="mt-1 text-sm text-muted-foreground">
            {unit.description}
          </p>
        )}
      </div>

      {/* Lesson path */}
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/courses/${courseSlug}/${unitSlug}/${lesson.slug}`}
            className="block"
          >
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-all hover:border-terminal-green/50 hover:bg-surface-2">
              {/* Status circle */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  lesson.completed
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : index === 0
                      ? "border-terminal-green text-terminal-green"
                      : "border-border text-muted"
                }`}
              >
                {lesson.completed ? (
                  <IconCheckCircle size={14} />
                ) : index > 0 ? (
                  <IconLock size={12} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{lesson.title}</h3>
                <span className="text-[10px] text-muted">
                  {difficultyLabels[lesson.difficulty] || "Easy"} &middot;{" "}
                  {lesson.difficulty === 1
                    ? "10"
                    : lesson.difficulty === 2
                      ? "15"
                      : "20"}{" "}
                  XP
                </span>
              </div>

              <span
                className={`text-[10px] font-medium ${typeColors[lesson.type] || "text-muted"}`}
              >
                {typeLabels[lesson.type] || lesson.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

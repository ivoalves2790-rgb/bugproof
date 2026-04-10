import { getCourse, getFullCourse, getAllUnits } from "@/lib/content/loader";
import { notFound } from "next/navigation";
import { COURSE_ICONS } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { IconCheckCircle } from "@/components/ui/Icons";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const courseIndex = getCourse(courseSlug);
  if (!courseIndex) notFound();

  const course = await getFullCourse(courseSlug);
  const Icon = COURSE_ICONS[courseIndex.icon];

  // Load real unit data with tiers, or fallback to course.json refs
  const realUnits = await getAllUnits(courseSlug);
  const units = realUnits.length > 0
    ? realUnits.map((u) => ({
        slug: u.slug,
        title: u.title,
        order: u.order,
        tier: u.tier,
        lessonCount: u.lessons.length,
      }))
    : course
      ? course.units.map((u) => ({
          slug: u.slug,
          title: u.title,
          order: u.order,
          tier: undefined as "beginner" | "intermediate" | "advanced" | undefined,
          lessonCount: 0,
        }))
      : [
          { slug: "basics", title: "Getting Started", order: 1, tier: "beginner" as const, lessonCount: 0 },
          { slug: "intermediate", title: "Core Concepts", order: 2, tier: "intermediate" as const, lessonCount: 0 },
          { slug: "advanced", title: "Advanced Topics", order: 3, tier: "advanced" as const, lessonCount: 0 },
        ];

  return (
    <div>
      {/* Course header */}
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; All Courses
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${courseIndex.color}20` }}
          >
            {Icon && <Icon size={24} style={{ color: courseIndex.color }} />}
          </div>
          <div>
            <h1 className="text-xl font-bold">{courseIndex.title}</h1>
            <p className="text-sm text-muted-foreground">
              {courseIndex.description}
            </p>
          </div>
        </div>
        {course && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {course.longDescription}
          </p>
        )}
        <div className="mt-4">
          <ProgressBar value={0} size="md" color="green" />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>
              {courseIndex.lessonCount} lessons &middot; {units.length} units
            </span>
            <Badge variant="default">Novice</Badge>
          </div>
        </div>
      </div>

      {/* Units path */}
      <div className="space-y-3">
        {units.map((unit, index) => (
          <Link
            key={unit.slug}
            href={`/courses/${courseSlug}/${unit.slug}`}
            className="block"
          >
            <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-terminal-green/50 hover:bg-surface-2">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  index === 0
                    ? "border-terminal-green text-terminal-green"
                    : "border-border text-muted"
                }`}
              >
                <span className="text-sm font-bold">{index + 1}</span>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm">{unit.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {unit.tier && (
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
                  {unit.lessonCount > 0 && (
                    <span className="text-[10px] text-muted">
                      {unit.lessonCount} lessons
                    </span>
                  )}
                </div>
              </div>

              <div className="text-muted-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourse, getFullCourse, getAllUnits } from "@/lib/content/loader";
import { COURSE_ICONS } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, COURSE_PAGE_MESSAGES } from "@/lib/motivation/messages";

interface UnitInfo {
  slug: string;
  title: string;
  order: number;
  tier?: string;
  lessonCount: number;
}

export default function CoursePage() {
  const params = useParams<{ courseSlug: string }>();
  const courseSlug = params.courseSlug;
  const { locale, t } = useLanguage();

  const courseIndex = getCourse(courseSlug, locale);
  const Icon = courseIndex ? COURSE_ICONS[courseIndex.icon] : null;

  const [units, setUnits] = useState<UnitInfo[]>([]);
  const [longDescription, setLongDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [motivation] = useState(() => getRandomMessage(COURSE_PAGE_MESSAGES, locale));

  useEffect(() => {
    async function loadCourse() {
      const course = await getFullCourse(courseSlug, locale);
      const realUnits = await getAllUnits(courseSlug, locale);

      if (course) {
        setLongDescription(course.longDescription);
      }

      if (realUnits.length > 0) {
        setUnits(
          realUnits.map((u) => ({
            slug: u.slug,
            title: u.title,
            order: u.order,
            tier: u.tier,
            lessonCount: u.lessons.length,
          }))
        );
      } else if (course) {
        setUnits(
          course.units.map((u) => ({
            slug: u.slug,
            title: u.title,
            order: u.order,
            tier: undefined,
            lessonCount: 0,
          }))
        );
      }
      setLoading(false);
    }
    loadCourse();
  }, [courseSlug]);

  if (!courseIndex) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Course not found</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">{t("lesson.loading")}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; {t("courses.title")}
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
        {longDescription && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {longDescription}
          </p>
        )}
        <CourseProgress
          courseSlug={courseSlug}
          totalLessons={courseIndex.lessonCount}
          units={units.map((u) => ({ slug: u.slug, lessonCount: u.lessonCount }))}
        />
      </div>

      <div className="mb-4 rounded-lg border border-xp-gold/20 bg-xp-gold/5 px-4 py-3">
        <p className="text-xs text-xp-gold/90 leading-relaxed">
          {motivation}
        </p>
      </div>

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
                      {unit.lessonCount} {t("courses.lessons")}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

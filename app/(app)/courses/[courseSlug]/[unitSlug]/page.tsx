"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourse, getUnit } from "@/lib/content/loader";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { UnitLessonList } from "./unit-lesson-list";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, UNIT_PAGE_MESSAGES } from "@/lib/motivation/messages";

const typeColors: Record<string, string> = {
  bug_hunt: "text-terminal-red",
  swipe_to_judge: "text-terminal-amber",
  incident_response: "text-terminal-blue",
  terminal_sim: "text-terminal-green",
};

// typeLabels kept for prop compatibility; the client component now translates internally
const typeLabels: Record<string, string> = {};

interface LessonInfo {
  slug: string;
  title: string;
  type: string;
  difficulty: number;
}

interface UnitData {
  title: string;
  description?: string;
  tier?: string;
  lessons: LessonInfo[];
}

export default function UnitPage() {
  const params = useParams<{ courseSlug: string; unitSlug: string }>();
  const { courseSlug, unitSlug } = params;
  const { locale, t } = useLanguage();

  const course = getCourse(courseSlug, locale);
  const [unitData, setUnitData] = useState<UnitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [motivation] = useState(() => getRandomMessage(UNIT_PAGE_MESSAGES, locale));

  useEffect(() => {
    async function loadUnit() {
      const unit = await getUnit(courseSlug, unitSlug, locale);
      if (unit) {
        setUnitData({
          title: unit.title,
          description: unit.description,
          tier: unit.tier,
          lessons: unit.lessons.map((l) => ({
            slug: l.slug,
            title: l.title,
            type: l.type,
            difficulty: l.difficulty,
          })),
        });
      }
      setLoading(false);
    }
    loadUnit();
  }, [courseSlug, unitSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">{t("lesson.loading")}</div>
      </div>
    );
  }

  const unitTitle = unitData
    ? unitData.title
    : unitSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const lessons = unitData
    ? unitData.lessons
    : [
        { slug: "lesson-1", title: "Introduction", type: "swipe_to_judge", difficulty: 1 },
        { slug: "lesson-2", title: "Core Concept", type: "bug_hunt", difficulty: 2 },
        { slug: "lesson-3", title: "Practice", type: "terminal_sim", difficulty: 1 },
        { slug: "lesson-4", title: "Scenario", type: "incident_response", difficulty: 2 },
        { slug: "lesson-5", title: "Review", type: "swipe_to_judge", difficulty: 1 },
        { slug: "lesson-6", title: "Challenge", type: "bug_hunt", difficulty: 3 },
      ];

  if (!course) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Course not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/courses/${courseSlug}`}
          className="text-xs text-muted-foreground hover:text-terminal-green"
        >
          &larr; {course.title}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-xl font-bold">{unitTitle}</h1>
          {unitData?.tier && (
            <Badge
              variant={
                unitData.tier === "beginner"
                  ? "green"
                  : unitData.tier === "intermediate"
                    ? "amber"
                    : "red"
              }
            >
              {unitData.tier}
            </Badge>
          )}
        </div>
        {unitData?.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {unitData.description}
          </p>
        )}
      </div>

      <div className="mb-4 rounded-lg border border-xp-gold/20 bg-xp-gold/5 px-4 py-3">
        <p className="text-xs text-xp-gold/90 leading-relaxed">
          {motivation}
        </p>
      </div>

      {/* Lesson path */}
      <UnitLessonList
        courseSlug={courseSlug}
        unitSlug={unitSlug}
        lessons={lessons}
        typeColors={typeColors}
        typeLabels={typeLabels}
      />
    </div>
  );
}

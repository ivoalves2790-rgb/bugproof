"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/use-language";

interface UnitInfo {
  slug: string;
  lessonCount: number;
}

interface CourseProgressProps {
  courseSlug: string;
  totalLessons: number;
  units: UnitInfo[];
}

export function CourseProgress({
  courseSlug,
  totalLessons,
  units,
}: CourseProgressProps) {
  const t = useT();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let total = 0;
    for (const unit of units) {
      const key = `progress:${courseSlug}:${unit.slug}`;
      const completed: string[] = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      total += completed.length;
    }
    setCompletedCount(total);
  }, [courseSlug, units]);

  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const levelKey =
    progress >= 80 ? "profile.level.expert" : progress >= 40 ? "profile.level.intermediate" : "profile.level.novice";

  return (
    <div className="mt-4">
      <ProgressBar value={progress} size="md" color="green" />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>
          {completedCount} / {totalLessons} {t("courses.lessons")} &middot; {units.length} {t("courses.units")}
        </span>
        <Badge variant="default">{t(levelKey)}</Badge>
      </div>
    </div>
  );
}

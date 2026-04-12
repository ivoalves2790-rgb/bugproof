"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconFlame, IconStar, IconHeart, IconCheckCircle, IconSettings } from "@/components/ui/Icons";
import { getCourses } from "@/lib/content/loader";
import { getUserLevelProgress } from "@/lib/engine/level-calculator";
import { useProgressStats } from "@/lib/progress/use-progress";
import { useLanguage } from "@/lib/i18n/use-language";
import Link from "next/link";

function getCourseCompletedCount(courseSlug: string): number {
  let completed = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`progress:${courseSlug}:`)) {
      const items: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      completed += items.length;
    }
  }
  return completed;
}

export default function ProfilePage() {
  const { locale, t } = useLanguage();
  const { totalCompleted: lessonsCompleted, totalXP } = useProgressStats();
  const streak = Math.min(lessonsCompleted, 7);
  const levelProgress = getUserLevelProgress(totalXP);
  const courses = getCourses(locale);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress: Record<string, number> = {};
    for (const course of courses) {
      const completed = getCourseCompletedCount(course.slug);
      progress[course.slug] =
        course.lessonCount > 0
          ? Math.round((completed / course.lessonCount) * 100)
          : 0;
    }
    setCourseProgress(progress);
  }, [courses]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("profile.title")}
        </h1>
      </div>

      {/* User card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terminal-green/10 text-2xl font-bold text-terminal-green">
            BP
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("profile.engineer")}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="green">Level {levelProgress.level}</Badge>
              <span className="text-xs text-muted-foreground">
                {totalXP} XP total
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar
            value={levelProgress.progress}
            size="sm"
            color="gold"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            {levelProgress.currentXP} / {levelProgress.nextLevelXP} {t("profile.xpToNext")}
          </p>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2">
            <IconStar size={18} className="text-xp-gold" />
            <div>
              <div className="text-lg font-bold">{totalXP}</div>
              <div className="text-[10px] text-muted-foreground">{t("profile.totalXP")}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconFlame size={18} className="text-streak-orange" />
            <div>
              <div className="text-lg font-bold">{streak}</div>
              <div className="text-[10px] text-muted-foreground">{t("profile.dayStreak")}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconCheckCircle size={18} className="text-terminal-green" />
            <div>
              <div className="text-lg font-bold">{lessonsCompleted}</div>
              <div className="text-[10px] text-muted-foreground">{t("profile.lessons")}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconHeart size={18} className="text-heart-red" />
            <div>
              <div className="text-lg font-bold">{3}</div>
              <div className="text-[10px] text-muted-foreground">{t("profile.hearts")}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Course progress */}
      <h3 className="mb-3 font-semibold">{t("profile.courseProgress")}</h3>
      <div className="space-y-2">
        {courses.map((course) => {
          const progress = courseProgress[course.slug] || 0;
          const level =
            progress >= 80
              ? t("profile.level.expert")
              : progress >= 40
                ? t("profile.level.intermediate")
                : t("profile.level.novice");
          return (
            <Card key={course.slug}>
              <div className="flex items-center justify-between">
                <span className="text-sm">{course.title}</span>
                <Badge variant="default">{level}</Badge>
              </div>
              <ProgressBar
                value={progress}
                size="sm"
                color="green"
                animated={false}
                className="mt-2"
              />
            </Card>
          );
        })}
      </div>

      {/* Settings link */}
      <Link href="/settings" className="mt-6 block">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconSettings size={18} className="text-muted-foreground" />
              <span className="text-sm font-semibold">{t("nav.settings")}</span>
            </div>
            <span className="text-muted-foreground">&rarr;</span>
          </div>
        </Card>
      </Link>
    </div>
  );
}

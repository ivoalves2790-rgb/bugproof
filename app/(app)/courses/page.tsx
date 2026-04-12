"use client";

import { useState } from "react";
import { getCourses } from "@/lib/content/loader";
import { CourseCard } from "@/components/course/CourseCard";
import { useLanguage } from "@/lib/i18n/use-language";
import { getRandomMessage, COURSE_PAGE_MESSAGES } from "@/lib/motivation/messages";

export default function CoursesPage() {
  const { locale, t } = useLanguage();
  const courses = getCourses(locale);
  const [motivation] = useState(() => getRandomMessage(COURSE_PAGE_MESSAGES, locale));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("courses.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {courses.length} {t("courses.subtitle")}
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-xp-gold/20 bg-xp-gold/5 px-4 py-3">
        <p className="text-xs text-xp-gold/90 leading-relaxed">
          {motivation}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { getCourses } from "@/lib/content/loader";
import { CourseCard } from "@/components/course/CourseCard";
import { useLanguage } from "@/lib/i18n/use-language";

export default function CoursesPage() {
  const { locale, t } = useLanguage();
  const courses = getCourses(locale);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> {t("courses.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {courses.length} {t("courses.subtitle")}
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

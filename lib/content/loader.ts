import type { CourseIndex, Course, Unit, Lesson } from "@/lib/types/content.types";
import coursesData from "@/content/courses.json";

export function getCourses(): CourseIndex[] {
  return coursesData as CourseIndex[];
}

export function getCourse(slug: string): CourseIndex | undefined {
  return getCourses().find((c) => c.slug === slug);
}

export async function getFullCourse(slug: string): Promise<Course | null> {
  try {
    const mod = await import(`@/content/${slug}/course.json`);
    return mod.default as Course;
  } catch {
    return null;
  }
}

export async function getUnit(
  courseSlug: string,
  unitSlug: string
): Promise<Unit | null> {
  try {
    // Try loading each possible unit file by checking the course first
    const course = await getFullCourse(courseSlug);
    if (!course) return null;

    const unitRef = course.units.find((u) => u.slug === unitSlug);
    if (!unitRef) return null;

    const unitOrder = String(unitRef.order).padStart(2, "0");
    const mod = await import(
      `@/content/${courseSlug}/units/${unitOrder}-${unitSlug}.json`
    );
    return mod.default as Unit;
  } catch {
    return null;
  }
}

export async function getAllUnits(courseSlug: string): Promise<Unit[]> {
  const course = await getFullCourse(courseSlug);
  if (!course) return [];

  const units: Unit[] = [];
  for (const unitRef of course.units) {
    const unit = await getUnit(courseSlug, unitRef.slug);
    if (unit) units.push(unit);
  }
  return units;
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  try {
    const mod = await import(
      `@/content/${courseSlug}/lessons/${lessonSlug}.json`
    );
    return mod.default as Lesson;
  } catch {
    return null;
  }
}

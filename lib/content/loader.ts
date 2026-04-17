import type { CourseIndex, Course, Unit, Lesson, ProjectIndex, Project, Chapter } from "@/lib/types/content.types";
import coursesData from "@/content/courses.json";
import coursesDataEs from "@/content/courses-es.json";
import projectsData from "@/content/projects.json";
import projectsDataEs from "@/content/projects-es.json";

export function getLocale(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bugproof:language") || "en";
  }
  return "en";
}

export function getCourses(locale?: string): CourseIndex[] {
  const lang = locale || "en";
  return (lang === "es" ? coursesDataEs : coursesData) as CourseIndex[];
}

export function getCourse(slug: string, locale?: string): CourseIndex | undefined {
  return getCourses(locale).find((c) => c.slug === slug);
}

export async function getFullCourse(slug: string, locale?: string): Promise<Course | null> {
  try {
    if (locale && locale !== "en") {
      try {
        const localeMod = await import(`@/content/${slug}/course-${locale}.json`);
        return localeMod.default as Course;
      } catch {
        // Fall through to English
      }
    }
    const mod = await import(`@/content/${slug}/course.json`);
    return mod.default as Course;
  } catch {
    return null;
  }
}

export async function getUnit(
  courseSlug: string,
  unitSlug: string,
  locale?: string
): Promise<Unit | null> {
  try {
    const course = await getFullCourse(courseSlug);
    if (!course) return null;

    const unitRef = course.units.find((u) => u.slug === unitSlug);
    if (!unitRef) return null;

    const unitOrder = String(unitRef.order).padStart(2, "0");

    if (locale && locale !== "en") {
      try {
        const localeMod = await import(
          `@/content/${courseSlug}/units-${locale}/${unitOrder}-${unitSlug}.json`
        );
        return localeMod.default as Unit;
      } catch {
        // Fall through to English
      }
    }

    const mod = await import(
      `@/content/${courseSlug}/units/${unitOrder}-${unitSlug}.json`
    );
    return mod.default as Unit;
  } catch {
    return null;
  }
}

export async function getAllUnits(courseSlug: string, locale?: string): Promise<Unit[]> {
  const course = await getFullCourse(courseSlug);
  if (!course) return [];

  const results = await Promise.all(
    course.units.map((unitRef) => getUnit(courseSlug, unitRef.slug, locale))
  );
  return results.filter((u): u is Unit => u !== null);
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

// --- Project loaders ---

export function getProjects(locale?: string): ProjectIndex[] {
  const lang = locale || "en";
  return (lang === "es" ? projectsDataEs : projectsData) as ProjectIndex[];
}

export function getProject(slug: string, locale?: string): ProjectIndex | undefined {
  return getProjects(locale).find((p) => p.slug === slug);
}

export async function getFullProject(slug: string): Promise<Project | null> {
  try {
    const mod = await import(`@/content/projects/${slug}/project.json`);
    return mod.default as Project;
  } catch {
    return null;
  }
}

export async function getChapter(
  projectSlug: string,
  chapterSlug: string,
  locale?: string
): Promise<Chapter | null> {
  try {
    const project = await getFullProject(projectSlug);
    if (!project) return null;

    const chapterRef = project.chapters.find((c) => c.slug === chapterSlug);
    if (!chapterRef) return null;

    const chapterOrder = String(chapterRef.order).padStart(2, "0");

    // Try locale-specific chapter first
    if (locale && locale !== "en") {
      try {
        const localeMod = await import(
          `@/content/projects/${projectSlug}/chapters-${locale}/${chapterOrder}-${chapterSlug}.json`
        );
        return localeMod.default as Chapter;
      } catch {
        // Fall through to English
      }
    }

    const mod = await import(
      `@/content/projects/${projectSlug}/chapters/${chapterOrder}-${chapterSlug}.json`
    );
    return mod.default as Chapter;
  } catch {
    return null;
  }
}

export async function getAllChapters(projectSlug: string, locale?: string): Promise<Chapter[]> {
  const project = await getFullProject(projectSlug);
  if (!project) return [];

  const results = await Promise.all(
    project.chapters.map((chapterRef) => getChapter(projectSlug, chapterRef.slug, locale))
  );
  return results.filter((c): c is Chapter => c !== null);
}

export async function getProjectLesson(
  projectSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  try {
    const mod = await import(
      `@/content/projects/${projectSlug}/lessons/${lessonSlug}.json`
    );
    return mod.default as Lesson;
  } catch {
    return null;
  }
}

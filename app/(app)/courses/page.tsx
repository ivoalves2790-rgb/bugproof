import { getCourses } from "@/lib/content/loader";
import { CourseCard } from "@/components/course/CourseCard";

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> All Courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {courses.length} courses covering everything a vibe coder needs to know.
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

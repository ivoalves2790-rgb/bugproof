import { getCourses } from "@/lib/content/loader";
import { CourseCard } from "@/components/course/CourseCard";

export default function DashboardPage() {
  const courses = getCourses();

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a course and start learning. Each lesson takes 2-5 minutes.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-xp-gold">0</div>
          <div className="text-[10px] text-muted-foreground">Total XP</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-streak-orange">0</div>
          <div className="text-[10px] text-muted-foreground">Day Streak</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-terminal-green">0</div>
          <div className="text-[10px] text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Course grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Courses</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

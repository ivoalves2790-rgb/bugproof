"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { COURSE_ICONS } from "@/components/ui/Icons";
import type { CourseIndex } from "@/lib/types/content.types";

interface CourseCardProps {
  course: CourseIndex;
  progress?: number; // 0-100
  level?: string;
}

export function CourseCard({ course, progress = 0, level }: CourseCardProps) {
  const Icon = COURSE_ICONS[course.icon];

  return (
    <Link href={`/courses/${course.slug}`}>
      <Card variant="interactive" className="h-full">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${course.color}20` }}
          >
            {Icon && <Icon size={20} style={{ color: course.color }} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{course.title}</h3>
              {level && (
                <Badge
                  variant={
                    level === "architect"
                      ? "green"
                      : level === "engineer"
                        ? "blue"
                        : level === "apprentice"
                          ? "amber"
                          : "default"
                  }
                >
                  {level}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 sm:truncate">
              {course.description}
            </p>
            <div className="mt-2">
              <ProgressBar
                value={progress}
                size="sm"
                color={progress === 100 ? "green" : "amber"}
                animated={false}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted">
                <span>{course.lessonCount} lessons</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

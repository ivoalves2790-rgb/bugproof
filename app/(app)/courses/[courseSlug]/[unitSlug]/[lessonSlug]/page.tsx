"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { LessonPlayer } from "@/components/exercises/LessonPlayer";

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; unitSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, unitSlug, lessonSlug } = use(params);
  const router = useRouter();

  function handleComplete(score: number, xpEarned: number) {
    // TODO: Save progress to Supabase
    // For now, navigate back to unit page
    router.push(`/courses/${courseSlug}/${unitSlug}`);
  }

  function handleExit() {
    router.push(`/courses/${courseSlug}/${unitSlug}`);
  }

  return (
    <LessonPlayer
      courseSlug={courseSlug}
      unitSlug={unitSlug}
      lessonSlug={lessonSlug}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}

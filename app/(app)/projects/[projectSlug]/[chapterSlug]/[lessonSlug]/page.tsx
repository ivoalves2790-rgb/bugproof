"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { LessonPlayer } from "@/components/exercises/LessonPlayer";
import { InterstitialAd } from "@/components/ads/InterstitialAd";
import { usePremium } from "@/lib/hooks/use-premium";

export default function ProjectLessonPage({
  params,
}: {
  params: Promise<{ projectSlug: string; chapterSlug: string; lessonSlug: string }>;
}) {
  const { projectSlug, chapterSlug, lessonSlug } = use(params);
  const router = useRouter();
  const { isPremium } = usePremium();
  const [showAd, setShowAd] = useState(false);
  const [returnPath, setReturnPath] = useState("");

  function handleComplete(score: number, xpEarned: number) {
    const key = `progress:${projectSlug}:${chapterSlug}`;
    const completed: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!completed.includes(lessonSlug)) {
      completed.push(lessonSlug);
      localStorage.setItem(key, JSON.stringify(completed));
      const currentXP = parseInt(localStorage.getItem("bugproof:totalXP") || "0", 10);
      localStorage.setItem("bugproof:totalXP", String(currentXP + xpEarned));
    }

    const path = `/projects/${projectSlug}/${chapterSlug}`;
    if (!isPremium) {
      setReturnPath(path);
      setShowAd(true);
    } else {
      router.push(path);
    }
  }

  function handleExit() {
    router.push(`/projects/${projectSlug}/${chapterSlug}`);
  }

  if (showAd) {
    return <InterstitialAd onClose={() => router.push(returnPath)} />;
  }

  return (
    <LessonPlayer
      courseSlug={`projects/${projectSlug}`}
      unitSlug={chapterSlug}
      lessonSlug={lessonSlug}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}

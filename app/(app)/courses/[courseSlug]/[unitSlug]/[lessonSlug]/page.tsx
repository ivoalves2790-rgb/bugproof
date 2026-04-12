"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { LessonPlayer } from "@/components/exercises/LessonPlayer";
import { InterstitialAd } from "@/components/ads/InterstitialAd";
import { usePremium } from "@/lib/hooks/use-premium";

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; unitSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, unitSlug, lessonSlug } = use(params);
  const router = useRouter();
  const { isPremium } = usePremium();
  const [showAd, setShowAd] = useState(false);
  const [returnPath, setReturnPath] = useState("");

  function handleComplete(score: number, xpEarned: number) {
    const key = `progress:${courseSlug}:${unitSlug}`;
    const completed: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!completed.includes(lessonSlug)) {
      completed.push(lessonSlug);
      localStorage.setItem(key, JSON.stringify(completed));
      const currentXP = parseInt(localStorage.getItem("bugproof:totalXP") || "0", 10);
      localStorage.setItem("bugproof:totalXP", String(currentXP + xpEarned));
    }

    const path = `/courses/${courseSlug}/${unitSlug}`;
    if (!isPremium) {
      setReturnPath(path);
      setShowAd(true);
    } else {
      router.push(path);
    }
  }

  function handleExit() {
    router.push(`/courses/${courseSlug}/${unitSlug}`);
  }

  if (showAd) {
    return <InterstitialAd onClose={() => router.push(returnPath)} />;
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

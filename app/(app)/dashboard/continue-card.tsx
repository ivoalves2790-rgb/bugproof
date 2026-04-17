"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useT } from "@/lib/i18n/use-language";

interface ChapterInfo {
  slug: string;
  title: string;
  order: number;
  lessonCount: number;
}

interface ContinueCardProps {
  projectSlug: string;
  projectTitle: string;
  chapters: ChapterInfo[];
}

export function ContinueCard({
  projectSlug,
  projectTitle,
  chapters,
}: ContinueCardProps) {
  const t = useT();
  const [currentChapter, setCurrentChapter] = useState(chapters[0]);
  const [completedInChapter, setCompletedInChapter] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    let total = 0;
    let lessonTotal = 0;
    let foundCurrent = false;

    for (const chapter of chapters) {
      const key = `progress:${projectSlug}:${chapter.slug}`;
      const completed: string[] = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      total += completed.length;
      lessonTotal += chapter.lessonCount;

      if (!foundCurrent) {
        if (completed.length < chapter.lessonCount) {
          setCurrentChapter(chapter);
          setCompletedInChapter(completed.length);
          foundCurrent = true;
        } else if (completed.length >= chapter.lessonCount && chapter.lessonCount > 0) {
          // This chapter is complete, continue to next
        }
      }
    }

    if (!foundCurrent) {
      // All chapters complete, show last chapter
      const lastChapter = chapters[chapters.length - 1];
      setCurrentChapter(lastChapter);
      setCompletedInChapter(lastChapter.lessonCount);
    }

    setTotalCompleted(total);
    setTotalLessons(lessonTotal);
  }, [projectSlug, chapters]);

  const progress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <Link href={`/projects/${projectSlug}/${currentChapter.slug}`} className="block">
        <Card variant="glow" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium text-terminal-green uppercase tracking-wider">
              {t("dashboard.continueBuilding")}
            </span>
            <Badge variant="green">
              {t("chapter.chapter")} {currentChapter.order} {t("chapter.of")} {chapters.length}
            </Badge>
          </div>
          <h2 className="text-lg font-bold mb-1">{projectTitle}</h2>
          <p className="text-xs text-muted-foreground mb-3">
            {currentChapter.title} &mdash; {t("chapter.lesson")} {completedInChapter + 1} {t("chapter.of")}{" "}
            {currentChapter.lessonCount || "?"}
          </p>
          <ProgressBar value={progress} size="sm" color="green" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="breathe mt-4 flex items-center justify-center rounded-lg bg-terminal-green px-6 py-2.5 font-mono font-bold text-background text-sm"
          >
            {t("dashboard.continue")}
          </motion.div>
        </Card>
      </Link>
    </motion.div>
  );
}

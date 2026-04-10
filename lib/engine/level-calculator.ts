import { LEVEL_THRESHOLDS, USER_LEVEL_XP_PER_LEVEL, USER_LEVEL_MAX } from "@/lib/utils/constants";
import type { CourseLevel } from "@/lib/utils/constants";

export function getCourseLevel(courseXP: number): CourseLevel {
  if (courseXP >= LEVEL_THRESHOLDS.architect) return "architect";
  if (courseXP >= LEVEL_THRESHOLDS.engineer) return "engineer";
  if (courseXP >= LEVEL_THRESHOLDS.apprentice) return "apprentice";
  return "novice";
}

export function getCourseLevelProgress(courseXP: number): {
  level: CourseLevel;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const level = getCourseLevel(courseXP);
  const levels: CourseLevel[] = ["novice", "apprentice", "engineer", "architect"];
  const currentIndex = levels.indexOf(level);

  if (level === "architect") {
    return {
      level,
      currentXP: courseXP,
      nextLevelXP: LEVEL_THRESHOLDS.architect,
      progress: 100,
    };
  }

  const nextLevel = levels[currentIndex + 1];
  const currentThreshold = LEVEL_THRESHOLDS[level];
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
  const progress = Math.round(
    ((courseXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );

  return {
    level,
    currentXP: courseXP - currentThreshold,
    nextLevelXP: nextThreshold - currentThreshold,
    progress,
  };
}

export function getUserLevel(totalXP: number): number {
  return Math.min(
    Math.floor(totalXP / USER_LEVEL_XP_PER_LEVEL) + 1,
    USER_LEVEL_MAX
  );
}

export function getUserLevelProgress(totalXP: number): {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const level = getUserLevel(totalXP);
  if (level >= USER_LEVEL_MAX) {
    return { level, currentXP: totalXP, nextLevelXP: totalXP, progress: 100 };
  }

  const currentLevelStart = (level - 1) * USER_LEVEL_XP_PER_LEVEL;
  const currentXP = totalXP - currentLevelStart;
  const progress = Math.round((currentXP / USER_LEVEL_XP_PER_LEVEL) * 100);

  return { level, currentXP, nextLevelXP: USER_LEVEL_XP_PER_LEVEL, progress };
}

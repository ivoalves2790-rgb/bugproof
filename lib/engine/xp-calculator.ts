import { XP_REWARDS, XP_BONUSES } from "@/lib/utils/constants";

interface XPCalculation {
  baseXP: number;
  firstTryBonus: number;
  streakBonus: number;
  perfectBonus: number;
  totalXP: number;
}

export function calculateXP(
  difficulty: 1 | 2 | 3,
  scorePercent: number,
  isFirstAttempt: boolean,
  streakDays: number
): XPCalculation {
  const difficultyMap = { 1: "easy", 2: "medium", 3: "hard" } as const;
  const baseXP = XP_REWARDS[difficultyMap[difficulty]];

  let firstTryBonus = 0;
  if (isFirstAttempt && scorePercent >= 50) {
    firstTryBonus = Math.round(baseXP * (XP_BONUSES.firstTry - 1));
  }

  const streakMultiplier = Math.min(
    streakDays * XP_BONUSES.streakPerDay,
    XP_BONUSES.streakCap
  );
  const streakBonus = Math.round(baseXP * streakMultiplier);

  let perfectBonus = 0;
  if (scorePercent === 100) {
    perfectBonus = Math.round(baseXP * (XP_BONUSES.perfectScore - 1));
  }

  const totalXP = baseXP + firstTryBonus + streakBonus + perfectBonus;

  return { baseXP, firstTryBonus, streakBonus, perfectBonus, totalXP };
}

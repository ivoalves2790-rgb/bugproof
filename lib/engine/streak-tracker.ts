export interface StreakResult {
  streakCount: number;
  longestStreak: number;
  streakMaintained: boolean;
  isNewDay: boolean;
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastStreakDate: string | null // ISO date string YYYY-MM-DD
): StreakResult {
  const today = new Date().toISOString().split("T")[0];

  // No previous activity
  if (!lastStreakDate) {
    return {
      streakCount: 1,
      longestStreak: Math.max(longestStreak, 1),
      streakMaintained: true,
      isNewDay: true,
    };
  }

  // Already completed a lesson today
  if (lastStreakDate === today) {
    return {
      streakCount: currentStreak,
      longestStreak,
      streakMaintained: true,
      isNewDay: false,
    };
  }

  // Check if yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastStreakDate === yesterdayStr) {
    // Continue streak
    const newStreak = currentStreak + 1;
    return {
      streakCount: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      streakMaintained: true,
      isNewDay: true,
    };
  }

  // Streak broken - start over
  return {
    streakCount: 1,
    longestStreak,
    streakMaintained: false,
    isNewDay: true,
  };
}

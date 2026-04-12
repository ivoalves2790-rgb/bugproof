"use client";

import { useState, useEffect } from "react";

export interface ProgressStats {
  totalCompleted: number;
  totalXP: number;
}

export function useProgressStats(): ProgressStats {
  const [stats, setStats] = useState<ProgressStats>({
    totalCompleted: 0,
    totalXP: 0,
  });

  useEffect(() => {
    let totalCompleted = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("progress:")) {
        const completed: string[] = JSON.parse(
          localStorage.getItem(key) || "[]"
        );
        totalCompleted += completed.length;
      }
    }

    const savedXP = parseInt(
      localStorage.getItem("bugproof:totalXP") || "0",
      10
    );
    // Use saved XP if available, otherwise estimate from completions
    const totalXP = savedXP > 0 ? savedXP : totalCompleted * 12;

    setStats({ totalCompleted, totalXP });
  }, []);

  return stats;
}

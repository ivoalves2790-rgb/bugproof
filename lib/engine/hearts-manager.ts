import { HEARTS } from "@/lib/utils/constants";

interface HeartsState {
  hearts: number;
  maxHearts: number;
  nextRechargeAt: Date | null;
  canPlay: boolean;
}

export function calculateHearts(
  currentHearts: number,
  maxHearts: number,
  lastRechargeTime: Date
): HeartsState {
  const now = new Date();
  const elapsed = now.getTime() - lastRechargeTime.getTime();
  const rechargeMs = HEARTS.rechargeMinutes * 60 * 1000;

  // Calculate how many hearts to recharge
  const heartsToRecharge = Math.floor(elapsed / rechargeMs);
  const newHearts = Math.min(currentHearts + heartsToRecharge, maxHearts);

  // Calculate when next heart recharges
  let nextRechargeAt: Date | null = null;
  if (newHearts < maxHearts) {
    const remainingMs = rechargeMs - (elapsed % rechargeMs);
    nextRechargeAt = new Date(now.getTime() + remainingMs);
  }

  return {
    hearts: newHearts,
    maxHearts,
    nextRechargeAt,
    canPlay: newHearts > 0,
  };
}

export function deductHeart(currentHearts: number): {
  hearts: number;
  outOfHearts: boolean;
} {
  const newHearts = Math.max(currentHearts - 1, 0);
  return { hearts: newHearts, outOfHearts: newHearts === 0 };
}

export function formatRechargeTime(nextRechargeAt: Date): string {
  const now = new Date();
  const diff = nextRechargeAt.getTime() - now.getTime();
  if (diff <= 0) return "Ready!";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

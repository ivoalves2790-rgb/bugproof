import type {
  BugHuntExercise,
  SwipeCard,
  IncidentResponseExercise,
  IncidentChoice,
} from "@/lib/types/content.types";

export interface BugHuntResult {
  lineCorrect: boolean;
  fixCorrect: boolean;
  correct: boolean;
  explanation: string;
}

export interface SwipeCardResult {
  correct: boolean;
  explanation: string;
}

export interface IncidentResponseResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  path: string[];
}

/**
 * Evaluate a Bug Hunt exercise attempt.
 * Returns whether the user found the correct buggy line and selected the right fix.
 */
export function evaluateBugHunt(
  selectedLine: number,
  selectedFixId: string,
  exercise: BugHuntExercise
): BugHuntResult {
  const lineCorrect = selectedLine === exercise.correctBuggyLine;
  const selectedFix = exercise.fixes.find((f) => f.id === selectedFixId);
  const fixCorrect = selectedFix?.isCorrect === true;
  const correct = lineCorrect && fixCorrect;

  return {
    lineCorrect,
    fixCorrect,
    correct,
    explanation: exercise.explanation,
  };
}

/**
 * Evaluate a single Swipe to Judge card.
 * swipeRight = true means user judged it as "good practice".
 */
export function evaluateSwipeCard(
  swipeRight: boolean,
  card: SwipeCard
): SwipeCardResult {
  const correct = swipeRight === card.isGoodPractice;

  return {
    correct,
    explanation: card.explanation,
  };
}

/**
 * Evaluate a completed Incident Response exercise.
 * Walks the taken path and sums up the scores from each choice.
 */
export function evaluateIncidentResponse(
  choicesMade: { nodeId: string; choiceId: string }[],
  exercise: IncidentResponseExercise
): IncidentResponseResult {
  let score = 0;
  let maxScore = 0;
  const path: string[] = [exercise.startNode];

  for (const { nodeId, choiceId } of choicesMade) {
    const node = exercise.nodes[nodeId];
    if (!node) continue;

    // Find the chosen option
    const chosen = node.choices.find((c) => c.id === choiceId);
    if (chosen) {
      score += chosen.score;
      path.push(chosen.nextNode);
    }

    // Calculate max possible score for this node
    const bestChoice = node.choices.reduce(
      (best, c) => (c.score > best.score ? c : best),
      node.choices[0]
    );
    if (bestChoice) {
      maxScore += bestChoice.score;
    }
  }

  // Get feedback from the end node
  const lastNodeId = path[path.length - 1];
  const endNode = exercise.nodes[lastNodeId];
  const feedback = endNode?.feedback || "Exercise complete.";

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    score,
    maxScore,
    percentage,
    feedback,
    path,
  };
}

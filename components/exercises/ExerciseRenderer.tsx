"use client";

import type { Lesson, BugHuntExercise, SwipeToJudgeExercise, IncidentResponseExercise } from "@/lib/types/content.types";
import { BugHunt } from "./BugHunt";
import { SwipeToJudge } from "./SwipeToJudge";
import { IncidentResponse } from "./IncidentResponse";

interface ExerciseRendererProps {
  lesson: Lesson;
  onComplete: (result: ExerciseResult) => void;
}

export interface ExerciseResult {
  lessonSlug: string;
  type: string;
  correct?: boolean;
  score?: number;
  maxScore?: number;
  total?: number;
  xpEarned: number;
}

export function ExerciseRenderer({ lesson, onComplete }: ExerciseRendererProps) {
  switch (lesson.type) {
    case "bug_hunt":
      return (
        <BugHunt
          exercise={lesson.exercise as BugHuntExercise}
          onComplete={(result) =>
            onComplete({
              lessonSlug: lesson.slug,
              type: lesson.type,
              correct: result.correct,
              xpEarned: result.correct ? lesson.xpReward : Math.round(lesson.xpReward * 0.25),
            })
          }
        />
      );

    case "swipe_to_judge":
      return (
        <SwipeToJudge
          exercise={lesson.exercise as SwipeToJudgeExercise}
          onComplete={(result) => {
            const percentage = result.total > 0 ? result.score / result.total : 0;
            return onComplete({
              lessonSlug: lesson.slug,
              type: lesson.type,
              score: result.score,
              total: result.total,
              correct: percentage >= 0.7,
              xpEarned: Math.round(lesson.xpReward * percentage),
            });
          }}
        />
      );

    case "incident_response":
      return (
        <IncidentResponse
          exercise={lesson.exercise as IncidentResponseExercise}
          onComplete={(result) => {
            const percentage =
              result.maxScore > 0 ? result.score / result.maxScore : 0;
            return onComplete({
              lessonSlug: lesson.slug,
              type: lesson.type,
              score: result.score,
              maxScore: result.maxScore,
              correct: percentage >= 0.7,
              xpEarned: Math.round(lesson.xpReward * Math.max(percentage, 0.25)),
            });
          }}
        />
      );

    case "terminal_sim":
    case "prompt_challenge":
    case "code_review":
    case "architecture_decision":
      return (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">
            This exercise type is coming soon.
          </p>
        </div>
      );

    default: {
      return (
        <div className="rounded-lg border border-terminal-red/30 bg-terminal-red/5 p-4">
          <p className="text-sm text-terminal-red">
            Unknown exercise type: {lesson.type}
          </p>
        </div>
      );
    }
  }
}

import type { CourseLevel, CourseSlug } from "@/lib/utils/constants";
import type { AssessmentAnswer } from "@/lib/types/user.types";

interface CourseAssessment {
  courseSlug: CourseSlug;
  score: number; // 0-100
  level: CourseLevel;
  totalQuestions: number;
  correctAnswers: number;
}

interface AssessmentSummary {
  overallScore: number;
  courseResults: CourseAssessment[];
}

export function scoreAssessment(
  answers: AssessmentAnswer[],
  courseSlugMap: Record<string, CourseSlug>
): AssessmentSummary {
  // Group by course
  const courseMap = new Map<CourseSlug, { total: number; correct: number }>();

  for (const answer of answers) {
    const courseSlug = courseSlugMap[answer.questionId];
    if (!courseSlug) continue;

    const existing = courseMap.get(courseSlug) || { total: 0, correct: 0 };
    existing.total++;
    if (answer.correct) existing.correct++;
    courseMap.set(courseSlug, existing);
  }

  const courseResults: CourseAssessment[] = [];

  for (const [courseSlug, data] of courseMap) {
    const score = Math.round((data.correct / data.total) * 100);
    const level = scoreToLevel(score);
    courseResults.push({
      courseSlug,
      score,
      level,
      totalQuestions: data.total,
      correctAnswers: data.correct,
    });
  }

  const overallScore =
    answers.length > 0
      ? Math.round(
          (answers.filter((a) => a.correct).length / answers.length) * 100
        )
      : 0;

  return { overallScore, courseResults };
}

function scoreToLevel(score: number): CourseLevel {
  if (score >= 80) return "engineer";
  if (score >= 50) return "apprentice";
  return "novice";
}

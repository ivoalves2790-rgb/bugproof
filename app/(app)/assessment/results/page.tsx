"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RadarChart } from "@/components/ui/RadarChart";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { scoreAssessment } from "@/lib/engine/assessment-scorer";
import assessmentData from "@/content/assessment.json";
import type { AssessmentAnswer } from "@/lib/types/user.types";
import type { CourseSlug } from "@/lib/utils/constants";

const courseLabels: Record<string, string> = {
  "git-version-control": "Git",
  "debugging-error-reading": "Debug",
  "security-fundamentals": "Security",
  "system-architecture": "Architecture",
  "database-design": "Database",
  "deployment-devops": "Deploy",
  testing: "Testing",
  "performance-scaling": "Performance",
  "code-organization": "Code Org",
  "ai-assisted-development": "AI Dev",
};

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ReturnType<typeof scoreAssessment> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("assessmentAnswers");
    if (!stored) {
      router.push("/assessment");
      return;
    }

    const answers: AssessmentAnswer[] = JSON.parse(stored);

    // Build question -> course slug map
    const courseSlugMap: Record<string, CourseSlug> = {};
    for (const q of assessmentData.questions) {
      courseSlugMap[q.id] = q.courseSlug as CourseSlug;
    }

    setResults(scoreAssessment(answers, courseSlugMap));
  }, [router]);

  if (!results) return null;

  const chartLabels = results.courseResults.map(
    (r) => courseLabels[r.courseSlug] || r.courseSlug
  );
  const chartValues = results.courseResults.map((r) => r.score);

  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold">
        <span className="text-terminal-green">{">"}</span> Your Skill Map
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Overall score: {results.overallScore}%
      </p>

      {/* Radar chart */}
      <div className="my-8 flex justify-center">
        <RadarChart
          labels={chartLabels}
          values={chartValues}
          size={300}
        />
      </div>

      {/* Course breakdown */}
      <div className="space-y-2 text-left">
        {results.courseResults.map((cr) => (
          <Card key={cr.courseSlug}>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {courseLabels[cr.courseSlug] || cr.courseSlug}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {cr.correctAnswers}/{cr.totalQuestions}
                </span>
                <Badge
                  variant={
                    cr.level === "engineer"
                      ? "green"
                      : cr.level === "apprentice"
                        ? "amber"
                        : "default"
                  }
                >
                  {cr.level}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button
          className="w-full"
          onClick={() => {
            sessionStorage.removeItem("assessmentAnswers");
            router.push("/dashboard");
          }}
        >
          Start Learning
        </Button>
      </div>
    </div>
  );
}

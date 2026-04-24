"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/use-language";
import courses from "@/content/courses.json";

const COURSE_COUNT = courses.length;

export default function AssessmentIntroPage() {
  const t = useT();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-md">
        <div className="mb-6 text-5xl">
          <span className="text-terminal-green glow-green">{"{ }"}</span>
        </div>

        <h1 className="text-2xl font-bold">
          {t("assessment.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("assessment.subtitle")}
        </p>

        <Card className="my-6 text-left">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="text-terminal-green">+</span> {t("assessment.time")}
            </p>
            <p>
              <span className="text-terminal-green">+</span> {t("assessment.topics", { count: COURSE_COUNT })}
            </p>
            <p>
              <span className="text-terminal-green">+</span> {t("assessment.jargon")}
            </p>
            <p>
              <span className="text-terminal-green">+</span> {t("assessment.retake")}
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href="/assessment/quiz">
            <Button className="w-full">{t("assessment.start")}</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full">
              {t("assessment.skip")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

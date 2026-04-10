"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AssessmentIntroPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-md">
        <div className="mb-6 text-5xl">
          <span className="text-terminal-green glow-green">{"{ }"}</span>
        </div>

        <h1 className="text-2xl font-bold">
          Let&apos;s see where you&apos;re at
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Answer 15 quick questions so we can customize your learning path. No
          wrong answers here — it&apos;s just to figure out where to start.
        </p>

        <Card className="my-6 text-left">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="text-terminal-green">+</span> Takes about 3
              minutes
            </p>
            <p>
              <span className="text-terminal-green">+</span> Covers all 10
              topics
            </p>
            <p>
              <span className="text-terminal-green">+</span> Jargon explained
              for every question
            </p>
            <p>
              <span className="text-terminal-green">+</span> You can retake it
              anytime
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href="/assessment/quiz">
            <Button className="w-full">Start Assessment</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full">
              Skip for now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

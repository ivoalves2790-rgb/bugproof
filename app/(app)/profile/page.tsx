"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconFlame, IconStar, IconHeart, IconCheckCircle } from "@/components/ui/Icons";
import { getCourses } from "@/lib/content/loader";
import { getUserLevelProgress } from "@/lib/engine/level-calculator";

export default function ProfilePage() {
  // TODO: Fetch real user data from Supabase
  const totalXP = 0;
  const streak = 0;
  const lessonsCompleted = 0;
  const levelProgress = getUserLevelProgress(totalXP);
  const courses = getCourses();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> Profile
        </h1>
      </div>

      {/* User card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terminal-green/10 text-2xl font-bold text-terminal-green">
            VC
          </div>
          <div>
            <h2 className="text-lg font-bold">Vibe Coder</h2>
            <div className="flex items-center gap-2">
              <Badge variant="green">Level {levelProgress.level}</Badge>
              <span className="text-xs text-muted-foreground">
                {totalXP} XP total
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar
            value={levelProgress.progress}
            size="sm"
            color="gold"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            {levelProgress.currentXP} / {levelProgress.nextLevelXP} XP to next
            level
          </p>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2">
            <IconStar size={18} className="text-xp-gold" />
            <div>
              <div className="text-lg font-bold">{totalXP}</div>
              <div className="text-[10px] text-muted-foreground">Total XP</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconFlame size={18} className="text-streak-orange" />
            <div>
              <div className="text-lg font-bold">{streak}</div>
              <div className="text-[10px] text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconCheckCircle size={18} className="text-terminal-green" />
            <div>
              <div className="text-lg font-bold">{lessonsCompleted}</div>
              <div className="text-[10px] text-muted-foreground">Lessons</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <IconHeart size={18} className="text-heart-red" />
            <div>
              <div className="text-lg font-bold">3</div>
              <div className="text-[10px] text-muted-foreground">Hearts</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Course progress */}
      <h3 className="mb-3 font-semibold">Course Progress</h3>
      <div className="space-y-2">
        {courses.map((course) => (
          <Card key={course.slug}>
            <div className="flex items-center justify-between">
              <span className="text-sm">{course.title}</span>
              <Badge variant="default">Novice</Badge>
            </div>
            <ProgressBar
              value={0}
              size="sm"
              color="green"
              animated={false}
              className="mt-2"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

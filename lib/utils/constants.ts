// XP rewards per difficulty
export const XP_REWARDS = {
  easy: 10,
  medium: 15,
  hard: 20,
} as const;

// XP bonuses (multipliers)
export const XP_BONUSES = {
  firstTry: 1.5,
  perfectScore: 1.25,
  streakPerDay: 0.1, // +10% per streak day
  streakCap: 0.5, // max +50%
} as const;

// Hearts
export const HEARTS = {
  max: 3,
  rechargeMinutes: 30,
} as const;

// Course level thresholds
export const LEVEL_THRESHOLDS = {
  novice: 0,
  apprentice: 500,
  engineer: 1500,
  architect: 3000,
} as const;

export type CourseLevel = keyof typeof LEVEL_THRESHOLDS;

// Overall user level (1-50)
export const USER_LEVEL_XP_PER_LEVEL = 200;
export const USER_LEVEL_MAX = 50;

// Exercise types
export const EXERCISE_TYPES = [
  "bug_hunt",
  "swipe_to_judge",
  "incident_response",
  "terminal_sim",
  "prompt_challenge",
  "code_review",
  "architecture_decision",
] as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];

// Course slugs
export const COURSE_SLUGS = [
  "git-version-control",
  "debugging-error-reading",
  "security-fundamentals",
  "system-architecture",
  "database-design",
  "deployment-devops",
  "testing",
  "performance-scaling",
  "code-organization",
  "ai-assisted-development",
] as const;

export type CourseSlug = (typeof COURSE_SLUGS)[number];

// Navigation items
export const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Build", href: "/projects", icon: "hammer" },
  { label: "Library", href: "/courses", icon: "book" },
  { label: "Profile", href: "/profile", icon: "user" },
] as const;

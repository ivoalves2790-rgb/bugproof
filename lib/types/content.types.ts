import type { ExerciseType, CourseSlug, CourseLevel } from "@/lib/utils/constants";

// Course index entry (courses.json)
export interface CourseIndex {
  slug: CourseSlug;
  title: string;
  description: string;
  icon: string;
  order: number;
  unitCount: number;
  lessonCount: number;
  color: string;
}

// Full course data (course.json per course)
export interface Course {
  slug: CourseSlug;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  prerequisites: CourseSlug[];
  units: UnitRef[];
  levelThresholds: Record<CourseLevel, number>;
}

export interface UnitRef {
  slug: string;
  title: string;
  order: number;
}

// Unit data (units/*.json)
export interface Unit {
  slug: string;
  title: string;
  description: string;
  order: number;
  courseSlug: CourseSlug;
  tier?: "beginner" | "intermediate" | "advanced";
  lessons: LessonRef[];
}

export interface LessonRef {
  slug: string;
  title: string;
  type: ExerciseType;
  order: number;
  difficulty: 1 | 2 | 3;
}

// Teach blocks — shown BEFORE the exercise to explain the concept
export type TeachBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code_example"; title?: string; language: string; code: string; annotation?: string }
  | { type: "analogy"; title?: string; body: string }
  | { type: "key_takeaway"; body: string };

// Lesson data (lessons/*.json)
export interface Lesson {
  slug: string;
  title: string;
  type: ExerciseType;
  difficulty: 1 | 2 | 3;
  xpReward: number;
  intro: string;
  teach?: TeachBlock[];
  exercise: BugHuntExercise | SwipeToJudgeExercise | IncidentResponseExercise | TerminalSimExercise;
}

// Bug Hunt exercise
export interface BugHuntExercise {
  language: string;
  code: CodeLine[];
  correctBuggyLine: number;
  prompt: string;
  fixes: FixOption[];
  explanation: string;
  glossaryTerms: string[];
}

export interface CodeLine {
  line: number;
  text: string;
  isBuggy: boolean;
}

export interface FixOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// Swipe to Judge exercise
export interface SwipeToJudgeExercise {
  cards: SwipeCard[];
  glossaryTerms: string[];
}

export interface SwipeCard {
  id: string;
  content: string;
  codeExample?: string;
  codeLanguage?: string;
  isGoodPractice: boolean;
  explanation: string;
}

// Incident Response exercise
export interface IncidentResponseExercise {
  startNode: string;
  nodes: Record<string, IncidentNode>;
  glossaryTerms: string[];
}

export interface IncidentNode {
  narrative: string;
  choices: IncidentChoice[];
  isEnd?: boolean;
  finalScore?: number;
  feedback?: string;
}

export interface IncidentChoice {
  id: string;
  text: string;
  nextNode: string;
  score: number;
}

// Terminal Simulator exercise
export interface TerminalSimExercise {
  initialDirectory: string;
  initialFiles?: string[];
  steps: TerminalStep[];
  completionMessage: string;
  glossaryTerms: string[];
}

export interface TerminalStep {
  instruction: string;
  expectedCommand: string;
  acceptAlternatives: string[];
  output: string;
  hint: string;
}

// Glossary
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedCourses: CourseSlug[];
  relatedTerms: string[];
  example?: string;
}

// Assessment
export interface AssessmentQuestion {
  id: string;
  text: string;
  context?: string; // jargon explanation for non-tech users
  courseSlug: CourseSlug;
  difficulty: 1 | 2 | 3;
  options: AssessmentOption[];
  explanation: string;
}

export interface AssessmentOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

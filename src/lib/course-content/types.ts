import type { Skill } from "@/lib/course-plan";

export type CourseQuestion = {
  id: string;
  prompt: string;
  type: "note-completion" | "short-answer" | "multiple-choice" | "true-false-not-given";
  answerLimit?: string;
  options?: string[];
};

type ActivityBase = {
  id: string;
  skill: Skill;
  title: string;
  instructions: string;
  minutes: number;
};

export type ListeningActivity = ActivityBase & {
  kind: "listening";
  part: 1 | 2 | 3 | 4;
  audioAssetRef: string;
  audioUrl?: string;
  questions: CourseQuestion[];
};

export type ReadingActivity = ActivityBase & {
  kind: "reading";
  passage: string;
  questionFamily: "note-completion" | "short-answer" | "multiple-choice" | "true-false-not-given";
  questions: CourseQuestion[];
};

export type WritingActivity = ActivityBase & {
  kind: "writing";
  taskType: "task1" | "task2";
  prompt: string;
  minimumWords: 150 | 250;
};

export type SpeakingActivity = ActivityBase & {
  kind: "speaking";
  part1: string[];
  part2: { topic: string; prompts: string[]; preparationSeconds: 60; speakingSeconds: 120 };
  part3: string[];
};

export type CourseActivity = ListeningActivity | ReadingActivity | WritingActivity | SpeakingActivity;

export type CourseLessonV2 = {
  schemaVersion: 2;
  id: string;
  databaseId?: string;
  week: number;
  globalDay: number;
  localDay: number;
  title: string;
  topic: string;
  focus: string;
  skills: Skill[];
  durationMinutes: number;
  assessmentKind: "lesson" | "diagnostic";
  phrases: Array<{ phrase: string; use: string }>;
  activities: CourseActivity[];
};

export type ActivityReview = {
  acceptableAnswers?: string[][];
  explanations?: string[];
  transcript?: string;
  modelResponse?: string;
};

export type CourseLessonReviewV2 = {
  schemaVersion: 2;
  activityReviews: Record<string, ActivityReview>;
};

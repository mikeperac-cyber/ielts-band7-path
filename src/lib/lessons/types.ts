export type LessonPhrase = {
  phrase: string;
  use: string;
};

export type LessonReview = {
  answers: string[];
  transcript: string;
};

export interface Lesson {
  id: string;
  day: string;
  title: string;
  duration: string;
  topic: string;
  audioLabel?: string; // e.g. "Original IELTS Academic Section 3 discussion · 4 min practice"
  questions: string[];
  phrases: LessonPhrase[];
  review: LessonReview;
}

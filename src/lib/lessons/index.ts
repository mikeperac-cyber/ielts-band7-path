import { Lesson } from "./types";
import { week1day1 } from "./week1-day1";
import { week5day1 } from "./week5-day1";
import { week10day1 } from "./week10-day1";

const lessons: Record<string, Lesson> = {
  "1-1": week1day1,
  "5-1": week5day1,
  "10-1": week10day1,
};

export function getLesson(week: number, day: number): Lesson | null {
  const key = `${week}-${day}`;
  return lessons[key] || null;
}

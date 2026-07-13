import { Lesson } from "./types";
import { week1day1 } from "./week1-day1";
import { week1day2 } from "./week1-day2";
import { week1day3 } from "./week1-day3";
import { week1day4 } from "./week1-day4";
import { week1day5 } from "./week1-day5";
import { week1day6 } from "./week1-day6";
import { week1day7 } from "./week1-day7";
import { week10day1 } from "./week10-day1";
import { week10day2 } from "./week10-day2";
import { week10day3 } from "./week10-day3";
import { week10day4 } from "./week10-day4";
import { week10day5 } from "./week10-day5";
import { week10day6 } from "./week10-day6";
import { week10day7 } from "./week10-day7";
import { week2day1 } from "./week2-day1";
import { week2day2 } from "./week2-day2";
import { week2day3 } from "./week2-day3";
import { week2day4 } from "./week2-day4";
import { week2day5 } from "./week2-day5";
import { week2day6 } from "./week2-day6";
import { week2day7 } from "./week2-day7";
import { week3day1 } from "./week3-day1";
import { week3day2 } from "./week3-day2";
import { week3day3 } from "./week3-day3";
import { week3day4 } from "./week3-day4";
import { week3day5 } from "./week3-day5";
import { week3day6 } from "./week3-day6";
import { week3day7 } from "./week3-day7";
import { week4day1 } from "./week4-day1";
import { week4day2 } from "./week4-day2";
import { week4day3 } from "./week4-day3";
import { week4day4 } from "./week4-day4";
import { week4day5 } from "./week4-day5";
import { week4day6 } from "./week4-day6";
import { week4day7 } from "./week4-day7";
import { week5day1 } from "./week5-day1";
import { week5day2 } from "./week5-day2";
import { week5day3 } from "./week5-day3";
import { week5day4 } from "./week5-day4";
import { week5day5 } from "./week5-day5";
import { week5day6 } from "./week5-day6";
import { week5day7 } from "./week5-day7";
import { week6day1 } from "./week6-day1";
import { week6day2 } from "./week6-day2";
import { week6day3 } from "./week6-day3";
import { week6day4 } from "./week6-day4";
import { week6day5 } from "./week6-day5";
import { week6day6 } from "./week6-day6";
import { week6day7 } from "./week6-day7";
import { week7day1 } from "./week7-day1";
import { week7day2 } from "./week7-day2";
import { week7day3 } from "./week7-day3";
import { week7day4 } from "./week7-day4";
import { week7day5 } from "./week7-day5";
import { week7day6 } from "./week7-day6";
import { week7day7 } from "./week7-day7";
import { week8day1 } from "./week8-day1";
import { week8day2 } from "./week8-day2";
import { week8day3 } from "./week8-day3";
import { week8day4 } from "./week8-day4";
import { week8day5 } from "./week8-day5";
import { week8day6 } from "./week8-day6";
import { week8day7 } from "./week8-day7";
import { week9day1 } from "./week9-day1";
import { week9day2 } from "./week9-day2";
import { week9day3 } from "./week9-day3";
import { week9day4 } from "./week9-day4";
import { week9day5 } from "./week9-day5";
import { week9day6 } from "./week9-day6";
import { week9day7 } from "./week9-day7";


const lessonsMap: Record<string, Lesson> = {
  "week-1-day-1": week1day1,
  "week-1-day-2": week1day2,
  "week-1-day-3": week1day3,
  "week-1-day-4": week1day4,
  "week-1-day-5": week1day5,
  "week-1-day-6": week1day6,
  "week-1-day-7": week1day7,
  "week-10-day-1": week10day1,
  "week-10-day-2": week10day2,
  "week-10-day-3": week10day3,
  "week-10-day-4": week10day4,
  "week-10-day-5": week10day5,
  "week-10-day-6": week10day6,
  "week-10-day-7": week10day7,
  "week-2-day-1": week2day1,
  "week-2-day-2": week2day2,
  "week-2-day-3": week2day3,
  "week-2-day-4": week2day4,
  "week-2-day-5": week2day5,
  "week-2-day-6": week2day6,
  "week-2-day-7": week2day7,
  "week-3-day-1": week3day1,
  "week-3-day-2": week3day2,
  "week-3-day-3": week3day3,
  "week-3-day-4": week3day4,
  "week-3-day-5": week3day5,
  "week-3-day-6": week3day6,
  "week-3-day-7": week3day7,
  "week-4-day-1": week4day1,
  "week-4-day-2": week4day2,
  "week-4-day-3": week4day3,
  "week-4-day-4": week4day4,
  "week-4-day-5": week4day5,
  "week-4-day-6": week4day6,
  "week-4-day-7": week4day7,
  "week-5-day-1": week5day1,
  "week-5-day-2": week5day2,
  "week-5-day-3": week5day3,
  "week-5-day-4": week5day4,
  "week-5-day-5": week5day5,
  "week-5-day-6": week5day6,
  "week-5-day-7": week5day7,
  "week-6-day-1": week6day1,
  "week-6-day-2": week6day2,
  "week-6-day-3": week6day3,
  "week-6-day-4": week6day4,
  "week-6-day-5": week6day5,
  "week-6-day-6": week6day6,
  "week-6-day-7": week6day7,
  "week-7-day-1": week7day1,
  "week-7-day-2": week7day2,
  "week-7-day-3": week7day3,
  "week-7-day-4": week7day4,
  "week-7-day-5": week7day5,
  "week-7-day-6": week7day6,
  "week-7-day-7": week7day7,
  "week-8-day-1": week8day1,
  "week-8-day-2": week8day2,
  "week-8-day-3": week8day3,
  "week-8-day-4": week8day4,
  "week-8-day-5": week8day5,
  "week-8-day-6": week8day6,
  "week-8-day-7": week8day7,
  "week-9-day-1": week9day1,
  "week-9-day-2": week9day2,
  "week-9-day-3": week9day3,
  "week-9-day-4": week9day4,
  "week-9-day-5": week9day5,
  "week-9-day-6": week9day6,
  "week-9-day-7": week9day7,
};

export function getLesson(week: number, day: number): Lesson | null {
  const key = `week-${week}-day-${day}`;
  return lessonsMap[key] || null;
}

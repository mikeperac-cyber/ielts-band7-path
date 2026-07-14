export type Skill = "Listening" | "Reading" | "Writing" | "Speaking";

export type DayPlan = {
  week: number;
  /** Global programme day (1–70). */
  day: number;
  /** Day within the week (1–7). */
  localDay: number;
  focus: string;
  skills: Skill[];
  duration: string;
  isMock: boolean;
  diagnosticLabel?: string;
};

const themes = [
  "Diagnosis and foundations",
  "Prediction, paraphrase, and accuracy",
  "Writing structure and idea control",
  "Timing and full-task control",
  "Ideas, examples, and higher-level language",
  "Grammar range, accuracy, and pronunciation",
  "Hard question types and academic precision",
  "Integrated exam pressure",
  "Targeted repair and Band 9 consistency",
  "Simulation, polishing, and confidence",
];

const regularDays: Array<{ skills: Skill[]; focus: string }> = [
  { skills: ["Listening", "Speaking"], focus: "Listen precisely and respond naturally" },
  { skills: ["Reading", "Writing"], focus: "Read for evidence and write with control" },
  { skills: ["Listening", "Reading"], focus: "Prediction, distractors, and evidence" },
  { skills: ["Writing", "Speaking"], focus: "Develop ideas with clarity and precision" },
  { skills: ["Reading", "Writing"], focus: "Time pressure, structure, and accuracy" },
];

export const programme: DayPlan[] = Array.from({ length: 10 }, (_, weekIndex) => {
  const week = weekIndex + 1;
  const firstDay = weekIndex * 7 + 1;

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const day = firstDay + dayIndex;
    if (dayIndex === 2 || dayIndex === 6) {
      const harder = dayIndex === 6;
      return {
        week,
        day,
        localDay: dayIndex + 1,
        focus: harder
          ? `Harder ${themes[weekIndex].toLowerCase()} diagnostic`
          : `${themes[weekIndex]} performance check`,
        skills: ["Listening", "Reading", "Writing", "Speaking"] as Skill[],
        duration: "2 h 45 min",
        isMock: true,
        diagnosticLabel: `Timed diagnostic ${week * 2 - (harder ? 0 : 1)}${harder ? " · harder" : ""}`,
      };
    }

    const regularIndex = dayIndex < 2 ? dayIndex : dayIndex - 1;
    const pattern = regularDays[regularIndex];
    return { week, day, localDay: dayIndex + 1, ...pattern, duration: "90–120 min", isMock: false };
  });
}).flat();

export function getDayPlan(week: number, day: number) {
  return programme.find((item) => item.week === week && item.day === day);
}

export function toLocalDay(week: number, globalDay: number) {
  const localDay = globalDay - (week - 1) * 7;
  return Number.isInteger(localDay) && localDay >= 1 && localDay <= 7 ? localDay : null;
}

export const weeklyThemes = themes;

import { getDayPlan, type DayPlan, type Skill } from "@/lib/course-plan";
import { getLesson } from "@/lib/lessons";
import type { Lesson } from "@/lib/lessons/types";
import type { CourseActivity, CourseLessonReviewV2, CourseLessonV2, CourseQuestion } from "./types";

const durationMinutes = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 90;
};

const questionTypeFor = (lesson: Lesson): CourseQuestion["type"] => lesson.questions.every((prompt) => prompt.includes("_")) ? "note-completion" : "multiple-choice";

const questionsFor = (lesson: Lesson): CourseQuestion[] => {
  const kind = questionTypeFor(lesson);
  return lesson.questions.map((prompt, index) => ({
    id: `${lesson.id}-q${index + 1}`,
    prompt,
    type: kind,
    ...(kind === "note-completion" ? { answerLimit: "ONE WORD AND/OR A NUMBER" } : { options: rotate([lesson.review.answers[index], lesson.review.answers[(index + 1) % lesson.review.answers.length], lesson.review.answers[(index + 2) % lesson.review.answers.length]], index % 3) }),
  }));
};

function rotate<T>(items: T[], amount: number) { return [...items.slice(amount), ...items.slice(0, amount)]; }

function readingPassage(lesson: Lesson) {
  const findings = lesson.review.answers.slice(0, lesson.questions.length).map((answer, index) => `Finding ${index + 1}. ${answer.trim().replace(/[,}]\s*$/, ".")}`).join("\n\n");
  return `Academic case study: ${lesson.topic}\n\nThe following summary synthesises the principal findings in the source material. Read it for precise relationships, claims and qualifications.\n\n${findings}`;
}

function activityFor(skill: Skill, lesson: Lesson, plan: DayPlan): CourseActivity {
  const id = `${lesson.id}-${skill.toLowerCase()}`;
  if (skill === "Listening") return {
    id,
    kind: "listening",
    skill,
    title: lesson.audioLabel ?? "IELTS Academic listening practice",
    instructions: questionTypeFor(lesson) === "note-completion" ? "Listen once under test conditions. Complete the notes using ONE WORD AND/OR A NUMBER." : "Listen once under test conditions and select the best answer for each question.",
    minutes: 20,
    part: 3,
    audioAssetRef: lesson.id,
    questions: questionsFor(lesson),
  };
  if (skill === "Reading") return {
    id,
    kind: "reading",
    skill,
    title: `Academic reading: ${lesson.topic}`,
    instructions: questionTypeFor(lesson) === "note-completion" ? "Read the passage and complete the notes. Report raw accuracy; this short drill does not produce an IELTS band." : "Read the academic case-study summary and select the best answer. Report raw accuracy; this short drill does not produce an IELTS band.",
    minutes: 25,
    passage: readingPassage(lesson),
    questionFamily: questionTypeFor(lesson),
    questions: questionsFor(lesson),
  };
  if (skill === "Writing") {
    const taskType = plan.localDay % 2 === 0 ? "task2" : "task1";
    return {
      id,
      kind: "writing",
      skill,
      title: taskType === "task1" ? "Academic Writing Task 1" : "Academic Writing Task 2",
      instructions: taskType === "task1" ? "Spend about 20 minutes and write at least 150 words." : "Spend about 40 minutes and write at least 250 words.",
      minutes: taskType === "task1" ? 20 : 40,
      taskType,
      minimumWords: taskType === "task1" ? 150 : 250,
      prompt: taskType === "task1"
        ? `The table below shows the percentage of survey respondents in three locations who regarded ${lesson.topic} as a high priority in 2005, 2015 and 2025.\n\nLocation A: 38%, 54%, 68%\nLocation B: 62%, 59%, 57%\nLocation C: 27%, 44%, 71%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. The figures are practice data.`
        : `Some people believe that decisions about ${lesson.topic} should be led by governments, while others believe individuals and communities should take greater responsibility. Discuss both views and give your own opinion.`,
    };
  }
  return {
    id,
    kind: "speaking",
    skill,
    title: "IELTS Speaking Parts 1–3",
    instructions: "Answer naturally. Use the one-minute preparation time for Part 2; do not memorise a script.",
    minutes: 14,
    part1: [`What interests you about ${lesson.topic}?`, "How often do you discuss this subject?", "Has your view changed over time?"],
    part2: {
      topic: `Describe an experience or example connected with ${lesson.topic}.`,
      prompts: ["what it was", "when and where it happened", "who was involved", "why it was significant"],
      preparationSeconds: 60,
      speakingSeconds: 120,
    },
    part3: [`Why is ${lesson.topic} important to society?`, "Who should be responsible for future improvements?", "How might the situation change in the next twenty years?"],
  };
}

export function convertLegacyLesson(week: number, globalDay: number) {
  const plan = getDayPlan(week, globalDay);
  if (!plan) return null;
  const lesson = getLesson(week, plan.localDay);
  if (!lesson) return null;
  const activities = plan.skills.map((skill) => activityFor(skill, lesson, plan));
  const content: CourseLessonV2 = {
    schemaVersion: 2,
    id: lesson.id,
    week,
    globalDay,
    localDay: plan.localDay,
    title: lesson.title,
    topic: lesson.topic,
    focus: plan.focus,
    skills: plan.skills,
    durationMinutes: durationMinutes(lesson.duration),
    assessmentKind: plan.isMock ? "diagnostic" : "lesson",
    phrases: lesson.phrases,
    activities,
  };
  const review: CourseLessonReviewV2 = { schemaVersion: 2, activityReviews: {} };
  for (const activity of activities) {
    if (activity.kind === "listening" || activity.kind === "reading") {
      review.activityReviews[activity.id] = {
        acceptableAnswers: lesson.review.answers.slice(0, activity.questions.length).map((answer) => [answer]),
        explanations: activity.questions.map((_, index) => activity.kind === "reading" ? `Finding ${index + 1} contains the supporting statement.` : "Check the exact supporting words in the unchanged recording before accepting a variant."),
        ...(activity.kind === "listening" ? { transcript: lesson.review.transcript } : {}),
      };
    }
  }
  return { content, review };
}

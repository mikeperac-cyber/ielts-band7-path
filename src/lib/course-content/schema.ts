import { z } from "zod";

const question = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  type: z.enum(["note-completion", "short-answer", "multiple-choice", "true-false-not-given"]),
  answerLimit: z.string().optional(),
  options: z.array(z.string().min(1)).min(3).max(4).optional(),
});
const base = {
  id: z.string().min(1),
  skill: z.enum(["Listening", "Reading", "Writing", "Speaking"]),
  title: z.string().min(1),
  instructions: z.string().min(1),
  minutes: z.number().int().positive(),
};
const listening = z.object({ ...base, kind: z.literal("listening"), skill: z.literal("Listening"), part: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]), audioAssetRef: z.string().min(1), audioUrl: z.string().optional(), questions: z.array(question).min(1) });
const reading = z.object({ ...base, kind: z.literal("reading"), skill: z.literal("Reading"), passage: z.string().min(100), questionFamily: z.enum(["note-completion", "short-answer", "multiple-choice", "true-false-not-given"]), questions: z.array(question).min(1) });
const writing = z.object({ ...base, kind: z.literal("writing"), skill: z.literal("Writing"), taskType: z.enum(["task1", "task2"]), prompt: z.string().min(30), minimumWords: z.union([z.literal(150), z.literal(250)]) });
const speaking = z.object({ ...base, kind: z.literal("speaking"), skill: z.literal("Speaking"), part1: z.array(z.string().min(1)).min(1), part2: z.object({ topic: z.string().min(1), prompts: z.array(z.string().min(1)).min(1), preparationSeconds: z.literal(60), speakingSeconds: z.literal(120) }), part3: z.array(z.string().min(1)).min(1) });

export const courseLessonV2Schema = z.object({
  schemaVersion: z.literal(2),
  id: z.string().min(1),
  databaseId: z.string().uuid().optional(),
  week: z.number().int().min(1).max(10),
  globalDay: z.number().int().min(1).max(70),
  localDay: z.number().int().min(1).max(7),
  title: z.string().min(1),
  topic: z.string().min(1),
  focus: z.string().min(1),
  skills: z.array(z.enum(["Listening", "Reading", "Writing", "Speaking"])).min(2).max(4),
  durationMinutes: z.number().int().positive(),
  assessmentKind: z.enum(["lesson", "diagnostic"]),
  phrases: z.array(z.object({ phrase: z.string().min(1), use: z.string().min(1) })),
  activities: z.array(z.discriminatedUnion("kind", [listening, reading, writing, speaking])).min(2).max(4),
}).superRefine((lesson, context) => {
  if (lesson.globalDay !== (lesson.week - 1) * 7 + lesson.localDay) context.addIssue({ code: "custom", path: ["globalDay"], message: "Global and local day values do not agree." });
  const activitySkills = lesson.activities.map((activity) => activity.skill);
  if (activitySkills.join("|") !== lesson.skills.join("|")) context.addIssue({ code: "custom", path: ["activities"], message: "Activities must exactly match the planned skills." });
  for (const [activityIndex, activity] of lesson.activities.entries()) {
    if (activity.kind === "listening" || activity.kind === "reading") activity.questions.forEach((item, questionIndex) => {
      if (item.type === "multiple-choice" && (!item.options || item.options.length < 3)) context.addIssue({ code: "custom", path: ["activities", activityIndex, "questions", questionIndex], message: "Multiple-choice questions require at least three options." });
    });
  }
});

export const courseLessonReviewV2Schema = z.object({
  schemaVersion: z.literal(2),
  activityReviews: z.record(z.string(), z.object({
    acceptableAnswers: z.array(z.array(z.string().min(1)).min(1)).optional(),
    explanations: z.array(z.string()).optional(),
    transcript: z.string().optional(),
    modelResponse: z.string().optional(),
  })),
});

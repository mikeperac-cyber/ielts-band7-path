import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { programme } from "../src/lib/course-plan";
import { convertLegacyLesson } from "../src/lib/course-content/legacy";
import { courseLessonReviewV2Schema, courseLessonV2Schema } from "../src/lib/course-content/schema";

async function main() {
const problems: string[] = [];
const seen = new Set<string>();
let completionActivities = 0;
let multipleChoiceActivities = 0;
for (const plan of programme) {
  const converted = convertLegacyLesson(plan.week, plan.day);
  if (!converted) { problems.push(`Day ${plan.day} could not be converted.`); continue; }
  const content = courseLessonV2Schema.safeParse(converted.content);
  const review = courseLessonReviewV2Schema.safeParse(converted.review);
  if (!content.success) problems.push(`Day ${plan.day}: ${content.error.issues.map((issue) => issue.message).join(", ")}`);
  if (!review.success) problems.push(`Day ${plan.day} review: ${review.error.issues.map((issue) => issue.message).join(", ")}`);
  if (seen.has(converted.content.id)) problems.push(`Duplicate lesson ID: ${converted.content.id}`);
  seen.add(converted.content.id);
  for (const activity of converted.content.activities) {
    const activityReview = converted.review.activityReviews[activity.id];
    if ((activity.kind === "listening" || activity.kind === "reading") && activityReview?.acceptableAnswers?.length !== activity.questions.length) problems.push(`${activity.id}: question and answer counts differ.`);
    if (activity.kind === "listening" && !activity.audioAssetRef) problems.push(`${activity.id}: missing audio reference.`);
    if (activity.kind === "listening" || activity.kind === "reading") {
      if (activity.questions.every((question) => question.type === "note-completion")) completionActivities += 1;
      if (activity.questions.every((question) => question.type === "multiple-choice")) multipleChoiceActivities += 1;
      activity.questions.forEach((question, index) => {
        const answer = activityReview?.acceptableAnswers?.[index]?.[0];
        if (question.type === "multiple-choice" && (!answer || !question.options?.includes(answer))) problems.push(`${question.id}: correct answer is absent from the options.`);
      });
    }
    if (activity.kind === "writing" && activity.taskType === "task1" && (!activity.prompt.includes("table below") || activity.minimumWords !== 150 || activity.minutes !== 20)) problems.push(`${activity.id}: invalid Academic Task 1 structure.`);
    if (activity.kind === "speaking" && (activity.part2.preparationSeconds !== 60 || activity.part2.speakingSeconds !== 120)) problems.push(`${activity.id}: invalid Speaking Part 2 timing.`);
  }
}
if (programme.length !== 70 || seen.size !== 70) problems.push(`Expected 70 unique lessons; found ${seen.size}.`);
if (programme.filter((item) => item.isMock).length !== 20) problems.push("Expected 20 diagnostic checkpoints.");
if (programme.filter((item) => !item.isMock).length !== 50) problems.push("Expected 50 regular lessons.");
if (completionActivities !== 16 || multipleChoiceActivities !== 74) problems.push(`Expected 16 completion and 74 multiple-choice objective activities; found ${completionActivities} and ${multipleChoiceActivities}.`);

const checksumLines = (await readFile(path.join(process.cwd(), "audio-checksums.sha256"), "utf8")).trim().split(/\r?\n/);
for (const line of checksumLines) {
  const [expected, relative] = line.split(/\s{2}/);
  const data = await readFile(path.join(process.cwd(), relative));
  if (createHash("sha256").update(data).digest("hex") !== expected) problems.push(`${relative}: checksum changed.`);
}
if (problems.length) throw new Error(`Course validation failed:\n${problems.join("\n")}`);
console.log("Validated 70 CourseLessonV2 payloads: 50 lessons, 20 diagnostics, 16 completion activities, 74 multiple-choice activities, and 72 frozen MP3s.");
}

void main();

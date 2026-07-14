import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.env.COURSE_SOURCE_DIR ?? path.join(process.cwd(), ".private-course"));
const release = JSON.parse(await fs.readFile(path.join(root, "release.json"), "utf8"));
const problems = [];
if (release.product !== "IELTS Academic Band 9 Path" || release.version !== 2) problems.push("Release must be Band 9 CourseLessonV2.");
if (release.rights !== "original-ielts-style") problems.push("Invalid content rights marker.");
if (!release.generatedWithoutPaidAi) problems.push("Release must declare zero paid build-time AI usage.");
if (!Array.isArray(release.lessons) || release.lessons.length !== 70) problems.push("Release must contain exactly 70 lessons.");
if (release.lessons?.filter((lesson) => lesson.assessmentKind === "diagnostic").length !== 20) problems.push("Release must contain 20 diagnostic checkpoints.");
for (const lesson of release.lessons ?? []) {
  const content = JSON.parse(await fs.readFile(path.join(root, lesson.contentFile), "utf8"));
  const review = JSON.parse(await fs.readFile(path.join(root, lesson.reviewFile), "utf8"));
  if (content.schemaVersion !== 2 || content.globalDay !== lesson.day || content.localDay !== lesson.localDay) problems.push(`${lesson.slug}: invalid V2 identity.`);
  if (content.activities.length !== content.skills.length) problems.push(`${lesson.slug}: activity/skill mismatch.`);
  for (const activity of content.activities) {
    if (["listening", "reading"].includes(activity.kind) && review.activityReviews?.[activity.id]?.acceptableAnswers?.length !== activity.questions.length) problems.push(`${activity.id}: question/answer mismatch.`);
  }
  for (const audio of lesson.audioFiles ?? []) {
    const bytes = await fs.readFile(path.join(root, audio.file));
    const actual = createHash("sha256").update(bytes).digest("hex");
    if (actual !== audio.sha256) problems.push(`${audio.file}: checksum mismatch.`);
  }
}
if (problems.length) throw new Error(`Private release validation failed:\n${problems.join("\n")}`);
console.log("Validated private V2 release: 70 lessons, 20 diagnostics, and zero audio checksum changes.");

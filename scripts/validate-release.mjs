import fs from "node:fs/promises";
import path from "node:path";

const manifestPath = process.env.COURSE_MANIFEST_PATH ?? path.join(process.cwd(), ".private-course", "release.json");

try {
  const release = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const problems = [];
  if (release.rights !== "original-ielts-style") problems.push("rights must equal 'original-ielts-style'.");
  if (!Array.isArray(release.lessons) || release.lessons.length !== 70) problems.push("release.lessons must contain exactly 70 lessons.");
  const mocks = release.lessons?.filter((lesson) => lesson.isMock) ?? [];
  if (mocks.length !== 20) problems.push("release must contain exactly 20 full mocks.");
  for (const lesson of release.lessons ?? []) {
    if (!lesson.slug || !lesson.contentFile || !lesson.reviewFile) problems.push(`Lesson ${lesson.day ?? "unknown"} is missing slug, contentFile, or reviewFile.`);
    if (!lesson.isMock && (!Array.isArray(lesson.skills) || lesson.skills.length !== 2)) problems.push(`Lesson ${lesson.day ?? "unknown"} must target exactly two skills.`);
    if (lesson.isMock && (!Array.isArray(lesson.skills) || lesson.skills.length !== 4)) problems.push(`Mock ${lesson.day ?? "unknown"} must include all four skills.`);
    if (!Array.isArray(lesson.audioFiles) || lesson.audioFiles.length === 0) problems.push(`Lesson ${lesson.day ?? "unknown"} has no MP3 audio mapping.`);
  }
  if (problems.length) throw new Error(problems.join("\n"));
  console.log(`Validated ${release.lessons.length} lessons and ${mocks.length} full mocks from ${manifestPath}.`);
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("No private course release found; public-code validation skipped. Set COURSE_MANIFEST_PATH in the private publishing environment to validate a release.");
  } else {
    console.error(`Course release validation failed:\n${error.message}`);
    process.exitCode = 1;
  }
}

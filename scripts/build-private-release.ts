import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { programme } from "../src/lib/course-plan";
import { convertLegacyLesson } from "../src/lib/course-content/legacy";

async function main() {
const root = process.cwd();
const target = path.join(root, ".private-course");
await Promise.all(["content", "reviews", "audio"].map((folder) => mkdir(path.join(target, folder), { recursive: true })));
const checksumMap = new Map((await readFile(path.join(root, "audio-checksums.sha256"), "utf8")).trim().split(/\r?\n/).map((line) => { const [hash, file] = line.split(/\s{2}/); return [file, hash]; }));
const lessons = [];
for (const plan of programme) {
  const converted = convertLegacyLesson(plan.week, plan.day);
  if (!converted) throw new Error(`Cannot build programme day ${plan.day}.`);
  const slug = converted.content.id;
  const audioSource = `public/audio/${slug}.mp3`;
  const audioTarget = `audio/${slug}.mp3`;
  await Promise.all([
    writeFile(path.join(target, "content", `${slug}.json`), `${JSON.stringify(converted.content, null, 2)}\n`, "utf8"),
    writeFile(path.join(target, "reviews", `${slug}.json`), `${JSON.stringify(converted.review, null, 2)}\n`, "utf8"),
    copyFile(path.join(root, audioSource), path.join(target, audioTarget)),
  ]);
  lessons.push({ slug, week: plan.week, day: plan.day, localDay: plan.localDay, title: converted.content.title, skills: converted.content.skills, durationMinutes: converted.content.durationMinutes, assessmentKind: converted.content.assessmentKind, contentSchemaVersion: 2, rubricVersion: "ielts-public-2026-07", contentFile: `content/${slug}.json`, reviewFile: `reviews/${slug}.json`, audioFiles: [{ file: audioTarget, sha256: checksumMap.get(audioSource) }] });
}
await writeFile(path.join(target, "release.json"), `${JSON.stringify({ product: "IELTS Academic Band 9 Path", version: 2, rights: "original-ielts-style", generatedWithoutPaidAi: true, lessons }, null, 2)}\n`, "utf8");
console.log("Built the ignored private CourseLessonV2 release package with 70 unchanged MP3 master copies.");
}

void main();

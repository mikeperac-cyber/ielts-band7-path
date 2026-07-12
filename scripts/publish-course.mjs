import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(process.env.COURSE_SOURCE_DIR ?? path.join(process.cwd(), ".private-course"));
const manifestPath = path.join(root, "release.json");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required only for private publishing.");
const release = JSON.parse(await fs.readFile(manifestPath, "utf8"));
if (release.rights !== "original-ielts-style" || release.lessons?.length !== 70) throw new Error("Refusing to publish an invalid release. Run npm run content:validate first.");
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const resolveSource = (file) => { const resolved = path.resolve(root, file); if (!resolved.startsWith(root + path.sep)) throw new Error(`Unsafe source path: ${file}`); return resolved; };

for (const lesson of release.lessons) {
  const contentPath = `published/${lesson.slug}.json`;
  const content = await fs.readFile(resolveSource(lesson.contentFile));
  const { error: contentError } = await supabase.storage.from("course-content").upload(contentPath, content, { contentType: "application/json", upsert: true });
  if (contentError) throw contentError;
  const { data: lessonRow, error: lessonError } = await supabase.from("course_lessons").upsert({ week: lesson.week, day: lesson.day, slug: lesson.slug, title: lesson.title, skills: lesson.skills, duration_minutes: lesson.durationMinutes, content_path: contentPath, is_mock: Boolean(lesson.isMock), is_harder_mock: Boolean(lesson.isHarderMock), is_published: true }, { onConflict: "slug" }).select("id").single();
  if (lessonError) throw lessonError;
  const review = JSON.parse(await fs.readFile(resolveSource(lesson.reviewFile), "utf8"));
  const { error: reviewError } = await supabase.schema("private").from("lesson_reviews").upsert({ lesson_id: lessonRow.id, answer_payload: review.answers, transcript_payload: review.transcript ?? {} }, { onConflict: "lesson_id" });
  if (reviewError) throw reviewError;
  for (const audioFile of lesson.audioFiles) {
    const audioName = path.basename(audioFile);
    const storagePath = `published/${lesson.slug}/${audioName}`;
    const audio = await fs.readFile(resolveSource(audioFile));
    const { error: audioError } = await supabase.storage.from("course-media").upload(storagePath, audio, { contentType: "audio/mpeg", upsert: true });
    if (audioError) throw audioError;
    const { error: assetError } = await supabase.from("course_assets").upsert({ lesson_id: lessonRow.id, asset_type: "audio", storage_path: storagePath }, { onConflict: "storage_path" });
    if (assetError) throw assetError;
  }
  console.log(`Published ${lesson.slug}`);
}
console.log("Private course release published successfully.");

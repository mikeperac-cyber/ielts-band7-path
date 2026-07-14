import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(process.env.COURSE_SOURCE_DIR ?? path.join(process.cwd(), ".private-course"));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
if (!url || !serviceKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for private publishing.");
const release = JSON.parse(await fs.readFile(path.join(root, "release.json"), "utf8"));
if (release.version !== 2 || release.lessons?.length !== 70) throw new Error("Run the V2 release builder and validator before publishing.");
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const resolveSource = (file) => { const resolved = path.resolve(root, file); if (!resolved.startsWith(root + path.sep)) throw new Error(`Unsafe source path: ${file}`); return resolved; };

for (const lesson of release.lessons) {
  const contentPath = `v2/${lesson.slug}.json`;
  const content = await fs.readFile(resolveSource(lesson.contentFile));
  const { error: contentError } = await supabase.storage.from("course-content").upload(contentPath, content, { contentType: "application/json", upsert: true });
  if (contentError) throw contentError;
  const { data: lessonRow, error: lessonError } = await supabase.from("course_lessons").upsert({ week: lesson.week, day: lesson.day, slug: lesson.slug, title: lesson.title, skills: lesson.skills, duration_minutes: lesson.durationMinutes, content_path: contentPath, is_mock: lesson.assessmentKind === "diagnostic", is_harder_mock: lesson.assessmentKind === "diagnostic" && lesson.localDay === 7, is_published: true, content_schema_version: 2, rubric_version: lesson.rubricVersion, assessment_kind: lesson.assessmentKind }, { onConflict: "slug" }).select("id").single();
  if (lessonError) throw lessonError;
  const review = JSON.parse(await fs.readFile(resolveSource(lesson.reviewFile), "utf8"));
  const { error: reviewError } = await supabase.rpc("publish_lesson_review", { lesson_uuid: lessonRow.id, answers: review, transcript: {} });
  if (reviewError) throw reviewError;
  for (const audioSpec of lesson.audioFiles) {
    const privateAudioPath = resolveSource(audioSpec.file);
    const audioPath = await fs.access(privateAudioPath).then(() => privateAudioPath).catch(() => path.join(process.cwd(), "public", "audio", path.basename(audioSpec.file)));
    const audio = await fs.readFile(audioPath);
    const originalHash = createHash("sha256").update(audio).digest("hex");
    if (originalHash !== audioSpec.sha256) throw new Error(`Refusing altered audio: ${audioSpec.file}`);
    const storagePath = `v2/${lesson.slug}/${path.basename(audioSpec.file)}`;
    const { error: audioError } = await supabase.storage.from("course-media").upload(storagePath, audio, { contentType: "audio/mpeg", upsert: true });
    if (audioError) throw audioError;
    const { data: downloaded, error: downloadError } = await supabase.storage.from("course-media").download(storagePath);
    if (downloadError || !downloaded) throw new Error(`Could not verify uploaded audio: ${storagePath}`);
    const downloadedHash = createHash("sha256").update(Buffer.from(await downloaded.arrayBuffer())).digest("hex");
    if (downloadedHash !== originalHash) throw new Error(`Uploaded audio checksum mismatch: ${storagePath}`);
    const { error: assetError } = await supabase.from("course_assets").upsert({ lesson_id: lessonRow.id, asset_type: "audio", storage_path: storagePath }, { onConflict: "storage_path" });
    if (assetError) throw assetError;
  }
  console.log(`Published and checksum-verified ${lesson.slug}`);
}
console.log("Protected V2 course published. Public course MP3 cleanup remains intentionally manual after authenticated playback smoke testing.");

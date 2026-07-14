import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { courseLessonV2Schema } from "./schema";
import type { CourseLessonV2 } from "./types";

export async function getProtectedLesson(week: number, globalDay: number): Promise<CourseLessonV2 | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("COURSE_UNAVAILABLE");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("AUTH_REQUIRED");

  const { data: row, error } = await supabase
    .from("course_lessons")
    .select("id,content_path")
    .eq("week", week)
    .eq("day", globalDay)
    .eq("is_published", true)
    .eq("content_schema_version", 2)
    .maybeSingle();
  if (error) throw new Error(`COURSE_QUERY_FAILED:${error.message}`);
  if (!row) return null;

  const [{ data: contentBlob, error: contentError }, { data: assets, error: assetError }] = await Promise.all([
    supabase.storage.from("course-content").download(row.content_path),
    supabase.from("course_assets").select("id,asset_type").eq("lesson_id", row.id),
  ]);
  if (contentError || !contentBlob) throw new Error("COURSE_CONTENT_UNAVAILABLE");
  if (assetError) throw new Error("COURSE_ASSETS_UNAVAILABLE");

  const parsed = courseLessonV2Schema.safeParse(JSON.parse(await contentBlob.text()));
  if (!parsed.success) throw new Error("COURSE_CONTENT_INVALID");
  const audioAsset = assets?.find((asset) => asset.asset_type === "audio");
  return {
    ...parsed.data,
    databaseId: row.id,
    activities: parsed.data.activities.map((activity) =>
      activity.kind === "listening" && audioAsset
        ? { ...activity, audioUrl: `/api/audio/${audioAsset.id}` }
        : activity,
    ),
  };
}

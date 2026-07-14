import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const payloadSchema = z.object({
  lessonId: z.string().uuid(),
  activityId: z.string().min(3).max(160),
  skill: z.enum(["Listening", "Reading", "Writing", "Speaking"]),
});

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid attempt request." }, { status: 400 });
  const { data, error } = await supabase.from("skill_attempts").insert({ user_id: user.id, lesson_id: parsed.data.lessonId, activity_id: parsed.data.activityId, skill: parsed.data.skill, response_payload: {}, content_schema_version: 2 }).select("id").single();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ attemptId: data.id }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}

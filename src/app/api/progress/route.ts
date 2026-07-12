import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json() as { lessonId?: string; status?: "not_started" | "in_progress" | "completed"; durationSeconds?: number };
  if (!body.lessonId || !body.status) return Response.json({ error: "lessonId and status are required." }, { status: 400 });
  const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, lesson_id: body.lessonId, status: body.status, duration_seconds: Math.max(0, body.durationSeconds ?? 0), updated_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}

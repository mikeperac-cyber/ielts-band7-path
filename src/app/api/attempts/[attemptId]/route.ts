import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const updateSchema = z.object({ response: z.union([z.string().max(30000), z.array(z.string().max(1000)).max(50)]), elapsedSeconds: z.number().int().min(0).max(21600) });

export async function PATCH(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const { attemptId } = await params;
  if (!z.string().uuid().safeParse(attemptId).success) return Response.json({ error: "Invalid attempt." }, { status: 400 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid draft." }, { status: 400 });
  const { error } = await supabase.from("skill_attempts").update({ response_payload: { response: parsed.data.response }, elapsed_seconds: parsed.data.elapsedSeconds, updated_at: new Date().toISOString() }).eq("id", attemptId).eq("user_id", user.id).is("submitted_at", null);
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}

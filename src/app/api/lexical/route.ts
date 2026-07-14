import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ phrase: z.string().trim().min(2).max(300), skill: z.enum(["Listening", "Reading", "Writing", "Speaking"]) });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid phrase." }, { status: 400 });
  const { error } = await supabase.from("lexical_entries").upsert({ user_id: user.id, phrase: parsed.data.phrase, skill: parsed.data.skill, updated_at: new Date().toISOString() }, { onConflict: "user_id,phrase" });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = z.object({ phrase: z.string().trim().min(2).max(300) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid phrase." }, { status: 400 });
  const { error } = await supabase.rpc("record_phrase_reuse", { phrase_text: parsed.data.phrase });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true });
}

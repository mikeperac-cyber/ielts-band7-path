import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ skill: z.enum(["Listening", "Reading", "Writing", "Speaking"]), errorType: z.string().trim().min(2).max(120), mistake: z.string().trim().min(3).max(1000), correctionRule: z.string().trim().min(3).max(1000) });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid prevention rule." }, { status: 400 });
  const { data, error } = await supabase.from("error_logs").insert({ user_id: user.id, skill: parsed.data.skill, error_type: parsed.data.errorType, mistake: parsed.data.mistake, correction_rule: parsed.data.correctionRule }).select("id").single();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ id: data.id }, { status: 201 });
}

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const { attemptId } = await params;
  const { data, error } = await supabase.rpc("get_attempt_review", { attempt_uuid: attemptId });
  if (error) return Response.json({ error: error.message }, { status: 403 });
  return Response.json(data, { headers: { "Cache-Control": "private, no-store" } });
}

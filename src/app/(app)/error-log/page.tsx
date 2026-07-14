import { ErrorLogView, type ErrorEntry } from "@/components/error-log-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type ErrorRow = { id: string; skill: ErrorEntry["skill"]; error_type: string; mistake: string; correction_rule: string };

export default async function ErrorLogPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/?course=unavailable");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/error-log");
  const { data } = await supabase.from("error_logs").select("id,skill,error_type,mistake,correction_rule").eq("user_id", user.id).order("created_at", { ascending: false });
  const errors = ((data ?? []) as ErrorRow[]).map((item) => ({ id: item.id, skill: item.skill, type: item.error_type, mistake: item.mistake, rule: item.correction_rule }));
  return <ErrorLogView initialErrors={errors} />;
}

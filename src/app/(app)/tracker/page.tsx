import { TrackerView, type TrackerPhrase, type TrackerSkill } from "@/components/tracker-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LexicalRow = { phrase: string; skill: TrackerSkill; confidence: number | null; meaning: string | null; reuse_count: number | null };

export default async function TrackerPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/?course=unavailable");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/tracker");
  const { data } = await supabase.from("lexical_entries").select("phrase,skill,confidence,meaning,reuse_count").eq("user_id", user.id).order("created_at", { ascending: false });
  const phrases: TrackerPhrase[] | undefined = (data as LexicalRow[] | null)?.map((item) => ({ phrase: item.phrase, skill: item.skill, confidence: item.confidence ?? 1, use: item.meaning ?? "Saved phrase", status: (item.reuse_count ?? 0) > 0 ? "Reused" : "Learning" }));
  return <TrackerView initialPhrasesFromDb={phrases} />;
}

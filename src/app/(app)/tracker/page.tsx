import { TrackerView } from "@/components/tracker-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TrackerPage() {
  const supabase = await createServerSupabaseClient();
  let dbPhrases = undefined;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("stale_phrases").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) {
        dbPhrases = data.map((d: any) => ({
          phrase: d.phrase,
          skill: d.skill,
          confidence: d.confidence || 1,
          use: d.use_case || "Saved phrase",
          status: d.status || "Learning"
        }));
      }
    }
  }

  return <TrackerView initialPhrasesFromDb={dbPhrases} />;
}

import { SettingsView } from "@/components/settings-view";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  let testDate = null;
  let currentBand = 7;
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  
  if (supabase && user) {
    const { data } = await supabase.from("profiles").select("test_date,current_band").eq("id", user.id).single();
    if (data && data.test_date) testDate = data.test_date;
    if (data?.current_band != null) currentBand = Number(data.current_band);
  }

  return <SettingsView initialTestDate={testDate} initialCurrentBand={currentBand} />;
}

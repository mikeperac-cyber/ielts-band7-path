import { SettingsView } from "@/components/settings-view";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  let testDate = null;
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  
  if (supabase && user) {
    const { data } = await supabase.from("profiles").select("test_date").eq("id", user.id).single();
    if (data && data.test_date) testDate = data.test_date;
  }

  return <SettingsView initialTestDate={testDate} />;
}

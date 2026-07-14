import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/?course=unavailable");
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard");

  let testDate = null;
  let currentBand = 7;
  const supabase = await createServerSupabaseClient();
  if (supabase && user) {
    const { data } = await supabase.from("profiles").select("test_date,current_band").eq("id", user.id).single();
    if (data && data.test_date) testDate = data.test_date;
    if (data?.current_band != null) currentBand = Number(data.current_band);
  }

  return <AppShell title={`Welcome back, ${user.email?.split("@")[0] ?? "learner"}`} testDate={testDate} currentBand={currentBand}>{children}</AppShell>;
}

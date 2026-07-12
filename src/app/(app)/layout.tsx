import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (isSupabaseConfigured() && !user) redirect("/sign-in?next=/dashboard");

  let testDate = null;
  const supabase = await createServerSupabaseClient();
  if (supabase && user) {
    const { data } = await supabase.from("profiles").select("test_date").eq("id", user.id).single();
    if (data && data.test_date) testDate = data.test_date;
  }

  return <AppShell title={user?.email ? `Welcome back, ${user.email.split("@")[0]}` : "Preview mode"} testDate={testDate}>{children}</AppShell>;
}

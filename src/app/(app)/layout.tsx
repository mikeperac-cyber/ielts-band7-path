import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (isSupabaseConfigured() && !user) redirect("/sign-in?next=/dashboard");
  return <AppShell title={user?.email ? `Welcome back, ${user.email.split("@")[0]}` : "Preview mode"}>{children}</AppShell>;
}

import { DashboardView } from "@/components/dashboard-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return <DashboardView />; // Fallback if no DB

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all dashboard data concurrently
  const [
    { data: dailyBrief },
    { data: userStreak },
    { data: bandTrajectory },
    { data: peerComparison }
  ] = await Promise.all([
    supabase.rpc("get_daily_brief", { target_user_id: user.id }),
    supabase.rpc("get_user_streak", { target_user_id: user.id }),
    supabase.rpc("get_band_trajectory", { target_user_id: user.id }),
    supabase.rpc("get_peer_comparison", { target_user_id: user.id })
  ]);

  return (
    <DashboardView 
      dailyBrief={dailyBrief} 
      userStreak={userStreak} 
      bandTrajectory={bandTrajectory} 
      peerComparison={peerComparison} 
    />
  );
}

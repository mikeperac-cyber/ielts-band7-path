import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LessonPlayer } from "@/components/lesson-player";
import { getDayPlan } from "@/lib/course-plan";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LessonPage({ params }: { params: Promise<{ week: string; day: string }> }) {
  const { week: weekString, day: dayString } = await params;
  const week = Number(weekString); const day = Number(dayString);
  const plan = getDayPlan(week, day);
  
  if (!plan) return (
    <div className="empty-state">
      <LockKeyhole size={32} />
      <h1>Lesson not found</h1>
      <p>Select a study day from the 10-week programme.</p>
      <Link href="/programme" className="primary-button">Open programme</Link>
    </div>
  );

  let stalePhrases: any[] = [];
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.rpc("get_daily_brief", { target_user_id: user.id });
      if (data && data.stale_phrases) {
        stalePhrases = data.stale_phrases;
      }
    }
  }

  return (
    <div className="lesson-page">
      <div className="lesson-page-banner">
        <Link href="/programme"><ArrowLeft size={16} /> Programme</Link>
        <span>Week {week} · Day {day}</span>
        <strong>{plan.focus}</strong>
      </div>
      <LessonPlayer stalePhrases={stalePhrases} />
    </div>
  );
}

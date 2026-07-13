import Link from "next/link";
import { ArrowLeft, LockKeyhole, Hammer } from "lucide-react";
import { LessonPlayer } from "@/components/lesson-player";
import { getDayPlan } from "@/lib/course-plan";
import { getLesson } from "@/lib/lessons";
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

  const lessonData = getLesson(week, day);
  
  if (!lessonData) {
    return (
      <div className="lesson-page">
        <div className="lesson-page-banner">
          <Link href="/programme"><ArrowLeft size={16} /> Programme</Link>
          <span>Week {week} · Day {day}</span>
          <strong>{plan.focus}</strong>
        </div>
        <div className="empty-state" style={{ marginTop: 80 }}>
          <Hammer size={32} className="text-muted" />
          <h2>Content Upcoming</h2>
          <p style={{ maxWidth: 400, margin: "0 auto 24px" }}>
            The highly intensive Band 9 materials for this day are currently being curated. 
            Check back soon!
          </p>
          <Link href="/programme" className="primary-button">Return to Programme</Link>
        </div>
      </div>
    );
  }

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
      <LessonPlayer lesson={lessonData} stalePhrases={stalePhrases} audioSrc={`/audio/${lessonData.id}.mp3`} />
    </div>
  );
}

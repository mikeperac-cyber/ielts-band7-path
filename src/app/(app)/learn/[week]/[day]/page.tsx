import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LessonPlayer } from "@/components/lesson-player";
import { getDayPlan } from "@/lib/course-plan";

export default async function LessonPage({ params }: { params: Promise<{ week: string; day: string }> }) {
  const { week: weekString, day: dayString } = await params;
  const week = Number(weekString); const day = Number(dayString);
  const plan = getDayPlan(week, day);
  if (!plan) return <div className="empty-state"><LockKeyhole size={32} /><h1>Lesson not found</h1><p>Select a study day from the 10-week programme.</p><Link href="/programme" className="primary-button">Open programme</Link></div>;
  return <div className="lesson-page"><div className="lesson-page-banner"><Link href="/programme"><ArrowLeft size={16} /> Programme</Link><span>Week {week} · Day {day}</span><strong>{plan.focus}</strong></div><LessonPlayer /></div>;
}

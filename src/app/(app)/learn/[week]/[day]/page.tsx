import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { getDayPlan } from "@/lib/course-plan";
import { getProtectedLesson } from "@/lib/course-content/server";

export default async function LessonPage({ params }: { params: Promise<{ week: string; day: string }> }) {
  const { week: weekValue, day: dayValue } = await params;
  const week = Number(weekValue);
  const globalDay = Number(dayValue);
  const plan = getDayPlan(week, globalDay);
  if (!plan || plan.isMock) notFound();

  let lesson;
  try {
    lesson = await getProtectedLesson(week, globalDay);
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") redirect(`/sign-in?next=/learn/${week}/${globalDay}`);
    return <div className="empty-state"><LockKeyhole size={32} /><h1>Course temporarily unavailable</h1><p>Protected lesson content could not be loaded. Your progress is safe; please try again later.</p><Link href="/programme" className="primary-button">Return to programme</Link></div>;
  }
  if (!lesson) notFound();

  return <div className="lesson-page">
    <div className="lesson-page-banner">
      <Link href="/programme"><ArrowLeft size={16} /> Programme</Link>
      <span>Week {week} · Programme Day {globalDay} · Local Day {plan.localDay}</span>
      <strong>{plan.focus}</strong>
    </div>
    <LessonPlayer lesson={lesson} />
  </div>;
}
